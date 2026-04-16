require('dotenv').config();
const { conn, ServiciosPortuarios } = require('./src/db');

const serviciosPortuariosSeed = [
  {
    id: 'SP-0001',
    descripcion: 'Maniobras especiales para carga pesada',
    origen: 'Puerto Principal',
    descripcionOrigen: 'Área de atraque A',
    destino: 'Terminal de Almacenaje',
    descripcionDestino: 'Zona de descarga B',
    fechaInicio: new Date().toISOString(),
    organizacionCcOi: 'CC900',
    multiplesCcOi: [{ ccOi: 'CC900', porcentaje: 100 }],
    sumatoriaPorcentaje: 100,
    tipoServicio: 'Maniobras Especiales',
    unidadMovilizar: 'Tanquero Buque Petrolero',
    aprobador: 'Gerente Portuario',
    correo: 'aprobador@empresa.com',
    solicitante: 'Carlos Jiménez',
    cedulaSolicitante: 'V-44556677',
    fecha: new Date().toISOString().split('T')[0],
    tipoSolicitud: 'Servicios Portuarios',
    subtipo: 'Ocasional',
    estado: 'pendiente',
    motivoRechazo: null
  },
  {
    id: 'SP-0002',
    descripcion: 'Servicio especial de maniobra de plataforma',
    origen: 'Refinería Sur',
    descripcionOrigen: 'Muelles de carga pesada',
    destino: 'Puerto Exterior',
    descripcionDestino: 'Bahía de recepción de mercancía',
    fechaInicio: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    organizacionCcOi: 'CC901',
    multiplesCcOi: [
      { ccOi: 'CC901', porcentaje: 70 },
      { ccOi: 'CC902', porcentaje: 30 }
    ],
    sumatoriaPorcentaje: 100,
    tipoServicio: 'Maniobras Especiales',
    unidadMovilizar: 'Tanquero Buque Petrolero',
    aprobador: 'Subgerente de Logística',
    correo: 'subgerente@empresa.com',
    solicitante: 'María Pérez',
    cedulaSolicitante: 'V-55667788',
    fecha: new Date().toISOString().split('T')[0],
    tipoSolicitud: 'Servicios Portuarios',
    subtipo: 'Ocasional',
    estado: 'pendiente',
    motivoRechazo: null
  }
];

(async function () {
  try {
    await conn.sync({ alter: true });
    for (const servicio of serviciosPortuariosSeed) {
      await ServiciosPortuarios.create(servicio);
    }
    console.log('Seed de servicios portuarios completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error al poblar servicios portuarios:', err);
    process.exit(1);
  }
})();