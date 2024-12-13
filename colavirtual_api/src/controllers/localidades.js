const { Localidad, Ua } = require( '../db' );


//----------- GET -----------//
exports.getAll = async ( req, res ) => {
    const { activo } = req.query
    let opt = {
        where: {},
        order: [ [ 'tx_nombre', 'ASC' ] ]
    }
    if ( activo ) {
        opt.where = { ...opt.where, isActive: ( activo === 'true' ) }
    }
    try {
        const localidades = await Localidad.findAll( opt )
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: localidades } )
    } catch ( error ) {
        console.log( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
exports.getPorId = async ( req, res ) => {
    try {
        const { localidadId } = req.params
        const localidad = await Localidad.findByPk(
            localidadId, { include: [ { model: Ua } ] }
        );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: localidad } )
    } catch ( error ) {
        console.log( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
exports.getUAs = async ( req, res ) => {
    const { localidadId } = req.params
    const { activo } = req.query
    let opt = {
        where: { localidadId },
        order: [ [ 'tx_nombre', 'ASC' ] ]
    }
    if ( activo ) {
        opt.where = { ...opt.where, isActive: ( activo === 'true' ) }
    }
    try {
        const uas = await Ua.findAll( opt )
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: uas } )
    } catch ( error ) {
        console.log( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
// exports.actualizarLocalidad = async ( req, res ) => {
//     res.send( "todo bien" )
// }

exports.switchEstado = async ( req, res ) => {
    const { localidadId } = req.params
    try {
        const localidad = await Localidad.findByPk( localidadId, {
            include: [ { model: Ua } ]
        } )
        localidad.isActive = !localidad.isActive
        await localidad.save()
        localidad.uas.forEach( async ( ua ) => { // si localidad se apaga, sus hijos también. Si localidad se enciende, no se sabe qué hijos se encienden
            ua.isActive = false
            await ua.save()
        } )
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}
