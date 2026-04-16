require('dotenv').config();
const { conn, SuministroLacustre, Materiales } = require('./src/db');

const serviciosLacustresSeed = [
  {
    id: 'SL-0001',
    descripcion: 'Suministro de materiales para construcción de muelle',
    origen: 'Almacén Central',
    descripcionOrigen: 'Depósito de materiales de construcción',
    destino: 'Sitio de Construcción Muelle A',
    descripcionDestino: 'Zona costera para construcción portuaria',
    fechaInicio: new Date().toISOString(),
    fechaFin: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    organizacionCcOi: 'CC456',
    multiplesCcOi: [{ ccOi: 'CC456', porcentaje: 100 }],
    tipoServicio: 'Suministro lacustre de materiales',
    personaEnvia: 'V-12345678',
    descripcionPersonaEnvia: 'Juan Pérez, Supervisor de Almacén',
    personaRecibe: 'V-87654321',
    descripcionPersonaRecibe: 'María López, Ingeniera de Obra',
    aprobador: 'Carlos Rodríguez',
    correo: 'carlos.rodriguez@ejemplo.com',
    solicitante: 'Ana Gómez',
    cedulaSolicitante: 'V-11223344',
    fecha: new Date().toISOString().split('T')[0],
    tipoSolicitud: 'Suministro Lacustre',
    subtipo: 'Ocasional',
    estado: 'pendiente',
    motivoRechazo: null,
    materiales: [
      { renglon: 'MAT001', descripcion: 'Cemento Portland 50kg', cantidad: 50, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Para concreto del muelle' },
      { renglon: 'MAT002', descripcion: 'Arena fina 1m³', cantidad: 25, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Mezcla de concreto' },
      { renglon: 'MAT004', descripcion: 'Acero corrugado 12mm', cantidad: 10, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Refuerzo estructural' }
    ]
  },
  {
    id: 'SL-0002',
    descripcion: 'Entrega de suministros para mantenimiento portuario',
    origen: 'Centro de Distribución',
    descripcionOrigen: 'Instalaciones de logística',
    destino: 'Puerto Industrial B',
    descripcionDestino: 'Terminal portuaria para operaciones de carga',
    fechaInicio: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    fechaFin: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    organizacionCcOi: 'OI789',
    multiplesCcOi: [
      { ccOi: 'OI789', porcentaje: 70 },
      { ccOi: 'CC101', porcentaje: 30 }
    ],
    tipoServicio: 'Suministro lacustre urgente',
    personaEnvia: 'V-23456789',
    descripcionPersonaEnvia: 'Pedro Ramírez, Coordinador de Suministros',
    personaRecibe: 'V-98765432',
    descripcionPersonaRecibe: 'Laura Torres, Gerente de Puerto',
    aprobador: 'Sofía Martínez',
    correo: 'sofia.martinez@ejemplo.com',
    solicitante: 'Diego Herrera',
    cedulaSolicitante: 'V-22334455',
    fecha: new Date().toISOString().split('T')[0],
    tipoSolicitud: 'Suministro Lacustre',
    subtipo: 'Ocasional',
    estado: 'aprobada',
    motivoRechazo: null,
    materiales: [
      { renglon: 'MAT008', descripcion: 'Tubos PVC 4"', cantidad: 20, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Para sistema de drenaje' },
      { renglon: 'MAT009', descripcion: 'Cable eléctrico 12 AWG', cantidad: 100, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Instalación eléctrica' },
      { renglon: 'MAT047', descripcion: 'Extintor ABC 5kg', cantidad: 10, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Seguridad portuaria' }
    ]
  },
  {
    id: 'SL-0003',
    descripcion: 'Suministro de equipos para dragado lacustre',
    origen: 'Fábrica de Equipos',
    descripcionOrigen: 'Planta de manufactura especializada',
    destino: 'Lago Artificial C',
    descripcionDestino: 'Embalse para operaciones de dragado',
    fechaInicio: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    fechaFin: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString(),
    organizacionCcOi: 'CC202',
    multiplesCcOi: [{ ccOi: 'CC202', porcentaje: 100 }],
    tipoServicio: 'Suministro lacustre de equipos pesados',
    personaEnvia: 'V-34567890',
    descripcionPersonaEnvia: 'Miguel Sánchez, Gerente de Ventas',
    personaRecibe: 'V-09876543',
    descripcionPersonaRecibe: 'Elena Vargas, Supervisora de Dragado',
    aprobador: 'Roberto Díaz',
    correo: 'roberto.diaz@ejemplo.com',
    solicitante: 'Gabriela Ruiz',
    cedulaSolicitante: 'V-33445566',
    fecha: new Date().toISOString().split('T')[0],
    tipoSolicitud: 'Suministro Lacustre',
    subtipo: 'Ocasional',
    estado: 'pendiente',
    motivoRechazo: null,
    materiales: [
      { renglon: 'MAT026', descripcion: 'Generador diesel 5kW', cantidad: 2, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Energía para equipos' },
      { renglon: 'MAT027', descripcion: 'Tanque de agua 1000L', cantidad: 3, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Almacenamiento de agua' },
      { renglon: 'MAT028', descripcion: 'Bomba sumergible 1HP', cantidad: 4, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Bombeo de agua' }
    ]
  }
];

(async function () {
  try {
    await conn.sync({ alter: true });
    console.log('Conexión a Postgres OK y sincronización lista');

    for (const servicio of serviciosLacustresSeed) {
      const { materiales, ...servicioData } = servicio;
      const createdServicio = await SuministroLacustre.create(servicioData);
      console.log('Servicio Lacustre creado:', createdServicio.id, createdServicio.descripcion);

      for (const mat of materiales) {
        await Materiales.create({
          ...mat,
          suministroLacustreId: createdServicio.id
        });
      }
      console.log('Materiales asociados creados para servicio:', createdServicio.id);
    }

    console.log('Seed de servicios lacustres completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error al poblar servicios lacustres:', err);
    process.exit(1);
  }
})();