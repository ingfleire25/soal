// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import NavBar from './NavBar/NavBar'

// const Layout = () => {
//     return (
//         <div>
//             <NavBar/>
//             <Outlet />
//         </div>
//     )
// }

// export default Layout

import { Outlet } from 'react-router-dom'
import NavBar from './NavBar/NavBar'
import { useLocation } from 'react-router-dom'

const Layout = () => {
  const location = useLocation()
  
  // console.log('[Layout] Ruta actual:', location.pathname)
  // console.log('[Layout] Renderizando Layout con Outlet')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout