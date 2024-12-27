import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataTable() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
  
     const response = await axios.get('http://localhost:3001/api/solicitudes/2'); // Reemplaza con tu endpoint
      if(response){
        setData(response.data.result)
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log(data)
    fetchData();
  }, []);


  return (
<div>
   {/* Tabla para mostrar los datos */}
  <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr>
        {/* Cambia estos encabezados según las propiedades de tus datos */}
        <th>Codigo</th>
            <th>Fecha de atencion</th>
            <th>Numero de Ticket</th>
            <th>unidad de atencion</th>
            <th>Estado de solicitud</th>
            <th>tipo de solicitud</th>
            <th>Nombre del Solicitante</th>
      </tr>
    </thead>
    <tbody>
      {filteredData.map((data, index) => (
        <tr key={data.id}>
          {/* Ajusta estas celdas según las propiedades de tus datos */}
          <td>{data.fh_atencion}</td>
                <td>{data.n_ticket}</td>
                <td>{data.ua.tx_nombre}</td>
                <td>{data.estado.tx_nombre}</td>
                <td>{data.tipos.tx_nombre}</td>
                <td>{data.solicitante.tx_nombre}</td>
          <td>
            {/* Botón de acción opcional */}
            <button onClick={() => alert(`Acción sobre ${data.name}`)}>
              Acción
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}

export default DataTable;