
require( 'dotenv' ).config();
const { Sequelize, UUID } = require( 'sequelize' );
const fs = require( 'fs' );
const path = require( 'path' );


const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;
const sequelize = new Sequelize( `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    // const sequelize = new Sequelize(`${DATABASE_URL}`, {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    port: DB_PORT,
    define: {
        freezeTableName: true,  // Mantiene los nombres definidos en los modelos (no los cambia a plural)
        // timestamps: false    // Comentar si se quieren crear los campos createdAt y updatedAt de forma predeterminada en todas las tablas
    }
} );
const basename = path.basename( __filename );
const modelDefiners = [];
// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync( path.join( __dirname, '/models' ) )
    .filter( ( file ) => ( file.indexOf( '.' ) !== 0 ) && ( file !== basename ) && ( file.slice( -3 ) === '.js' ) )
    .forEach( ( file ) => {
        modelDefiners.push( require( path.join( __dirname, '/models', file ) ) );
    } );
// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach( model => model( sequelize ) );
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries( sequelize.models );
let capsEntries = entries.map( ( entry ) => [ entry[ 0 ][ 0 ].toUpperCase() + entry[ 0 ].slice( 1 ), entry[ 1 ] ] );
sequelize.models = Object.fromEntries( capsEntries );
// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
    Usuario,
    Ua,
    Solicitud,
    Estado,
    Categoria,
    Tipo,
    // Topico,
    Zona,
    Area,
    Localidad,
    Rol
} = sequelize.models

Usuario.belongsToMany( Rol, {
    through: 'rol_usuario',
    foreignKey: 'uuid',
    onUpdate: 'CASCADE',
} )
Rol.belongsToMany( Usuario, {
    through: 'rol_usuario',
    foreignKey: 'rolId',
    onUpdate: 'CASCADE',
} )

Usuario.belongsToMany( Ua, {  // analistas por cait
    through: 'unidad_analista',
    foreignKey: 'analistaId',
    as: 'analistas',
    onUpdate: 'CASCADE',
     targetKey: 'id',
} )
Ua.belongsToMany( Usuario, {
    through: 'unidad_analista',
    as: 'analistas',
    foreignKey: 'uaId',
    onUpdate: 'CASCADE',
    sourceKey: 'id',
} )

Usuario.belongsToMany( Area, {  // supervisores por área
    through: 'area_supervisor',
    foreignKey: 'supervisorId',
    onUpdate: 'CASCADE',
} )
Area.belongsToMany( Usuario, {
    through: 'area_supervisor',
    as: 'supervisores',
    foreignKey: 'areaId',
    onUpdate: 'CASCADE',
} )

Usuario.hasMany( Solicitud, {
    foreignKey: 'analistaId',
    onUpdate: 'CASCADE',
} )
Solicitud.belongsTo( Usuario, {
    foreignKey: 'analistaId',
    as: 'analista',
    onUpdate: 'CASCADE',
} )

Usuario.hasMany( Solicitud, {
    foreignKey: 'solicitanteId',
    onUpdate: 'CASCADE',
} )
Solicitud.belongsTo( Usuario, {
    foreignKey: 'solicitanteId',
    as: 'solicitante',
    onUpdate: 'CASCADE',
} )

Estado.hasMany( Solicitud, {
    foreignKey: 'estadoId',
    onUpdate: 'CASCADE',
} )
Solicitud.belongsTo( Estado, {
    foreignKey: 'estadoId',
    onUpdate: 'CASCADE',
} )

Ua.hasMany( Solicitud, {
    foreignKey: 'uaId',
    onUpdate: 'CASCADE',
} )
Solicitud.belongsTo( Ua, {
    foreignKey: 'uaId',
    onUpdate: 'CASCADE',
} )

Categoria.hasMany( Tipo, {
    foreignKey: 'categoriaId',
    onUpdate: 'CASCADE',
} )
Tipo.belongsTo( Categoria, {
    foreignKey: 'categoriaId',
    onUpdate: 'CASCADE',
} )
// Tipo.hasMany( Topico, {
//     foreignKey: 'tipoId',
//     onUpdate: 'CASCADE',
// } )
// Topico.belongsTo( Tipo, {
//     foreignKey: 'tipoId',
//     onUpdate: 'CASCADE',
// } )

// Topico.belongsToMany( Solicitud, {
//     through: 'topico_solicitud',
//     foreignKey: 'topicoId',
//     onUpdate: 'CASCADE',
// } )
// Solicitud.belongsToMany( Topico, {
//     through: 'topico_solicitud',
//     foreignKey: 'solicitudId',
//     onUpdate: 'CASCADE',
// } )

Tipo.belongsToMany( Solicitud, { // Tipo reemplaza a tópicos por petición del usuario
    through: 'tipo_solicitud',
    foreignKey: 'tipoId',
    onUpdate: 'CASCADE',
} )
Solicitud.belongsToMany( Tipo, {
    through: 'tipo_solicitud',
    foreignKey: 'solicitudId',
    onUpdate: 'CASCADE',
} )

Zona.hasMany( Area, {
    foreignKey: 'zonaId',
    onUpdate: 'CASCADE',
} )
Area.belongsTo( Zona, {
    foreignKey: 'zonaId',
    onUpdate: 'CASCADE',
} )
Area.hasMany( Localidad, {
    foreignKey: 'areaId',
    onUpdate: 'CASCADE',
} )
Localidad.belongsTo( Area, {
    foreignKey: 'areaId',
    onUpdate: 'CASCADE',
} )
Localidad.hasMany( Ua, {
    foreignKey: 'localidadId',
    onUpdate: 'CASCADE',
} )
Ua.belongsTo( Localidad, {
    foreignKey: 'localidadId',
    onUpdate: 'CASCADE',
} )

module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
}
