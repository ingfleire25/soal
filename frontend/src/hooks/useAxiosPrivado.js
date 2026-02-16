import { apiPrivada, api } from "../utils/axios";
import { watchEffect, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'


// Composable que devuelve una instancia de axios (`apiPrivada`) con
// interceptors que agregan Authorization y refrescan el token si hace falta.
export function useAxiosPrivado() {
    const authStore = useAuthStore()

    // función para refrescar token usando la endpoint conocida
    const refrescar = async () => {
        try {
            const { data } = await api.get('/auth/refrescar', { withCredentials: true })
            const newToken = data?.tokenAcceso || data?.token || data?.accessToken
            if (newToken) {
                // actualizar token en el store
                authStore.token = newToken
            }
            return newToken
        } catch (err) {
            return null
        }
    }

    let reqInterceptor = null
    let resInterceptor = null

    watchEffect((onInvalidate) => {
        // establecer interceptor de request
        reqInterceptor = apiPrivada.interceptors.request.use(
            (config) => {
                if (!config.headers) config.headers = {}
                if (!config.headers['Authorization'] && authStore.token) {
                    config.headers['Authorization'] = `Bearer ${authStore.token}`
                }
                return config
            },
            (error) => Promise.reject(error)
        )

        resInterceptor = apiPrivada.interceptors.response.use(
            (response) => response,
            async (error) => {
                const prevRequest = error?.config
                if (error?.response?.status === 403 && prevRequest && !prevRequest._retry) {
                    prevRequest._retry = true
                    const tokenNueva = await refrescar()
                    if (tokenNueva) {
                        prevRequest.headers = prevRequest.headers || {}
                        prevRequest.headers['Authorization'] = `Bearer ${tokenNueva}`
                        return apiPrivada(prevRequest)
                    }
                }
                return Promise.reject(error)
            }
        )

        onInvalidate(() => {
            // limpiar interceptors cuando el efecto se invalide
            if (reqInterceptor !== null) apiPrivada.interceptors.request.eject(reqInterceptor)
            if (resInterceptor !== null) apiPrivada.interceptors.response.eject(resInterceptor)
        })
    })

    onBeforeUnmount(() => {
        if (reqInterceptor !== null) apiPrivada.interceptors.request.eject(reqInterceptor)
        if (resInterceptor !== null) apiPrivada.interceptors.response.eject(resInterceptor)
    })

    return apiPrivada
}

export default useAxiosPrivado