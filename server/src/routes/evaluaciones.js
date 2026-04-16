const express = require('express');
const router = express.Router();
const evaluaciones = require('../controllers/evaluaciones');

router.get('/', evaluaciones.getAll);
router.post('/', evaluaciones.postEvaluacion);

module.exports = router;
