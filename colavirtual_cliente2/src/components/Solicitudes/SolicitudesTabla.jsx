// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
// import DataTable from 'react-data-table-component';
// import moment from 'moment';
// import styles from './SolicitudesTabla.module.css';

// function DataTables() {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filterText, setFilterText] = useState('');

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get('http://localhost:3001/api/solicitudes/');
//             if (response && Array.isArray(response.data.result)) {
//                 setData(response.data.result);
//             } else {
//                 setError("Respuesta de la API con formato incorrecto. Se esperaba un array en 'result'.");
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setError("Error al obtener los datos de la API.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const customFilter = (filterText, row) => {
//         const lowerCaseFilter = filterText.toLowerCase();
//         const fieldsToSearch = ['fh_apertura', 'fh_atencion', 'fh_cierre'];

//         for (const field of fieldsToSearch) {
//             if (row[field]) {
//                 const momentDate = moment(row[field]);
//                 if (momentDate.isValid()) {
//                     const formattedDate = momentDate.format('DD/MM/YYYY');
//                     if (formattedDate.toLowerCase().includes(lowerCaseFilter)) {
//                         return true;
//                     }
//                 } else {
//                     console.warn(`Fecha inválida encontrada en el campo ${field}:`, row[field]);
//                 }
//             }
//         }

//         return Object.values(row).some(value => {
//             if (typeof value === 'string' || typeof value === 'number') { // Incluir números en la búsqueda general
//                 return value.toString().toLowerCase().includes(lowerCaseFilter);
//             }
//             if (typeof value === 'object' && value !== null) {
//                 return Object.values(value).some(nestedValue => {
//                     if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
//                         return nestedValue.toString().toLowerCase().includes(lowerCaseFilter);
//                     }
//                     return false;
//                 })
//             }
//             return false;
//         });
//     };

//     const filteredData = useMemo(() => {
//         if (!filterText) {
//             return data;
//         }

//         return data.filter(row => customFilter(filterText, row));
//     }, [data, filterText]);

//     const columns = [
//         {
//             name: '#',
//             cell: (row, index) => index + 1,
//             width: '60px',
//         },
//         { name: '# Solicitud', selector: row => row.n_ticket, sortable: true },
//         { name: 'Fecha de Creación', selector: row => row.fh_apertura ? moment(row.fh_apertura).format('DD/MM/YYYY HH:mm') : '', sortable: false },
//         { name: 'Solicitante', selector: row => `${row.solicitante?.tx_nombre || ''} ${row.solicitante?.tx_apellido || ''}` },
//         { name: 'Categoría', selector: row => row.tipos?.[0]?.categorium?.tx_nombre || '' },
//         { name: 'Fecha de Atención', selector: row => row.fh_atencion ? moment(row.fh_atencion).format('DD/MM/YYYY HH:mm') : '--', sortable: true },
//         { name: 'Analista Asignado', selector: row => row.analista ? `${row.analista.tx_nombre} ${row.analista.tx_apellido}` : 'Sin asignar' },
//         { name: 'Unidad de Atención', selector: row => row.uaId },
//         { name: 'Estado de la Solicitud', selector: row => row.estado?.tx_nombre || '' },
//         { name: 'Fecha de Cierre', selector: row => row.fh_cierre ? moment(row.fh_cierre).format('DD/MM/YYYY HH:mm') : 'No asignada', }
//     ];

//     const customStyles = {
//         header: {
//             style: {
//                 fontSize: "2rem",
//                 color: "red",
//             }
//         },
//         headCells: {
//             style: {
//                 fontSize: "0.8rem",
//                 backgroundColor: "#e0e0e0"
//             }
//         },
//         cells: {
//             style: {
//                 //fontSize: "1rem",
//             }
//         },
//     };

//     if (loading) {
//         return <div>Cargando datos...</div>;
//     }

//     if (error) {
//         return <div>Error: {error}</div>;
//     }

//     if (!data || data.length === 0) {
//         return <div>No hay datos para mostrar</div>;
//     }

//     return (
//         <section className={styles.contenedor}>
//             <div>
//                 <input
//                     type="text"
//                     placeholder="Buscar..."
//                     value={filterText}
//                     onChange={e => setFilterText(e.target.value)}
//                     className={styles.searchInput}
//                 />
//                 <DataTable
//                     title='Solicitudes'
//                     columns={columns}
//                     data={filteredData}
//                     customStyles={customStyles}
//                     pagination
//                     highlightOnHover
//                     dense
//                     striped
//                 />
//             </div>
//         </section>
//     );
// }

// export default DataTables;

import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import styles from './SolicitudesTabla.module.css';
import  useAuth  from '../../hooks/useAuth';
import api from '../../services/api';

function DataTables() {
    const { auth } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState('');

    const fetchData = async () => {
         setLoading(true);
        try {
            const response = await api.get('/solicitudes/', {
                headers: {
                    'Authorization': `Bearer ${auth.tokenAcceso}`
                }
            });
            
            if (response && Array.isArray(response.data.result)) {
                setData(response.data.result);
            } else {
                setError("Respuesta de la API con formato incorrecto");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError("Error al obtener los datos de la API.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const customFilter = (filterText, row) => {
        const lowerCaseFilter = filterText.toLowerCase();
        const fieldsToSearch = ['fh_apertura', 'fh_atencion', 'fh_cierre'];

        for (const field of fieldsToSearch) {
            if (row[field]) {
                const momentDate = moment(row[field]);
                if (momentDate.isValid()) {
                    const formattedDate = momentDate.format('DD/MM/YYYY');
                    if (formattedDate.toLowerCase().includes(lowerCaseFilter)) {
                        return true;
                    }
                } else {
                    console.warn(`Fecha inválida encontrada en el campo ${field}:`, row[field]);
                }
            }
        }

        return Object.values(row).some(value => {
            if (typeof value === 'string' || typeof value === 'number') { // Incluir números en la búsqueda general
                return value.toString().toLowerCase().includes(lowerCaseFilter);
            }
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(nestedValue => {
                    if (typeof nestedValue === 'string' || typeof nestedValue === 'number') {
                        return nestedValue.toString().toLowerCase().includes(lowerCaseFilter);
                    }
                    return false;
                })
            }
            return false;
        });
    };

    const filteredData = useMemo(() => {
        if (!filterText) {
            return data;
        }

        return data.filter(row => customFilter(filterText, row));
    }, [data, filterText]);

    const columns = [
        {
            name: '#',
            cell: (row, index) => index + 1,
            width: '60px',
        },
        { name: '# Solicitud', selector: row => row.n_ticket, sortable: true },
        { name: 'Fecha de Creación', selector: row => row.fh_apertura ? moment(row.fh_apertura).format('DD/MM/YYYY HH:mm') : '', sortable: false },
        { name: 'Solicitante', selector: row => `${row.solicitante?.tx_nombre || ''} ${row.solicitante?.tx_apellido || ''}` },
        { name: 'Categoría', selector: row => row.tipos?.[0]?.categorium?.tx_nombre || '' },
        { name: 'Fecha de Atención', selector: row => row.fh_atencion ? moment(row.fh_atencion).format('DD/MM/YYYY HH:mm') : '--', sortable: true },
        { name: 'Analista Asignado', selector: row => row.analista ? `${row.analista.tx_nombre} ${row.analista.tx_apellido}` : 'Sin asignar' },
        { name: 'Unidad de Atención', selector: row => row.uaId },
        { name: 'Estado de la Solicitud', selector: row => row.estado?.tx_nombre || '' },
        { name: 'Fecha de Cierre', selector: row => row.fh_cierre ? moment(row.fh_cierre).format('DD/MM/YYYY HH:mm') : 'No asignada', }
    ];

    const customStyles = {
        header: {
            style: {
                fontSize: "2rem",
                color: "red",
            }
        },
        headCells: {
            style: {
                fontSize: "0.8rem",
                backgroundColor: "#e0e0e0"
            }
        },
        cells: {
            style: {
                //fontSize: "1rem",
            }
        },
    };

    if (loading) {
        return <div>Cargando datos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data || data.length === 0) {
        return <div>No hay datos para mostrar</div>;
    }

    return (
        <section className={styles.contenedor}>
            <div>
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                    className={styles.searchInput}
                />
                <DataTable
                    title='Solicitudes'
                    columns={columns}
                    data={filteredData}
                    customStyles={customStyles}
                    pagination
                    highlightOnHover
                    dense
                    striped
                />
            </div>
        </section>
    );
}

export default DataTables;