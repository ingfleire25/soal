const { Rol } = require( '../db' )
const { Op } = require( "sequelize" );


const verificarRoles = ( ...rolesPermitidos ) => { // verifica con id del rol, no con el código
//     return async ( req, res, next ) => {
//         if ( !req?.roles ) return res.sendStatus( 401 )
//         const rolesUsuario = req.roles
//         const roles = await Rol.findAll( { // recupero los roles validos de entre los existentes
//             where: {
//                 tx_nombre: {
//                     [ Op.or ]: [ ...rolesPermitidos ]
//                 }
//             }
//         } )
//         let rolValido
//         const rolesIds = roles.map( rol => rol.rolId )
//         // evalúo si entre los ids de roles válidos está el del usuario (con 1 true es suficiente)
//         for ( let i of rolesIds ) {
//             for ( let j of rolesUsuario ) {
//                 if ( j === i ) {
//                     rolValido = true
//                     break
//                 }
//             }
//         }
//         if ( !rolValido ) return res.sendStatus( 401 ) // si no hay roles válido, se bloquea la entrada
//         next()
//     }
// }

    return async (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        
        // Convertir nombres de roles a IDs (ajusta según tu DB)
        const roleIds = {
            'Analista': 1707,
            'Supervisor': 3008,
            'Administrador': 1709
        };
        
        const requiredIds = rolesPermitidos.map(name => roleIds[name]);
        const hasRole = req.roles.some(roleId => requiredIds.includes(roleId));
        
        if (!hasRole) return res.sendStatus(401);
        next();
    };
};
module.exports = verificarRoles