const { Topico } = require( '../db' );


//----------- GET -----------//
exports.getAll = async ( req, res ) => {
    try {
        const topicos = await Topico.findAll( { order: [ [ 'tx_nombre', 'ASC' ] ], where: { isActive: true } } );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: topicos } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
    }
}

exports.switchEstado = async ( req, res ) => {
    const { topicoId } = req.params
    try {
        const topico = await Topico.findByPk( topicoId )
        topico.isActive = !topico.isActive
        await topico.save()
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}