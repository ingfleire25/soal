
require( 'dotenv' ).config();
const { Sequelize, UUID } = require( 'sequelize' );
const path = require('path');
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;
const sequelize = new Sequelize( `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    logging: false,
    native: false,
    port: DB_PORT,
    define: {
        freezeTableName: true
    }
} );

// require only the simple solicitud model
require( path.join( __dirname, '/models/solicitud' ) )( sequelize );

// Capitalizamos los nombres de los modelos
let entries = Object.entries( sequelize.models );
let capsEntries = entries.map( ( entry ) => [ entry[ 0 ][ 0 ].toUpperCase() + entry[ 0 ].slice( 1 ), entry[ 1 ] ] );
sequelize.models = Object.fromEntries( capsEntries );

// Export models and connection
module.exports = {
    ...sequelize.models,
    conn: sequelize,
};


module.exports = {
    ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
    conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
}
