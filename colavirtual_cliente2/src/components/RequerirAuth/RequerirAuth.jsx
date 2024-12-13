// import { useState, useEffect } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


const RequerirAuth = ( { rolesPermitidos } ) => {
    const { auth } = useAuth()
    console.log( auth )
    const location = useLocation()
    return (
        auth?.co_roles?.find( rol => rolesPermitidos.includes( rol ) ) // pregunto si hay auth y busco entre los roles autorizados
            ? <Outlet /> // muestro la vista si el usar tiene un rol autorizado
            : auth?.indicador // si al preguntar por el auth o rol da false, vuelvo a preguntar si hay auth por si acaso
                ? <Navigate to='/no-autorizado' state={ { from: location } } replace /> // sí hay auth, entonces no tiene un rol autorizado
                : <Navigate to='/' state={ { from: location } } replace /> // no había auth, entonces lo devolvemos al login
        // from location replace reemplaza la dirección 'actual' por lo que esté en 'to'
    )
}

export default RequerirAuth