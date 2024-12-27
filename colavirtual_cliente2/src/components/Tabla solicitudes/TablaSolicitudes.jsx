// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import FullScreenLoader from '../Loader/FullScreenLoader'
// import { useFetch } from '../../hooks/useFetch'



// function DataTable() {
//   const [data, setData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   let [filteredData, setFilteredData] = useState([]);
//   const [ loading, setLoading ] = useState( false )

//   const fetchData = async () => {
//     try {
//       //const { response, error, loading } = useFetch( `/solicitudes/2` )
//       //const { response, error, loading } = useFetch( `/http://localhost:3001/api/solicitudes/2` )
//      const response = await axios.get('http://localhost:3001/api/solicitudes/2'); // Reemplaza con tu endpoint


//      // Verifica si la respuesta tiene un arreglo
//      const responseData = Array.isArray(response.data)
//         ? response.data
//         : response.data.result || []; // Ajusta esto según tu estructura real
//       setData(responseData);
      
//       //setFilteredData(response.data);
    
//       // if ( loading ) return <FullScreenLoader />
//       // if ( !Object.keys( response.data.result ).length ) return null
//     } catch (error) {
//       console.log('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     console.log(typeof(data))
//     fetchData();
//   }, []);
//   // porque el valos no se esta pasando al estado en setData?
//   //console.log(data)
//   //console.log(filteredData.result)
  
  
//   //useEffect para filtrar los datos cuando cambien `data` o `searchQuery`
//   useEffect(() => {
//     if (Array.isArray(data)) {
//       const filtered = JSON.stringify(data).filter((result) =>
//         Object.values(result).some(
//           (value) =>
//             typeof value === "string" &&
//             value.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//       );
//       setFilteredData(filtered);
//     } else {
//       console.error("`data` no es un arreglo:", data);
//     }
//   }, [data, searchQuery]);
  
  
  

//   const handleSearch = (event) => {
//     setSearchQuery(event.target.value);
//   };

//   return (
// <div>
//   {/* Input para la búsqueda */}
//   <input
//     type="text"
//     value={searchQuery}
//     onChange={(e) => setSearchQuery(e.target.value)}
//     placeholder="Buscar..."
//     style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
//   />

//   {/* Tabla para mostrar los datos */}
//   <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
//     <thead>
//       <tr>
//         {/* Cambia estos encabezados según las propiedades de tus datos */}
//         <th>Codigo</th>
//             <th>Fecha de atencion</th>
//             <th>Numero de Ticket</th>
//             <th>unidad de atencion</th>
//             <th>Estado de solicitud</th>
//             <th>tipo de solicitud</th>
//             <th>Nombre del Solicitante</th>
//       </tr>
//     </thead>
//     <tbody>
//       {filteredData.map((data, index) => (
//         <tr key={data.id}>
//           {/* Ajusta estas celdas según las propiedades de tus datos */}
//           <td>{data.fh_atencion}</td>
//                 <td>{data.n_ticket}</td>
//                 <td>{data.ua.tx_nombre}</td>
//                 <td>{data.estado.tx_nombre}</td>
//                 <td>{data.tipos.tx_nombre}</td>
//                 <td>{data.solicitante.tx_nombre}</td>
//           <td>
//             {/* Botón de acción opcional */}
//             <button onClick={() => alert(`Acción sobre ${data.name}`)}>
//               Acción
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

//     /* <div className='table'>
//       <input type="text" placeholder="Buscar" value={searchQuery} onChange={handleSearch} />
//       <table>
//         <thead>
//           <tr>
//             {/* Aquí definirías los encabezados de la tabla según tu estructura de datos *
//             <th>Codigo</th>
//             <th>Fecha de atencion</th>
//             <th>Numero de Ticket</th>
//             <th>unidad de atencion</th>
//             <th>Estado de solicitud</th>
//             <th>tipo de solicitud</th>
//             <th>Nombre del Solicitante</th>

//             {/* ...otros encabezados *
//           </tr>
//         </thead>
//         <tbody>
//           {/* Verificamos si filteredData es un array y luego renderizamos *
//           {Array.isArray(filteredData) && filteredData.length > 0 ? (
//             filteredData.map(item => (
//               <tr key={item.id}>
//                 <td>{item.fh_atencion}</td>
//                 <td>{item.n_ticket}</td>
//                 <td>{item.ua.tx_nombre}</td>
//                 <td>{item.estado.tx_nombre}</td>
//                 <td>{item.tipos.tx_nombre}</td>
//                 <td>{item.solicitante.tx_nombre}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6">No hay datos disponibles</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div> */
//   );
// }

// export default DataTable;

// import React, { useState, useEffect } from 'react';

// function DynamicTable({ endpoint }) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(endpoint);
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const json = await response.json();
//         setData(json.result);
//       } catch (error) {
//         setError(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [endpoint]);

//   if (loading) {
//     return <div>Cargando...</div>;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   if (!data) {
//     return <div>No hay datos para mostrar.</div>;
//   }

//   const generateTable = (data) => {
//     const rows = [];

//     //Extrae los datos principales del objeto
//     const extractMainData = (obj) => {
//         const mainData = {}
//         for (const key in obj) {
//             if (obj.hasOwnProperty(key)) {
//                 if(typeof obj[key] !== 'object' || obj[key] === null){
//                     mainData[key] = obj[key]
//                 }else if(key === 'id'){
//                     mainData[key] = obj[key]
//                 }
//             }
//         }
//         return mainData
//     }

//     //Extrae los datos de los objetos anidados y los formatea como string
//     const extractNestedData = (obj) => {
//         const nestedData = {}
//         for (const key in obj) {
//             if (obj.hasOwnProperty(key)) {
//                 if(typeof obj[key] === 'object' && obj[key] !== null){
//                   if(Array.isArray(obj[key])){
//                     nestedData[key] = JSON.stringify(obj[key])
//                   }else{
//                     nestedData[key] = JSON.stringify(obj[key])
//                   }
//                 }
//             }
//         }
//         return nestedData
//     }

//     const mainData = extractMainData(data)
//     const nestedData = extractNestedData(data)
//     const headers = [...Object.keys(mainData), ...Object.keys(nestedData)]
//     rows.push({...mainData, ...nestedData})
//     console.log("mainData:" + mainData )
//     console.log("nestedData:" + headers )
//     console.log("headers:" + headers )
//     console.log("rows:" + rows )
    
//     return (
//       <table>
//         <thead>
//           <tr>
//             {headers.map((header, index) => (
//               <th key={index}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {headers.map((header, index) => (
//                 <td key={index}>{row[header] != null ? row[header].toString() : ''}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   };

//   return (
//     <div>
//       {generateTable(data)}
//     </div>
//   );
// }


// // Ejemplo de uso:
// function TablaSolicitudes() {
//     const endpoint = 'http://localhost:3001/api/solicitudes/';
//     return (
//         <div className="App">
//             <DynamicTable endpoint={endpoint}/>
//         </div>
//     )
// }

// export default TablaSolicitudes;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TablaSolicitudes.module.css'

function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/solicitudes/');
      if (response) { // Verifica si result es un array
        setData([response.data.result]);
      } else {
        setError("Respuesta de la API con formato incorrecto. Se esperaba un array en 'result'.");
      }
    } catch (error) {
      console.log('Error fetching data:', error);
      setError("Error al obtener los datos de la API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(data)
    fetchData();
  }, []);

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
    <div>
      {/* <table className={ `${table} section`}> */}
      <table>
        <thead>
          <tr>
            <th>Fecha de atencion</th>
            <th>Numero de Ticket</th>
            <th>Unidad de Atencion</th>
            <th>Estado de solicitud</th>
            <th>Tipo de solicitud</th>
            <th>Nombre del Solicitante</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => ( // Iteramos directamente sobre el array 'data'
            <tr key={item.id}> {/* Usamos item.id como key, ahora es un array con objetos con id */}
              <td>{item.fh_atencion}</td>
              <td>{item.n_ticket}</td>
              <td>{item.ua?.tx_nombre || 'N/A'}</td>
              <td>{item.estado?.tx_nombre || 'N/A'}</td>
              <td>{item.tipos?.[0]?.tx_nombre || 'N/A'}</td>
              <td>{item.solicitante?.tx_nombre || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

//crea un ejemplo de una hoja de estillo css para darle formato a esta tabla segun los archivos en esta aplicacion incluyendo la parde de bajar la tabla y centrar cada elemento dentro de la tabla asumiendo que la tabla tiene una clase llamada table?
