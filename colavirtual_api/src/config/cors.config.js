const origenesPermitidos = require( './origenesPermitidos' )

// para permitir varios origenes válidos
const opciones = {
    origin: ( origin, cb ) => {
        if ( origenesPermitidos.indexOf( origin ) !== -1 || !origin ) { // si el origen es válido (o es él mismo, es decir, undefined) accede
            return cb( null, true )
        }
        else {
            return cb( new Error( 'Acceso denegado por CORS' ) )
        }
    },
    optionsSuccessStatus: 200
}

module.exports = opciones