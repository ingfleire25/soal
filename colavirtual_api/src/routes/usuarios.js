const express = require( 'express' );
const router = express.Router();
const usuarios = require( '../controllers/usuarios' );
const verificarToken = require( '../middleware/verificarToken' )
const verificarRoles = require( '../middleware/verificarRoles' )


router.get( '/', [ verificarToken, verificarRoles( 'Analista', 'Supervisor', 'Administrador' ) ], usuarios.getAll )
router.get( '/:uuid', usuarios.getByIdentificador ) // uuid, indicador o cédula
// solicitudes por usuario -> analista, admin y supervisor
router.get( '/:uuid/solicitudes', [ verificarToken, verificarRoles( 'Analista', 'Supervisor', 'Administrador' ) ], usuarios.getSolicitudes )
module.exports = router