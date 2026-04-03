import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Crear instancia base
const api = axios.create({
  baseURL: BACKEND_URL,
  // con backend CORS configurado (credentials true), cabeceras de auth via token localStorage
  withCredentials: false
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