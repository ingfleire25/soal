// import useAxiosPrivado from "../hooks/useAxiosPrivado"
import useAxiosPrivado from "../hooks/useAxiosPrivado"

export const getSolicitudes = async () => {
    const apiPrivada = useAxiosPrivado()
    const abortController = new AbortController()
    const signal = abortController.signal // de repente la api está caída o quiero cortar la petición
    try {
        const { data } = await apiPrivada.get( '/api/solicitudes', { signal } )
        return data.result
    } catch ( error ) {
        let err = {}
        console.error( error )
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