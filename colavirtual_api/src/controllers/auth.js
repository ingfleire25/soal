const { validarCredenciales } = require( '../utils/ldap' )
const { Usuario, Rol } = require( '../db' )
const { Op } = require( "sequelize" );
const jwt = require( 'jsonwebtoken' )
require( 'dotenv' ).config()


exports.procesarLogin = async ( req, res ) => {
    const { indicador, contrasena } = req.body
    let usuario
    if ( !indicador || !contrasena ) {
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Indicador y Contraseña son requeridos' } )
    }
    try { // buscar entre los id de rol si el usuario tiene uno válido para iniciar sesión
        const validRoles = await Rol.findAll( { // son 4 roles: 'Invitado', 'Analista', 'Supervisor', 'Administrador'
            where: {
                tx_nombre: {
                    [ Op.ne ]: 'Invitado' // todos, excepto este, son válidos para iniciar sesión
                }
            }
        } )
        usuario = await Usuario.findOne( { // buscar si el usuario si es activo y si tiene un rol valido
            where: {
                tx_indicador: indicador,
                isActive: true
            },
            include: [ {
                model: Rol, where: {
                    rolId: {
                        [ Op.or ]: validRoles.map( rol => rol.rolId )
                    }
                }
            } ]
        } )
        if ( !usuario ) return res.status( 400 ).json( { statusCode: 400, statusText: 'Usuario no registrado o sin autorización' } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar en Base de Datos' } )
    }
    try {
        await validarCredenciales( indicador, contrasena ) // si no explota, el indicador y contraseña son válidos
    } catch ( error ) {
        console.error( error )
        return res.status( error.statusCode ).json( error )
    }
    // generar token para control de acceso y sesión
    // console.log( "estoy creando tokens para el usuario: ", usuario )
    const roles = usuario.rols.map( r => r.rolId ) // me quedo con los código porque es más fácil luego validar las rutas
    const co_roles = usuario.rols.map( r => r.co_rol )
    const tokenAcceso = jwt.sign(
        {
            UserInfo: {
                indicador: usuario.tx_indicador,
                roles,
                co_roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30m' } // 30 min
    )
    const tokenRefrescar = jwt.sign(
        { indicador: usuario.tx_indicador },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    usuario.auth = tokenRefrescar
    await usuario.save()
    // Se crea la cookie que se utilizará en el cliente para refrescar el acceso
    // Durará 1 día. httpOnly es para que no se pueda acceder a ella por javascript
    res.cookie( 'jwt', tokenRefrescar, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 } )
    return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: { roles, tokenAcceso, co_roles } } )
}

exports.procesarLogout = async ( req, res ) => {
    // es necesario borrar el token de acceso en el cliente también
    const cookies = req.cookies
    let usuario
    if ( !cookies ) return res.sendStatus( 204 ) // no hay cookie, no hay problema
    const tokenRefrescar = cookies.jwt
    try {
        // busco el token entre los usuarios
        usuario = await Usuario.findOne( {
            where: {
                auth: tokenRefrescar
            }
        } )
        if ( !usuario ) { // si el token no está en la db, pero la cookie sí, se borra el token de la cookie
            res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } )
            return res.sendStatus( 204 ) // ya no hay cookie, ya no hay problema
        }
        // si sí está en bd, lo borro
        usuario.auth = null
        await usuario.save()
        // y luego borro la cookie
        res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } ) // secure: true -> solo para producción
        return res.sendStatus( 204 ) // si cerró sesión, qué le voy a monstar?
    } catch ( error ) {
        console.error( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: 'Error al cerrar sesión' } )
    }
}