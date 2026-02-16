import React, { useEffect, useState,useMemo } from 'react'
import Filtros from './Filtros'
import DataTable from '../DataTable/DataTable'
// import { getSolicitudes } from '../../services'
// import Paginacion from '../Paginacion/Paginacion'
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styles from './DashboardSolicitudes.module.css'


const datos = [
    {
        id: 1,
        fh_creacion: '13/03/2023',
        fh_asignacion: null,
        fh_atencion: null,
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#010',
        analistaId: 1,
        analista: null,
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: 'green',
            tx_nombre: 'ABIERTO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 2,
        fh_creacion: '13/03/2023',
        fh_asignacion: null,
        fh_atencion: null,
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#009',
        analistaId: 1,
        analista: null,
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: 'green',
            tx_nombre: 'ABIERTO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 3,
        fh_creacion: '13/03/2023',
        fh_asignacion: '13/03/2023',
        fh_atencion: null,
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#008',
        analistaId: 1,
        analista: {
            tx_nombre: 'Guillermo',
            tx_apellido: 'Morillo'
        },
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: 'green',
            tx_nombre: 'ABIERTO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 4,
        fh_creacion: '13/03/2023',
        fh_asignacion: '13/03/2023',
        fh_atencion: null,
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#007',
        analistaId: 1,
        analista: {
            tx_nombre: 'Guillermo',
            tx_apellido: 'Morillo'
        },
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: 'green',
            tx_nombre: 'ABIERTO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 5,
        fh_creacion: '13/03/2023',
        fh_asignacion: '13/03/2023',
        fh_atencion: '13/03/2023',
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#006',
        analistaId: 1,
        analista: {
            tx_nombre: 'Guillermo',
            tx_apellido: 'Morillo'
        },
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: 'orange',
            tx_nombre: 'RELACIONADO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 6,
        fh_creacion: '13/03/2023',
        fh_asignacion: '13/03/2023',
        fh_atencion: '13/03/2023',
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#005',
        analistaId: 1,
        analista: {
            tx_nombre: 'Guillermo',
            tx_apellido: 'Morillo'
        },
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: '#ff832b',
            tx_nombre: 'EN PROCESO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 7,
        fh_creacion: '13/03/2023',
        fh_asignacion: '13/03/2023',
        fh_atencion: '13/03/2023',
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#004',
        analistaId: 1,
        analista: {
            tx_nombre: 'Guillermo',
            tx_apellido: 'Morillo'
        },
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: 'orange',
            tx_nombre: 'RELACIONADO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 8,
        fh_creacion: '13/03/2023',
        fh_asignacion: '13/03/2023',
        fh_atencion: '13/03/2023',
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#003',
        analistaId: 1,
        analista: {
            tx_nombre: 'Guillermo',
            tx_apellido: 'Morillo'
        },
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: '#ff832b',
            tx_nombre: 'EN PROCESO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 9,
        fh_creacion: '13/03/2023',
        fh_asignacion: null,
        fh_atencion: null,
        fh_cierre: null,
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#002',
        analistaId: 1,
        analista: null,
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: 'green',
            tx_nombre: 'ABIERTO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    },
    {
        id: 10,
        fh_creacion: '13/03/2023',
        fh_asignacion: '13/03/2023',
        fh_atencion: '13/03/2023',
        fh_cierre: '13/03/2023',
        tx_observacion: null,
        enviadoA: ['davalillojp@pdvsa.com', 'jovana.davalillo@gmail.com'],
        n_ticket: '20230313#001',
        analistaId: 1,
        analista: {
            tx_nombre: 'Guillermo',
            tx_apellido: 'Morillo'
        },
        solicitanteId: 1,
        solicitante: {
            tx_nombre: 'Jovana',
            tx_apellido: 'Davalillo'
        },
        estadoId: 1,
        estado: {
            tx_color: 'grey',
            tx_nombre: 'CERRADO'
        },
        uaId: 1,
        ua: {
            tx_nombre: 'Unidad de Prueba'
        },
        tipos: [
            {
                categorium: {
                    tx_nombre: 'CAIT'
                }
            }
        ]
    }
]

const DashboardSolicitudes = () => {
    // const [ pagina, setPagina ] = useState( 1 )
    // const [ itemsPorPagina, setItemsPorPagina ] = useState( 3 )
    // const [ filas, setFilas ] = useState( datos )
    // const totalPaginas = Math.ceil( filas.length / itemsPorPagina )
    // const navigate = useNavigate()
    // const location = useLocation()
    // useEffect( () => {
    //     getSolicitudes().then(
    //         ( filas ) => { setFilas( filas ) },
    //         ( error ) => {
    //             console.log( "estoy en el useEffect de dashboard solicitudes: ", error )
    //             if ( error.status === 403 ) { // se venció su token
    //                 navigate( '/iniciar-sesion', { state: { from: location } }, replace = true )
    //             }
    //         } )
    // }, [] )
    const data = useMemo(() => datos, [datos])

    const columns = useMemo(() => {
        return [
            {
            Header: '# Solicitud',
            accessor: 'n_ticket'
            },
            {
            Header: 'Fecha de Creación',
            accessor: 'fh_creacion'
            },
            {
            id: 'solicitante',
            Header: 'Solicitante',
            accessor: row => `${row.solicitante.tx_nombre} ${row.solicitante.tx_apellido}`
            },
            {
            id: 'tipos',
            Header: 'Categoría',
            accessor: row => row.tipos[ 0 ].categorium.tx_nombre
            },
            {
            id:'fh_atencion',
            Header: 'Fecha de Atención',
            accessor: row => `${row.fh_atencion || '--'}`
            },
            {
            id: 'analista',
            Header: 'Analista Asignado',
            accessor: row => row.analista ? `${row.analista.tx_nombre} ${row.analista.tx_apellido}` : 'Sin asignar'
            },
            {
            Header: 'Unidad de Atención',
            accessor: 'ua.tx_nombre'
            },
            {
            Header: 'Estado de la Solicitud',
            accessor: 'estado.tx_nombre', // es un objeto, falta el color de la celda
            },
            {
            id:'fh_cierre',
            Header: 'Fecha de Cierre',
            accessor: row => `${row.fh_cierre || '--'}`
            }
            // {
            // Header: 'Opciones',
            // accessor: 'fh_cierre'
            // }
        ]
    },[])
    return (
        <section className={styles.contenedor}>
            <div className={styles.wrapperOpciones}>
                {/* <Filtros filas={filas} setFilas={setFilas} /> */}
                <Link to='/crear-solicitud' className='btn btn-secondary-fit'>Nueva Solicitud</Link>
            </div>
            {
                // filas.length &&
                <DataTable
                    // filas={ filas.slice( ( ( pagina - 1 ) * itemsPorPagina ), ( ( ( pagina - 1 ) * itemsPorPagina ) + itemsPorPagina ) ) }
                    // setItemsPorPagina={ setItemsPorPagina }
                    // pagina={ pagina } setPagina={ setPagina } totalPaginas={ totalPaginas }
                    data={data}
                    columns={columns}
                />
            }
        </section>
    )
}

//modificado por leonardo fleire 09/12/2025
//export default DashboardSolicitudes
// construime en react componentes que me sirvan para generar una tabla con filtros por columna. Las columnas son de tipo texto, fecha y numéricos. Luego, a este mismo componente, agregale paginación y la posibilidad de cambiar el número de filas mostradas por página