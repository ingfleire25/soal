const express = require( 'express' );
const router = express.Router();
const tipos = require( '../controllers/tipos' );

router.get( '/', tipos.getAll )
// router.get( '/:tipoId/topicos', tipos.getTopicos )


module.exports = router