const { Zona, Area, Localidad, Ua } = require( '../db' );


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
        const zonas = await Zona.findAll( opt );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: zonas } )
    } catch ( error ) {
        console.error( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
exports.getPorId = async ( req, res ) => {
    try {
        const { zonaId } = req.params
        const zona = await Zona.findByPk(
            zonaId,
            // { include: [ { model: Area, include: [ { model: Localidad, include: [ { model: Ua } ] } ] } ] }
        );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: zona } )
    } catch ( error ) {
        console.error( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
exports.getAreas = async ( req, res ) => {
    const { zonaId } = req.params
    const { activo } = req.query
    let opt = {
        where: { zonaId },
        order: [ [ 'tx_nombre', 'ASC' ] ]
    }
    if ( activo ) {
        opt.where = { ...opt.where, isActive: ( activo === 'true' ) }
    }
    try {
        const areas = await Area.findAll( opt )
        return res.json( { statusCode: 200, statusText: "OK", result: areas } )
    } catch ( error ) {
        console.error( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: "Error en el servidor" } )
    }
}
//----------- PUT -----------//
// exports.actualizarZona = async ( req, res ) => {
//     res.send( "todo bien" )
// }
exports.switchEstado = async ( req, res ) => {
    const { zonaId } = req.params
    try {
        const zona = await Zona.findByPk( zonaId, {
            include: [ { model: Area, include: [ { model: Localidad, include: [ { model: Ua } ] } ] } ]
        } )
        zona.isActive = !zona.isActive
        await zona.save()
        zona.areas.forEach( async ( a ) => { // si zona se apaga, sus hijos también. Si zona se enciende, no se sabe qué hijos se encienden
            a.isActive = false
            await a.save()
            a.localidads.forEach( async ( l ) => {
                l.isActive = false
                await l.save()
                l.uas.forEach( async ( ua ) => {
                    ua.isActive = false
                    await ua.save()
                } )
            } )
        } )
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}