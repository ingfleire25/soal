import React, { useState } from 'react'
import { contenedor, datos, ubicacion, categorizacion, botones } from './SolicitudFormulario.module.css'
import FormInput from '../FormComponents/FormInput'
import FormSelect from '../FormComponents/FormSelect'
import FormCheckboxesList from '../FormComponents/FormCheckboxesList'
import { validarFormato } from './validarFormato'
import { validarLlenado } from './validarLlenado'
import { getUsuario, postSolicitud } from '../../services'
import FullScreenLoader from '../Loader/FullScreenLoader'
import Swal from 'sweetalert2'
import { useNavigate, useLocation } from 'react-router-dom'


const SolicitudFormulario = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const initialState = {
        solicitanteId: "",
        cedula: "",
        nombre: "",
        apellido: "",
        correo: "",
        estado: "0",
        indicador: "",
        // trabajador: "", // cédula del trabajador por el que se presenta el sobreviviente
        zona: "0",
        area: "0",
        localidad: "0",
        uaId: "0",
        categoria: "0",
        tipos: [],
        // topicos: [],
        fh_atencion: "",
        correo_alt: ""
    }
    const [ input, setInput ] = useState( initialState )
    const [ error, setError ] = useState( {} )
    const [ loading, setLoading ] = useState( false )
    const buscarPorCI = async () => {
        if ( !input.cedula ) return false
        setLoading( true )
        setInput( {     // reiniciar sección 'Datos Personales' excepto cédula
            ...input,
            solicitanteId: "",
            nombre: "",
            apellido: "",
            correo: "",
            estado: "0",
            indicador: "",
            // trabajador: "",
        } )
        try {
            const u = await getUsuario( input.cedula )
            setInput( {
                ...input,
                solicitanteId: u.uuid,
                nombre: u.tx_nombre,
                apellido: u.tx_apellido,
                correo: u.tx_correo,
                estado: u.tx_estado,
                indicador: u.tx_indicador,
                // trabajador: u.trabajador
            } )
        } catch ( error ) {
            Swal.fire( error.statusText, '', 'error' )
        } finally {
            setLoading( false )
        }
    }
    const handleChange = ( { name, value } ) => {
        if ( name === 'cedula' ) {
            if ( !isNaN( value ) ) { // porque viene como string
                setInput( {
                    ...input,
                    cedula: value
                } )
            }
        }
        // else if ( name === 'trabajador' ) {
        //     if ( !isNaN( value ) ) {
        //         setInput( {
        //             ...input,
        //             trabajador: value
        //         } )
        //     }
        // }
        else {
            setInput( {
                ...input,
                [ name ]: value
            } )
        }
        setError( validarFormato( { ...input, [ name ]: value } ) )
    }
    const handleCheckbox = ( target, tipos ) => {
        if ( target.checked ) {
            setInput( {
                ...input,
                tipos: [ ...input.tipos, tipos ]
            } )
        } else {
            setInput( {
                ...input,
                tipos: input.tipos.filter( t => t.id !== tipos.id )
            } )
        }
    }
    const handleSubmit = async ( e ) => {
        e.preventDefault()
        const err = validarLlenado( input )
        if ( !Object.keys( err ).length ) {
            const lista = input.tipos.sort( ( a, b ) => a.tx_nombre.localeCompare( b.tx_nombre ) ).reduce( ( prev, curr, idx ) => {
                return prev + `<li>${input.tipos[ idx ].tx_nombre}</li>`
            }, "" )
            Swal.fire( {
                title: '¿Crear solicitud con los siguientes tipos y fecha?',
                icon: 'question',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Crear',
                denyButtonText: `Borrar`,
                cancelButtonText: 'Volver',
                confirmButtonColor: '#1b26ca', // secondary-clr-500
                denyButtonColor: '#ca1b26',    // primary-clr-500
                html: `<ul align='center'><span class='bold'>Tópicos:</span>${lista}</ul><br><p><span class='bold'>Fecha:</span> ${input.fh_atencion}</p>`
            } ).then( async ( result ) => {
                if ( result.isConfirmed ) {
                    let cuerpo = { ...input, tipos: input.tipos.map( t => t.id ) }
                    const res = await Swal.fire( {
                        title: 'Copia de Solicitud',
                        icon: 'question',
                        text: '¿Quisiera recibir una copia de la solicitud creada en un correo alternativo?',
                        input: 'email',
                        inputLabel: 'Correo alternativo',
                        inputPlaceholder: 'usuario@correo.com',
                        showDenyButton: true,
                        denyButtonText: 'No',
                        confirmButtonText: 'Enviar'
                    } )
                    // console.log( res )
                    if ( res.isConfirmed ) {
                        if ( res.value ) {
                            cuerpo = { ...cuerpo, correo_alt: res.value }
                        }
                        // console.log( cuerpo )
                    }
                    // console.log( cuerpo )
                    try {
                        setLoading( true )
                        const solicitud = await postSolicitud( cuerpo )
                        // console.log( "Recibí: ", solicitud )
                        try {
                            Swal.fire( {
                                title: '¡Solicitud creada con éxito!',
                                html: `
                                <p class='bold'>Su número de ticket es: ${solicitud.n_ticket}</p>
                                <p>En breve llegará a su bandeja de correo un mensaje con los detalles de su solicitud<p/>
                                `,
                                icon: 'success'
                            } )
                        } catch ( error ) {
                            console.log( error )
                        }
                        stateReset()
                    } catch ( error ) {
                        // console.error( error )
                        Swal.fire( 'Error al guardar la solicitud', error.statusText, 'error' )
                    } finally {
                        setLoading( false )
                        navigate( '/' )// o quizá hacer un link hasta el inicio
                    }
                } else if ( result.isDenied ) {
                    // console.log( result )
                    stateReset()
                    Swal.fire( 'Solicitud Eliminada', '', 'success' )
                }
            } )
        } else {
            setError( err )
        }
    }
    const stateReset = () => {
        setInput( initialState )
    }
    return (
        <form onSubmit={ handleSubmit }>
            { loading ? <FullScreenLoader /> : null }
            <div className={ `${contenedor} ` }>
                <div className={ `section ${datos} ` }>
                    <h2>Datos Personales</h2>
                    <div className='input-wrapper-col'>
                        <label htmlFor="cedula"><strong>Cédula:</strong></label>
                        <div className='input-wrapper-row'>
                            <input
                                type="text"
                                name="cedula"
                                id="cedula"
                                onChange={ ( e ) => handleChange( e.target ) }
                                value={ input.cedula }
                            />
                            <button
                                className='btn btn-primary-lined-fit'
                                type='button'
                                onClick={ buscarPorCI }
                            >
                                Buscar
                            </button>
                        </div>
                        <span className='small error'>{ error.cedula ? error.cedula : '\u00A0' }</span>
                    </div>
                    <div className='input-wrapper-row'>
                        <div className='input-wrapper-col'>
                            <FormInput
                                label={ 'Nombre:' }
                                attributes={
                                    {
                                        type: 'text',
                                        name: 'nombre',
                                        id: 'nombre',
                                        value: input.nombre
                                    }
                                }
                                errorMsg={ error.nombre }
                                onChange={ ( e ) => handleChange( e.target ) }
                            />
                        </div>
                        <div className='input-wrapper-col'>
                            <FormInput
                                label={ 'Apellido:' }
                                attributes={
                                    {
                                        type: 'text',
                                        name: 'apellido',
                                        id: 'apellido',
                                        value: input.apellido
                                    }
                                }
                                errorMsg={ error.apellido }
                                onChange={ ( e ) => handleChange( e.target ) }
                            />
                        </div>
                        <div className='input-wrapper-col'>
                            <FormInput
                                label={ 'Correo:' }
                                attributes={
                                    {
                                        type: 'text',
                                        name: 'correo',
                                        id: 'correo',
                                        value: input.correo
                                    }
                                }
                                errorMsg={ error.correo }
                                onChange={ ( e ) => handleChange( e.target ) }
                            />
                        </div>
                        <div className='input-wrapper-col'>
                            <label htmlFor='estado'><strong>Estado:</strong></label>
                            <select
                                name="estado"
                                id="estado"
                                onChange={ ( e ) => handleChange( e.target ) }
                                value={ input.estado }
                            >
                                <option value="0">Seleccione una opción</option>
                                {
                                    [ 'ACTIVO', 'JUBILADO', 'SOBREVIVIENTE' ].map( ( estado, i ) => {
                                        return <option key={ i } value={ estado }>{ estado }</option>
                                    } )
                                }
                            </select>
                            <span className='small error'>{ error.estado ? error.estado : '\u00A0' }</span>
                        </div>
                    </div>
                    <div className='input-wrapper-row'>
                        {
                            input.estado === 'ACTIVO' ?
                                <div className='input-wrapper-col'>
                                    <FormInput
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
                                    />
                                </div> : null
                        }
                        {
                            input.estado === 'SOBREVIVIENTE' || input.estado === 'JUBILADO' &&
                            alert( "En construcción" )
                            // <div className='input-wrapper-col'>
                            //     <FormInput
                            //         label={ 'C.I. Trabajador:' }
                            //         attributes={
                            //             {
                            //                 type: 'text',
                            //                 name: 'trabajador',
                            //                 id: 'trabajador',
                            //                 value: input.trabajador
                            //             }
                            //         }
                            //         errorMsg={ error.trabajador }
                            //         onChange={ ( e ) => handleChange( e.target ) }
                            //     />
                            // </div> : null
                        }
                    </div>
                </div>
                <div className={ `section ${ubicacion} ` }>
                    <h2>Ubicación CAIT/CAIJ</h2>
                    <div className='input-wrapper-col'>
                        <FormSelect
                            label={ 'Zona:' }
                            attributes={
                                {
                                    name: 'zona',
                                    id: 'zona',
                                    value: input.zona
                                }
                            }
                            url={ '/api/zonas?activo=true' }
                            errorMsg={ error.zona }
                            onChange={ ( e ) => handleChange( e.target ) }
                        // setLoading={ setLoading }
                        />
                    </div>
                    <div className='input-wrapper-col'>
                        <FormSelect
                            label={ 'Área:' }
                            attributes={
                                {
                                    name: 'area',
                                    id: 'area',
                                    value: input.area
                                }
                            }
                            url={ input.zona !== '0' ? `/api/zonas/${input.zona}/areas?activo=true` : '' }
                            errorMsg={ error.area }
                            onChange={ ( e ) => handleChange( e.target ) }
                        // setLoading={ setLoading }
                        />
                    </div >
                    <div className='input-wrapper-col'>
                        <FormSelect
                            label={ 'Localidad:' }
                            attributes={
                                {
                                    name: 'localidad',
                                    id: 'localidad',
                                    value: input.localidad
                                }
                            }
                            url={ input.area !== '0' ? `/api/areas/${input.area}/localidades?activo=true` : '' }
                            errorMsg={ error.localidad }
                            onChange={ ( e ) => handleChange( e.target ) }
                        // setLoading={ setLoading }
                        />
                    </div>
                    <div className='input-wrapper-col'>
                        <FormSelect
                            label={ 'Unidad de Atención:' }
                            attributes={
                                {
                                    name: 'uaId',
                                    id: 'uaId',
                                    value: input.uaId
                                }
                            }
                            url={ input.localidad !== '0' ? `/api/localidades/${input.localidad}/unidades-atencion?activo=true` : '' }
                            errorMsg={ error.uaId }
                            onChange={ ( e ) => handleChange( e.target ) }
                        // setLoading={ setLoading }
                        />
                    </div>
                </div >
                <div className={ `section ${categorizacion}` }>
                    <h2>Categorización de la Solicitud</h2>
                    <div className='input-wrapper-col'>
                        <FormSelect
                            label={ 'Categoría:' }
                            attributes={
                                {
                                    name: 'categoria',
                                    id: 'categoria',
                                    value: input.categoria
                                }
                            }
                            url={ input.estado === 'ACTIVO' ? `/api/categorias/${1}` : `/api/categorias` }
                            errorMsg={ error.categoria }
                            onChange={ ( e ) => handleChange( e.target ) }
                        // setLoading={ setLoading }
                        />
                    </div>
                    {/* <div className='input-wrapper-col'>
                        <FormSelect
                            label={ 'Tipo:' }
                            attributes={
                                {
                                    name: 'tipo',
                                    id: 'tipo',
                                    value: input.tipo
                                }
                            }
                            url={ input.categoria !== '0' ? `/api/categorias/${input.categoria}/tipos : '' }
                            errorMsg={ error.tipo }
                            onChange={ ( e ) => handleChange( e.target ) }
                        // setLoading={ setLoading }
                        />
                    </div> */}
                    <div className='input-wrapper-col'>
                        {/* <label>Tópico(s):</label> -> */ }
                        <FormCheckboxesList
                            url={ input.categoria !== '0' ? `/api/categorias/${input.categoria}/tipos?activo=true` : '' }
                            // url anterior: `/api/tipos/${input.tipo}/topicos?activo=true`
                            label={ 'Tipo(s) de Solicitud:' }
                            // attributes={
                            //     {
                            //         name: 'topico',
                            //         id: 'topico'
                            //         type: 'checkbox'
                            //     }
                            // }
                            onChange={ handleCheckbox }
                            // setLoading={ setLoading }
                            state={ input.tipos }
                            errorMsg={ error.tipo }
                        />
                        {/* <span className='small error'>{ error.topico ? error.topico : '\u00A0' }</span> */ }
                    </div>
                    <div className='input-wrapper-col'>
                        {/* <label htmlFor="cedula">Fecha de atención:</label>
                        <div className='input-wrapper-row'>
                            <input
                                type="date"
                                name="fh_atencion"
                                id="fh_atencion"
                                onChange={ ( e ) => handleChange( e.target ) }
                                value={ input.fh_atencion }
                            />
                        </div>
                        <span className='small error'>{ error.cedula ? error.cedula : '\u00A0' }</span> */}
                        <FormInput
                            label={ 'Fecha de Atención:' }
                            attributes={
                                {
                                    type: 'date',
                                    name: 'fh_atencion',
                                    id: 'fh_atencion',
                                    value: input.fh_atencion
                                }
                            }
                            errorMsg={ error.fh_atencion }
                            onChange={ ( e ) => handleChange( e.target ) }
                        />
                    </div>
                </div>
                <div className={ botones }>
                    <button className='btn btn-neutral-lined' type='reset' onClick={ stateReset }>Cancelar</button>
                    <button className='btn btn-secondary-full' type='submit'>Crear Solicitud</button>
                </div>
            </div >
        </form >
    )
}

export default SolicitudFormulario