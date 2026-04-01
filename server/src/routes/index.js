const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => res.send('API mínima de solicitudes de transporte acuático'));
router.use('/api/solicitudes', require('./solicitudes'));
router.use('/api/consultasOracle', require('./consultasOracle'));

module.exports = router;
 