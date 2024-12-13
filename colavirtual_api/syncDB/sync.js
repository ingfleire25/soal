
const { conn } = require( '../src/db.js' )
const { Estado, Zona, Area, Localidad, Ua, Categoria, Tipo, Topico, Usuario, Rol } = require( '../src/db' )
const { zonas } = require( './Zonas' )
const { areas } = require( './Areas' )
const { localidades } = require( './Localidades' )
const { unidades } = require( './Unidades' )
const { tipos } = require( './Tipos' )
const { roles } = require( './Roles' )

conn.sync( { force: true } ).then( async () => {
    const estados = [
        { tx_nombre: 'Abierto', tx_color: '#fa4d56' },   // rojo - ¡alerta! este ticket necesita atención
        { tx_nombre: 'En Proceso', tx_color: '#ff832b' }, // naranja - el analista necesita de procesos externos para cerrar
        { tx_nombre: 'Relacionado', tx_color: '#f1c21b' }, // amarillo - la solicitud necesita de entidades externas para ser cerrada
        { tx_nombre: 'Cerrado', tx_color: '#42be65' }, // verde - procesado (success)
        { tx_nombre: 'Anulado', tx_color: '#8d8d8d' }    // gris
    ]
    const categorias = [
        { tx_nombre: 'CAIT' },
        { tx_nombre: 'CAIJ' },
        { tx_nombre: 'UNIDAD DE GESTIÓN' } // para personal interno (privado)
    ]
    // const tipos = [
    //     { tx_nombre: 'Tipo 1', categoriaId: 1 },
    //     { tx_nombre: 'Tipo 2', categoriaId: 2 },
    //     { tx_nombre: 'Tipo 3', categoriaId: 3 }
    // ]
    // const topicos = [
    //     { tx_nombre: 'Tipificación 1', tipoId: 1 },
    //     { tx_nombre: 'Tipificación 2', tipoId: 1 },
    //     { tx_nombre: 'Tipificación 3', tipoId: 1 },
    //     { tx_nombre: 'Tipificación 4', tipoId: 1 },
    //     { tx_nombre: 'Tipificación 5', tipoId: 1 },
    //     { tx_nombre: 'Tipificación 6', tipoId: 1 },
    //     { tx_nombre: 'Tipificación 1', tipoId: 2 },
    //     { tx_nombre: 'Tipificación 2', tipoId: 2 },
    //     { tx_nombre: 'Tipificación 6', tipoId: 2 },
    //     { tx_nombre: 'Tipificación 1', tipoId: 3 },
    //     { tx_nombre: 'Tipificación 2', tipoId: 3 },
    //     { tx_nombre: 'Tipificación 3', tipoId: 3 },
    //     { tx_nombre: 'Tipificación 4', tipoId: 3 },
    // ]
    // const roles = [
    //     { tx_nombre: 'Invitado', co_rol: 1802 },
    //     { tx_nombre: 'Analista', co_rol: 1707 },
    //     { tx_nombre: 'Supervisor', co_rol: 3008 },
    //     { tx_nombre: 'Administrador', co_rol: 1709 } ]
    const users = [
        // const user = 
        {
            tx_nombre: "Guillermo",
            tx_apellido: "Morillo",
            tx_cedula: "16234442",
            tx_indicador: "morillogk",
            tx_correo: "morillogk@pdvsa.com",
            tx_estado: "ACTIVO"
        },
        {
            tx_nombre: "Jovana",
            tx_apellido: "Davalillo",
            tx_cedula: "21489171",
            tx_indicador: "davalillojp",
            tx_correo: "davalillojp@pdvsa.com",
            tx_estado: "ACTIVO"
            // tx_correo_alt: "davalillojp@gmail.com"
        },
        {
            tx_nombre: "Usuario",
            tx_apellido: "De Prueba 1",
            tx_cedula: "12345678",
            tx_indicador: "userprueba1",
            tx_correo: "userprueba1@pdvsa.com",
            tx_estado: "ACTIVO"
        },
        {
            tx_nombre: "Usuario",
            tx_apellido: "De Prueba 2",
            tx_cedula: "00000000",
            tx_indicador: "userprueba2",
            tx_correo: "userprueba2@pdvsa.com",
            tx_estado: "ACTIVO"
            // tx_correo_alt: "davalillojp@gmail.com"
        },
        {
            tx_nombre: "Usuario",
            tx_apellido: "De Prueba 3",
            tx_cedula: "87654321",
            tx_indicador: "userprueba3",
            tx_correo: "userprueba3@pdvsa.com",
            tx_estado: "ACTIVO"
        },
        {
            tx_nombre: "Usuario",
            tx_apellido: "De Prueba 4",
            tx_cedula: "11111111",
            tx_indicador: "userprueba4",
            tx_correo: "userprueba4@pdvsa.com",
            tx_estado: "ACTIVO"
            // tx_correo_alt: "davalillojp@gmail.com"
        }
    ]
    try {
        await Estado.bulkCreate( estados ) // ESTADO DE LA SOLICITUD
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Estados de solicitud sincronizados' )
    }
    try {
        // await Zona.bulkCreate( zonas )
        zonas.forEach( async ( i ) => {
            await Zona.create( {
                tx_nombre: i.tx_ubicacion_interna,
                co_ubicacion_interna: i.co_ubicacion_interna,
                isActive: i.in_logica ? true : false
            } )
        } )
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Zonas sincronizadas' )
    }
    try {
        // await Area.bulkCreate( areas )
        areas.forEach( async ( i ) => {
            try {
                const area = await Area.create( {
                    tx_nombre: i.tx_ubicacion_interna,
                    co_ubicacion_interna: i.co_ubicacion_interna,
                    isActive: i.in_logica ? true : false
                } )
                const zona = await Zona.findOne( { where: { co_ubicacion_interna: parseInt( i.co_ubicacion_interna_padre ) } } )
                await area.setZona( zona )
            } catch ( error ) {
                console.log( error )
                console.log( `Problema al crear el área ${i.co_ubicacion_interna}` )
            }
        } )
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Áreas sincronizadas' )
    }
    try {
        // await Localidad.bulkCreate( localidades )
        localidades.forEach( async ( i ) => {
            try {
                const localidad = await Localidad.create( {
                    tx_nombre: i.tx_ubicacion_interna,
                    co_ubicacion_interna: i.co_ubicacion_interna,
                    isActive: i.in_logica ? true : false
                } )
                const area = await Area.findOne( { where: { co_ubicacion_interna: parseInt( i.co_ubicacion_interna_padre ) } } )
                await localidad.setArea( area )
            } catch ( error ) {
                console.log( error )
                console.log( `Problema al crear la localidad ${i.co_ubicacion_interna}` )
            }
        } )
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Localidades sincronizadas' )
    }
    try {
        // await Ua.bulkCreate( unidades )
        unidades.forEach( async ( i ) => {
            try {
                const unidad = await Ua.create( {
                    tx_nombre: i.tx_ubicacion_interna,
                    co_ubicacion_interna: i.co_ubicacion_interna,
                    isActive: i.in_logica ? true : false
                } )
                const localidad = await Localidad.findOne( { where: { co_ubicacion_interna: parseInt( i.co_ubicacion_interna_padre ) } } )
                await unidad.setLocalidad( localidad )
            } catch ( error ) {
                console.log( error )
                console.log( `Problema al crear la unidad ${i.co_ubicacion_interna}` )
            }
        } )
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Unidades de atención sincronizadas' )
    }
    try {
        await Categoria.bulkCreate( categorias )
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Categorías sincronizadas' )
    }
    try {
        await Tipo.bulkCreate( tipos )
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Tipos sincronizados' )
    }
    // try {
    //     await Topico.bulkCreate( topicos )
    // } catch ( error ) {
    //     console.log( error )
    // } finally {
    //     console.log( 'Tópicos sincronizados' )
    // }
    try {
        await Usuario.bulkCreate( users )
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Usuarios de prueba creados' )
    }
    try {
        await Rol.bulkCreate( roles )
    } catch ( error ) {
        console.log( error )
    } finally {
        console.log( 'Roles creados' )
    }
} ).catch( e => {
    console.log( 'Error al sincronizar: ', e )
} ).finally( () => {
    console.log( 'Fin de la sincronización' )
} )