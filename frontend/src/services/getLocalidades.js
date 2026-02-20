import { api } from "../utils/axios"

export const getLocalidades = async ( areaId ) => {
  try {
    const { data } = await api.get(`/api/areas/${areaId}/localidades`)
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
