import axios from 'axios';
import { BASE_URL_BACKEND } from '../config/constantes';
//import { useAuth } from '../hooks/useAuth';

// Crear instancia base
const api = axios.create({
  baseURL: BASE_URL_BACKEND,
  withCredentials: true
});

// Interceptor para agregar el token
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  if (auth?.tokenAcceso) {
    config.headers.Authorization = `Bearer ${auth.tokenAcceso}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Manejar token expirado
      localStorage.removeItem('auth');
      window.location.href = '/iniciar-sesion';
    }
    return Promise.reject(error);
  }
);

export default api;