require('dotenv').config();
const { conn, Usuario } = require('./src/db');

const seedData = [
  {
    username: 'gerente',
    password: '1234',
    nombres: 'Juan',
    apellidos: 'Pérez',
    cedula: 'V-12345678',
    telefono: '04141234567',
    gerencia: 'Gerencia General',
    departamento: 'Dirección',
    rol: 'Gerente'
  },
  {
    username: 'subgerente',
    password: '1234',
    nombres: 'María',
    apellidos: 'Gómez',
    cedula: 'V-23456789',
    telefono: '04149876543',
    gerencia: 'Gerencia Operaciones',
    departamento: 'Planeación',
    rol: 'Subgerente'
  },
  {
    username: 'supervisor',
    password: '1234',
    nombres: 'Carlos',
    apellidos: 'Rojas',
    cedula: 'V-34567890',
    telefono: '04147654321',
    gerencia: 'Gerencia Producción',
    departamento: 'Supervisión',
    rol: 'Supervisor'
  },
  {
    username: 'analista',
    password: '1234',
    nombres: 'Laura',
    apellidos: 'López',
    cedula: 'V-45678901',
    telefono: '04142345678',
    gerencia: 'Gerencia Técnica',
    departamento: 'Análisis',
    rol: 'Analista'
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