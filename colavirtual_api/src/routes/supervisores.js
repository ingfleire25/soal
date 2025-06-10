const express = require( 'express' )
const router = express.Router()
const supervisores = require( '../controllers/supervisores' )
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


// router.get( '/', [ verificarToken, verificarRoles( 'Supervisor', 'Administrador' ) ], analistas.getAll )


router.post( '/:supervisorId/asignar-supervisor', supervisores.asignarSupervisor )



module.exports = router  