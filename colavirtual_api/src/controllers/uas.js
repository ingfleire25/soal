const { Ua, Usuario, Solicitud, Rol } = require( '../db' );
const getAllMethods = require( '../utils/metodosDeClase' )


//----------- GET -----------//
exports.getAll = async ( req, res ) => {
    const { activo } = req.query
    let opt = {
        where: {},
        order: [ [ 'tx_nombre', 'ASC' ] ],
        include: [ { model: Solicitud } ]
    }
    if ( activo ) {
        opt.where = { ...opt.where, isActive: ( activo === 'true' ) }
    }
    try {
        const uas = await Ua.findAll( opt );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: uas } )
    } catch ( error ) {
        console.log( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
exports.getPorId = async ( req, res ) => { // si supervisor, solo las suyas; si admin, todas
    try {
        const { uaId } = req.params
        const ua = await Ua.findByPk(
            uaId, {
            include: [ { model: Solicitud }, { model: Usuario, as: 'analistas' } ]
        }
        )
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: ua } )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
    }
}

exports.getAnalistas = async ( req, res ) => { // controlador aparte?
    const { uaId } = req.params
    try {
        const ua = await Ua.findByPk( uaId, {
            include: [ { model: Usuario, as: 'analistas' } ]
        } )
        if ( !ua ) return res.status( 404 ).json( { statusCode: 404, statusText: "No se encontró la Unidad de Atención" } )
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: ua.analistas } )
    } catch ( error ) {

    }
}

exports.getSolicitudes = async ( req, res ) => { // controlador aparte?
    const { uaId } = req.params
    // const indicador = req.indicador
    try {
        // const rolesUsuario = await Usuario.findOne( {
        //     where: { tx_indicador: indicador },
        //     include: [ { model: Rol, attributes: [ 'tx_nombre' ], through: { attributes: [] } } ]
        // } )
        // const noEsAdmin = rolesUsuario.rols.every( r => r.tx_nombre !== 'Administrador' )
        // if ( noEsAdmin ) {
        //     opt.include.push( { model: Usuario, as: 'supervisores', where: { tx_indicador: indicador } } )
        // }
        const ua = await Ua.findByPk( uaId, {
            include: [ { model: Solicitud, include: [ { model: Usuario, as: 'solicitante' }, { model: Usuario, as: 'analista' } ] } ]
        } )
        if ( !ua ) return res.status( 404 ).json( { statusCode: 404, statusText: "No se encontró la Unidad de Atención" } )
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: ua.solicituds } )
    } catch ( error ) {

    }
}

//----------- PUT -----------//
exports.asignarAnalista = async ( req, res ) => {
    // verificar rol (analista id, no el autenticado)
    // si ya existe, verificar si es de invitado
    // si es de invitado, borrar
    // asignar rol de analista
    // si no es invitado,mantener rol
    const { uaId } = req.params
    const { analistaId } = req.body
    try {
        const ua = await Ua.findByPk( uaId )
        // console.log( getAllMethods( ua ) )
        await ua.addAnalista( analistaId )
        const analista = await Usuario.findByPk( analistaId )
        const rolAnalista = await Rol.findOne( { where: { tx_nombre: 'Analista' } } )
        const rolInvitado = await Rol.findOne( { where: { tx_nombre: 'Invitado' } } )
        await analista.removeRol( rolInvitado )
        await analista.addRol( rolAnalista )
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}
exports.removerAnalista = async ( req, res ) => {
    // verificar rol (analista id, no el autenticado)
    // si ya existe, verificar si es de invitado
    // si es de invitado, borrar
    // asignar rol de analista
    // si no es invitado,mantener rol
    const { uaId } = req.params
    const { analistaId } = req.body
    try {
        const ua = await Ua.findByPk( uaId )
        // console.log( getAllMethods( ua ) )
        await ua.removeAnalista( analistaId ) // falta validar que no fuera su última ua
        // const analista = await Usuario.findByPk( analistaId )
        // const rolAnalista = await Rol.findOne( { where: { tx_nombre: 'Analista' } } )
        // const rolInvitado = await Rol.findOne( { where: { tx_nombre: 'Invitado' } } )
        // await analista.removeRol( rolInvitado )
        // await analista.addRol( rolAnalista )
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}
exports.switchEstado = async ( req, res ) => {
    const { uaId } = req.params
    try {
        const ua = await Ua.findByPk( uaId )
        // console.log( getAllMethods( ua ) )
        ua.isActive = !ua.isActive
        await ua.save()
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}