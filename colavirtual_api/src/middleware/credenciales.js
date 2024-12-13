const origenesPermitidos = require( '../config/origenesPermitidos' )

// es necesario que el encabezado 'Access-Control-Allow-Credentias' esté seteado en 'true' se va a usar fetch
// y/o el withCredentials para las cookies porque los bloquea cors
const credenciales = ( req, res, next ) => {
    const origen = req.headers.origin
    if ( origenesPermitidos.includes( origen ) || !origen ) {
        res.header( 'Access-Control-Allow-Credentials', true ) // necesario que esté en true por el cors y el withCredentials
        // res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept' )
        // res.header( 'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE' )
        next()
    }
}

module.exports = credenciales