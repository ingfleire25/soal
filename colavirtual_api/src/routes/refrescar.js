const express = require( 'express' );
const router = express.Router();
const refrescar = require( '../controllers/refrescarToken' );

router.get( '/', refrescar.procesarTokenRefresh )


module.exports = router