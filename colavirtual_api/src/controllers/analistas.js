const { Ua, Usuario, Rol } = require ( '../db' )


exports.getAll = async ( req, res ) => {
    try {
        const analistas = await Usuario.findAll( {
            include: [
                { model: Rol, where: { tx_nombre: 'Analista' } },
                { model: Ua }
            ]
        } )
        return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: analistas } )
    } catch ( error ) {

    }
}

exports.getUas = async ( req, res ) => {
    const { analistaId } = req.params
    try {
        const uas = await Ua.findAll( { where: { analistaId } } )
        return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: uas } )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar' } )
    }
}