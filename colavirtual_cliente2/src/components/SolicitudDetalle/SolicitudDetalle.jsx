import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'
import FullScreenLoader from '../Loader/FullScreenLoader'
import { contenedor } from './SolicitudDetalle.module.css'


const SolicitudDetalle = () => {
    let { solicitudId } = useParams()
    const { data, error, loading } = useFetch( `/solicitudes/${solicitudId}` )
    if ( loading ) return <FullScreenLoader />
    if ( !Object.keys( data ).length ) return null

    return (
        <div className={ `${contenedor} section` }>
            <h1>Solicitud #{ solicitudId }</h1>
            <ul>
                <li>
                    <strong>Solicitante: </strong>
                    { data.usuario.tx_nombre + ' ' + data.usuario.tx_apellido }
                </li>
                <li>
                    <strong>Fecha de apertura: </strong>
                    { new Date( data.fh_apertura ).toLocaleString( 'es-VE', { dateStyle: 'short', timeStyle: 'short' } ) }
                </li>
                <li>
                    <strong>Analista para el caso: </strong>
                    { data.analista || 'Sin Asignar' }
                </li>
                <li>
                    <strong>Estado: </strong>
                    <span style={ { color: data.estado.tx_color } } className='bold'>{ data.estado.tx_nombre }</span>
                </li>
                <li>
                    <strong>Correo donde se envió la notificación: </strong>
                    { data.enviadoA.join( ', ' ) }
                </li>
                <li>
                    <strong>Unidad de Atención: </strong>
                    { data.ua.tx_nombre }
                </li>
                <li>
                    <strong>Tópicos Seleccionados:</strong>
                    <ul>
                        {
                            data.topicos.map( t => {
                                return <li key={ t.id }>{ t.tx_nombre }</li>
                            } )
                        }
                    </ul>
                </li>
            </ul>
            <Link to='/' className='btn btn-primary-lined-fit'>Volver</Link>
        </div>
    )
}

export default SolicitudDetalle