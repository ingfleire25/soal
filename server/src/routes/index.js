const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => res.send('API mínima de solicitudes de transporte acuático'));
router.use('/api/auth', require('./auth'));
router.use('/api/solicitudes', require('./solicitudes'));
router.use('/api/materiales', require('./materiales'));
router.use('/api/usuarios', require('./usuarios'));
router.use('/api/consultasOracle', require('./consultasOracle'));

module.exports = router;
 