
// Carga las variables de entorno desde el archivo .env a process.env
require( 'dotenv' ).config();

// Importa Sequelize para el ORM y UUID por si se necesita en las definiciones
const { Sequelize, UUID } = require( 'sequelize' );
const path = require('path');

// Desestructuración de las credenciales de la base de datos desde las variables de entorno
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

/**
 * Configuración de la instancia de Sequelize
 * Se utiliza un Template String para construir la URL de conexión a PostgreSQL
 */
const sequelize = new Sequelize( `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    logging: false,      // Desactiva los logs de SQL en la consola para mantenerla limpia
    native: false,       // Desactiva el uso de la librería nativa de pg (Postgres)
    port: DB_PORT,       // Define el puerto de conexión (usualmente 5432)
    define: {
        freezeTableName: true // Evita que Sequelize pluralice automáticamente los nombres de las tablas
    }
} );

// Importa y define el modelo 'solicitud' pasándole la instancia de sequelize
require( path.join( __dirname, '/models/solicitud' ) )( sequelize );

/**
 * Estandarización de nombres de modelos:
 * Este bloque recorre todos los modelos definidos y se asegura de que 
 * la primera letra del nombre esté en mayúscula (ej: 'solicitud' -> 'Solicitud').
 */
let entries = Object.entries( sequelize.models );
let capsEntries = entries.map( ( entry ) => [ entry[ 0 ][ 0 ].toUpperCase() + entry[ 0 ].slice( 1 ), entry[ 1 ] ] );
sequelize.models = Object.fromEntries( capsEntries );

// Exportación de los modelos y de la conexión (conn) para usarlos en el resto de la App
module.exports = {
    ...sequelize.models, // Esparce los modelos (ej: Solicitud) como propiedades individuales
    conn: sequelize,     // Exporta la instancia de conexión para sincronizar la base de datos
};