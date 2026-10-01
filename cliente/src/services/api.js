import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Crear instancia base
const api = axios.create({
  baseURL: BACKEND_URL,
  // con backend CORS configurado (credentials true), cabeceras de auth via token localStorage
  withCredentials: false,
});

// Interceptor para agregar el token
api.interceptors.request.use(
  (config) => {
    const auth = JSON.parse(localStorage.getItem("auth"));
    const token = auth?.tokenAcceso || auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/api/auth/login")
    ) {
      // El store invalida el estado reactivo y redirige; no dejar la interfaz autenticada.
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
