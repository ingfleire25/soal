require('dotenv').config();
const { conn, Materiales } = require('./src/db');

const materialesSeed = [
  { renglon: 'MAT001', descripcion: 'Cemento Portland 50kg', cantidad: 100, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Material para construcción' },
  { renglon: 'MAT003', descripcion: 'Grava 3/4"', cantidad: 30, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Grava para concreto' },
  { renglon: 'MAT004', descripcion: 'Acero corrugado 12mm', cantidad: 20, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Varillas de acero' },
  { renglon: 'MAT005', descripcion: 'Bloques de concreto 15x20x40cm', cantidad: 200, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Bloques para muro' },
  { renglon: 'MAT006', descripcion: 'Tejas de barro', cantidad: 150, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Tejas para techo' },
  { renglon: 'MAT007', descripcion: 'Pintura latex blanca 5L', cantidad: 25, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Pintura interior' },
  { renglon: 'MAT008', descripcion: 'Tubos PVC 4"', cantidad: 40, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Tubería sanitaria' },
  { renglon: 'MAT009', descripcion: 'Cable eléctrico 12 AWG', cantidad: 100, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Cable para instalación' },
  { renglon: 'MAT010', descripcion: 'Interruptor simple', cantidad: 50, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Interruptor eléctrico' },
  { renglon: 'MAT011', descripcion: 'Cemento blanco 25kg', cantidad: 80, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Cemento para acabados' },
  { renglon: 'MAT012', descripcion: 'Yeso para pared 40kg', cantidad: 60, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Yeso para interior' },
  { renglon: 'MAT013', descripcion: 'Madera pino 2x4x8ft', cantidad: 35, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Madera para estructura' },
  { renglon: 'MAT014', descripcion: 'Clavos 3"', cantidad: 500, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Clavos para carpintería' },
  { renglon: 'MAT015', descripcion: 'Vidrio templado 4mm', cantidad: 10, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Vidrio para ventanas' },
  { renglon: 'MAT016', descripcion: 'Cerámica 30x30cm', cantidad: 120, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Cerámica para piso' },
  { renglon: 'MAT017', descripcion: 'Grifería completa baño', cantidad: 15, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Juego de grifería' },
  { renglon: 'MAT018', descripcion: 'Inodoro blanco', cantidad: 12, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Inodoro cerámico' },
  { renglon: 'MAT019', descripcion: 'Lavamanos rectangular', cantidad: 10, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Lavamanos de baño' },
  { renglon: 'MAT020', descripcion: 'Ducha teléfono', cantidad: 8, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Cabezal de ducha' },
  { renglon: 'MAT021', descripcion: 'Puerta de madera 80x200cm', cantidad: 5, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Puerta interior' },
  { renglon: 'MAT022', descripcion: 'Ventana aluminio 100x150cm', cantidad: 7, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Ventana corrediza' },
  { renglon: 'MAT023', descripcion: 'Aire acondicionado 12000 BTU', cantidad: 3, fechaEntregaMuelle: new Date().toISOString(), observacion: 'A/C split' },
  { renglon: 'MAT024', descripcion: 'Panel solar 100W', cantidad: 20, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Panel fotovoltaico' },
  { renglon: 'MAT025', descripcion: 'Batería gel 12V 100Ah', cantidad: 5, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Batería para energía' },
  { renglon: 'MAT026', descripcion: 'Generador diesel 5kW', cantidad: 2, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Generador eléctrico' },
  { renglon: 'MAT027', descripcion: 'Tanque de agua 1000L', cantidad: 4, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Tanque plástico' },
  { renglon: 'MAT028', descripcion: 'Bomba sumergible 1HP', cantidad: 6, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Bomba de agua' },
  { renglon: 'MAT029', descripcion: 'Filtro de agua 10"', cantidad: 10, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Filtro sedimentos' },
  { renglon: 'MAT030', descripcion: 'Cable coaxial RG6', cantidad: 200, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Cable para TV' },
  { renglon: 'MAT031', descripcion: 'Router WiFi', cantidad: 15, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Router inalámbrico' },
  { renglon: 'MAT032', descripcion: 'Switch Ethernet 8 puertos', cantidad: 8, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Switch de red' },
  { renglon: 'MAT033', descripcion: 'UPS 1000VA', cantidad: 12, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Sistema de respaldo' },
  { renglon: 'MAT034', descripcion: 'Disco duro 1TB', cantidad: 20, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Almacenamiento' },
  { renglon: 'MAT035', descripcion: 'Monitor LCD 24"', cantidad: 18, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Pantalla de computadora' },
  { renglon: 'MAT036', descripcion: 'Teclado USB', cantidad: 25, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Teclado mecánico' },
  { renglon: 'MAT037', descripcion: 'Mouse óptico', cantidad: 30, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Mouse inalámbrico' },
  { renglon: 'MAT038', descripcion: 'Impresora láser', cantidad: 5, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Impresora multifunción' },
  { renglon: 'MAT039', descripcion: 'Toner negro', cantidad: 50, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Cartucho de tinta' },
  { renglon: 'MAT040', descripcion: 'Papel A4 500 hojas', cantidad: 100, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Paquete de papel' },
  { renglon: 'MAT041', descripcion: 'Silla ergonómica', cantidad: 22, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Silla de oficina' },
  { renglon: 'MAT042', descripcion: 'Escritorio modular', cantidad: 10, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Escritorio ajustable' },
  { renglon: 'MAT043', descripcion: 'Archivador metálico', cantidad: 15, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Archivador de 4 gavetas' },
  { renglon: 'MAT044', descripcion: 'Cafetera industrial', cantidad: 3, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Máquina de café' },
  { renglon: 'MAT045', descripcion: 'Microondas 1000W', cantidad: 12, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Horno de microondas' },
  { renglon: 'MAT046', descripcion: 'Refrigerador 200L', cantidad: 6, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Nevera pequeña' },
  { renglon: 'MAT047', descripcion: 'Extintor ABC 5kg', cantidad: 20, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Extintor de incendios' },
  { renglon: 'MAT048', descripcion: 'Kit primeros auxilios', cantidad: 25, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Botiquín médico' },
  { renglon: 'MAT049', descripcion: 'Candado de seguridad', cantidad: 40, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Candado con llave' },
  { renglon: 'MAT050', descripcion: 'Cinta adhesiva 50m', cantidad: 30, fechaEntregaMuelle: new Date().toISOString(), observacion: 'Cinta de embalaje' }
];

(async function () {
  try {
    await conn.sync({ alter: true });
    console.log('Conexión a Postgres OK y sincronización lista');

    for (const mat of materialesSeed) {
      const created = await Materiales.create({ ...mat, suministroLacustreId: null });
      console.log('Material creado:', created.renglon, created.descripcion);
    }

    console.log('Seed de materiales completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error al poblar materiales:', err);
    process.exit(1);
  }
})();