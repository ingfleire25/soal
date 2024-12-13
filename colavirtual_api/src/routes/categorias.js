const express = require( 'express' );
const router = express.Router();
const categorias = require( '../controllers/categorias' );

router.get( '/', categorias.getAll )
router.get( '/:categoriaId', categorias.getById )
router.get( '/:categoriaId/tipos', categorias.getTipos )




module.exports = router