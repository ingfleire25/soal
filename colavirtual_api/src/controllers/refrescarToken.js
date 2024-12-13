
const { Usuario, Rol } = require( '../db' )
const jwt = require( 'jsonwebtoken' )
require( 'dotenv' ).config()


exports.procesarTokenRefresh = async ( req, res ) => { // genera nuevo token de acceso cuando el anterior expira
    const cookies = req.cookies
    let usuario
    if ( !cookies?.jwt ) {
        return res.sendStatus( 401 )
    }
    const tokenRefrescar = cookies.jwt
    try {
        usuario = await Usuario.findOne( {
            where: {
                auth: tokenRefrescar
            },
            include: [ { model: Rol } ]
        } )
        if ( !usuario ) return res.sendStatus( 401 ) // no autorizado
        jwt.verify(
            tokenRefrescar,
            process.env.REFRESH_TOKEN_SECRET,
            ( error, resultado ) => {
                if ( error || usuario.tx_indicador !== resultado.indicador ) return res.sendStatus( 403 ) // prohibido
                const tokenAcceso = jwt.sign(
                    {
                        UserInfo: {
                            indicador: resultado.indicador,
                            roles: usuario.rols.map( r => r.rolId ),
                            co_roles: usuario.rols.map( r => r.co_rol )
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30m' } // 30m
                )
                return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: tokenAcceso } )
            }
        )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar en Base de Datos' } )
    }
}