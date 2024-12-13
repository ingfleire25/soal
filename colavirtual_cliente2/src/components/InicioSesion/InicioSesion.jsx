import React, { useState } from 'react'
import { container, box } from './InicioSesion.module.css'
import FormInput from '../FormComponents/FormInput'
import { validarFormato } from './validarFormato'
import { validarLlenado } from './validarLlenado'
import useAuth from '../../hooks/useAuth'
import { login } from '../../services/'
import Swal from 'sweetalert2'
import { useNavigate, useLocation } from 'react-router-dom'
import FullScreenLoader from '../Loader/FullScreenLoader'


const InicioSesion = () => {
    const estadoInicial = {
        indicador: "",
        contrasena: ""
    }
    const { setAuth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/solicitudes' // de donde venía o al inicio
    const [ input, setInput ] = useState( estadoInicial )
    const [ error, setError ] = useState( {} )
    const [ loading, setLoading ] = useState( false )
    const handleChange = ( { name, value } ) => {
        setInput( {
            ...input,
            [ name ]: value
        } )
        setError( validarFormato( { ...input, [ name ]: value } ) )
    }
    const handleSubmit = async ( e ) => {
        e.preventDefault()
        const err = validarLlenado( input )
        if ( !Object.keys( err ).length ) {
            // manejo del inicio de sesión
            try {
                setLoading( true )
                const { result } = await login( { indicador: input.indicador, contrasena: input.contrasena } )
                // console.log( "no estoy en el error", result )
                setAuth( { indicador: result.indicador, roles: result.roles, co_roles: result.co_roles, tokenAcceso: result.tokenAcceso } )
                setInput( estadoInicial )
                navigate( from, { replace: true } )
            } catch ( error ) { // error de validación a nivel de servidor
                console.log( "estoy en el error: ", error )
                Swal.fire( error.statusText || "Error al iniciar sesión", '', 'error' )
            } finally {
                setLoading( false )
            }
        }
        else { // error de validación a nivel de cliente
            setError( err )
        }
    }

    return (
        <section className={ `${container} txt-center` }>
            { loading ? <FullScreenLoader /> : null }
            <section className={ box }>
            </section>
            <section className={ box }>
                <h1 className='h1'>Inicia Sesión</h1>
                <form onSubmit={ e => handleSubmit }>
                    <div className='input-wrapper-col'>
                        <FormInput
                            label={ 'Indicador:' }
                            attributes={ {
                                type: 'text',
                                name: 'indicador',
                                id: 'indicador',
                                value: input.indicador
                            } }
                            errorMsg={ error.indicador }
                            onChange={ ( e ) => handleChange( e.target ) } />
                    </div>
                    <div className='input-wrapper-col'>
                        <FormInput
                            label={ 'Contraseña:' }
                            attributes={ {
                                type: 'password',
                                name: 'contrasena',
                                id: 'contrasena',
                                value: input.contrasena
                            } }
                            errorMsg={ error.contrasena }
                            onChange={ ( e ) => handleChange( e.target ) } />
                    </div>
                    <button onClick={ handleSubmit } className='btn btn-primary-full mt-1'>Iniciar Sesión</button>
                </form>
            </section>
        </section >
    )
}

export default InicioSesion