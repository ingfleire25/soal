const express = require( 'express' );
const router = express.Router();
const localidades = require( '../controllers/localidades' );
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


router.get( '/', localidades.getAll )
router.get( '/:localidadId', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], localidades.getPorId )
router.get( '/:localidadId/unidades-atencion', localidades.getUAs ) // se deja sin validar para que cualquiera pueda crear solicitudes
router.put( '/:localidadId/estado', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], localidades.switchEstado )

// router.post( '/', localidades.postLocalidad )


module.exports = router