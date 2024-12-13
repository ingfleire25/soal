import { apiPrivada } from "../utils/axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";


// uso de interceptors para evitar que se rompa todo en caso de que el token de acceso se venza en media petición
// en lugar de usar la instancia apiPrivte directamente, se usa este hook
const useAxiosPrivado = () => {
    const refrescar = useRefreshToken()
    const { auth } = useAuth()
    useEffect( () => {
        // si al hacer una petición (request) por la api privada no hay headers, se setea con el token de acceso (config)
        const requestIntercept = apiPrivada.interceptors.request.use(
            config => {
                if ( !config.headers[ 'Authorization' ] ) { // si el header no existe, lo seteo
                    config.headers[ 'Authorization' ] = `Bearer ${auth?.tokenAcceso}` // lo seteo con el token en auth
                }
                return config // devuelvo la config nuevo
            }, ( error ) => {
                console.log( error )
                return Promise.reject( error )
            } // si llega a haber un error (probablemente con el token), devolverlo
        )
        const responseIntercept = apiPrivada.interceptors.response.use(
            response => response, // si todo va bien, se devuelve la respuesta
            async ( error ) => { // si explota...
                // console.log( "estoy en el componente de axios privado (error): ", error )
                const prevRequest = error?.config // tomo la config (header) que viene en la respuesta de la petición con el error
                // la respuesta me dio forbidden (403)? Se me venció el token, debo refrescar.
                if ( error?.response?.status === 403 && !prevRequest?.enviado ) {
                    prevRequest.enviado = true // es para que, si vuelve otro 403, no se vuelva a hacer la petición y evitar un loop infinito
                    const tokenAccesoNueva = await refrescar() // pido el nuevo token de acceso
                    prevRequest.headers[ 'Authorization' ] = `Bearer ${tokenAccesoNueva}` // seteo el nuevo token en el header
                    return apiPrivada( prevRequest ) // vuelvo a hacer la petición con el nuevo token
                }
                return Promise.reject( error )
            }
        )
        return () => { // limpio todo al desmontar para que no se acumulen los interceptors
            apiPrivada.interceptors.request.eject( requestIntercept )
            apiPrivada.interceptors.response.eject( responseIntercept )
        }
    }, [ auth, refrescar ] )
    return apiPrivada // devuelvo la instancia de axios con los headers que corresponden (config) si hace falta
}

export default useAxiosPrivado