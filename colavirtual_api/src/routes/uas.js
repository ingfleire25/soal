const express = require( 'express' );
const router = express.Router();
const uas = require( '../controllers/uas' );
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


router.get( '/', [ verificarToken, verificarRoles( 'Administrador' ) ], uas.getAll )
// router.get( '/:uaId', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], uas.getPorId )
router.get( '/:uaId', uas.getPorId ) // para pruebas
router.get( '/:uaId/analistas', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], uas.getAnalistas )
router.get( '/:uaId/solicitudes', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], uas.getSolicitudes )
// router.put( '/:uaId/analistas', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], uas.asignarAnalista )
router.put( '/:uaId/analistas', uas.asignarAnalista )
router.delete( '/:uaId/analistas', uas.removerAnalista )
router.put( '/:uaId/estado', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], uas.switchEstado )



module.exports = router