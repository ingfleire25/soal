import axios from 'axios';
import { BASE_URL_BACKEND } from '../config/constantes'

const api = axios.create({
    baseURL: BASE_URL_BACKEND,
    withCredentials: true
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(config => {
    const token = localStorage.getItem('tokenAcceso'); // O del contexto de autenticación
    console.log(token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // pendiente con la estructura de como viene la configuracion de la req
        // config.headers.Authorization = token; // pendiente con la estructura de como viene la configuracion de la req
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;