import { LOGIN_URL } from "../config/constantes"
import { api } from "../utils/axios"


export const login = async ( { indicador, contrasena } ) => {
    try {
        const { data } = await api.post( LOGIN_URL, { indicador, contrasena }, { withCredentials: true } )
        // console.log( "estoy en el servicio: ", data.result )
        return data
    } catch ( error ) {
        let err = {}
        if ( error.response ) {
            err.status = error.response.data.statusCode || error.response.status
            err.statusText = error.response.data.statusText || error.response.statusText
        } else {
            err.status = 503
            err.statusText = "Sin respuesta de parte del servidor."
        }
        throw err
    }
}