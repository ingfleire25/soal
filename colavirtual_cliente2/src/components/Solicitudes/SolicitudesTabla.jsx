// import React, { useState, useEffect, useMemo } from "react";
// import DataTable from 'react-data-table-component';
// import moment from 'moment';
// import styles from './SolicitudesTabla.module.css';
// import useAuth from '../../hooks/useAuth';
// import api from '../../services/api';
// import FormSelect from '../FormComponents/FormSelect';

// function SolicitudesTabla() {
//   const { auth } = useAuth();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterText, setFilterText] = useState('');

//   // Función para obtener datos de la API
//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Cambio: Eliminé la instancia duplicada de API y simplifiqué la llamada
//       const response = await api.get('/solicitudes/');
      
//       console.log("Respuesta completa de la API:", response);
      
//       // Cambio: Mejoré la verificación de la respuesta
//       if (response.data?.result && Array.isArray(response.data.result)) {
//         setData(response.data.result);
//         console.log("Datos recibidos:", response.data.result);
//       } else {
//         throw new Error("Formato de respuesta inesperado");
//       }
//     } catch (error) {
//       console.error('Error al obtener datos:', error);
//       // Cambio: Mensaje de error más descriptivo
//       setError(error.response?.data?.message || error.message || "Error al cargar las solicitudes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = ({ name, value }) => {
      
//         if (!isNaN(value)) {
//           setInput({
//             ...input,
//             cedula: value,
//           });
       
//       } else {
//         setInput({
//           ...input,
//           [name]: value,
//         });
//       }
//       setError(validarFormato({ ...input, [name]: value }));
//     };

//   // Efecto para cargar datos al montar el componente o cambiar el token
//   useEffect(() => {
//     console.log('Iniciando carga de datos...');
//     fetchData();
//   }, [auth.tokenAcceso]); // Cambio: Añadí dependencia para recargar cuando cambie el token

//   // Función para filtrar datos
//   const customFilter = (filterText, row) => {
//     const lowerCaseFilter = filterText.toLowerCase();
//     const fieldsToSearch = ['fh_apertura', 'fh_atencion', 'fh_cierre'];

//     // Búsqueda por fechas
//     for (const field of fieldsToSearch) {
//       if (row[field]) {
//         const momentDate = moment(row[field]);
//         if (momentDate.isValid()) {
//           const formattedDate = momentDate.format('DD/MM/YYYY');
//           if (formattedDate.toLowerCase().includes(lowerCaseFilter)) {
//             return true;
//           }
//         }
//       }
//     }

//     // Búsqueda general en todos los campos
//     return Object.values(row).some(value => {
//       if (value === null || value === undefined) return false;
      
//       // Búsqueda en strings y números
//       if (typeof value === 'string' || typeof value === 'number') {
//         return value.toString().toLowerCase().includes(lowerCaseFilter);
//       }
      
//       // Búsqueda en objetos anidados
//       if (typeof value === 'object') {
//         return Object.values(value).some(nestedValue => {
//           if (nestedValue === null || nestedValue === undefined) return false;
//           return nestedValue.toString().toLowerCase().includes(lowerCaseFilter);
//         });
//       }
      
//       return false;
//     });
//   };

//   // Datos filtrados usando useMemo para optimización
//   const filteredData = useMemo(() => {
//     if (!filterText) return data;
//     return data.filter(row => customFilter(filterText, row));
//   }, [data, filterText]);

//   // Configuración de columnas para la tabla
//   const columns = [
//     {
//       name: '#',
//       cell: (row, index) => index + 1,
//       width: '60px',
//     },
//     { 
//       name: '# Solicitud', 
//       selector: row => row.n_ticket, 
//       sortable: true,
//       // Cambio: Añadí omit para omitir la columna en pantallas pequeñas
//       omit: window.innerWidth < 768 
//     },
//     { 
//       name: 'Fecha Creación', 
//       selector: row => row.fh_apertura ? moment(row.fh_apertura).format('DD/MM/YYYY') : '',
//       // Cambio: Formateo de fecha más eficiente
//       format: row => moment(row.fh_apertura).format('DD/MM/YYYY')
//     },
//     { 
//       name: 'Solicitante', 
//       selector: row => `${row.solicitante?.tx_nombre || ''} ${row.solicitante?.tx_apellido || ''}`,
//       grow: 2 // Cambio: Permite que la columna crezca más que las demás
//     },
//     { 
//       name: 'Categoría', 
//       selector: row => row.tipos?.[0]?.categorium?.tx_nombre || '',
//       omit: window.innerWidth < 900 
//     },
//     { 
//       name: 'Fecha Atención', 
//       selector: row => row.fh_atencion ? moment(row.fh_atencion).format('DD/MM/YYYY') : '--',
//       sortable: true 
//     },
//     { 
//       name: 'Analista', 
//       selector: row => row.analista ? `${row.analista.tx_nombre} ${row.analista.tx_apellido}` : 'Sin asignar',
//       omit: window.innerWidth < 1024 
//     },
//     { 
//       name: 'UA', 
//       selector: row => row.uaId,
//       width: '80px' 
//     },
//     { 
//       name: 'Estado', 
//       selector: row => row.estado?.tx_nombre || '',
//       cell: row => (
//         // <span style={{ 
//         //   color: row.estado?.tx_nombre === 'Cerrado' ? 'green' : 'inherit',
//         //   fontWeight: 'bold'
//         // }}>
//         //   {row.estado?.tx_nombre || ''}
//         // </span>
//         <FormSelect
//               label={'Zona:'}
//               attributes={{
//                 name: 'zona',
//                 id: 'zona',
//                 value: input.zona,
//               }}
//               url={'/api/zonas?activo=true'}
//               errorMsg={error.zona}
//               onChange={(e) => handleChange(e.target)}
//             />
//       )
//     },
//     { 
//       name: 'Fecha Cierre', 
//       selector: row => row.fh_cierre ? moment(row.fh_cierre).format('DD/MM/YYYY') : '--',
//       omit: window.innerWidth < 1200 
//     }
//   ];

//   // Estilos personalizados para la tabla
//   const customStyles = {
//     headCells: {
//       style: {
//         backgroundColor: '#f8f9fa',
//         fontWeight: 'bold',
//         fontSize: '0.9rem',
//       },
//     },
//     cells: {
//       style: {
//         fontSize: '0.875rem',
//         padding: '12px 8px',
//       },
//     },
//     pagination: {
//       style: {
//         borderTop: 'none',
//       },
//     },
//   };

//   // Renderizado condicional
//   if (loading && !data.length) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.spinner}></div>
//         <p>Cargando solicitudes...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <h3>Error al cargar los datos</h3>
//         <p>{error}</p>
//         <button 
//           onClick={fetchData}
//           className={styles.retryButton}
//         >
//           Reintentar
//         </button>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className={styles.emptyState}>
//         <h3>No hay solicitudes para mostrar</h3>
//         <p>Actualmente no existen solicitudes registradas</p>
//         <button 
//           onClick={fetchData}
//           className={styles.refreshButton}
//         >
//           Actualizar
//         </button>
//       </div>
//     );
//   }

//   return (
//     <section className={styles.container}>
//       <div className={styles.tableHeader}>
//         <h2 className={styles.title}>Listado de Solicitudes</h2>
        
//         <div className={styles.controls}>
//           <input
//             type="text"
//             placeholder="Buscar en todas las columnas..."
//             value={filterText}
//             onChange={(e) => setFilterText(e.target.value)}
//             className={styles.searchInput}
//             disabled={loading}
//           />
          
//           <button
//             onClick={fetchData}
//             className={styles.refreshButton}
//             disabled={loading}
//             aria-label="Actualizar datos"
//           >
//             {loading ? (
//               <span className={styles.refreshLoader}></span>
//             ) : (
//               'Actualizar'
//             )}
//           </button>
//         </div>
//       </div>

//       <div className={styles.tableWrapper}>
//         <DataTable
//           columns={columns}
//           data={filteredData}
//           customStyles={customStyles}
//           pagination
//           paginationPerPage={10}
//           paginationRowsPerPageOptions={[10, 25, 50]}
//           highlightOnHover
//           striped
//           responsive
//           noDataComponent={<div>No se encontraron resultados</div>}
//           progressPending={loading && data.length > 0}
//           progressComponent={
//             <div className={styles.tableLoading}>
//               <div className={styles.spinner}></div>
//               <p>Actualizando datos...</p>
//             </div>
//           }
//           // Cambio: Añadí persistTableHead para mejor UX
//           persistTableHead
//         />
//       </div>
//     </section>
//   );
// }

// export default SolicitudesTabla;

//LINEA 306 AL 609 FUNCIONA CON RUTAS PROTEGIDAS
// SE INTEGRARA BOTONES DINAMICOS EN LOS REGISTROS DE LA TABLA DE LA LINE 615 EN adelante.


// import React, { useState, useEffect, useMemo } from "react";
// import DataTable from 'react-data-table-component';
// import moment from 'moment';
// import styles from './SolicitudesTabla.module.css';
// import useAuth from '../../hooks/useAuth';
// import api from '../../services/api'; // Asegúrate de que esta instancia de 'api' esté configurada para tus endpoints
// import FormSelect from '../FormComponents/FormSelect';

// function SolicitudesTabla() {
//   const { auth } = useAuth();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filterText, setFilterText] = useState('');

//   // --- NUEVOS ESTADOS PARA LOS FILTROS DE ESTADO Y ANALISTA ---
//   const [filterState, setFilterState] = useState('0'); // '0' para "Seleccione una opción"
//   const [filterAnalyst, setFilterAnalyst] = useState('0'); // '0' para "Seleccione una opción"
//   const [availableUAs, setAvailableUAs] = useState([]); // Para almacenar las UAs disponibles para el filtro de analistas

//   // Función para obtener datos de la API
//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await api.get('/solicitudes/');
//       
//       console.log("Respuesta completa de la API:", response);
//       
//       if (response.data?.result && Array.isArray(response.data.result)) {
//         setData(response.data.result);
//         console.log("Datos recibidos:", response.data.result);

//         // Extraer UAs únicas para poblar el FormSelect de analistas
//         const uas = [...new Set(response.data.result.map(solicitud => solicitud.uaId))].filter(Boolean); // Filter(Boolean) para quitar nulls o undefineds
//         setAvailableUAs(uas);

//       } else {
//         throw new Error("Formato de respuesta inesperado");
//       }
//     } catch (error) {
//       console.error('Error al obtener datos:', error);
//       setError(error.response?.data?.message || error.message || "Error al cargar las solicitudes");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // --- CAMBIO EN handleChange para manejar los nuevos filtros ---
//   const handleChangeFilter = ({ name, value }) => {
//     if (name === 'filterState') {
//       setFilterState(value);
//     } else if (name === 'filterAnalyst') {
//       setFilterAnalyst(value);
//     }
//     // Nota: No hay validación de formato aquí, ya que los FormSelects deberían proveer valores válidos
//   };

//   // Efecto para cargar datos al montar el componente o cambiar el token
//   useEffect(() => {
//     console.log('Iniciando carga de datos...');
//     fetchData();
//   }, [auth.tokenAcceso]);

//   // Función para filtrar datos, ahora incluyendo los nuevos filtros
//   const customFilter = (filterText, row, filterState, filterAnalyst) => {
//     const lowerCaseFilter = filterText.toLowerCase();

//     // Filtrar por texto general
//     const matchesText = Object.values(row).some(value => {
//       if (value === null || value === undefined) return false;
//       
//       if (typeof value === 'string' || typeof value === 'number') {
//         return value.toString().toLowerCase().includes(lowerCaseFilter);
//       }
//       
//       if (typeof value === 'object') {
//         return Object.values(value).some(nestedValue => {
//           if (nestedValue === null || nestedValue === undefined) return false;
//           return nestedValue.toString().toLowerCase().includes(lowerCaseFilter);
//         });
//       }
//       return false;
//     });

//     // Filtrar por estado
//     const matchesState = filterState === '0' || (row.estado?.uuid === filterState);

//     // Filtrar por analista asignado a una UA específica
//     const matchesAnalyst = filterAnalyst === '0' || (row.uaId === filterAnalyst);

//     return matchesText && matchesState && matchesAnalyst;
//   };

//   // Datos filtrados usando useMemo para optimización
//   const filteredData = useMemo(() => {
//     return data.filter(row => customFilter(filterText, row, filterState, filterAnalyst));
//   }, [data, filterText, filterState, filterAnalyst]);

//   // Configuración de columnas para la tabla
//   const columns = [
//     {
//       name: '#',
//       cell: (row, index) => index + 1,
//       width: '60px',
//     },
//     { 
//       name: '# Solicitud', 
//       selector: row => row.n_ticket, 
//       sortable: true,
//       omit: window.innerWidth < 768 
//     },
//     { 
//       name: 'Fecha Creación', 
//       selector: row => row.fh_apertura ? moment(row.fh_apertura).format('DD/MM/YYYY') : '',
//       format: row => moment(row.fh_apertura).format('DD/MM/YYYY')
//     },
//     { 
//       name: 'Solicitante', 
//       selector: row => `${row.solicitante?.tx_nombre || ''} ${row.solicitante?.tx_apellido || ''}`,
//       grow: 2 
//     },
//     { 
//       name: 'Categoría', 
//       selector: row => row.tipos?.[0]?.categorium?.tx_nombre || '',
//       omit: window.innerWidth < 900 
//     },
//     { 
//       name: 'Fecha Atención', 
//       selector: row => row.fh_atencion ? moment(row.fh_atencion).format('DD/MM/YYYY') : '--',
//       sortable: true 
//     },
//     { 
//       name: 'Analista', 
//       selector: row => row.analista ? `${row.analista.tx_nombre} ${row.analista.tx_apellido}` : 'Sin asignar',
//       omit: window.innerWidth < 1024 
//     },
//     { 
//       name: 'UA', 
//       selector: row => row.uaId,
//       width: '80px' 
//     },
//     { 
//       name: 'Estado', 
//       selector: row => row.estado?.tx_nombre || '',
//       // Aquí el FormSelect ya no es parte de la celda de la tabla.
//       // Se moverá al área de filtros.
//     },
//     { 
//       name: 'Fecha Cierre', 
//       selector: row => row.fh_cierre ? moment(row.fh_cierre).format('DD/MM/YYYY') : '--',
//       omit: window.innerWidth < 1200 
//     }
//   ];

//   // Estilos personalizados para la tabla
//   const customStyles = {
//     headCells: {
//       style: {
//         backgroundColor: '#f8f9fa',
//         fontWeight: 'bold',
//         fontSize: '0.9rem',
//       },
//     },
//     cells: {
//       style: {
//         fontSize: '0.875rem',
//         padding: '12px 8px',
//       },
//     },
//     pagination: {
//       style: {
//         borderTop: 'none',
//       },
//     },
//   };

//   // Renderizado condicional
//   if (loading && !data.length) {
//     return (
//       <div className={styles.loadingContainer}>
//         <div className={styles.spinner}></div>
//         <p>Cargando solicitudes...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={styles.errorContainer}>
//         <h3>Error al cargar los datos</h3>
//         <p>{error}</p>
//         <button 
//           onClick={fetchData}
//           className={styles.retryButton}
//         >
//           Reintentar
//         </button>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className={styles.emptyState}>
//         <h3>No hay solicitudes para mostrar</h3>
//         <p>Actualmente no existen solicitudes registradas</p>
//         <button 
//           onClick={fetchData}
//           className={styles.refreshButton}
//         >
//           Actualizar
//         </button>
//       </div>
//     );
//   }

//   return (
//     <section className={styles.container}>
//       <div className={styles.tableHeader}>
//         <h2 className={styles.title}>Listado de Solicitudes</h2>
//         
//         <div className={styles.controls}>
//           <input
//             type="text"
//             placeholder="Buscar en todas las columnas..."
//             value={filterText}
//             onChange={(e) => setFilterText(e.target.value)}
//             className={styles.searchInput}
//             disabled={loading}
//           />
//           
//           {/* --- NUEVO FormSelect para filtrar por Estado --- */}
//           <FormSelect
//             label={'Filtrar por Estado:'}
//             attributes={{
//               name: 'filterState',
//               id: 'filterState',
//               value: filterState,
//             }}
//             url={'/api/estado?activo=true'} 
//             onChange={(e) => handleChangeFilter(e.target)}
//           />

//           {/* --- NUEVO FormSelect para filtrar por Analista (asociado a UA) --- */}
//           <FormSelect
//             label={'Filtrar por UA (Analista):'}
//             attributes={{
//               name: 'filterAnalyst',
//               id: 'filterAnalyst',
//               value: filterAnalyst,
//             }}
//             // Generamos las opciones directamente desde las UAs encontradas en los datos de solicitudes
//             // o podrías tener un endpoint '/api/unidades-atencion?activo=true' si necesitas todas las UAs
//             options={
//               availableUAs.map(ua => ({ value: ua, label: ua }))
//             }
//             onChange={(e) => handleChangeFilter(e.target)}
//           />
//           
//           <button
//             onClick={fetchData}
//             className={styles.refreshButton}
//             disabled={loading}
//             aria-label="Actualizar datos"
//           >
//             {loading ? (
//               <span className={styles.refreshLoader}></span>
//             ) : (
//               'Actualizar'
//             )}
//           </button>
//         </div>
//       </div>

//       <div className={styles.tableWrapper}>
//         <DataTable
//           columns={columns}
//           data={filteredData}
//           customStyles={customStyles}
//           pagination
//           paginationPerPage={10}
//           paginationRowsPerPageOptions={[10, 25, 50]}
//           highlightOnHover
//           striped
//           responsive
//           noDataComponent={<div>No se encontraron resultados</div>}
//           progressPending={loading && data.length > 0}
//           progressComponent={
//             <div className={styles.tableLoading}>
//               <div className={styles.spinner}></div>
//               <p>Actualizando datos...</p>
//             </div>
//           }
//           persistTableHead
//         />
//       </div>
//     </section>
//   );
// }

// export default SolicitudesTabla;



import React, { useState, useEffect, useMemo, useCallback } from "react";
import DataTable from 'react-data-table-component';
import moment from 'moment';
import styles from './SolicitudesTabla.module.css';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api'; // Asegúrate de que tu instancia de 'api' esté configurada para tus endpoints
import FormSelect from '../FormComponents/FormSelect'; // Asumo que FormSelect puede recibir un prop 'options' además de 'url'
import Swal from 'sweetalert2'; // Para mensajes de confirmación

function SolicitudesTabla() {
  const { auth } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');

  // --- NUEVOS ESTADOS PARA MANEJAR LOS CAMBIOS PENDIENTES ---
  const [changes, setChanges] = useState({}); // { solicitudId: { estadoId: 'nuevoId', analistaId: 'nuevoId' }, ... }
  const [allStates, setAllStates] = useState([]); // Almacena todos los estados disponibles para el FormSelect

  // Función para obtener datos de la API (solicitudes, estados)
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Obtener solicitudes
      const solicitudesResponse = await api.get('/solicitudes/');
      if (solicitudesResponse.data?.result && Array.isArray(solicitudesResponse.data.result)) {
        setData(solicitudesResponse.data.result);
      } else {
        throw new Error("Formato de respuesta de solicitudes inesperado");
      }

      // Obtener todos los estados disponibles para los selectores
      const statesResponse = await api.get('/estado?activo=true');
      if (statesResponse.data?.result && Array.isArray(statesResponse.data.result)) {
        setAllStates(statesResponse.data.result.map(s => ({ value: s.uuid, label: s.tx_nombre })));
        
      } else {
        throw new Error("Formato de respuesta de estados inesperado");
      }

      setChanges({}); // Limpiar cambios pendientes al recargar
    } catch (error) {
      console.error('Error al obtener datos:', error);
      setError(error.response?.data?.message || error.message || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos al montar el componente o cambiar el token
  useEffect(() => {
    fetchData();
  }, [auth.tokenAcceso]);

  // Función para manejar el cambio de estado en un FormSelect de una fila
  const handleStateChange = useCallback((solicitudId, newEstadoId) => {
    setChanges(prevChanges => ({
      ...prevChanges,
      [solicitudId]: {
        ...(prevChanges[solicitudId] || {}),
        estadoId: newEstadoId
      }
    }));
  }, []);

  // Función para que el analista tome un caso
  const handleTakeCase = useCallback(async (solicitud) => {
    if (!auth.indicador) {
    console.log(auth)
      Swal.fire('Error', 'No se pudo identificar al analista logeado.', 'error');
      return;
    }

    // Confirmación antes de tomar el caso
    const result = await Swal.fire({
      title: `¿Desea tomar la solicitud ${solicitud.n_ticket}?`,
      text: "Esta acción asignará la solicitud a su nombre.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, tomar caso',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        // Llama a la API para asignar la solicitud al analista logeado
        const response = await api.put(`/solicitudes/${solicitud.uuid}/asignar`, {
          analistaId: auth.user.uuid // Asumiendo que el UUID del analista está en auth.user.uuid
        });

        if (response.status === 200) {
          Swal.fire('Asignado', `Solicitud ${solicitud.n_ticket} asignada a tu nombre.`, 'success');
          // Actualizar los datos localmente o refetch
          fetchData();
        } else {
          throw new Error(response.data?.message || 'Error al asignar el caso');
        }
      } catch (err) {
        console.error('Error al tomar caso:', err);
        Swal.fire('Error', err.message || 'No se pudo asignar el caso.', 'error');
      } finally {
        setLoading(false);
      }
    }
  }, [auth.user, fetchData]);

  // Función para guardar todos los cambios pendientes
  const handleSaveChanges = async () => {
    if (Object.keys(changes).length === 0) {
      Swal.fire('Atención', 'No hay cambios pendientes para guardar.', 'info');
      return;
    }

    const result = await Swal.fire({
      title: '¿Desea guardar los cambios realizados?',
      text: "Se actualizarán los estados de las solicitudes modificadas.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const updatePromises = Object.entries(changes).map(([solicitudId, changedFields]) => {
          // Puedes enviar los campos individualmente o consolidar en un solo endpoint
          // Aquí envío solo el estado, ya que la asignación es un botón separado.
          if (changedFields.estadoId) {
            return api.put(`/solicitudes/${solicitudId}/estado`, { estadoId: changedFields.estadoId });
          }
          return Promise.resolve(); // Si no hay estadoId para cambiar en esa solicitud
        });

        await Promise.all(updatePromises);
        Swal.fire('Guardado', 'Los cambios se han guardado exitosamente.', 'success');
        setChanges({}); // Limpiar cambios pendientes
        fetchData(); // Refrescar la tabla para mostrar los cambios
      } catch (err) {
        console.error('Error al guardar cambios:', err);
        Swal.fire('Error', err.response?.data?.message || 'No se pudieron guardar los cambios.', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para filtrar datos
  const customFilter = useCallback((filterText, row) => {
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
        }
      }
    }

    return Object.values(row).some(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString().toLowerCase().includes(lowerCaseFilter);
      }
      if (typeof value === 'object') {
        return Object.values(value).some(nestedValue => {
          if (nestedValue === null || nestedValue === undefined) return false;
          return nestedValue.toString().toLowerCase().includes(lowerCaseFilter);
        });
      }
      return false;
    });
  }, []);


  // Datos filtrados usando useMemo para optimización
  const filteredData = useMemo(() => {
    if (!filterText) return data;
    return data.filter(row => customFilter(filterText, row));
  }, [data, filterText, customFilter]);

  // Configuración de columnas para la tabla
  const columns = useMemo(() => [
    {
      name: '#',
      cell: (row, index) => index + 1,
      width: '60px',
    },
    {
      name: '# Solicitud',
      selector: row => row.n_ticket,
      sortable: true,
      omit: window.innerWidth < 768
    },
    {
      name: 'Fecha Creación',
      selector: row => row.fh_apertura ? moment(row.fh_apertura).format('DD/MM/YYYY') : '',
      format: row => moment(row.fh_apertura).format('DD/MM/YYYY')
    },
    {
      name: 'Solicitante',
      selector: row => `${row.solicitante?.tx_nombre || ''} ${row.solicitante?.tx_apellido || ''}`,
      grow: 2
    },
    {
      name: 'Categoría',
      selector: row => row.tipos?.[0]?.categorium?.tx_nombre || '',
      omit: window.innerWidth < 900
    },
    {
      name: 'Fecha Atención',
      selector: row => row.fh_atencion ? moment(row.fh_atencion).format('DD/MM/YYYY') : '--',
      sortable: true
    },
    {
      name: 'Analista',
      cell: row => (
        <div className={styles.analistaCell}>
          {row.analista ?
            `${row.analista.tx_nombre} ${row.analista.tx_apellido}` :
            <button
              className={styles.takeCaseButton}
              onClick={() => handleTakeCase(row)}
              disabled={loading || !!row.analista} // Deshabilitar si ya tiene analista o está cargando
            >
              Tomar Caso
            </button>
          }
        </div>
      ),
      omit: window.innerWidth < 1024
    },
    {
      name: 'UA',
      selector: row => row.uaId,
      width: '80px'
    },
    {
      name: 'Estado',
      cell: row => (
        <FormSelect
          attributes={{
            name: `estado-${row.uuid}`, // Nombre único para cada selector
            id: `estado-${row.uuid}`,
            // Usa el estado actual si hay un cambio pendiente, de lo contrario, el de la fila
            value: changes[row.uuid]?.estadoId || row.estado?.uuid || '0',
            disabled: loading // Deshabilita los selectores mientras se carga
          }}
          options={allStates} // Pasa los estados cargados de la API
          onChange={(e) => handleStateChange(row.uuid, e.target.value)}
        />
      ),
      // Asegúrate de que esta columna tenga suficiente espacio
      width: '150px'
    },
    {
      name: 'Fecha Cierre',
      selector: row => row.fh_cierre ? moment(row.fh_cierre).format('DD/MM/YYYY') : '--',
      omit: window.innerWidth < 1200
    }
  ], [changes, loading, allStates, handleStateChange, handleTakeCase]); // Dependencias para useMemo

  // Estilos personalizados para la tabla (sin cambios significativos aquí)
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold',
        fontSize: '0.9rem',
      },
    },
    cells: {
      style: {
        fontSize: '0.875rem',
        padding: '12px 8px',
      },
    },
    pagination: {
      style: {
        borderTop: 'none',
      },
    },
  };

  // Renderizado condicional
  if (loading && !data.length && Object.keys(changes).length === 0) { // Mostrar loader si no hay datos iniciales
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h3>Error al cargar los datos</h3>
        <p>{error}</p>
        <button
          onClick={fetchData}
          className={styles.retryButton}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h3>No hay solicitudes para mostrar</h3>
        <p>Actualmente no existen solicitudes registradas</p>
        <button
          onClick={fetchData}
          className={styles.refreshButton}
        >
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.tableHeader}>
        <h2 className={styles.title}>Listado de Solicitudes</h2>
        
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Buscar en todas las columnas..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className={styles.searchInput}
            disabled={loading}
          />
          
          {/* Botón para guardar todos los cambios pendientes */}
          <button
            onClick={handleSaveChanges}
            className={styles.saveChangesButton}
            disabled={loading || Object.keys(changes).length === 0} // Deshabilitar si no hay cambios o está cargando
          >
            Guardar Cambios ({Object.keys(changes).length})
          </button>

          <button
            onClick={fetchData}
            className={styles.refreshButton}
            disabled={loading}
            aria-label="Actualizar datos"
          >
            {loading && Object.keys(changes).length === 0 ? (
              <span className={styles.refreshLoader}></span>
            ) : (
              'Actualizar'
            )}
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <DataTable
          columns={columns}
          data={filteredData}
          customStyles={customStyles}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 25, 50]}
          highlightOnHover
          striped
          responsive
          noDataComponent={<div>No se encontraron resultados</div>}
          progressPending={loading && data.length > 0}
          progressComponent={
            <div className={styles.tableLoading}>
              <div className={styles.spinner}></div>
              <p>Actualizando datos...</p>
            </div>
          }
          persistTableHead
        />
      </div>
    </section>
  );
}

export default SolicitudesTabla;