
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
//import FullScreenLoader from './components/Loader/FullScreenLoader'; // Tu componente de carga global


// const PrivateRoute = ({ children }) => {
//   const { auth } = useAuth();
//   const location = useLocation();

//   if (!auth.tokenAcceso) {
//     return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
//   }

//   return children;
// };

const PrivateRoute = ({ allowedRoles = [], children }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // console.log('[PrivateRoute] Verificando acceso para:', location.pathname);
  // console.log(' - Usuario autenticado:', !!auth.tokenAcceso);
  // console.log(' - Roles del usuario:', auth.co_roles);
  // console.log(' - Roles requeridos:', allowedRoles);

  if (!auth.tokenAcceso) {
    // console.log('[PrivateRoute] Redirigiendo a login');
    return <Navigate to="/iniciar-sesion" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && 
      !auth.co_roles?.some(role => allowedRoles.includes(role))) {
    // console.log('[PrivateRoute] Redirigiendo a no-autorizado');
    return <Navigate to="/no-autorizado" replace />;
  }

  // console.log('[PrivateRoute] Permitiendo acceso');
  return children;
};


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta Pública de Login */}
       
        
        {/* Layout Principal */}
        <Route element={<Layout />}>
         <Route index element={ <Inicio /> } />
          <Route path='iniciar-sesion' element={ <InicioSesion /> } />
          <Route path='crear-solicitud' element={ <SolicitudFormulario /> } />


          {/* Ruta Protegida de Solicitudes (que sabemos que funciona) */}
          <Route path="solicitudes" element={
            <PrivateRoute allowedRoles={[1707,3008, 1709]}>
              {/* <div style={{ border: '2px solid red', padding: '20px' }}> */}
                <SolicitudesTabla />
              {/* </div> */}
            </PrivateRoute>
          } />

          <Route path="reportes" element={
            <PrivateRoute allowedRoles={[3008, 1709]}>
              <div style={{ border: '2px solid blue', padding: '20px' }}>
                <Dashboard />
              </div>
            </PrivateRoute>
          } />

              <Route path="asignar-analista" element={
           <PrivateRoute allowedRoles={[1709]}>
            <div style={{ border: '2px solid green', padding: '20px' }}>
              <AsignarAnalista />
           </div>
           </PrivateRoute>
          } />
             

               <Route path="asignar-supervisor" element={
           <PrivateRoute allowedRoles={[1709]}>
            <div style={{ border: '2px solid green', padding: '20px' }}>
              <AsignarSupervisor />
           </div>
           </PrivateRoute>
          } />

          {/* <Route path="no-autorizado" element={<SinAuth />} /> */}
          <Route path="*" element={<NoMatch />} />
        </Route>
        
      </Routes>
    </AuthProvider>
  )
}

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