const express = require( 'express' );
const router = express.Router();
const auth = require( '../controllers/auth' );

router.post( '/login', auth.procesarLogin )
router.post( '/logout', auth.procesarLogout )
router.get( '/refresh', auth.handleRefreshToken )


module.exports = router