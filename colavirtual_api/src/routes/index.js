const { Router } = require( 'express' );
const router = Router();

router.get( '/', ( req, res ) => res.send( 'API de aplicativo ColaVirtual (CAIT)' ) )
router.use( '/api/solicitudes', require( './solicitudes' ) )
router.use( '/api/zonas', require( './zonas' ) )
router.use( '/api/areas', require( './areas' ) )
router.use( '/api/categorias', require( './categorias' ) )
router.use( '/api/tipos', require( './tipos' ) )
// router.use( '/api/topicos', require( './topicos' ) )
router.use( '/api/localidades', require( './localidades' ) )
router.use( '/api/unidades-atencion', require( './uas' ) )
router.use( '/api/usuarios', require( './usuarios' ) )
router.use( '/api/analistas', require( './analistas' ) )
router.use( '/auth', require( './auth' ) )
router.use( '/auth/refrescar', require( './refrescar' ) ) // refrescar token de acceso una vez que este expira
router.use( '/api/siga', require('./casosSiga' ) )

module.exports = router 