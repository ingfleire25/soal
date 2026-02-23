// Servicio simple para devolver los usuarios mock (para desarrollo sin backend)
import mock from '@/data/mockUsers.json'

export const getMockUsers = async () => {
  // Simula una llamada a la API; devuelve la data en una promesa.
  return new Promise((resolve) => {
    setTimeout(() => resolve(mock), 100)
  })
}

export const getMockUserByToken = async (token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const u = mock.find(m => m.token === token) || null
      resolve(u)
    }, 100)
  })
}

export default {
  getMockUsers,
  getMockUserByToken
}
