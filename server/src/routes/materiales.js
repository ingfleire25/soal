const express = require('express');
const router = express.Router();
const { C002T_MATERIAL } = require('../db');

// Get all materiales
router.get('/', async (req, res) => {
  try {
    const materiales = await C002T_MATERIAL.findAll({ order: [['descripcion', 'ASC']] });
    res.status(200).json({ statusCode: 200, statusText: 'OK', result: materiales });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al obtener materiales', error: err.message });
  }
});

module.exports = router;