require('dotenv').config();
const { conn, EvaluacionTransporte } = require('./src/db');

const evaluacionesData = [
  {
    id: 'EVAL-001',
    codigoSolicitud: 'TP-0001',
    tipoSolicitud: 'Transporte de Personal',
    subtipo: 'Ocasional',
    evaluadorNombre: 'Juan Pérez',
    evaluadorCedula: 'V-12345678',
    evaluadorCorreo: 'juan.perez@ejemplo.com',
    fecha: new Date('2024-01-15'),
    puntualidad: 5,
    calidad: 4,
    comunicacion: 5,
    seguridad: 5,
    satisfaccion: 4,
    comentarios: 'Excelente servicio, muy puntual.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-002',
    codigoSolicitud: 'TP-0002',
    tipoSolicitud: 'Transporte de Personal',
    subtipo: 'Recurrente',
    evaluadorNombre: 'María García',
    evaluadorCedula: 'V-87654321',
    evaluadorCorreo: 'maria.garcia@ejemplo.com',
    fecha: new Date('2024-01-20'),
    puntualidad: 4,
    calidad: 5,
    comunicacion: 4,
    seguridad: 4,
    satisfaccion: 5,
    comentarios: 'Buena calidad del transporte.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-003',
    codigoSolicitud: 'OUM-0001',
    tipoSolicitud: 'Movimiento Unidades Mayores',
    subtipo: 'Ocasional',
    evaluadorNombre: 'Carlos López',
    evaluadorCedula: 'V-11223344',
    evaluadorCorreo: 'carlos.lopez@ejemplo.com',
    fecha: new Date('2024-02-10'),
    puntualidad: 3,
    calidad: 4,
    comunicacion: 3,
    seguridad: 5,
    satisfaccion: 4,
    comentarios: 'Servicio aceptable, pero podría mejorar en comunicación.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-004',
    codigoSolicitud: 'SL-0001',
    tipoSolicitud: 'Suministro Lacustre',
    subtipo: 'Ocasional',
    evaluadorNombre: 'Ana Rodríguez',
    evaluadorCedula: 'V-55667788',
    evaluadorCorreo: 'ana.rodriguez@ejemplo.com',
    fecha: new Date('2024-02-15'),
    puntualidad: 5,
    calidad: 5,
    comunicacion: 5,
    seguridad: 5,
    satisfaccion: 5,
    comentarios: 'Servicio perfecto en todos los aspectos.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-005',
    codigoSolicitud: 'TP-0003',
    tipoSolicitud: 'Transporte de Personal',
    subtipo: 'Ocasional',
    evaluadorNombre: 'Pedro Martínez',
    evaluadorCedula: 'V-99887766',
    evaluadorCorreo: 'pedro.martinez@ejemplo.com',
    fecha: new Date('2024-03-05'),
    puntualidad: 4,
    calidad: 3,
    comunicacion: 4,
    seguridad: 4,
    satisfaccion: 3,
    comentarios: 'Regular, necesita mejoras en calidad.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-006',
    codigoSolicitud: 'OUM-0002',
    tipoSolicitud: 'Movimiento Unidades Mayores',
    subtipo: 'Ocasional',
    evaluadorNombre: 'Laura Sánchez',
    evaluadorCedula: 'V-33445566',
    evaluadorCorreo: 'laura.sanchez@ejemplo.com',
    fecha: new Date('2024-03-12'),
    puntualidad: 5,
    calidad: 4,
    comunicacion: 4,
    seguridad: 5,
    satisfaccion: 4,
    comentarios: 'Buen trabajo en seguridad.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-007',
    codigoSolicitud: 'SL-0002',
    tipoSolicitud: 'Suministro Lacustre',
    subtipo: 'Ocasional',
    evaluadorNombre: 'Roberto Díaz',
    evaluadorCedula: 'V-77889900',
    evaluadorCorreo: 'roberto.diaz@ejemplo.com',
    fecha: new Date('2024-04-08'),
    puntualidad: 4,
    calidad: 4,
    comunicacion: 3,
    seguridad: 4,
    satisfaccion: 4,
    comentarios: 'Servicio estándar.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-008',
    codigoSolicitud: 'TP-0004',
    tipoSolicitud: 'Transporte de Personal',
    subtipo: 'Recurrente',
    evaluadorNombre: 'Sofía Ramírez',
    evaluadorCedula: 'V-11224455',
    evaluadorCorreo: 'sofia.ramirez@ejemplo.com',
    fecha: new Date('2024-04-20'),
    puntualidad: 5,
    calidad: 5,
    comunicacion: 5,
    seguridad: 5,
    satisfaccion: 5,
    comentarios: 'Excelente en todos los aspectos.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-009',
    codigoSolicitud: 'OUM-0003',
    tipoSolicitud: 'Movimiento Unidades Mayores',
    subtipo: 'Ocasional',
    evaluadorNombre: 'Miguel Torres',
    evaluadorCedula: 'V-66778899',
    evaluadorCorreo: 'miguel.torres@ejemplo.com',
    fecha: new Date('2024-05-03'),
    puntualidad: 3,
    calidad: 3,
    comunicacion: 2,
    seguridad: 4,
    satisfaccion: 3,
    comentarios: 'Necesita mejoras significativas.',
    estado: 'registrada'
  },
  {
    id: 'EVAL-010',
    codigoSolicitud: 'SL-0003',
    tipoSolicitud: 'Suministro Lacustre',
    subtipo: 'Ocasional',
    evaluadorNombre: 'Elena Vargas',
    evaluadorCedula: 'V-22334455',
    evaluadorCorreo: 'elena.vargas@ejemplo.com',
    fecha: new Date('2024-05-15'),
    puntualidad: 4,
    calidad: 4,
    comunicacion: 4,
    seguridad: 4,
    satisfaccion: 4,
    comentarios: 'Buen servicio general.',
    estado: 'registrada'
  }
];

(async function () {
  try {
    await EvaluacionTransporte.bulkCreate(evaluacionesData);
    console.log('Evaluaciones seeded successfully');
  } catch (error) {
    console.error('Error seeding evaluaciones:', error);
  } finally {
    process.exit();
  }
})();