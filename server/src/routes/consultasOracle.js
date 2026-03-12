const express = require('express');
const router = express.Router();
const consultasOracle = require('../controllers/consultasOracle');

// public endpoints
router.get('/modserv', consultasOracle.getAll);


module.exports = router;