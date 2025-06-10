// import React from 'react'
// import { Link } from 'react-router-dom'
// import styles from './NavBar.module.css'
// import logo from '../../assets/imgs/logo_blanco.png'

// const NavBar = () => {
//     return (
//         <header className={styles.container}>
//             <nav className={styles.navbar}>
//                 <p><Link to='/'><img className={styles.logo} src={logo} alt='PDVSA, S.A.' /></Link></p>
//                 <ul className={styles.menuList}>
//                     <li><Link to='/solicitudes'>Solicitudes</Link></li>
//                     <li><Link to='/reportes'>Reportes</Link></li>
//                     <li><Link to='/asignar-analista'>Asignar-Analista</Link></li>
//                     <li><Link to='/asignar-supervisor'>Asignar-supervisor</Link></li>
//                     <li><Link to='/cerrar-sesion'>Cerrar sesión</Link></li>
//                 </ul>
//             </nav>
//         </header>
//     )
// }

// export default NavBar

// Modificado por Leonardo fleire 30/05/25


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NavBar.module.css'; // Asegúrate de que tus estilos CSS estén definidos aquí
import logo from '../../assets/imgs/logo_blanco.png'; // Ruta a tu logo
import useAuth from '../../hooks/useAuth'; // Importa tu hook personalizado para la autenticación

const NavBar = () => {
    // Obtenemos el estado de autenticación (auth) y la función de cierre de sesión (logout)
    // del contexto proporcionado por AuthProvider.
    const { auth, logout } = useAuth();

    // Usamos el hook 'useNavigate' de React Router para redirigir al usuario.
    const navigate = useNavigate();

    // Función que se ejecuta cuando el usuario hace clic en "Cerrar sesión".
    const handleLogout = async () => {
        // Llama a la función 'logout' del contexto de autenticación.
        // Esta función se encarga de comunicarse con el backend para invalidar la sesión
        // y limpiar el estado de autenticación en el frontend.
        await logout();
        // Después de cerrar sesión, redirigimos al usuario a la página de inicio de sesión.
        navigate('/iniciar-sesion');
    };

    // --- Lógica para determinar la visibilidad de los enlaces según los roles ---

    // `isAuthenticated` es verdadero si existe un token de acceso en el estado de autenticación.
    // Esto es un indicador básico de que el usuario ha iniciado sesión.
    const isAuthenticated = !!auth.tokenAcceso;

    // `userRoles` contendrá un array de los IDs numéricos de los roles del usuario (ej. [1707, 3008]).
    // Si no hay roles (ej. el usuario no está autenticado), se inicializa como un array vacío para evitar errores.
    const userRoles = auth.co_roles   || [];
    
    // Definimos variables booleanas para cada tipo de rol,
    // comprobando si el array `userRoles` incluye el ID numérico correspondiente.
    // Estos IDs son los que vienen de tu base de datos y se envían en el token JWT.
    const isAnalyst = userRoles.includes(1707);    // Rol de Analista
    const isSupervisor = userRoles.includes(3008); // Rol de Supervisor
    const isAdmin = userRoles.includes(1709);      // Rol de Administrador
    // El rol 1802 (Invitado) no necesitará un enlace específico en la navbar,
    // ya que su acceso sería a rutas públicas o restringidas.
    
   // console.log(isAnalyst,isSupervisor,isAdmin)
    
    return (
        <header className={styles.container}>
            <nav className={styles.navbar}>
                {/* Enlace al inicio con el logo de la aplicación */}
                <p><Link to='/'><img className={styles.logo} src={logo} alt='PDVSA, S.A.' /></Link></p>
                <ul className={styles.menuList}>
                    {/* Condición principal: Mostrar enlaces solo si el usuario está autenticado */}
                    {isAuthenticated ? (
                        <>
                            {/* Enlace a 'Solicitudes': Visible para Analistas, Supervisores y Administradores. */}
                            {/* Si el usuario tiene alguno de estos roles, el enlace se mostrará. */}
                            {(isAnalyst || isSupervisor || isAdmin) && (
                                <li><Link to='/solicitudes'>Solicitudes</Link></li>
                            )}

                            {/* Enlace a 'Reportes': Visible solo para Supervisores y Administradores. */}
                            {(isSupervisor || isAdmin) && (
                                <li><Link to='/reportes'>Reportes</Link></li>
                            )}

                            {/* Enlace a 'Asignar Analista': Visible solo para Administradores. */}
                            {isAdmin && (
                                <li><Link to='/asignar-analista'>Asignar-Analista</Link></li>
                            )}

                            {/* Enlace a 'Asignar Supervisor': Visible solo para Administradores. */}
                            {isAdmin && (
                                <li><Link to='/asignar-supervisor'>Asignar-Supervisor</Link></li>
                            )}

                            {/* Botón para "Cerrar sesión": Siempre visible si el usuario está autenticado. */}
                            <li>
                                <button
                                    onClick={handleLogout} // Ejecuta la función handleLogout al hacer clic
                                    //className={styles.logoutButton} // Clase CSS para el botón (si la tienes)
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        // Si el usuario NO está autenticado, solo se muestra el enlace para iniciar sesión.
                        <li><Link to='/iniciar-sesion'>Iniciar Sesión</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default NavBar;