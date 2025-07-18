// routes/estados.js
const express = require('express');
const router = express.Router();
const estadosController = require('../controllers/estado'); // Importa el controlador que acabas de crear

// Importa tus middlewares de autenticación y autorización si los necesitas
const verificarToken = require('../middleware/verificarToken'); // Asumiendo que ya tienes esto
const verificarRoles = require('../middleware/verificarRoles'); // Asumiendo que ya tienes esto

// Ruta para obtener todos los estados (usado por FormSelect en el frontend)
// No requiere verificación de token ni roles si solo es para listar opciones públicas.
router.get('/', estadosController.getAll);

// Ruta para obtener un estado por su ID (útil para detalles específicos, si es necesario)
// Podrías restringir esta ruta a ciertos roles si los detalles del estado son sensibles.
router.get('/:estadoId', [verificarToken, verificarRoles('Administrador')], estadosController.getPorId);

// Si decides implementar el switchEstado para activar/desactivar estados, descomenta y usa esta ruta:
// router.put('/:estadoId/estado', [verificarToken, verificarRoles('Administrador')], estadosController.switchEstado);

module.exports = router;