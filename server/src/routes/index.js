const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => res.send('API mínima de solicitudes de transporte acuático'));
router.use('/api/solicitudes', require('./solicitudes'));

module.exports = router;
 