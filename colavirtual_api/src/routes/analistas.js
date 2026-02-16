const express = require( 'express' )
const router = express.Router()
const analistas = require( '../controllers/analistas' )
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


// router.get( '/', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], analistas.getAll )

router.get( '/', analistas.getAll )
router.post( '/:usuarioId/asignar-analista', analistas.asignarUsuarioAUbicacion ) 

router.get( '/:analistaId/unidades-atencion', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], analistas.getUas )


module.exports = router  