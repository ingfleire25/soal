import React from 'react'
import { api } from '../utils/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
    const { setAuth } = useAuth()
    const refrescar = async () => {
        const { data } = await api.get( '/auth/refrescar', { withCredentials: true } )
        console.log( "estoy en refreshtoken: ", data )
        setAuth( ( prev ) => {
            return {
                ...prev, tokenAcceso: result.tokenAcceso
            }
        } )
        return result.tokenAcceso
    }
    return refrescar
}

export default useRefreshToken