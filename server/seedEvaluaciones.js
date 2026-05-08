require('dotenv').config();
const { conn, EvaluacionTransporte } = require('./src/db');
const { solicitudesSeed } = require('./seedSolicitudesData');

const evaluadores = [
  { nombre: 'Juan Pérez', cedula: 'V-12345678', correo: 'juan.perez@ejemplo.com' },
  { nombre: 'María García', cedula: 'V-87654321', correo: 'maria.garcia@ejemplo.com' },
  { nombre: 'Carlos López', cedula: 'V-11223344', correo: 'carlos.lopez@ejemplo.com' },
  { nombre: 'Ana Rodríguez', cedula: 'V-55667788', correo: 'ana.rodriguez@ejemplo.com' },
  { nombre: 'Pedro Martínez', cedula: 'V-99887766', correo: 'pedro.martinez@ejemplo.com' },
  { nombre: 'Laura Sánchez', cedula: 'V-33445566', correo: 'laura.sanchez@ejemplo.com' },
  { nombre: 'Roberto Díaz', cedula: 'V-77889900', correo: 'roberto.diaz@ejemplo.com' },
  { nombre: 'Sofía Ramírez', cedula: 'V-11224455', correo: 'sofia.ramirez@ejemplo.com' },
  { nombre: 'Miguel Torres', cedula: 'V-66778899', correo: 'miguel.torres@ejemplo.com' },
  { nombre: 'Elena Vargas', cedula: 'V-22334455', correo: 'elena.vargas@ejemplo.com' }
];

const camposEvaluacion = [
  { puntualidad: 5, calidad: 4, comunicacion: 5, seguridad: 5, satisfaccion: 4 },
  { puntualidad: 4, calidad: 5, comunicacion: 4, seguridad: 4, satisfaccion: 5 },
  { puntualidad: 3, calidad: 4, comunicacion: 3, seguridad: 5, satisfaccion: 4 },
  { puntualidad: 5, calidad: 5, comunicacion: 5, seguridad: 5, satisfaccion: 5 },
  { puntualidad: 4, calidad: 3, comunicacion: 4, seguridad: 4, satisfaccion: 3 },
  { puntualidad: 5, calidad: 4, comunicacion: 4, seguridad: 5, satisfaccion: 4 },
  { puntualidad: 4, calidad: 4, comunicacion: 3, seguridad: 4, satisfaccion: 4 },
  { puntualidad: 5, calidad: 5, comunicacion: 5, seguridad: 5, satisfaccion: 5 },
  { puntualidad: 3, calidad: 3, comunicacion: 2, seguridad: 4, satisfaccion: 3 },
  { puntualidad: 4, calidad: 4, comunicacion: 4, seguridad: 4, satisfaccion: 4 }
];

const evaluacionesData = solicitudesSeed.map((solicitud, index) => {
  const evaluador = evaluadores[index % evaluadores.length];
  const valores = camposEvaluacion[index % camposEvaluacion.length];

  return {
    id: `EVAL-${String(index + 1).padStart(3, '0')}`,
    codigoSolicitud: solicitud.id,
    tipoSolicitud: solicitud.tipoSolicitud,
    subtipo: solicitud.subtipo || '',
    evaluadorNombre: evaluador.nombre,
    evaluadorCedula: evaluador.cedula,
    evaluadorCorreo: evaluador.correo,
    fecha: new Date(Date.now() - index * 86400000),
    puntualidad: valores.puntualidad,
    calidad: valores.calidad,
    comunicacion: valores.comunicacion,
    seguridad: valores.seguridad,
    satisfaccion: valores.satisfaccion,
    comentarios: 'Evaluación generada a partir de la solicitud existente.',
    estado: 'registrada'
  };
});

(async function () {
  try {
    await conn.sync({ alter: true });
    await EvaluacionTransporte.bulkCreate(evaluacionesData);
    console.log('Evaluaciones seeded successfully');
  } catch (error) {
    console.error('Error seeding evaluaciones:', error);
  } finally {
    process.exit();
  }
})();