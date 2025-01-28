// import React, {useState, useEffect} from "react";
// import axios from "axios";
// import DataTable from 'react-data-table-component'
// import styles from './SolicitudesTabla.module.css'

// function DataTables() {
//     //const [value, setValue] = useState('')
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [records, setRecords ] = useState(data[0])
//     const data2 = []

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get('http://localhost:3001/api/solicitudes/');
//         if (response) { // Verifica si result es un array
//           setData([response.data.result]);
//         } else {
//           setError("Respuesta de la API con formato incorrecto. Se esperaba un array en 'result'.");
//         }
//       } catch (error) {
//         console.log('Error fetching data:', error);
//         setError("Error al obtener los datos de la API.");
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     useEffect(() => {
//       fetchData();
//     }, []);
    
//     data2.push(data[0])

//     if (loading) {
//       return <div>Cargando datos...</div>;
//     }
//       if (error) {
//       return <div>Error: {error}</div>;
//     }
//       if (!data || data.length === 0) {
//       return <div>No hay datos para mostrar</div>;
//     }
//     //console.log(data[0])

//         const columns = [
//         { name: '# Solicitud', selector:  row => row.n_ticket},
//         { name: 'Fecha de Creación', selector: row => row.fh_apertura},
//         {id: 'solicitante',
//         name: 'Solicitante', selector: row => `${row.solicitante.tx_nombre} ${row.solicitante.tx_apellido}` },
//         { id: 'tipos',
//         name: 'Categoría',
//         selector: row => row.tipos[ 0 ].categorium.tx_nombre },
//         {
//         id:'fh_atencion',
//         name: 'Fecha de Atención',
//         selector: row => `${row.fh_atencion || '--'}`,
//         sortable: true
//         },
//         {
//         id: 'analista',
//         name: 'Analista Asignado',
//         selector: row => row.analista ? `${row.analista.tx_nombre} ${row.analista.tx_apellido}` : 'Sin asignar'
//         },
//         {
//         name: 'Unidad de Atención',
//         selector: row => row.uaId
//         },
//         {
//         name: 'Estado de la Solicitud',
//         selector: row => row.estado.tx_nombre, // es un objeto, falta el color de la celda
//         },
//         {
//         id:'fh_cierre',
//         name: 'Fecha de Cierre',
//         selector: row => `${row.fh_cierre || 'No asignada'}`
//         }
//         ]
//         const customStyles = {
//             header: {
//                 style:{
//                     fontSize: "2rem",
//                     color: "red",
//                 }
//             },
//             headCells: {
//                 style:{
//                     fontSize: "0.8rem",
//                     backgroundColor: "#e0e0e0"
//                 }
//             },
//             cells: {
//                 style:{
//                     //fontSize: "1rem",
//                 }
//             },
//         }
        

//         const  handleFilter = (e) => {
//           let query = e.target.value
//           const newrecords = data2.filter(row => {row.tx_apellido.toLowerCase().includes(query.toLowerCase())})
//           setRecords(newrecords)
          
//         }
//         console.log(data2)
//     return (
//         <section className={styles.contenedor}>
//         <div>
//             <div className="search"><input type="text"  onChange={handleFilter}/></div>
           
//             <DataTable
//                 title='Solicitudes'
//                 columns={columns}
//                  //data={data[0]}
//                data={records}
//                 customStyles={customStyles}
//                 pagination
//             />
//         </div>
//         </section>
//     )
// }
// export default DataTables;