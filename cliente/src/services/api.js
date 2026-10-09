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
    let auth = null;
    try {
      const saved =
        localStorage.getItem("auth") || sessionStorage.getItem("auth");
      auth = saved ? JSON.parse(saved) : null;
    } catch (error) {
      localStorage.removeItem("auth");
      sessionStorage.removeItem("auth");
    }
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
      error.response?.data?.code === "SESSION_INVALID" &&
      !error.config?.url?.includes("/api/auth/login")
    ) {
      // Solo invalidar el store cuando el servidor confirma que expiró la sesión; otros 401
      // de endpoints de negocio no deben cerrar una sesión que todavía es válida.
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
