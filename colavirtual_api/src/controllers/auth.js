const { validarCredenciales } = require( '../utils/ldap' )
const { Usuario, Rol } = require( '../db' )
const { Op } = require( "sequelize" );
const jwt = require( 'jsonwebtoken' )
require( 'dotenv' ).config()


exports.procesarLogin = async ( req, res ) => {
    const { indicador, contrasena } = req.body
    let usuario
    if ( !indicador || !contrasena ) {
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Indicador y Contraseña son requeridos' } )
    }
    try { // buscar entre los id de rol si el usuario tiene uno válido para iniciar sesión
        const validRoles = await Rol.findAll( { // son 4 roles: 'Invitado', 'Analista', 'Supervisor', 'Administrador'
            where: {
                tx_nombre: {
                    [ Op.ne ]: 'Invitado' // todos, excepto este, son válidos para iniciar sesión
                }
            }
        } )
        usuario = await Usuario.findOne( { // buscar si el usuario si es activo y si tiene un rol valido
            where: {
                tx_indicador: indicador,
                isActive: true
            },
            include: [ {
                model: Rol, where: {
                    rolId: {
                        [ Op.or ]: validRoles.map( rol => rol.rolId )
                    }
                }
            } ]
        } )
        console.log(usuario)
        if ( !usuario ) return res.status( 400 ).json( { statusCode: 400, statusText: 'Usuario no registrado o sin autorización' } )
    } catch ( error ) {
        console.error( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar en Base de Datos' } )
    }
    try {
        await validarCredenciales( indicador, contrasena ) // si no explota, el indicador y contraseña son válidos
    } catch ( error ) {
        console.error( error )
        return res.status( error.statusCode ).json( error )
    }

    if (!usuario.rols || usuario.rols.length === 0) {
            return res.status(403).json({ statusCode: 403, statusText: 'Usuario no tiene roles asignados' });
        }
       // console.log("Roles encontrados:", usuario.rols); // Debug: ver estructura real
            //Respuyesta de este console: 
//             Roles encontrados: [
//   rol {
//     dataValues: {
//       rolId: 'e4ecf29a-17a1-4c27-a37b-c9a619549d9a',
//       co_rol: 1707,
//       tx_nombre: 'Analista',
//       tx_descripcion: null,
//       rol_usuario: [rol_usuario]
//     },
//     _previousDataValues: {
//       rolId: 'e4ecf29a-17a1-4c27-a37b-c9a619549d9a',
//       co_rol: 1707,
//       tx_nombre: 'Analista',
//       tx_descripcion: null,
//       rol_usuario: [rol_usuario]
//     },
//     uniqno: 1,
//     _changed: Set(0) {},
//     _options: {
//       isNewRecord: false,
//       _schema: null,
//       _schemaDelimiter: '',
//       include: [Array],
//       includeNames: [Array],
//       includeMap: [Object],
//       includeValidated: true,
//       raw: true,
//       attributes: undefined
//     },
//     isNewRecord: false,
//     rol_usuario: rol_usuario {
//       dataValues: [Object],
//       _previousDataValues: [Object],
//       uniqno: 1,
//       _changed: Set(0) {},
//       _options: [Object],
//       isNewRecord: false
//     }
//   }
// ]
    // generar token para control de acceso y sesión
    // console.log( "estoy creando tokens para el usuario: ", usuario )
    
    // MODIFICADO PARA PUREBAS LA SING

    // const roles =  usuario.rols.map( r => r.rolId ) // me quedo con los código porque es más fácil luego validar las rutas
    // const co_roles =  usuario.rols.map( r => r.co_rol )
    // const tokenAcceso = jwt.sign(
    //         {
    //             // Estructura simplificada
    //             indicador: usuario.tx_indicador,
    //             roles: roles,
    //             co_roles: co_roles,
    //             // Eliminamos UserInfo para simplificar
    //         },
    //         process.env.ACCESS_TOKEN_SECRET,
    //         { expiresIn: '30m' }
    //     );
    
    const tokenAcceso = jwt.sign(
    {
        indicador: usuario.tx_indicador,
        roles: usuario.rols.map(r => r.rolId),  // UUIDs
        co_roles: usuario.rols.map(r => r.co_rol), // Códigos numéricos
        uuid: usuario.uuid
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '30m' }
);
     
     console.log("Token generado:", tokenAcceso);

        //Respuesta de este console: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmRpY2Fkb3IiOiJmbGVpcmVsIiwicm9sZXMiOlsiZTRlY2YyOWEtMTdhMS00YzI3LWEzN2ItYzlhNjE5NTQ5ZDlhIl0sImNvX3JvbGVzIjpbMTcwN10sImlhdCI6MTc0ODg5MjA1MywiZXhwIjoxNz
//Q4ODkzODUzfQ.k-e55MgGPHUERIiS7RY3_vm2gL8PekbGsUVQpe8ouds 

//DECODIFICACION Y ESTRUCTURA DEL TOKEN DE ACCESO:
// {
//   "indicador": "fleirel",
//   "roles": [
//     "e4ecf29a-17a1-4c27-a37b-c9a619549d9a"
//   ],
//   "co_roles": [
//     1707
//   ],
//   "iat": 1748892053,
//   "exp": 1748893853
// }
   // console.log(co_roles, roles)
    // RESPUESTA DE ESTE CONSOLE: 
    //[ 1707 ] [ 'e4ecf29a-17a1-4c27-a37b-c9a619549d9a' ]

    try {
            const decoded = jwt.verify(tokenAcceso, process.env.ACCESS_TOKEN_SECRET);
            //nsole.log("Token decodificado BACKEND:", decoded);
            // RESPUESTA DE ESTE CONSOLE:
//             Token decodificado BACKEND: {
//   indicador: 'fleirel',
//   roles: [ 'e4ecf29a-17a1-4c27-a37b-c9a619549d9a' ],
//   co_roles: [ 1707 ],
//   iat: 1748892053,
//   exp: 1748893853
// }
        } catch (error) {
            console.error("Error decodificando token:", error);
        }


    const tokenRefrescar = jwt.sign(
        { indicador: usuario.tx_indicador },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    usuario.auth = tokenRefrescar
    await usuario.save()
    // Se crea la cookie que se utilizará en el cliente para refrescar el acceso
    // Durará 1 día. httpOnly es para que no se pueda acceder a ella por javascript
    res.cookie( 'jwt', tokenRefrescar, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 } )
    // return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: { roles, tokenAcceso, co_roles } } )
    return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: {tokenAcceso} } )
}

exports.procesarLogout = async ( req, res ) => { 
    // es necesario borrar el token de acceso en el cliente también
    const cookies = req.cookies
    let usuario
    if ( !cookies ) return res.sendStatus( 204 ) // no hay cookie, no hay problema
    const tokenRefrescar = cookies.jwt
    try {
        // busco el token entre los usuarios
        usuario = await Usuario.findOne( { 
            where: {
                auth: tokenRefrescar
            }
        } )
        if ( !usuario ) { // si el token no está en la db, pero la cookie sí, se borra el token de la cookie
            res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } )
            return res.sendStatus( 204 ) // ya no hay cookie, ya no hay problema
        }
        // si sí está en bd, lo borro
        usuario.auth = null
        await usuario.save()
        // y luego borro la cookie
        res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true } ) // secure: true -> solo para producción
        return res.sendStatus( 204 ) // si cerró sesión, qué le voy a monstar?
    } catch ( error ) {
        console.error( error )
        return res.status( 500 ).json( { statusCode: 500, statusText: 'Error al cerrar sesión' } )
    }
}

// modificado por leonardo Fleire 30/05/25


// Nueva función para manejar la actualización del token de acceso
exports.handleRefreshToken = async (req, res) => {
    const cookies = req.cookies; // Accede a las cookies de la solicitud

    // 1. Verificar si la cookie 'jwt' existe (contiene el refresh token)
    // if (!cookies?.jwt) {
    //     // Si no hay cookie 'jwt', el cliente no está autenticado o la sesión ya expiró
    //     return res.status(401).json({ statusCode: 401, statusText: 'No autorizado: No hay token de refresco' });
    // }
    if (!cookies?.jwt) {
    return res.status(401).json({ 
        statusCode: 401, 
        statusText: 'No hay sesión activa',
        isInitialState: true // Bandera para identificar estado inicial
    });
}
    const refreshToken = cookies.jwt; // Obtiene el token de refresco de la cookie

    let usuario;
    try {
        // 2. Buscar al usuario en la base de datos que tiene este token de refresco guardado
        // Esto valida si el token de refresco es conocido y está activo en tu sistema.
        usuario = await Usuario.findOne({
            where: {
                auth: refreshToken // Campo 'auth' donde se almacena el refresh token en tu modelo Usuario
            },
            include: [{ model: Rol }] // Incluye los roles del usuario para el nuevo Access Token
        });

        // 3. Si no se encuentra un usuario con ese refresh token en la DB
        if (!usuario) {
            // Borrar la cookie del cliente, ya que el token no es válido o ya fue invalidado en el servidor
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.status(403).json({ statusCode: 403, statusText: 'Prohibido: Token de refresco no válido o invalidado' });
        }
        
        if (!usuario.rols || usuario.rols.length === 0) {
            throw new Error("Usuario sin roles");
        }

         const roles = usuario.rols.map(r => r.rolId);
        const co_roles = usuario.rols.map(r => r.co_rol);

        // 4. Verificar el token de refresco (firma y expiración)
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET, // Secreto usado para firmar el refresh token
            async (err, decoded) => { // Usar `async` para poder usar `await` dentro
                // Si hay un error en la verificación (ej. token expirado, firma inválida)
                if (err) {
                    console.error("Error al verificar el refresh token:", err);
                    // Si el token no es válido, invalida también el token en la DB del usuario
                    // Esto evita el uso de tokens comprometidos o ya expirados/revocados.
                    usuario.auth = null;
                    await usuario.save(); // Espera a que se guarde el cambio
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                    return res.status(403).json({ statusCode: 403, statusText: 'Prohibido: Token de refresco expirado o inválido' });
                }

                // 5. Verificar que el indicador decodificado del token coincida con el usuario encontrado en la DB
                if (usuario.tx_indicador !== decoded.indicador) {
                    console.error("Mismatch de indicador entre DB y token decodificado.");
                    // Si el indicador no coincide, podría ser un token comprometido o de otro usuario.
                    // Se invalida el token en DB y se borra la cookie.
                    usuario.auth = null;
                    await usuario.save();
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                    return res.status(403).json({ statusCode: 403, statusText: 'Prohibido: Mismatch de usuario en token de refresco' });
                }

                // 6. Si el token de refresco es válido y el usuario es consistente, genera un nuevo Access Token
              //  const roles = usuario.rols.map(r => r.rolId); // IDs numéricos de los roles
                //const co_roles = usuario.rols.map(r => r.co_rol); // Códigos de los roles (ej. 'ADM', 'SUP')


                 const newAccessToken = jwt.sign(
                    {
                        indicador: usuario.tx_indicador,
                        roles: roles,
                        co_roles: co_roles,
                        uuid: usuario.uuid
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30m' }
                );

                //console.log("Nuevo token generado (refresh):", jwt.decode(newAccessToken));

                // 7. Devuelve el nuevo Access Token y la información de los roles al cliente
                // El cliente usará este `tokenAcceso` para futuras solicitudes autenticadas.
                return res.status(200).json({
                    statusCode: 200,
                    statusText: 'OK',
                    result: {
                        roles,
                        co_roles,
                        tokenAcceso: newAccessToken // Envía el nuevo access token
                    }
                });
            }
        );
    } catch (error) {
        console.error("Error general en handleRefreshToken:", error);
        return res.status(500).json({ statusCode: 500, statusText: 'Error interno del servidor al refrescar token' });
    }
};