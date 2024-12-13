const { Area, Localidad, Usuario, Ua, Solicitud, Rol } = require( '../db' );
// const getAllMethods = require( '../utils/metodosDeClase' )


//----------- GET -----------//
exports.getAll = async ( req, res ) => {
    const { activo } = req.query
    let opt = {
        where: {},
        order: [ [ 'tx_nombre', 'ASC' ] ],
        // include: [ { model: Usuario, as: 'supervisores' }, { model: Localidad } ]
    }
    if ( activo ) {
        opt.where = { ...opt.where, isActive: ( activo === 'true' ) } // vuelve como string de la petición y 'false' da true
    }
    try {
        const areas = await Area.findAll( opt );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: areas } )
    } catch ( error ) {
        console.error( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
exports.getPorId = async ( req, res ) => {
    try {
        const { areaId } = req.params
        const area = await Area.findByPk(
            areaId,
            { include: [ { model: Usuario, as: 'supervisores' } ] }
        )
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: area } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
    }
}
exports.getLocalidades = async ( req, res ) => { // solo las localidades para el formulario de solicitudes
    const { areaId } = req.params
    const { activo } = req.query
    let opt = {
        where: { areaId },
        order: [ [ 'tx_nombre', 'ASC' ] ]
    }
    if ( activo ) {
        opt.where = { ...opt.where, isActive: ( activo === 'true' ) }
    }
    try {
        const localidades = await Localidad.findAll( opt )
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: localidades } )
    } catch ( error ) {
        console.error( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
exports.getSolicitudes = async ( req, res ) => { // devuelve solo las solicitudes del área si el usuario tiene relación con ella
    const { areaId } = req.params
    const indicador = req.indicador // indicador del usuario que hace la solicitud
    let opt = {
        include: [
            { model: Localidad, include: [ { model: Ua, include: [ { model: Solicitud } ] } ] }
        ]
    }
    const rolesUsuario = await Usuario.findOne( {
        where: { tx_indicador: indicador },
        include: [ { model: Rol, attributes: [ 'tx_nombre' ], through: { attributes: [] } } ]
    } )
    const noEsAdmin = rolesUsuario.rols.every( r => r.tx_nombre !== 'Administrador' )
    if ( noEsAdmin ) {
        opt.include.push( { model: Usuario, as: 'supervisores', where: { tx_indicador: indicador } } )
    }
    const area = await Area.findByPk( areaId, opt )
    if ( !area ) return res.status( noEsAdmin ? 401 : 400 ).json( { statusCode: noEsAdmin ? 401 : 400, statusText: "Error al consultar" } )
    return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: area } )
}
exports.getSupervisores = async ( req, res ) => {
    const { areaId } = req.params
    const area = await Area.findByPk( areaId, {
        include: [
            { model: Usuario, as: 'supervisores' }
        ]
    } )
    if ( !area ) return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
    return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: area } )
}
//----------- PUT -----------//
// exports.actualizarArea = async ( req, res ) => {
//     res.send( "todo bien" )
// }
exports.asignarSupervisor = async ( req, res ) => {
    // verificar rol (del asignado, no del autor del cambio - que, se supone, es admin)
    // si es supervisor, no hacer nada
    // si es analista o invitado, remover rol
    // asignar a las UAs hijas
    const { areaId } = req.params
    const { supervisorId } = req.body
    try {
        const area = await Area.findByPk( areaId, { include: [ { model: Localidad, include: [ { model: Ua } ] } ] } )
        await area.addSupervisore( supervisorId ) // la 'e' al final no es un error
        area.localidads.forEach( ( l ) => { // se asigna como analista de las unidades de atención
            l.uas.forEach( async ( ua ) => {
                try {
                    await ua.addAnalista( supervisorId )
                } catch ( error ) {
                    console.error( error )
                }
            } )
        } )
        const supervisor = await Usuario.findByPk( supervisorId )
        const rolSupervisor = await Rol.findOne( { where: { tx_nombre: 'Supervisor' } } )
        const rolInvitado = await Rol.findOne( { where: { tx_nombre: 'Invitado' } } )
        await supervisor.removeRol( rolInvitado )
        await supervisor.addRol( rolSupervisor )
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}
exports.removerSupervisor = async ( req, res ) => {
    const { areaId } = req.params
    const { supervisorId } = req.body
    try {
        const area = await Area.findByPk( areaId, { include: [ { model: Localidad, include: [ { model: Ua } ] } ] } )
        await area.removeSupervisore( supervisorId ) // la 'e' al final no es un error
        area.localidads.forEach( ( l ) => { // se asigna como analista de las unidades de atención
            l.uas.forEach( async ( ua ) => {
                try {
                    await ua.removeAnalista( supervisorId )
                } catch ( error ) {
                    console.error( error )
                }
            } )
        } )
        const esSupervisorEn = await Area.findAll( { include: [ { model: Usuario, as: 'supervisores', where: { uuid: supervisorId } } ] } )
        if ( !esSupervisorEn.length ) { // si no supervisa otra area
            const usuario = await Usuario.findByPk( supervisorId )
            const rolSupervisor = await Rol.findOne( { where: { tx_nombre: 'Supervisor' } } ) // eliminar rol
            const rolInvitado = await Rol.findOne( { where: { tx_nombre: 'Invitado' } } ) // asignar rol de invitado
            await usuario.removeRol( rolSupervisor )
            await usuario.addRol( rolInvitado )
        }
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}
exports.switchEstado = async ( req, res ) => {
    const { areaId } = req.params
    try {
        const area = await Area.findByPk( areaId, {
            include: [ { model: Localidad, include: [ { model: Ua } ] } ]
        } )
        area.isActive = !area.isActive
        await area.save()
        area.localidads.forEach( async ( l ) => { // si area se apaga, sus hijos también. Si area se enciende, no se sabe qué hijos se encienden
            l.isActive = false
            await l.save()
            l.uas.forEach( async ( ua ) => {
                ua.isActive = false
                await ua.save()
            } )
        } )
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}
