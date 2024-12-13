const express = require( 'express' );
const router = express.Router();
const topicos = require( '../controllers/topicos' );
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


router.get( '/', topicos.getAll )
router.put( '/:topicoId/estado', [ verificarToken, verificarRoles( 'Administrador' ) ], topicos.switchEstado )




module.exports = router