const jwt = require( 'jsonwebtoken' )
require( 'dotenv' ).config()


const verificarToken = ( req, res, next ) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if ( !authHeader?.startsWith( 'Bearer ' ) ) { // si no hay authHeader o si no comienza con 'Bearer '
        return res.sendStatus( 401 ) // sin autorización
    }
    const token = authHeader.split( ' ' )[ 1 ] // Authorization: Bearer <token>
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        ( error, resultado ) => {
            if ( error ) return res.sendStatus( 403 ) // prohibido. El token no se pudo validar
            req.indicador = resultado.UserInfo.indicador
            req.roles = resultado.UserInfo.roles
            next()
        }
    )
}

module.exports = verificarToken