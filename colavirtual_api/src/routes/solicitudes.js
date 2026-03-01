const express = require('express');
const router = express.Router();
const solicitudes = require('../controllers/solicitudes');

// public endpoints
router.get('/', solicitudes.getAll);
router.post('/', solicitudes.postSolicitud);

module.exports = router;

