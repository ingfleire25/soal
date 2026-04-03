const express = require('express');
const router = express.Router();
const solicitudes = require('../controllers/solicitudes');

// public endpoints
router.get('/', solicitudes.getAll);
router.post('/', solicitudes.postSolicitud);
router.post('/suministro-lacustre', solicitudes.postSuministroLacustre);
router.post('/servicios-portuarios', solicitudes.postServiciosPortuarios);
router.put('/:id', solicitudes.updateSolicitud);
router.patch('/:id/estado', solicitudes.cambiarEstado);

module.exports = router;

