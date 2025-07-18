const { Solicitud, Usuario, Tipo, Ua, Estado, Conteo, Categoria, Rol } = require( '../db' )
const { sendEmail, getTemplate } = require( '../utils/nodemailer' )
const moment = require('moment')
const { Op } = require('sequelize');

//----------- GET -----------//
// exports.getAll = async ( req, res ) => {
// //     // si el usuario es analista o supervisor, solo devuelve las solicitudes de las uas asignadas
// //     // si el usuario es admin, devuelve todo
// //     //const indicador = req.indicador //no entiendo porque pide buscar informacion en req.indicador po eso el cambio
// //     const indicador = req.params
     
// //     let opt = {
// //         include: [
// //             { model: Estado },
// //             { model: Tipo, include: [ { model: Categoria } ] },
// //             { model: Usuario, as: 'solicitante' },
// //             { model: Usuario, as: 'analista' },
// //             // { model: Ua } // quitar al terminar la prueba
// //         ]
// //     }
// // //     const rolesUsuario = await Usuario.findOne( {
// // //         where: { tx_indicador: indicador },
// // //         include: [
// // //             { model: Rol, attributes: [ 'tx_nombre', 'uuid' ], through: { attributes: [] } },
// // //             { model: Usuario, as: 'analista' }
// // //         ]
// // //     } )
// // //    // console.log(rolesUsuario())
// // //     const noEsAdmin = rolesUsuario.rols.every( r => r.tx_nombre !== 'Administrador' )
// // //     if ( noEsAdmin ) {
// // //         opt.include.push( { model: Ua, where: { analistaId: rolesUsuario.uuid } } ) // solo traer las solicitudes que tengan asignadas al usuario en su ua
// // //     } else {
// // //         opt.include.push( { model: Ua } ) // si es admin, sin filtro por usuario
// // //     }

// // try {
// //     const solicitudes = await Solicitud.findAll( opt )
// //     //return res.status( 200 ).json( { statusCode: 200, statusText: "OK", result: solicitudes } )
    
// //     if ( !solicitudes ) return res.status( 404 ).json( { statusCode: 404, statusText: 'No se encontró la solicitud' } )
// //         return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: solicitudes } )
// //     } catch ( error ) {
// //         console.log( error )
// //         return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar' } )
// //     }

// //modificado por leonardo fleire 04/06/25
//  const { indicador, co_roles = [] } = req; // Ahora viene del middleware
    
//     let opt = {
//         include: [
//             { model: Estado },
//             { model: Tipo, include: [{ model: Categoria }] },
//             { model: Usuario, as: 'solicitante' },
//             { model: Usuario, as: 'analista' }
//         ]
//     };
// // console.log("Datos recibidos en getAll:", {
// //     indicador: req.indicador,
// //     co_roles: req.co_roles,
// //     roles: req.roles
// // });
//     try {
//         // Si no es admin, filtrar por UA asignada
//          const esAdmin = Array.isArray(co_roles) && co_roles.includes(1709);
//         if (!esAdmin) {
//             const usuario = await Usuario.findOne({
//                 where: { tx_indicador: indicador },
//                 include: [{ model: Ua }]
//             });
            
//             if (usuario && usuario.uas && usuario.uas.length > 0) {
//                 const uaIds = usuario.uas.map(ua => ua.uaId);
//                 opt.include.push({
//                     model: Ua,
//                     where: { uaId: { [Op.in]: uaIds } }
//                 });
//             } else {
//                 return res.status(403).json({ 
//                     statusCode: 403, 
//                     statusText: 'No tienes unidades de atención asignadas' 
//                 });
//             }
//         } else {
//             opt.include.push({ model: Ua });
//         }

//         const solicitudes = await Solicitud.findAll(opt);
//         return res.status(200).json({ 
//             statusCode: 200, 
//             statusText: "OK", 
//             result: solicitudes 
//         });
        
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ 
//             statusCode: 500, 
//             statusText: 'Error al consultar solicitudes' 
//         });
//     }
   
// } 
 // Asegúrate de importar Op de sequelize

exports.getAll = async (req, res) => {
    const { indicador, co_roles = [] } = req;

    let opt = {
        include: [
            { model: Estado },
            { model: Tipo, include: [{ model: Categoria }] },
            { model: Usuario, as: 'solicitante' },
            { model: Usuario, as: 'analista' }
        ],
        order: [['fh_apertura', 'DESC']]
    };

    try {
        const esAdmin = co_roles.includes(1709);
        const esSupervisor = co_roles.includes(3008);
        const esAnalista = co_roles.includes(1707);

        // Si no es ninguno de los roles autorizados, denegar el acceso.
        if (!esAdmin && !esSupervisor && !esAnalista) {
            return res.status(403).json({
                statusCode: 403,
                statusText: 'Acceso denegado: Rol no autorizado'
            });
        }

        // Variable para almacenar los IDs de las UAs si no es administrador
        let uaIds = [];

        // Si no es administrador, necesitamos filtrar por UAs asignadas al usuario
        if (!esAdmin) {
            // Consulta el usuario con sus UAs asignadas usando el alias correcto 'analistas'
            const usuario = await Usuario.findOne({
                where: { tx_indicador: indicador },
                include: [{
                    model: Ua,
                    as: 'analistas', // Usando el alias definido en la relación
                    attributes: ['id', 'tx_nombre']
                }]
            });

            if (!usuario || !usuario.analistas || usuario.analistas.length === 0) {
                return res.status(403).json({
                    statusCode: 403,
                    statusText: 'No tienes unidades de atención asignadas o no se encontró tu usuario.'
                });
            }

            uaIds = usuario.analistas.map(ua => ua.id);

            // Añadir el filtro de UA al objeto de opciones
            // Este filtro se aplicará a todas las solicitudes
            opt.include.push({
                model: Ua,
                where: { id: { [Op.in]: uaIds } },
                required: true // Asegura que solo se devuelvan solicitudes con una UA en la lista
            });

            // Lógica específica para analistas
            if (esAnalista) {
                // Si ya existe un `where` en `opt`, combinamos las condiciones
                // Si no, creamos un nuevo objeto `where`
                opt.where = {
                    ...(opt.where || {}), // Mantiene las condiciones existentes si las hay
                    [Op.or]: [
                        { analistaId: usuario.uuid }, // Solicitudes asignadas directamente al analista
                        { analistaId: null }          // Solicitudes sin analista asignado
                    ]
                };
            }
            // Los supervisores y otros roles no administradores ven todas las solicitudes
            // dentro de sus UAs asignadas sin el filtro adicional de 'analistaId'
            // ya que el filtro de UA ya se ha aplicado.

        } else {
            // Admin ve todo - incluir UAs sin filtro de pertenencia
            opt.include.push({ model: Ua });
        }

        const solicitudes = await Solicitud.findAll(opt);

        return res.status(200).json({
            statusCode: 200,
            statusText: "OK",
            result: solicitudes
        });

    } catch (error) {
        console.error('Error en getAll:', error);

        // Manejar errores específicos de Sequelize
        if (error.name === 'SequelizeEagerLoadingError') {
            return res.status(500).json({
                statusCode: 500,
                statusText: 'Error en las relaciones de la base de datos',
                error: 'Problema con las asociaciones entre modelos. Verifique los alias y las relaciones.'
            });
        }

        // Manejar errores de validación de Sequelize (ej. datos inválidos)
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                statusCode: 400,
                statusText: 'Error de validación',
                error: error.message,
                errors: error.errors.map(err => err.message)
            });
        }

        return res.status(500).json({
            statusCode: 500,
            statusText: 'Error al consultar solicitudes',
            error: error.message
        });
    }
};

 
exports.getPorId = async ( req, res ) => {
    const { solicitudId } = req.params
    try {
        const solicitud = await Solicitud.findByPk( solicitudId, {
            include: [
                { model: Ua }, { model: Estado }, { model: Tipo }, { model: Usuario, as: 'solicitante' }, { model: Usuario, as: 'analista' }
            ]
        } )
        if ( !solicitud ) return res.status( 404 ).json( { statusCode: 404, statusText: 'No se encontró la solicitud' } )
        return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: solicitud } )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar' } )
    }
}

exports.postSolicitud = async ( req, res ) => { // findOrCreate devuelve [{instancia}, si fue creado o no (true o false)]
    const { solicitanteId, tipos, uaId, fh_atencion, correo, correo_alt, localidad } = req.body // pendiente de cómo viene la fecha por fomulario
    if ( !solicitanteId || !tipos.length || ( !uaId || parseInt( uaId ) < 1 ) || !fh_atencion || !correo ) {
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Todos los campos son requeridos' } )
    }
    const ua = await Ua.findByPk( uaId )
    const  solicitudesParaUAyDia = await Conteo.findOrCreate( {
        where: {
            fh_atencion,
            uaId
        },
        attributes: [ 'id', 'cantidad' ] // necesito el id para actualizar
    } )
    const cantidadSolicitudes = solicitudesParaUAyDia[ 0 ].cantidad
    if ( cantidadSolicitudes >= ua.limite_solicitudes ) { // refactor. El usuario debe poder saber cuándo hay citas
        return res.status( 400 ).json( {
            statusCode: 400, statusText: `Cantidad de solicitudes excedido para "${ua.tx_nombre}" en la fecha solicitada (${fh_atencion})`
        } )
    }

    const activo = 1 // para evitar número mágicos
    let solicitud
    const n_ticket = `${fh_atencion.replaceAll( '-', '' )}#${( cantidadSolicitudes + 1 ).toString().padStart( 3, '0' )}`
    try {
        solicitud = await Solicitud.create( {
            estadoId: activo,
            solicitanteId,
            uaId,
            fh_atencion,
            n_ticket
        }, {
            include: [
                { model: Ua }, { model: Estado }, { model: Tipo }, { model: Usuario, as: 'solicitante' }, { model: Usuario, as: 'analista' }
            ]
        } )
    } catch ( error ) {
        console.log( error )
        await solicitud.destroy()
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al crear la solicitud' } )
    }
    try {
        await solicitud.addTipos( tipos )
        solicitudesParaUAyDia[ 0 ].cantidad = cantidadSolicitudes + 1
        await solicitudesParaUAyDia[ 0 ].save()
    } catch ( error ) {
        console.error( error )
        await solicitud.destroy()
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al crear la solicitud' } )
    }
    try {
        let enviados = [ correo ]
        const usuario = await solicitud.getSolicitante()    

        const tiposDeSolicitud = await solicitud.getTipos(); // Utiliza la función de asociación para obtener los tipos
        const nombresTipos = tiposDeSolicitud.map(tipo => tipo.tx_nombre).join(', ')
    

        const mensaje = getTemplate( 'bienvenida', {
            name: await usuario.tx_nombre + " " + usuario.tx_apellido,
            tipos: nombresTipos,
            localidad,
            fecha: moment(solicitud.fh_atencion).format('DD/MM/YYYY'),
            ticket : await solicitud.n_ticket
        })
        await sendEmail( correo, 'prueba', mensaje )
        if ( correo_alt ) {
            await sendEmail( correo_alt, 'prueba', mensaje )
            enviados.push( correo_alt )
        }
        solicitud.enviadoA = enviados
        await solicitud.save()
    } catch ( error ) {
        console.error( error )
        await solicitud.destroy()
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al crear la solicitud' } )
     }
    return res.status( 201 ).json( { statusCode: 201, statusText: 'Solicitud creada con éxito', result: solicitud } )
}

// exports.getSolicitudesPorUsuario = async ( req, res ) => { // en el controlador de usuarios ?
//     return res.send( "getSolicitudesPorUsuario" ) // para solicitantes y analistas
// }

// exports.actualizarSolicitud = async ( req, res ) => {
//     // return res.send( "actualizarSolicitud" )
//     const { solicitudId } = req.params
//     try {
//         const solicitud = await Solicitud.findByPk( solicitudId )
//     } catch ( error ) {
//         console.log( error )
//     }
// }

exports.asignarAnalista = async ( req, res ) => {
    const { solicitudId } = req.params
    const { analistaId } = req.body
    try {
        const ua = await Ua.findOne( {
            include: [ { model: Solicitud, where: { id: solicitudId } } ]
        } )
        // console.log( await ua.hasAnalista( analistaId ) )
        if ( await ua.hasAnalista( analistaId ) ) {
            try {
                await Solicitud.update( {
                    analistaId: analistaId,
                    fh_asignacion: new Date() // formatear a zona horaria local
                },
                    { where: { id: solicitudId } }
                )
                return res.sendStatus( 204 )
            } catch ( error ) {
                console.log( error )
                return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar la solicitud' } )
            }
        }
        return res.status( 400 ).json( { statusCode: 400, statusText: 'El analista no pertenece a la Unidad de Atención a la que pertenece la solicitud' } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar la solicitud' } )
    }

}

exports.actualizarEstado = async ( req, res ) => {
    const { solicitudId } = req.params
    const { estado } = req.body
    try {
        const solicitud = await Solicitud.findByPk( solicitudId )
        await solicitud.setEstado( estado )
        return res.sendStatus( 204 )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al actualizar' } )
    }
}
