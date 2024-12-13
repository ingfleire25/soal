const express = require( 'express' );
const router = express.Router();
const zonas = require( '../controllers/zonas' );
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


router.get( '/', zonas.getAll )
router.get( '/:zonaId', [ verificarToken, verificarRoles( 'Administrador' ) ], zonas.getPorId )
router.get( '/:zonaId/areas', zonas.getAreas )
router.put( '/:zonaId/estado', [ verificarToken, verificarRoles( 'Administrador' ) ], zonas.switchEstado )


module.exports = router