const server = require('./src/app.js');
require('dotenv').config();
const { conn } = require('./src/db');
const PUERTO = process.env.PORT || 3001;

// sincronizar modelos y arrancar servidor
// conn.sync({ force: true }).then(() => {
conn.sync().then(() => {
  server.listen(PUERTO, () => {
    console.log(`Servidor ejecutándose en el puerto ${PUERTO}`);
  });
}).catch(err => {
  console.error('Error al sincronizar la base de datos:', err);
});

 