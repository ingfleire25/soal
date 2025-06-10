import { api } from "../utils/axios"

export const postSupervisor = async ( solicitud ) => {
    try {
        const { data } = await api.post( '/api/supervisores/:supervisorId/asignar-supervisor', solicitud )
        return data.result
    } catch ( error ) {
        let err = {}
        if ( error.response ) {
            err.status = error.response.status
            err.statusText = error.response.data.statusText || error.response.statusText
        } else {
            err.status = 503
            err.statusText = "Servicio no disponible. Contacte a su administrador para más información"
        }
        throw err
    }
}