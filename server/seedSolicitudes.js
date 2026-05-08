require('dotenv').config();
const { conn, Solicitud } = require('./src/db');
const { solicitudesSeed } = require('./seedSolicitudesData');

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