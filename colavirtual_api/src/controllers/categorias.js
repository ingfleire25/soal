const { Categoria, Tipo } = require( '../db' );


//----------- GET -----------//
exports.getAll = async ( req, res ) => {
    try {
        const categorias = await Categoria.findAll( { order: [ [ 'tx_nombre', 'ASC' ] ] } );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: categorias } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
    }
}
exports.getById = async ( req, res ) => {
    const { categoriaId } = req.params
    try {
        const categorias = await Categoria.findByPk( categoriaId );
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: [ categorias ] } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
    }
}

exports.getTipos = async ( req, res ) => {
    const { categoriaId } = req.params
    let opt = {
        where: { categoriaId },
        order: [ [ 'tx_nombre', 'ASC' ] ]
    }
    if ( req.query.activo ) {
        opt.where = { ...opt.where, isActive: ( req.query.activo === 'true' ) }
    }
    try {
        const tipos = await Tipo.findAll( opt )
        return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: tipos } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: "Error al consultar" } )
    }
}
