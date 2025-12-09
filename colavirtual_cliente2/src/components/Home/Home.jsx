import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch';
// import {DataTable} from '../DataTable';
import DataTable from 'react-data-table-component';
import FullScreenLoader from '../Loader/FullScreenLoader'
import { contenedor } from './Home.module.css'


const Home = ( { url } ) => {
    const { user } = useSelector( ( state ) => state )
    const navigate = useNavigate()
    useEffect( () => {
        if ( !user ) {
            navigate( '/bienvenida' )
        }
    }, [ user ] )
    const { data, error, loading } = useFetch( url )
    const columns = [
        { field: 'id', headerName: 'N°', width: 90 },
        {
            field: 'solicitanteNombre',
            headerName: 'Nombre',
            width: 150,
            editable: false,
            sortable: true,
        },
        {
            field: 'solicitanteApellido',
            headerName: 'Apellido',
            sortable: true,
            width: 150,
            editable: false,
        },
        {
            field: 'solicitanteCedula',
            headerName: 'Cédula',
            // type: 'number',
            sortable: true,
            width: 110,
            editable: false,
        },
        {
            field: 'topicoDesc',
            headerName: 'Tópico',
            sortable: true,
            width: 150,
            editable: false,
        },
        {
            field: 'uaDesc',
            headerName: 'Unidad de Atención',
            sortable: true,
            width: 150,
            editable: false,
        },
        {
            field: 'solicitudEstado',
            headerName: 'Estado',
            sortable: true,
            width: 100,
            renderCell: ( cellValues ) => {
                return <span style={ { color: cellValues.row.solicitudEstadoColor, fontWeight: 'bold' } }>
                    { cellValues.row.solicitudEstado }
                </span>
            }
        },
        {
            field: 'apertura',
            headerName: 'Fecha Creación',
            sortable: true,
            type: 'date',
            width: 180,
            valueFormatter: ( date ) => new Date( date.value ).toLocaleString( 'es-VE', { dateStyle: 'short', timeStyle: 'short' } )
        },
        {
            field: "detallle",
            headerName: 'Opciones',
            renderCell: ( cellValues ) => {
                return <Link to={ `detalle-solicitud/${cellValues.row.id}` }><span className='small'>Detalle</span></Link>
            }
        }
        // {
        //     field: 'fullName',
        //     headerName: 'Full name',
        //     description: 'This column has a value getter and is not sortable.',
        //     sortable: false,
        //     width: 160,
        //     valueGetter: ( params ) =>
        //         `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        // }
    ]
    let rows = data.map( s => {
        const topicos = s.topicos.map( t => t.tx_nombre ).join( ', ' )
        return {
            id: s.id,
            apertura: s.fh_apertura,
            atencion: s.fh_atencion,
            cierre: s.fh_cierre,
            // solicitanteId: s.solicitanteId,
            solicitanteNombre: s.usuario.tx_nombre,
            solicitanteApellido: s.usuario.tx_apellido,
            solicitanteCedula: s.usuario.tx_cedula,
            solicitanteEstado: s.usuario.estado,
            // topicoId: s.topico.id,
            // topicoDesc: s.topico.tx_nombre,
            topicoDesc: topicos,
            uaId: s.ua.id,
            uaDesc: s.ua.tx_nombre,
            solicitudEstado: s.estado.tx_nombre,
            solicitudEstadoColor: s.estado.tx_color
        }
    } )

    return (
        <div className={ `${contenedor} section` }>
            { loading ? <FullScreenLoader /> : null }
            <div className='wrapper-row' style={ { marginBottom: '1rem' } }>
                <h1>Solicitudes</h1>
                <Link to='/crear-solicitud' className='btn btn-primary-lined-fit '>Crear Solicitud</Link>
            </div>
            <DataTable columns={ columns } rows={ rows } />
        </div>
    )
}

//modificado por leonardo fleire 09/12/2025
//export default Home