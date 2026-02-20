import { api } from "../utils/axios"

export const getUAs = async ( localidadId ) => {
  try {
    const { data } = await api.get(`/api/localidades/${localidadId}/unidades-atencion`)
    return data.result
  } catch (error) {
    let err = {}
    if (error.response) {
      err.status = error.response.status
      err.statusText = error.response.data.statusText || error.response.statusText
    } else {
      err.status = 503
      err.statusText = "Sin respuesta de parte del servidor."
    }
    throw err
  }
}
