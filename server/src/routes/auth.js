const { Router } = require('express');
const { iniciarSesion, cerrarSesion, registrarActividad, obtenerSesiones } = require('../controllers/auth');
const exigirSesion = require('../middleware/requireSession');
const router = Router();

router.post('/login', iniciarSesion);
router.post('/logout', exigirSesion, cerrarSesion);
router.post('/activity', exigirSesion, registrarActividad);
router.get('/sesiones', exigirSesion, obtenerSesiones);

module.exports = router;
