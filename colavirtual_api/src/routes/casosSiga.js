const express = require ( 'express' )
const router = express.Router()
const siga = require( '../controllers/pruebaSQL' )



//router.get( '/:cedula', siga.obtenerUsuarios )
//router.post( '/', siga.registroTrabajo )
router.post( '/:cedula',  siga.crearCaso)


 

module.exports = router