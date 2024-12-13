import React from 'react'
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom' // useLocation
import { container, box } from './Inicio.module.css'
import { login } from '../../services/login'
import Swal from 'sweetalert2'
import FormInput from '../FormComponents/FormInput'
import FullScreenLoader from '../Loader/FullScreenLoader'
import useAuth from '../../hooks/useAuth'


const Inicio = () => {
    const estadoInicial = {
        indicador: "",
        contrasena: ""
    }
    const { setAuth } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/solicitudes' // de donde viene o al inicio
    const [ input, setInput ] = useState( estadoInicial )
    const [ error, setError ] = useState( {} )
    // const [ focus, setFocus ] = useState( false )
    const [ loading, setLoading ] = useState( false )
    const validarFormato = ( value ) => {
        let error = {}
        if ( !( /^[ a-zA-Z]*$/g.test( value.indicador ) ) ) {
            error.indicador = "Este campo contiene caracteres inválidos"
        } else if ( !input.indicador ) {
            error.indicador = "Este campo no puede estar vacío"
        }
        if ( !input.contrasena ) {
            error.contrasena = "Este campo no puede estar vacío"
        }
        return error
    }
    const handleChange = ( { name, value } ) => {
        setInput( {
            ...input,
            [ name ]: value
        } )
        // }
        // const handleFocus = ( { name, value } ) => {
        //     setFocus( true )
        setError( validarFormato( { ...input, [ name ]: value } ) )
    }
    const handleSubmit = async ( e ) => {
        e.preventDefault()
        // console.log( input )
        // const err = validarLlenado( input )
        if ( !Object.keys( error ).length ) {
            // manejo del inicio de sesión
            try {
                setLoading( true )
                const { result } = await login( { indicador: input.indicador, contrasena: input.contrasena } )
                console.log( result )
                setAuth( { indicador: input.indicador, roles: result.roles, co_roles: result.co_roles, tokenAcceso: result.tokenAcceso } )
                setInput( estadoInicial )
                navigate( from, { replace: true } )
            } catch ( error ) { // error de validación a nivel de servidor
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
                <h1 className='h2'>Bienvenido a ColaVirtual</h1>
                <p className='h3'>
                    Donde podrás solicitar los beneficios que te corresponden como trabajador, jubilado o sobreviviente.
                </p>
                <Link to='/crear-solicitud' className='btn btn-secondary-full mt-1'>Crea una Solicitud</Link>
            </section>
            <section className={ box }>
                <h2 className='h2'>Inicia Sesión</h2>
                <p className='h3'>
                    Si eres un analista del CAIT/CAIJ, inicia sesión para entrar y comenzar a procesar solicitudes.
                </p>
                {/* <form onSubmit={ handleSubmit }> */ }
                {/* <div className='input-wrapper-col'> */ }
                {/* <label htmlFor='indicador'>Indicador:</label>
                        <input
                            type='text'
                            name='indicador'
                            id='indicador'
                            value={ input.indicador }
                            onChange={ ( e ) => handleChange( e.target ) }
                            onBlur={ ( e ) => handleFocus( e.target ) }
                            focus={ `${focus}` }
                        />
                        <span className='small'>
                            { error.indicador ? error.indicador : "" }
                        </span> */}
                {/* <FormInput
                            label={ 'Indicador:' }
                            attributes={
                                {
                                    type: 'text',
                                    name: 'indicador',
                                    id: 'indicador',
                                    value: input.indicador
                                }
                            }
                            errorMsg={ error.indicador }
                            onChange={ ( e ) => handleChange( e.target ) }
                        /> */}
                {/* </div> */ }
                {/* <div className='input-wrapper-col'> */ }
                {/* <label htmlFor='contrasena'>Contrasena:</label>
                        <input
                            type='password'
                            name='contrasena'
                            id='contrasena'
                            value={ input.contrasena }
                            onChange={ ( e ) => handleChange( e.target ) }
                            onBlur={ ( e ) => handleFocus( e.target ) }
                            focus={ `${focus}` }
                        />
                        <span className='small'>
                            { error.contrasena ? error.contrasena : "" }
                        </span> */}
                {/* <FormInput
                            label={ 'Contraseña:' }
                            attributes={
                                {
                                    type: 'password',
                                    name: 'contrasena',
                                    id: 'contrasena',
                                    value: input.contrasena
                                }
                            }
                            errorMsg={ error.contrasena }
                            onChange={ ( e ) => handleChange( e.target ) }
                        /> */}
                {/* </div> */ }
                {/* <button type='submit' className='btn btn-primary-full mt-1'>Iniciar Sesión</button> */ }
                <Link to='/iniciar-sesion' className='btn btn-primary-full mt-1'>Iniciar Sesión</Link>
                {/* </form> */ }
            </section>
        </section>
    )
}

export default Inicio