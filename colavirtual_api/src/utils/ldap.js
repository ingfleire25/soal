const ldap = require( 'ldapjs' );


const conectar = () => {
    return new Promise( ( resolve, reject ) => {
        const client = ldap.createClient( { // crear cliente solo cuando necesite conectarme por ldap
            url: 'ldap://167.134.177.66' //ORIGINAL
           //url: 'ldap://10.121.101.201'
            //url: 'ldap://10.121.101.103' //PRUEBA 2
            //mbocpe101.pdvsa.com --> servidor alterno para acceso al DA
        } )
        client.on( 'connect', conn => {
            // console.log( "Entramos" )
            client.bind( "", "", function ( err ) { // con esto "inicio sesión" para buscar en el D.A.
                if ( err ) {
                    return reject( `Error al bindear: ${err}` )
                }
            } )
            return resolve( client )
        } )
        // Evento de error genérico, para detalles de los otros eventos, consultar documentación ldapjs
        client.on( 'error', err => {
            // console.log( err )
            return reject( err.code );
        } );
    } )
}

exports.buscar = async ( key, value ) => {
    // const key = 'pdvsacom-AD-cedula' para buscar por cédula, 'uid' para buscar por indicador y así...
    // const value = '21489171', davalillojp y así...
    return new Promise( async ( resolve, reject ) => {
        let client
        try {
            client = await conectar()
        } catch ( error ) {
            // console.log( "Error con: ", error )
            return reject( "Error al intentar conexión con Directorio Activo" )
        }
        const opts = {
            filter: `(${key}=${value})`,
            scope: 'sub',
            // attributes: [ 'dn', 'sn', 'cn' ]
        };
        client.search( 'ou=Usuarios,dc=pdvsa,dc=com', opts, ( err, res ) => {
            let user
            if ( err ) return reject( "Error al buscar: ", err );
            res.on( 'searchEntry', ( entry ) => {
                user = entry.object
                // return resolve( entry.object ) // si el usuario no existe, no "termina" la promesa. Se pasa a 'end'
            } );
            res.on( 'error', ( err ) => {
                // console.error( 'error: ' + err.message );
                return reject( "Error al consultar en el Directorio Activo" )
            } );
            res.on( 'end', ( result ) => {
                // console.log( 'status: ' + result.status );
                // console.log( 'status: ' + result );
                // console.log( user.dn )
                return resolve( user )
            } );
        } );
    } )
}

exports.validarCredenciales = async ( indicador, contrasena ) => {
    return new Promise( async ( resolve, reject ) => {
        let client
        try {
            client = await conectar()
        } catch ( error ) {
            console.log( error )
            return reject( { statusCode: 500, statusText: "Error al intentar conexión con el Directorio Activo" } )
        }
        const opts = {
            filter: `(uid=${indicador})`,
            scope: 'sub',
            // attributes: [ 'dn', 'sn', 'cn' ]
        };
        client.search( 'ou=Usuarios,dc=pdvsa,dc=com', opts, ( err, res ) => {
            let user
            if ( err ) return reject( "Error al buscar: ", err );
            res.on( 'searchEntry', ( entry ) => {
                user = entry.object
            } );
            res.on( 'error', ( err ) => {
                console.error( err )
                return reject( { statusCode: 500, statusText: "Error al consultar en el Directorio Activo" } )
            } );
            res.on( 'end', ( result ) => {
                // console.log( 'status: ' + result.status )
                client.bind( user.dn, contrasena, function ( err ) { // con esto "inicio sesión" utilizando el dn
                    if ( err ) {
                        console.error( err )
                        return reject( { statusCode: 409, statusText: `Credenciales inválidas` } )
                    }
                    return resolve( { statusCode: 200, statusText: `Usuario validado` } )
                } )
            } );
        } );
    } )
}


//servidor de guillermo: http://10.114.31.192:8000/api/ldapUsers/ para usuarios