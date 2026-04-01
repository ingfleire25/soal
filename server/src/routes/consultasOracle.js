const express = require('express');
const router = express.Router();
const consultasOracle = require('../controllers/consultasOracle');
const locations = require('../controllers/locations');

// public endpoints
router.get('/modserv', consultasOracle.getAll);
router.get('/locations', locations.getAll);


module.exports = router;