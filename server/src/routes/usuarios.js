const express = require('express');
const router = express.Router();
const usuarios = require('../controllers/usuarios');

router.get('/', usuarios.search);           // GET /api/usuarios?search=...
router.get('/:id', usuarios.getById);       // GET /api/usuarios/:id
router.post('/', usuarios.create);          // POST /api/usuarios
router.put('/:id', usuarios.update);        // PUT /api/usuarios/:id

module.exports = router;
