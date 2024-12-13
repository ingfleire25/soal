const express = require( 'express' );
const router = express.Router();
const areas = require( '../controllers/areas' );
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


router.get( '/', areas.getAll )
router.get( '/:areaId', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], areas.getPorId )
router.get( '/:areaId/localidades', areas.getLocalidades ) // no se valida para que cualquiera pueda crear solicitudes
router.get( '/:areaId/solicitudes', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], areas.getSolicitudes )
router.get( '/:areaId/supervisores', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], areas.getSupervisores )
router.put( '/:areaId/supervisores', [ verificarToken, verificarRoles( 'Administrador' ) ], areas.asignarSupervisor ) // solo admins
router.put( '/:areaId/supervisores/remover', [ verificarToken, verificarRoles( 'Administrador' ) ], areas.removerSupervisor ) // solo admins
router.put( '/:areaId/estado', [ verificarToken, verificarRoles( 'Administrador' ) ], areas.switchEstado )


module.exports = router