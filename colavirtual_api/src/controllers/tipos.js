const { Tipo, Topico } = require( '../db' );


//----------- GET -----------//
exports.getAll = async ( req, res ) => {
    let opt = {
        where: {},
        order: [ [ 'tx_nombre', 'ASC' ] ],
    }
    if ( req.query.activo ) {
        opt.where = { ...opt.where, isActive: ( req.query.activo === 'true' ) }
    }
    try {
        const tipos = await Tipo.findAll( opt );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: tipos } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
    }
}

// exports.getTopicos = async ( req, res ) => {  // removido tópicos
//     try {
//         const { tipoId } = req.params
//         const topicos = await Topico.findAll( { where: { tipoId } } )
//         return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: topicos } )
//     } catch ( error ) {
//         console.error( error )
//         return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
//     }
// }

exports.switchEstado = async ( req, res ) => {
    const { tipoId } = req.params
    try {
        const tipo = await Tipo.findByPk( tipoId )
        tipo.isActive = !tipo.isActive
        await tipo.save()
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}
