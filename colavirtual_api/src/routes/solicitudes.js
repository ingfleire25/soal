const express = require( 'express' );
const router = express.Router();
const solicitudes = require( '../controllers/solicitudes' );
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


router.get( '/', [ verificarToken, verificarRoles( 'Analista', 'Supervisor', 'Administrador' ) ], solicitudes.getAll ) // filtra por usuario
 //router.get( '/', solicitudes.getAll ) // para pruebas
// get solicitudes por ua
// get solicitudes por area
router.get( '/:solicitudId', [ verificarToken, verificarRoles( 'Analista', 'Supervisor', 'Administrador' ) ], solicitudes.getPorId )
// router.get( '/:solicitudId',  solicitudes.getPorId )
router.post( '/', solicitudes.postSolicitud )
router.put( '/:solicitudId/analistas', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], solicitudes.asignarAnalista )
router.put( '/:solicitudId/estado', [ verificarToken, verificarRoles( 'Analista', 'Supervisor', 'Administrador' ) ], solicitudes.actualizarEstado )


module.exports = router

