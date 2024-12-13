const { Solicitud, Usuario, Topico, Ua, Estado, Rol } = require( '../db' );
const { buscar } = require( '../utils/ldap' )


//----------- GET -----------//
exports.getAll = async ( req, res ) => {
    const { rol } = req.query
    if ( rol ) {
        // filtrar por rol
        // retornar respuesta
        console.error( req.query )
    }
    try {
        const usuarios = await Usuario.findAll( {
            include: [
                { model: Ua },
                { model: Rol }
            ]
        } )
        return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: usuarios } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar' } )
    }
}

exports.getByIdentificador = async ( req, res ) => { // uuid, indicador o cédula. Busca el usuario en BD; si no lo encuentra, busca en DA y regitra
    const { uuid } = req.params
    let usuario
    let identificador
    const buscarPor = { 'cedula': 'pdvsacom-AD-cedula', 'indicador': 'uid' }
    try { // se busca el usuario en bd
        if ( isNaN( uuid ) ) {
            if ( uuid.includes( '-' ) ) {
                usuario = await Usuario.findByPk( uuid )
                identificador = 'uuid'
            } else {
                usuario = await Usuario.findOne( { where: { tx_indicador: uuid }, include: [ { model: Rol } ] } )
                identificador = 'indicador'
            }
        } else {
            usuario = await Usuario.findOne( { where: { tx_cedula: uuid }, include: [ { model: Rol } ] } )
            identificador = 'cedula'
        }
        if ( !usuario && identificador !== 'uuid' ) { // se busca el usuario en el DA y se agrega a la BD
            usuario = await procesarUsuarioLDAP( buscarPor[ identificador ], uuid ) // busca en el DA y lo registra en BD
        }
        if ( !usuario ) { // si después de todo, todavía no está
            return res.status( 404 ).json( { statusCode: 404, statusText: 'No se encontró al trabajador' } )
        }
        return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: usuario } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar' } )
    }
}

const crearUsuarioEnBD = async ( datos, rol ) => { // AVISO: SI ES SOBREVIVIENTE, FALTA RELACIONAR CON TRABAJADOR
    /*
    datos = {
        tx_nombre: 'Jovana',
        tx_apellido: 'Davalillo',
        tx_cedula: '21489171',
        tx_indicador: 'davalillojp',            (solo si es activo)
        tx_correo: 'davalillojp@pdvsa.com',     (si es activo, indicador; sino, el que el usuario elija)
        tx_correo_alt: 'davalillojp@gmail.com',
        estado: "ACTIVO"                        (Activo: Efectivo Permanente o Activo, Jubilado, Sobreviviente)
    }
    */
    try {
        const usuario = await Usuario.create( datos )
        const rol = await Rol.findOne( { where: { tx_nombre: 'Invitado' } } ) // predeterminado
        await rol.addUsuario( usuario )
        return usuario
    } catch ( error ) {
        console.error( error )
        throw Error( "Error al crear usuario" )
    }
}

const procesarUsuarioLDAP = async ( clave, valor ) => { // busca y crea objeto con datos de usuario para crear en base de datos
    // clave: 'pdvsacom-AD-cedula' para buscar por cédula, 'uid' para buscar por indicador y así...
    const userLDAP = await buscar( clave, valor )
    // console.log( userLDAP )
    // console.log( clave, valor )
    if ( userLDAP ) {
        const datos = {
            tx_nombre: userLDAP.givenName[ 0 ] + userLDAP.givenName.slice( 1 ).toLowerCase(),
            tx_apellido: userLDAP.sn[ 0 ] + userLDAP.sn.slice( 1 ).toLowerCase(),
            tx_cedula: userLDAP[ 'pdvsacom-AD-cedula' ],
            tx_indicador: userLDAP[ 'UID' ].toLowerCase(),
            tx_correo: userLDAP.mail.toLowerCase(),
            tx_correo_alt: userLDAP.otherMailbox && userLDAP.otherMailbox !== 'SINF.' ? userLDAP.otherMailbox.toLowerCase() : null,
            tx_estado: "ACTIVO" // siempre que venga del DA
        }
        try {
            const usuario = await crearUsuarioEnBD( datos )
            if ( usuario ) return usuario
        } catch ( error ) {
            console.error( error )
            throw Error( error )
        }
    }
    return false
}

exports.getSolicitudes = async ( req, res ) => {
    const { uuid } = req.params
    let usuario
    try {
        if ( isNaN( uuid ) ) {
            if ( uuid.includes( '-' ) ) {
                usuario = await Usuario.findByPk( uuid, { include: { model: Solicitud } } )
            } else {
                usuario = await Usuario.findOne( { where: { tx_indicador: uuid }, include: { model: Solicitud } } )
            }
        } else {
            usuario = await Usuario.findOne( { where: { tx_cedula: uuid }, include: { model: Solicitud } } )
        }
        if ( !usuario ) {
            return res.status( 404 ).json( { statusCode: 404, statusText: 'No se encontró al trabajador' } )
        }
        const solicitudes = await usuario.solicituds
        return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: solicitudes } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar' } )
    }
}

exports.switchEstado = async ( req, res ) => {
    const { uuid } = req.params
    try {
        const usuario = await Usuario.findByPk( uuid )
        Usuario.isActive = !usuario.isActive
        await usuario.save()
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}