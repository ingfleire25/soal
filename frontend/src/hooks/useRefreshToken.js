import { api } from '../utils/axios'
import { useAuthStore } from '@/stores/auth'

// Composable para refrescar token y persistirlo siguiendo la lógica del store
export default function useRefreshToken() {
    const authStore = useAuthStore()

    const refrescar = async () => {
        try {
            const { data } = await api.get('/auth/refrescar', { withCredentials: true })
            // El backend puede devolver distintas claves para el token
            const nuevoToken = data?.tokenAcceso || data?.token || data?.accessToken
            if (nuevoToken) {
                // Actualizar store
                authStore.token = nuevoToken

                // Persistir según dónde estaba el token originalmente
                if (localStorage.getItem('auth_token')) {
                    localStorage.setItem('auth_token', nuevoToken)
                } else if (sessionStorage.getItem('auth_token')) {
                    sessionStorage.setItem('auth_token', nuevoToken)
                }
            }
            return nuevoToken
        } catch (err) {
            return null
        }
    }

    return refrescar
}