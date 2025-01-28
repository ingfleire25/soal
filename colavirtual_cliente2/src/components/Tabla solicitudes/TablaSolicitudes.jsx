import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TablaSolicitudes.module.css'

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
    //console.log(data[0])
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
    <section className={styles.contenedor}>
      <div>
      {/* <table className={ `${table} section`}> */}
      <table className={styles.table}>
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
          {data[0].map((item) => ( // Iteramos directamente sobre el array 'data'
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
    </section>
  );
}

export default DataTable;