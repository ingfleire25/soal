// import { createContext, useState } from 'react'

// const AuthContext = createContext( {} )

// export const AuthProvider = ( { children } ) => {
//     const [ auth, setAuth ] = useState( {} )
//     return (
//         <AuthContext.Provider value={ { auth, setAuth } }>
//             { children }
//         </AuthContext.Provider>
//     )
// }

// export default AuthContext

// modificacion Leonardo Fleire 30/05/25

import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as loginService, logout as logoutService, refreshToken as refreshTokenService } from '../services/login'; // Importa las funciones de servicio
import * as jwtDecodeModule from 'jwt-decode'; // Import compatible con distintos empaquetadores
import FullScreenLoader from '../components/Loader/FullScreenLoader'; // Tu componente de carga global

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // auth contendrá: { indicador, roles, co_roles, tokenAcceso }
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true); // Nuevo estado de carga para la verificación inicial
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
  console.log("Estado actual de auth:", auth); // Debug
}, [auth]);

    // Helper para decodificar tokens compatible con CJS y ESM según cómo se exporte la librería
    const decodeToken = (token) => {
        if (!token) return null;
        try {
            // jwt-decode puede exportar la función como default o como la función principal.
            if (typeof jwtDecodeModule === 'function') return jwtDecodeModule(token);
            if (jwtDecodeModule && typeof jwtDecodeModule.default === 'function') return jwtDecodeModule.default(token);
            if (jwtDecodeModule && typeof jwtDecodeModule.jwtDecode === 'function') return jwtDecodeModule.jwtDecode(token);
            // Si ninguna forma funciona, intentar acceder directamente
            return jwtDecodeModule(token);
        } catch (err) {
            console.error('Error decodificando token con decodeToken:', err);
            return null;
        }
    };

    // Función para manejar el inicio de sesión
    const login = async (indicador, contrasena) => {
        setLoading(true); // Activa el loader al iniciar sesión
        try {
            // Llama al servicio de login (que interactúa con tu backend procesarLogin)
            const { result } = await loginService({ indicador, contrasena });
            
            // Decodificar el token para obtener la estructura consistente
            const decoded = decodeToken(result.tokenAcceso);

            // Normalizamos la forma del estado `auth` para evitar inconsistencias
            // - `user`: objeto con la info decodificada (compatibilidad con código que usa `auth.user`)
            // - Campos top-level (`indicador`, `roles`, `co_roles`, `uuid`) para código que accede directamente
            // - `tokenAcceso`: token recibido del backend
            const userDecoded = {
                indicador: decoded.indicador,
                roles: decoded.roles,
                co_roles: decoded.co_roles,
                uuid: decoded.uuid
            };

            const newAuth = {
                ...userDecoded,
                user: userDecoded, // Mantener compatibilidad hacia atrás con `auth.user` uso previo
                tokenAcceso: result.tokenAcceso
            };

            // Guardar en estado y, opcionalmente, en localStorage para persistencia ligera.
            // Nota: el refresh token está en cookie httpOnly, por lo que la persistencia del access token
            // en storage es una decisión de diseño; aquí se mantiene para compatibilidad.
            setAuth(newAuth);
            localStorage.setItem('auth', JSON.stringify(newAuth));

            return { success: true, from: location.state?.from?.pathname || '/solicitudes' }; // Devuelve éxito y la ruta original
        } catch (error) {
            localStorage.removeItem('auth');
            console.error("Error en login de AuthProvider:", error);
            setAuth({}); // Limpia el estado de autenticación en caso de error
            // Puedes lanzar el error de nuevo o manejarlo según tu UI/UX para InicioSesion
            throw error; 
        } finally {
            setLoading(false); // Desactiva el loader
        }
    };

    // Función para manejar el cierre de sesión
    const logout = async () => {
        setLoading(true); // Activa el loader al cerrar sesión
        try {
            await logoutService(); // Llama al servicio de logout (interactúa con tu backend procesarLogout)
            setAuth({}); // Limpia completamente el estado de autenticación
            // También limpiar localStorage para evitar que interceptores usen un token viejo
            localStorage.removeItem('auth');
            // No necesitas limpiar localStorage, ya que el token de refresco está en una cookie HTTP-only
            // y el backend es responsable de invalidarlo y eliminar la cookie.
        } catch (error) {
            console.error("Error en logout de AuthProvider:", error);
            // Puedes manejar el error si el logout falla por algún motivo
        } finally {
            setLoading(false); // Desactiva el loader
        }
    };

    // Efecto para verificar la autenticación al cargar el componente
    useEffect(() => {
        // const verifyRefreshToken = async () => {
        //     try {
        //         // Intenta obtener un nuevo token de acceso usando el refresh token (cookie httponly)
        //         const response = await refreshTokenService(); // Llama a la nueva función de refresh token
                
        //         if (response && response.tokenAcceso) {
        //             // Si el refresh token es válido y se recibe un nuevo token de acceso
        //             const decoded = jwtDecode(response.tokenAcceso);
                    
        //             // Verificar que el token no esté expirado (aunque el backend ya lo hace)
        //             if (decoded.exp * 1000 > Date.now()) {
        //                 setAuth({
        //                     indicador: decoded.UserInfo.indicador,
        //                     roles: decoded.UserInfo.roles,
        //                     co_roles: decoded.UserInfo.co_roles,
        //                     tokenAcceso: response.tokenAcceso // Establece el nuevo token de acceso
        //                 });
        //             } else {
        //                 // El token de acceso recibido ya expiró, forzar logout
        //                 console.warn("Token de acceso refrescado expirado. Forzando logout.");
        //                 await logout();
        //             }
        //         } else {
        //             // No se pudo refrescar el token (ej. no hay cookie, cookie inválida, etc.)
        //             // Asegúrate de que el estado de autenticación esté vacío
        //             setAuth({});
        //         }
        //     } catch (error) {
        //         console.error("Error al verificar el refresh token:", error);
        //         setAuth({}); // Asegura que no haya estado de autenticación en caso de error
        //     } finally {
        //         setLoading(false); // Indica que la verificación inicial ha terminado
        //     }
        // };
        const verifyRefreshToken = async () => {
        try {
        const response = await refreshTokenService();

        if (response && response.tokenAcceso) {
            const decoded = decodeToken(response.tokenAcceso);
            console.log("Token decodificado estoy en el authprovider:", decoded);
            if (decoded.exp * 1000 > Date.now()) {
                // Igual que en login: normalizamos la forma `auth` para compatibilidad
                const userDecoded = {
                    indicador: decoded.indicador,
                    roles: decoded.roles,
                    co_roles: decoded.co_roles,
                    uuid: decoded.uuid
                };

                const refreshedAuth = {
                    ...userDecoded,
                    user: userDecoded,
                    tokenAcceso: response.tokenAcceso
                };
                setAuth(refreshedAuth);
                // Mantener localStorage en sincronía con el estado para compatibilidad con `api.js`
                localStorage.setItem('auth', JSON.stringify(refreshedAuth));
            } else {
                console.warn("Token de acceso refrescado expirado. Forzando logout.");
                await logout();
            }

        } else {
            setAuth({});
        }
    } catch (error) {
        if (error?.response?.status === 401) {
                console.log("No hay sesión activa - estado inicial");
                setAuth({});
            } else {
                console.error("Error al verificar refresh token:", error);
                await logout();
            }
    } finally {
        setLoading(false);
    }
};
        verifyRefreshToken(); // Ejecuta la verificación al montar el AuthProvider
    }, []); // Dependencia vacía para que se ejecute solo una vez al montar

    // Muestra un loader global mientras se verifica la autenticación inicial
    if (loading) {
        return <FullScreenLoader />;
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;


// import { createContext, useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// // Asegúrate de que loginService, logoutService y refreshTokenService manejen las cookies correctamente
// import { login as loginService, logout as logoutService, refreshToken as refreshTokenService } from '../services/login'; 
// import { jwtDecode } from 'jwt-decode'; 
// import FullScreenLoader from '../components/Loader/FullScreenLoader'; 

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
    
//     const [auth, setAuth] = useState({
//         user: null, // user contendrá: { indicador, roles, co_roles, uuid, ... }
//         tokenAcceso: null,
//         indicador: false, // Indicador de sesión activa
//     });
//     const [loading, setLoading] = useState(true);
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Función para manejar el inicio de sesión
//     const login = async (indicador, contrasena) => {
//         setLoading(true);
//         try {
//             const { result } = await loginService({ indicador, contrasena });
//             const decoded = jwtDecode(result.tokenAcceso);
            
//             // Acceso consistente: utiliza UserInfo si existe, si no, usa la raíz del token.
//             const userDecoded = decoded.UserInfo || decoded; 

//             const newAuth = {
//                 user: userDecoded,
//                 indicador: true,
//                 tokenAcceso: result.tokenAcceso
//             };
            
//             setAuth(newAuth);
//             // Ya no manipulamos localStorage/sessionStorage aquí si el Refresh Token está en una cookie.

//             return { success: true, from: location.state?.from?.pathname || '/solicitudes' };
//         } catch (error) {
//             console.error("Error en login de AuthProvider:", error);
//             setAuth({ user: null, tokenAcceso: null, indicador: false });
//             throw error; 
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Función para manejar el cierre de sesión
//     const logout = async () => {
//         // No activamos setLoading aquí para evitar un parpadeo, lo hacemos en el servicio si es necesario
//         try {
//             await logoutService(); // Esto debería limpiar la cookie del Refresh Token en el backend
//             setAuth({ user: null, tokenAcceso: null, indicador: false }); 
//         } catch (error) {
//             console.error("Error en logout de AuthProvider:", error);
//             // Incluso si el servicio de logout falla, limpiamos el estado local para forzar el cierre
//             setAuth({ user: null, tokenAcceso: null, indicador: false });
//         } finally {
//             // Si el logout es exitoso, esto podría llevar a una redirección, por lo que no siempre es necesario setLoading(false) aquí.
//         }
//     };

//     // Efecto para verificar la autenticación al cargar el componente (USANDO EL REFRESH TOKEN)
//     useEffect(() => {
//         const verifyRefreshToken = async () => {
//             try {
//                 // Llama al servicio que usa la cookie Refresh Token para obtener un nuevo Access Token.
//                 const response = await refreshTokenService();
                
//                 if (response && response.tokenAcceso) {
//                     const decoded = jwtDecode(response.tokenAcceso);
                    
//                     // Acceso consistente: utiliza UserInfo si existe, si no, usa la raíz del token.
//                     const userDecoded = decoded.UserInfo || decoded;
                    
//                     // Solo actualiza si el token no ha expirado
//                     if (userDecoded.exp * 1000 > Date.now()) {
//                         setAuth({
//                             user: userDecoded,
//                             indicador: true,
//                             tokenAcceso: response.tokenAcceso,
//                         });
//                     }
//                     // Si el token está expirado, simplemente dejamos que caiga al 'finally' 
//                     // donde se establece loading en false. Si la cookie expiró o es inválida,
//                     // el servicio refreshTokenService debe manejar la respuesta 401.

//                 } 
//                 // Si 'response' no tiene 'tokenAcceso', significa que no se pudo refrescar (401 o sin cookie).
//                 // En este caso, el estado 'auth' se queda en { user: null, ... } (lo que es correcto).
                
//             } catch (error) {
//                 // Manejo de errores 401 (no autorizado)
//                 if (error?.response?.status === 401) {
//                     console.log("No hay sesión activa (Refresh Token inválido/ausente).");
//                     // No hacemos nada, simplemente dejamos el estado 'auth' vacío o como { user: null, ... }
//                 } else {
//                     console.error("Error inesperado al verificar refresh token:", error);
//                 }
//             } finally {
//                 // ESTO ES LO MÁS IMPORTANTE: Indica que la verificación inicial ha terminado
//                 setLoading(false); 
//             }
//         };

//         verifyRefreshToken(); 
//     }, []); 

//     // Muestra el loader mientras se verifica la autenticación inicial
//     if (loading) {
//         return <FullScreenLoader />;
//     }

//     return (
//         <AuthContext.Provider value={{ auth, setAuth, login, logout, loading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export default AuthContext;