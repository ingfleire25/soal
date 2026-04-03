const express = require('express');
const routes = require('./routes'); // Importa las rutas definidas en tu carpeta de rutas
require('./db.js');                // Ejecuta la conexión a la base de datos
const server = express();
const cors = require('cors');

// Asigna un nombre interno a la instancia del servidor
server.name = 'SOAL-API';

/**
 * MIDDLEWARES
 */

// Permite peticiones desde el frontend configurado para evitar error CORS con withCredentials
server.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Permite que el servidor entienda datos enviados a través de formularios (URL encoded)
server.use(express.urlencoded({ extended: true }));

// Permite que el servidor reciba y entienda el formato JSON en el cuerpo (body) de las peticiones
server.use(express.json());

/**
 * RUTAS
 */

// Redirige todas las peticiones que lleguen a la raíz '/' hacia el archivo de rutas importado
server.use('/', routes);

/**
 * MANEJO de ERRORES y RUTAS NO ENCONTRADAS
 */

// Captura cualquier ruta que no haya sido definida previamente (comodín '*')
// Devuelve un error 404 estandarizado en formato JSON
server.all('*', (req, res) => res.status(404).json({ 
    statusCode: 404, 
    statusText: "No se encontró el recurso" 
}));

// Exporta la configuración del servidor para que pueda ser iniciado (usualmente desde index.js)
module.exports = server;