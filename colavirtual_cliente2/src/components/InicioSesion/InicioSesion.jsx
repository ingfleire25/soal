// import React, { useState } from 'react'
// import { container, box } from './InicioSesion.module.css'
// import FormInput from '../FormComponents/FormInput'
// import { validarFormato } from './validarFormato'
// import { validarLlenado } from './validarLlenado'
// import useAuth from '../../hooks/useAuth'
// import { login } from '../../services/'
// import Swal from 'sweetalert2'
// import { useNavigate, useLocation } from 'react-router-dom'
// import FullScreenLoader from '../Loader/FullScreenLoader'


// const InicioSesion = () => {
//     const estadoInicial = {
//         indicador: "",
//         contrasena: ""
//     }
//     const { setAuth } = useAuth()
//     const navigate = useNavigate()
//     const location = useLocation()
//     const from = location.state?.from?.pathname || '/solicitudes' // de donde venía o al inicio
//     const [ input, setInput ] = useState( estadoInicial )
//     const [ error, setError ] = useState( {} )
//     const [ loading, setLoading ] = useState( false )
//     const handleChange = ( { name, value } ) => {
//         setInput( {
//             ...input,
//             [ name ]: value
//         } )
//         setError( validarFormato( { ...input, [ name ]: value } ) )
//     }
//     const handleSubmit = async ( e ) => {
//         e.preventDefault()
//         const err = validarLlenado( input )
//         if ( !Object.keys( err ).length ) {
//             // manejo del inicio de sesión
//             try {
//                 setLoading( true )
//                 const { result } = await login( { indicador: input.indicador, contrasena: input.contrasena } )
//                 // console.log( "no estoy en el error", result )
//                 setAuth( { indicador: result.indicador, roles: result.roles, co_roles: result.co_roles, tokenAcceso: result.tokenAcceso } )
//                 setInput( estadoInicial )
//                 navigate( from, { replace: true } )
//             } catch ( error ) { // error de validación a nivel de servidor
//                 console.log( "estoy en el error: ", error )
//                 Swal.fire( error.statusText || "Error al iniciar sesión", '', 'error' )
//             } finally {
//                 setLoading( false )
//             }
//         }
//         else { // error de validación a nivel de cliente
//             setError( err )
//         }
//     }

//     return (
//         <section className={ `${container} txt-center` }>
//             { loading ? <FullScreenLoader /> : null }
//             <section className={ box }>
//             </section>
//             <section className={ box }>
//                 <h1 className='h1'>Inicia Sesión</h1>
//                 <form onSubmit={ e => handleSubmit }>
//                     <div className='input-wrapper-col'>
//                         <FormInput
//                             label={ 'Indicador:' }
//                             attributes={ {
//                                 type: 'text',
//                                 name: 'indicador',
//                                 id: 'indicador',
//                                 value: input.indicador
//                             } }
//                             errorMsg={ error.indicador }
//                             onChange={ ( e ) => handleChange( e.target ) } />
//                     </div>
//                     <div className='input-wrapper-col'>
//                         <FormInput
//                             label={ 'Contraseña:' }
//                             attributes={ {
//                                 type: 'password',
//                                 name: 'contrasena',
//                                 id: 'contrasena',
//                                 value: input.contrasena
//                             } }
//                             errorMsg={ error.contrasena }
//                             onChange={ ( e ) => handleChange( e.target ) } />
//                     </div>
//                     <button onClick={ handleSubmit } className='btn btn-primary-full mt-1'>Iniciar Sesión</button>
//                 </form>
//             </section>
//         </section >
//     )
// }

// export default InicioSesion

// modificacion por Leonardo fleire 30/05/25

import React, { useState } from 'react'
import { container, box } from './InicioSesion.module.css'
import FormInput from '../FormComponents/FormInput'
import { validarFormato } from './validarFormato'
import { validarLlenado } from './validarLlenado'
import useAuth from '../../hooks/useAuth' // Correcto
// import { login } from '../../services/' // <-- ESTO YA NO ES NECESARIO IMPORTAR DIRECTAMENTE
import Swal from 'sweetalert2'
import { useNavigate, useLocation } from 'react-router-dom'
import FullScreenLoader from '../Loader/FullScreenLoader'


const InicioSesion = () => {
    const estadoInicial = {
        indicador: "",
        contrasena: ""
    }
    // Desestructuramos la función `login` del contexto de autenticación
    const { login:  authLogin, loading: authLoading } = useAuth(); // Renombramos `login` para evitar conflicto
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/solicitudes' // de donde venía o al inicio
    const [ input, setInput ] = useState( estadoInicial );
    const [ error, setError ] = useState( {} );
    // El estado `loading` de la página de login ahora solo controla el proceso del formulario
    const [ formLoading, setFormLoading ] = useState( false ); 

    const handleChange = ( { name, value } ) => {
        setInput( {
            ...input,
            [ name ]: value
        } );
        setError( validarFormato( { ...input, [ name ]: value } ) );
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        const err = validarLlenado( input ); // Valida el llenado de los campos
        
        if ( !Object.keys( err ).length ) {
            // Si no hay errores de validación en el cliente
            try {
                setFormLoading( true ); // Activa el loader del formulario
                
                // Llama a la función `login` expuesta por `useAuth()`
                const { success, from: redirectTo } = await authLogin( input.indicador, input.contrasena );
                
                if (success) {
                    setInput( estadoInicial ); // Limpia el formulario
                    navigate( redirectTo, { replace: true } ); // Redirige al usuario
                } else {
                    // Esto se manejaría si `authLogin` devuelve `false` explícitamente
                    // pero `authLogin` ahora lanza errores para manejarlos aquí.
                    Swal.fire( "Error al iniciar sesión", '', 'error' );
                }
            } catch ( error ) { // Captura errores de la función `authLogin` (del backend)
                console.log( "Error al iniciar sesión:", error );
                Swal.fire( error.statusText || "Error desconocido al iniciar sesión", '', 'error' );
            } finally {
                setFormLoading( false ); // Desactiva el loader del formulario
            }
        }
        else { // Errores de validación a nivel de cliente
            setError( err );
        }
    };

    return (
        <section className={ `${container} txt-center` }>
            { /* `authLoading` es el loader global de AuthProvider al inicio de la aplicación */ }
            { /* `formLoading` es el loader específico del formulario de login */ }
            { authLoading || formLoading ? <FullScreenLoader /> : null } 
            
            <section className={ box }>
                {/* Puedes poner aquí la imagen o contenido lateral */}
            </section>
            <section className={ box }>
                <h1 className='h1'>Inicia Sesión</h1>
                <form onSubmit={ handleSubmit }> {/* Se usa handleSubmit directamente en el onSubmit del form */}
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
                    {/* El botón de submit ya no necesita un onClick si el form tiene onSubmit */}
                    <button type="submit" className='btn btn-primary-full mt-1' disabled={formLoading}>
                        {formLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </section>
        </section >
    )
}

export default InicioSesion;