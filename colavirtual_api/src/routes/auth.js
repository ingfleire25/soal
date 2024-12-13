const express = require( 'express' );
const router = express.Router();
const auth = require( '../controllers/auth' );

router.post( '/login', auth.procesarLogin )
router.get( '/logout', auth.procesarLogout )


module.exports = router