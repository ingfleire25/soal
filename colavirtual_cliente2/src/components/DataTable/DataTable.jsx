import React from 'react'
// import { useMemo } from 'react'
import { useTable } from 'react-table'
import styles from './DataTable.module.css'
// import Paginacion from '../Paginacion/Paginacion'


const DataTable = ({columns, data}) => {
    const instanciaDeTabla = useTable({columns, data})
    const { 
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = instanciaDeTabla

    return (
        <section className='section'>

            <table {...getTableProps()}>
                <thead>
                    {
                        headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {
                                    headerGroup.headers.map(col => (
                                        <th {...col.getHeaderProps()}>
                                            {col.render("Header")}
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map(row => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {
                                        row.cells.map((cell) => {
                                            return (
                                            <td {...cell.getCellProps()}>
                                                {cell.render("Cell")}
                                            </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </section>
    )
}

// const DataTable = ( { filas, setItemsPorPagina, pagina, setPagina, totalPaginas } ) => {
//     // console.log(filas)
//     return (
//         <section className='section'>
//             <table>
//                 <thead>
//                     <tr>
//                         <th># Solicitud</th>
//                         <th>Fecha de Creación</th>
//                         <th>Solicitante</th>
//                         <th>Categoría</th>
//                         <th>Fecha de Atención</th>
//                         <th>Analista Asignado</th>
//                         <th>Unidad de Atención</th>
//                         <th>Estado de la Solicitud</th>
//                         <th>Fecha de Cierre</th>
//                         <th>Opciones</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {
//                         filas.map( fil => {
//                             return <tr key={ Math.random() }>
//                                 <td>{ fil.n_ticket }</td>
//                                 <td>{ fil.fh_creacion }</td>
//                                 <td>{ fil.solicitante.tx_nombre } { fil.solicitante.tx_apellido }</td>
//                                 <td>{ fil.tipos[ 0 ].categorium.tx_nombre }</td>
//                                 <td>{ fil.fh_atencion ? fil.fh_atencion : 'Sin asignar' }</td>
//                                 <td>{ fil.analista ? `${fil.analista.tx_nombre} ${fil.analista.tx_apellido}` : 'Sin asignar' }</td>
//                                 <td>{ fil.ua.tx_nombre }</td>
//                                 <td style={ { backgroundColor: fil.estado.tx_color } } align='center'>{ fil.estado.tx_nombre }</td>
//                                 <td>{ fil.fh_cierre ? fil.fh_cierre : 'Sin Asignar' }</td>
//                                 <td align='center'><button>Detalle</button></td>
//                             </tr>
//                         } )
//                     }
//                 </tbody>
//             </table>
//             <div className={styles.wrapperOpciones}>
//                 <Paginacion pagina={ pagina } setPagina={ setPagina } totalPaginas={ totalPaginas } />
//                 <label htmlFor='cantFilas'> Mostrar: &nbsp;
//                     <select id='cantFilas' onChange={ e => setItemsPorPagina( parseInt( e.target.value ) ) }>
//                         <option value='3'>3 filas</option>
//                         <option value='5'>5 filas</option>
//                         <option value='10'>10 filas</option>
//                         {/* <option value='20'>20</option>
//                         <option value='50'>50</option>
//                         <option value='100'>100</option> */}
//                     </select>
//                 </label>
//             </div>
//         </section>
//     )
// }

//modificado por leonardo fleire 09/12/2025
//export default DataTable