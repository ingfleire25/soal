require('dotenv').config();
const { conn, Usuario } = require('./src/db');

const seedData = [
  {
    username: 'leonardo',
    password: '1234',
    nombres: 'Leonardo',
    apellidos: 'Silva',
    cedula: 'V-10000001',
    correo: 'leonardo@empresa.com',
    telefono: '04141234501',
    gerencia: 'Gerencia A',
    departamento: 'Solicitudes',
    rol: 'Solicitante'
  },
  {
    username: 'victoria',
    password: '1234',
    nombres: 'Victoria',
    apellidos: 'Martínez',
    cedula: 'V-10000002',
    correo: 'victoria@empresa.com',
    telefono: '04141234502',
    gerencia: 'Gerencia B',
    departamento: 'Solicitudes',
    rol: 'Solicitante'
  },
  {
    username: 'mary',
    password: '1234',
    nombres: 'Mary',
    apellidos: 'González',
    cedula: 'V-10000003',
    correo: 'mary@empresa.com',
    telefono: '04141234503',
    gerencia: 'Gerencia C',
    departamento: 'Solicitudes',
    rol: 'Solicitante'
  },
  {
    username: 'linda',
    password: '1234',
    nombres: 'Linda',
    apellidos: 'Castro',
    cedula: 'V-10000004',
    correo: 'linda@empresa.com',
    telefono: '04141234504',
    gerencia: 'Gerencia A',
    departamento: 'Aprobaciones',
    rol: 'Aprobador',
    nivelAprobacion: '2'
  },
  {
    username: 'jose',
    password: '1234',
    nombres: 'Jose',
    apellidos: 'Fernández',
    cedula: 'V-10000005',
    correo: 'jose@empresa.com',
    telefono: '04141234505',
    gerencia: 'Gerencia B',
    departamento: 'Administración',
    rol: 'Administrador'
  }
];

(async function () {
  try {
    await conn.sync({ alter: true });
    console.log('Conexión a Postgres OK y sincronización lista');

    for (const user of seedData) {
      const [record, created] = await Usuario.findOrCreate({
        where: { username: user.username },
        defaults: user
      });
      console.log(`${created ? 'Creado' : 'Saltado'} usuario: ${record.username}`);
    }

    console.log('Seed de usuarios completado.');
    process.exit(0);
  } catch (err) {
    console.error('Error al poblar usuarios:', err);
    process.exit(1);
  }
})();