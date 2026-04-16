require('dotenv').config();
const { conn, Solicitud } = require('./src/db');

const solicitudesSeed = [
  {
    id: 'TP-0001',
    descripcion: 'Traslado de equipo de trabajo al punto A',
    origen: 'Sede Principal',
    descripcionOrigen: 'Recepción y áreas administrativas',
    destino: 'Planta A',
    descripcionDestino: 'Área de operaciones',
    fechaInicio: new Date().toISOString(),
    fechaFin: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    organizacionCcOi: 'CC123',
    multiplesCcOi: [{ ccOi: 'CC123', porcentaje: 100 }],
    lunes: true,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false,
    domingo: false,
    cantidadPasajeros: 12,
    tipoServicio: 'Transporte de personal ocasional',
    aprobador: 'Juan Pérez',
    correo: 'juan.perez@ejemplo.com',
    solicitante: 'Laura López',
    cedulaSolicitante: 'V-45678901',
    tipoSolicitud: 'Transporte de Personal',
    subtipo: 'Ocasional',
    estado: 'pendiente',
    motivoRechazo: null,
    fecha: new Date().toISOString().split('T')[0]
  },
  {
    id: 'TP-0002',
    descripcion: 'Transporte recurrente de cuadrilla de mantenimiento',
    origen: 'Base de Operaciones',
    descripcionOrigen: 'Almacén y área de equipos',
    destino: 'Planta B',
    descripcionDestino: 'Zona de mantenimiento',
    fechaInicio: new Date().toISOString(),
    fechaFin: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
    organizacionCcOi: 'OI456',
    multiplesCcOi: [
      { ccOi: 'OI456', porcentaje: 70 },
      { ccOi: 'CC789', porcentaje: 30 }
    ],
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: false,
    domingo: false,
    cantidadPasajeros: 20,
    tipoServicio: 'Transporte de personal recurrente',
    aprobador: 'María Gómez',
    correo: 'maria.gomez@ejemplo.com',
    solicitante: 'Carlos Rojas',
    cedulaSolicitante: 'V-34567890',
    tipoSolicitud: 'Transporte de Personal',
    subtipo: 'Recurrente',
    estado: 'pendiente',
    motivoRechazo: null,
    modserv: '0001',
    fecha: new Date().toISOString().split('T')[0]
  },
  {
    id: 'MUN-0001',
    descripcion: 'Movimiento de grúa pesada al sitio de construcción',
    origen: 'Depósito Central',
    descripcionOrigen: 'Área de almacenamiento de equipos pesados',
    destino: 'Sitio de Construcción A',
    descripcionDestino: 'Zona de obras civiles',
    fechaInicio: new Date().toISOString(),
    organizacionCcOi: 'CC987',
    multiplesCcOi: [{ ccOi: 'CC987', porcentaje: 100 }],
    tipoServicio: 'Movimiento de unidades mayores',
    aprobador: 'Ana Torres',
    correo: 'ana.torres@ejemplo.com',
    solicitante: 'Pedro Martínez',
    cedulaSolicitante: 'V-56789012',
    tipoSolicitud: 'Movimiento Unidades Mayores',
    subtipo: 'Ocasional',
    estado: 'pendiente',
    motivoRechazo: null,
    unidadMovilizar: 'Grúa Liebherr LTM 1100',
    descripcionUnidad: 'Grúa móvil de 100 toneladas para levantamiento de estructuras',
    fecha: new Date().toISOString().split('T')[0]
  },
  {
    id: 'MUN-0002',
    descripcion: 'Traslado de excavadora al proyecto minero',
    origen: 'Taller de Mantenimiento',
    descripcionOrigen: 'Instalaciones de reparación y preparación de equipos',
    destino: 'Proyecto Minero B',
    descripcionDestino: 'Área de extracción y operaciones mineras',
    fechaInicio: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    organizacionCcOi: 'OI654',
    multiplesCcOi: [
      { ccOi: 'OI654', porcentaje: 80 },
      { ccOi: 'CC321', porcentaje: 20 }
    ],
    tipoServicio: 'Movimiento de unidades mayores',
    aprobador: 'Luis Fernández',
    correo: 'luis.fernandez@ejemplo.com',
    solicitante: 'Sofía Ramírez',
    cedulaSolicitante: 'V-67890123',
    tipoSolicitud: 'Movimiento Unidades Mayores',
    subtipo: 'Ocasional',
    estado: 'aprobada',
    motivoRechazo: null,
    unidadMovilizar: 'Excavadora Caterpillar 320',
    descripcionUnidad: 'Excavadora hidráulica para trabajos de minería y construcción',
    fecha: new Date().toISOString().split('T')[0]
  }
];

(async function () {
  try {
    await conn.sync({ alter: true });
    console.log('Conexión a Postgres OK y sincronización lista');

    for (const s of solicitudesSeed) {
      const created = await Solicitud.create(s);
      console.log('Solicitud creada:', created.id, created.tipoSolicitud, created.subtipo);
    }

    console.log('Seed de solicitudes completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error al poblar solicitudes:', err);
    process.exit(1);
  }
})();