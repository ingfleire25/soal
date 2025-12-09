//import { BASE_LOGIN } from "../config/constantes"
// import { api } from "../utils/axios"


// export const login = async ( { indicador, contrasena } ) => {
//     try {
//         const { data } = await api.post( LOGIN_URL, { indicador, contrasena }, { withCredentials: true } )
//         // console.log( "estoy en el servicio: ", data.result )
//         return data
//     } catch ( error ) {
//         let err = {}
//         if ( error.response ) {
//             err.status = error.response.data.statusCode || error.response.status
//             err.statusText = error.response.data.statusText || error.response.statusText
//         } else {
//             err.status = 503
//             err.statusText = "Sin respuesta de parte del servidor."
//         }
//         throw err
//     }
// }

// modificacion por Leonardo fleire 30/05/25

import { BASE_LOGIN } from "../config/constantes"
import axios from 'axios';

// Instancia de Axios configurada para manejar cookies
const api = axios.create({
    
    baseURL: BASE_LOGIN, // Asegúrate de que esta sea la URL de tu backend
    withCredentials: true, // ¡CRUCIAL para enviar y recibir cookies (como el refresh token)!
});

// Función para el login del usuario
export const login = async ({ indicador, contrasena }) => {
    try {
        const response = await api.post('/login', { indicador, contrasena });
        // Tu backend `procesarLogin` devuelve `{ statusCode, statusText, result: { roles, tokenAcceso, co_roles } }`
        return response.data; // Devolvemos toda la data, que contiene el `result`
    } catch (error) {
        console.error("Error en el servicio de login:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error desconocido al iniciar sesión"); // Lanza el error con info del backend
    }
};

// Función para cerrar sesión
export const logout = async () => {
    try {
        await api.post('/logout'); // Llama a tu backend `procesarLogout`
        return true;
    } catch (error) {
        console.error("Error en el servicio de logout:", error.response?.data || error.message);
        throw error.response?.data || new Error("Error desconocido al cerrar sesión");
    }
};

// Nueva función para refrescar el token de acceso
export const refreshToken = async () => {
    try {
        // Al hacer esta llamada GET, Axios automáticamente enviará la cookie 'jwt' (refresh token)
        const response = await api.get('/refresh'); // Llama a tu backend `handleRefreshToken`
        // El backend `handleRefreshToken` devuelve `{ statusCode, statusText, result: { roles, co_roles, tokenAcceso } }`
        return response.data.result; // Devolvemos solo la parte `result` que contiene el nuevo token de acceso y los roles.
    } catch (error) {
        // console.error("Error en el servicio de refresh token:", error.response?.data || error.message);
        // // Es importante devolver `null` o lanzar un error específico si no se puede refrescar,
        // // para que AuthProvider pueda decidir si el usuario sigue autenticado.
        // if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        //     // Si el servidor indica no autorizado o prohibido, la sesión no es válida.
        //     return null; 
        // }
        // throw error.response?.data || new Error("Error desconocido al refrescar token");
        if (error.response?.status === 401) {
            // console.log("No hay sesión activa");
            return null; // No es un error, es estado inicial
        }
        
        console.error("Error en refresh token:", error.response?.data || error.message);
        
        // Solo lanza error para casos que no sean 401
        if (error.response?.status !== 401) {
            throw error.response?.data || new Error("Error al refrescar token");
        }
        
        return null;
    }
};

// Puedes exportar un objeto si tienes muchas funciones
// const authService = { login, logout, refreshToken };
// export default authService;