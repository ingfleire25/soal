import { api } from "../utils/axios"

export const getUsuario = async ( uuid ) => { // uuid también representa la cédula
    const abortController = new AbortController()
    const signal = abortController.signal // de repente la api está caída
    try {
        const { data } = await api.get( '/api/usuarios/' + uuid, { signal: signal } )
        return data.result
    } catch ( error ) {
        let err = {}
        console.log( error )
        if ( error.response ) {
            err.status = error.response.status
            err.statusText = error.response.data.statusText || error.response.statusText
        } else {
            err.status = 503
            err.statusText = "Sin respuesta de parte del servidor."
        }
        throw err
    }
}