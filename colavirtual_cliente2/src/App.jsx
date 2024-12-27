
import './App.css'
import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/Layout';
import Inicio from './components/Inicio/Inicio';
import InicioSesion from './components/InicioSesion/InicioSesion';
import SolicitudFormulario from './components/SolicitudFormulario/SolicitudFormulario';
// import RequerirAuth from './components/RequerirAuth/RequerirAuth';
import DashboardSolicitudes from './components/DashboardSolicitudes/DashboardSolicitudes';
import SolicitudDetalle from './components/SolicitudDetalle/SolicitudDetalle';
import Configuracion from './components/Configuracion/Configuracion';
import Dashboard from './components/Reportes/Dashboard';
import TablaSolicitudes from './components/Tabla solicitudes/TablaSolicitudes'


const App = () => {
  return (
    <main className='App'>
      <Routes>
         
          {/* rutas públicas*/ }
          <Route index element={ <Inicio /> } />
          <Route path='iniciar-sesion' element={ <InicioSesion /> } />
          <Route path='crear-solicitud' element={ <SolicitudFormulario /> } />
          <Route path='solicitudes2' element={ < TablaSolicitudes/> } />
          <Route path='no-autorizado' element={ <SinAuth /> } />
          {/* rutas protegidas*/ }
          {/* <Route element={ <RequerirAuth rolesPermitidos={ [ 1707, 3008, 1709 ] } /> } > */}
            <Route path='solicitudes' element={ <DashboardSolicitudes /> } /> {/* dashboard de analistas: url=`${import.meta.env.VITE_API_URL}/solicitudes` */ }
            <Route path='detalle-solicitud/:solicitudId' element={ <SolicitudDetalle /> } />
          {/* </Route> */}
          {/* <Route element={ <RequerirAuth rolesPermitidos={ [ 3008, 1709 ] } /> } > */}
            <Route path='configuracion' element={ <Configuracion /> } /> {/** dashboard de admins y supervisores */ }
            <Route path='reportes' element={ <Dashboard /> } /> {/** dashboard de admins y supervisores */ }
          {/* </Route> */}
          {/* todo lo que no haga match*/ }
          <Route path='*' element={ <NoMatch /> } />
   
      </Routes>
    </main >
  )
}

export default App

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
}
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
}