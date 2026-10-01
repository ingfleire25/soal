const { Router } = require('express');
const exigirSesion = require('../middleware/requireSession');
const router = Router();

router.get('/', (req, res) => res.send('API mínima de solicitudes de transporte acuático'));
router.use('/api/auth', require('./auth'));
router.use('/api', exigirSesion);
router.use('/api/solicitudes', require('./solicitudes'));
router.use('/api/materiales', require('./materiales'));
router.use('/api/usuarios', require('./usuarios'));
router.use('/api/evaluaciones', require('./evaluaciones'));
router.use('/api/consultasOracle', require('./consultasOracle'));
router.use('/api/loginLdap', require('./loginLdap'));


module.exports = router;
 