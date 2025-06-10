
// import './App.css'
// import { Routes, Route, Link } from 'react-router-dom';
// import Layout from './components/Layout';
// import Inicio from './components/Inicio/Inicio';
// import InicioSesion from './components/InicioSesion/InicioSesion';
// import SolicitudFormulario from './components/SolicitudFormulario/SolicitudFormulario';
// // import RequerirAuth from './components/RequerirAuth/RequerirAuth';

// //import DashboardSolicitudes from './components/DashboardSolicitudes/DashboardSolicitudes';
// import SolicitudDetalle from './components/SolicitudDetalle/SolicitudDetalle';
// import AsignarAnalista from './components/AsignarAnalista/AsignarAnalista';
// import AsignarSupervisor from './components/AsignarSupervisor/AsignarSupervisor'
// import Dashboard from './components/Reportes/Dashboard';
// import SolicitudesTabla from './components/Solicitudes/SolicitudesTabla'


// const App = () => { 
//   return (
//     <main className='App'>
//       <Routes>
//          <Route path='/' element={ <Layout /> } >
//           {/* rutas públicas*/ }
//           <Route index element={ <Inicio /> } />
//           <Route path='iniciar-sesion' element={ <InicioSesion /> } />
//           <Route path='crear-solicitud' element={ <SolicitudFormulario /> } />
//           {/* <Route path='solicitudes2' element={ < TablaSolicitudes/> } />
//           <Route path='solicitudes3' element={ < SolicitudesTabla/> } /> */}
//           <Route path='no-autorizado' element={ <SinAuth /> } />
//           {/* rutas protegidas*/ }
//           {/* <Route element={ <RequerirAuth rolesPermitidos={ [ 1707, 3008, 1709 ] } /> } > */}

//             {/* <Route path='solicitudes' element={ <DashboardSolicitudes /> } /> {/* dashboard de analistas: url=`${import.meta.env.VITE_API_URL}/solicitudes` */ } 
//             <Route path='solicitudes' element={ <SolicitudesTabla /> } />
//             <Route path='detalle-solicitud/:solicitudId' element={ <SolicitudDetalle /> } />
//           {/* </Route> */}
//           {/* <Route element={ <RequerirAuth rolesPermitidos={ [ 3008, 1709 ] } /> } > */}
//             <Route path='asignar-analista' element={ <AsignarAnalista /> } /> {/** dashboard de admins y supervisores */ }
//             <Route path='asignar-supervisor' element={ < AsignarSupervisor/> } /> {/** dashboard de admins y supervisores */ }
//             <Route path='reportes' element={ <Dashboard /> } /> {/** dashboard de admins y supervisores */ }
//           {/* </Route> */}
//           {/* todo lo que no haga match*/ }
//           <Route path='*' element={ <NoMatch /> } />
   
//         </Route>
//       </Routes>
//     </main >
//   )
// }

// export default App

// const NoMatch = () => {
//   return (
//     <div>
//       <h2>404</h2>
//       <h1>El sitio no existe o no se encuentra</h1>
//       <p>
//         <Link to='/'>Volver al inicio</Link>
//       </p>
//     </div>
//   );
// }
// const SinAuth = () => {
//   return (
//     <div>
//       <h2>401</h2>
//       <h1>Usted no tiene autorización para acceder a este sitio</h1>
//       <p>
//         <Link to='/'>Volver al inicio</Link>
//       </p>
//     </div>
//   );
// }

// modificado por Leonardo Fleire 30/05/25

import './App.css';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'; // Agrega Navigate
import Layout from './components/Layout'; // Asumo que este Layout incluye tu NavBar
import Inicio from './components/Inicio/Inicio';
import InicioSesion from './components/InicioSesion/InicioSesion';
import SolicitudFormulario from './components/SolicitudFormulario/SolicitudFormulario';

// Importa los componentes de las páginas protegidas
import SolicitudDetalle from './components/SolicitudDetalle/SolicitudDetalle';
import AsignarAnalista from './components/AsignarAnalista/AsignarAnalista';
import AsignarSupervisor from './components/AsignarSupervisor/AsignarSupervisor';
import Dashboard from './components/Reportes/Dashboard';
import SolicitudesTabla from './components/Solicitudes/SolicitudesTabla';

// Importa el AuthProvider y el useAuth para la lógica de autenticación
import { AuthProvider } from './context/AuthProvider'; // Asegúrate de que la ruta sea correcta
import useAuth from './hooks/useAuth'; // Asegúrate de que la ruta sea correcta
import FullScreenLoader from './components/Loader/FullScreenLoader'; // Tu componente de carga global

// --- Componente RequerirAuth (tu PrivateRoute) ---
// Este componente envolverá las rutas que requieren autenticación y/o roles específicos.
// Se ha renombrado de 'RequerirAuth' a 'PrivateRoute' para mantener la consistencia con ejemplos estándar,
// pero puedes usar el nombre que prefieras.
const PrivateRoute = ({ allowedRoles = [], children }) => {
    // Usa el hook useAuth para acceder al estado de autenticación
    const { auth, loading } = useAuth();
    const location = useLocation();
    // 1. Mostrar loader mientras se verifica la autenticación inicial
    if (loading) {
        return <FullScreenLoader />;
    }

// console.log("Auth state in PrivateRoute:", {
//         token: !!auth.tokenAcceso,
//         roles: auth.roles,
//         allowedRoles,
//         path: location.pathname,
//         auth: auth
//     });

    // 2. Si no hay token de acceso (no autenticado), redirige a la página de inicio de sesión
    // Nota: 'auth.tokenAcceso' es el nuevo token de acceso de corta duración que se obtiene.
    if (!auth.tokenAcceso) {
        // Redirige a la página de login, pasando la ubicación actual
        // para que después del login se pueda volver aquí.
        return <Navigate to="/iniciar-sesion" replace state={{ from: location }} />;
    }

    // 3. Si se especificaron roles permitidos y el usuario no tiene ninguno de ellos
    // `auth.roles` contendrá los IDs numéricos de los roles del usuario logueado (ej. [1707, 3008, 1709])
    // if (allowedRoles.length > 0 && !auth.roles?.some(roleId => allowedRoles.includes(roleId))) {
    //     // Redirige a la página de "No Autorizado"
    //     return <Navigate to="/no-autorizado" replace />;
    // }
    const hasRequiredRole = allowedRoles.length === 0 || (auth.co_roles && auth.co_roles.some(role => allowedRoles.includes(role)));

    if (!hasRequiredRole) {
        console.warn("Acceso denegado. Roles necesarios:", allowedRoles, "Roles del usuario:", auth.roles);
        return <Navigate to="/no-autorizado" replace />;
    }


    // 4. Si está autenticado y tiene los roles correctos, renderiza los componentes hijos
    return children;
};
// --- Fin Componente RequerirAuth ---


const App = () => {
    return (
        // Envuelve toda la aplicación con AuthProvider para que el contexto esté disponible globalmente
        <AuthProvider>
            <main className='App'>
                {/* Layout ahora contiene NavBar internamente, así que no se importa aquí directamente */}
                <Routes>
                    {/* La ruta base '/' ahora tiene un Layout como elemento principal */}
                    {/* <Route path='/' element={<Layout />}> */}
                        {/* Rutas públicas */}
                        {/* La ruta index se renderiza en el Outlet de Layout para '/' */}
                        {/* <Route index element={<Inicio />} /> */}
                        {/* La página de inicio de sesión */}
                        <Route path='iniciar-sesion' element={<InicioSesion />} />
                        {/* La página para crear solicitudes (accesible sin autenticación) */}
                        <Route path='crear-solicitud' element={<SolicitudFormulario />} /> 
                        {/* Página de "No Autorizado" */}
                       
                        <Route element={<Layout/>}>
                        <Route index element={<Inicio />} />
                         <Route path='no-autorizado' element={<SinAuth />} />

                        {/* Rutas protegidas */}

                        {/* Grupo de rutas para roles con permisos para 'SolicitudesTabla' y 'SolicitudDetalle' */}
                        {/* Asumo que 1707 es Analista, 3008 es Supervisor, 1709 es Administrador */}
                        <Route element={<PrivateRoute allowedRoles={[1707, 3008, 1709]} />}>
                            {/* Dashboard de solicitudes para analistas, supervisores, administradores */}
                            <Route path='solicitudes' element={<SolicitudesTabla />} />
                            {/* Detalle de solicitud, accesible para los mismos roles */}
                            <Route path='detalle-solicitud/:solicitudId' element={<SolicitudDetalle />} />
                        </Route>

                        {/* Grupo de rutas para roles con permisos para 'AsignarAnalista', 'AsignarSupervisor', 'Dashboard' (Reportes) */}
                        {/* Asumo que 3008 es Supervisor, 1709 es Administrador */}
                        <Route element={<PrivateRoute allowedRoles={[3008, 1709]} />}>
                            {/* Asignar Analista: dashboard de admins y supervisores */}
                            <Route path='asignar-analista' element={<AsignarAnalista />} />
                            {/* Asignar Supervisor: dashboard de admins y supervisores */}
                            <Route path='asignar-supervisor' element={<AsignarSupervisor />} />
                            {/* Reportes: dashboard de admins y supervisores */}
                            <Route path='reportes' element={<Dashboard />} />
                        </Route>

                        {/* Ruta comodín para todo lo que no haga match */}
                        <Route path='*' element={<NoMatch />} />

                    </Route> {/* Cierre del Route principal con Layout */}
                </Routes>
            </main>
        </AuthProvider>
    );
};

export default App;

// Componente para la página 404 (No Encontrado)
const NoMatch = () => {
    return (
        <div>
            <h2>404</h2>
            <h1>El sitio no existe o no se encuentra</h1>
            <p>
                <Link to='/'>Volver al inicio</Link>
            </p>
        </div>
    );
};

// Componente para la página "Sin Autorización"
const SinAuth = () => {
    return (
        <div>
            <h2>401</h2>
            <h1>Usted no tiene autorización para acceder a este sitio</h1>
            <p>
                <Link to='/'>Volver al inicio</Link>
            </p>
        </div>
    );
};