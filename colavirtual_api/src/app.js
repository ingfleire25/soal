const express = require('express');
const routes = require('./routes');
require('./db.js');
const server = express();
const cors = require('cors');

server.name = 'SOAL-API';
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use('/', routes);

server.all('*', (req, res) => res.status(404).json({ statusCode: 404, statusText: "No se encontró el recurso" }));

// simple global error handler can be added here if needed


module.exports = server
