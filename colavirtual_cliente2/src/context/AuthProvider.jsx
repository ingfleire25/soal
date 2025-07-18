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
import { jwtDecode } from 'jwt-decode'; // Necesitarás 'jwt-decode'
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

    // Función para manejar el inicio de sesión
    const login = async (indicador, contrasena) => {
        setLoading(true); // Activa el loader al iniciar sesión
        try {
            // Llama al servicio de login (que interactúa con tu backend procesarLogin)
            const { result } = await loginService({ indicador, contrasena });
            
            // Decodificar el token para obtener la estructura consistente
                    const decoded = jwtDecode(result.tokenAcceso);

             const newAuth = {
            indicador: decoded.indicador,
            roles: decoded.roles,
            co_roles: decoded.co_roles,
            tokenAcceso: result.tokenAcceso,
            uuid: decoded.uuid
        };
        
        
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
            const decoded = jwtDecode(response.tokenAcceso);
            console.log("Token decodificado estoy en el authprovider:", decoded); 
            if (decoded.exp * 1000 > Date.now()) {
                setAuth({
                    indicador: decoded.indicador,
                    roles: decoded.roles,
                    co_roles: decoded.co_roles,
                    tokenAcceso: response.tokenAcceso
                });
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