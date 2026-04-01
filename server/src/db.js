// ACTUALIZACION PARA MANEJAR DOS INSTANCIAS DE BASES DE DATOS POSTGRES Y ORACLE
// FECHA DE CAMBIO: 03/03/2026

// Carga las variables de entorno desde el archivo .env a process.env
require( 'dotenv' ).config();

// Importa Sequelize para el ORM y UUID por si se necesita en las definiciones
const fs = require('fs');
const { Sequelize, UUID } = require( 'sequelize' );
const path = require('path');
const oracledb = require('oracledb');


// --- CONFIGURACIÓN PARA MODO THICK (NECESARIA PARA VERSIONES ANTIGUAS) ---
try {
    // Aquí pones la ruta exacta donde descomprimiste el Instant Client
    oracledb.initOracleClient({ libDir: 'C:\\ORACLE\\instantclient' }); 
    console.log("✅ Oracle Client inicializado en modo Thick");
} catch (err) {
    console.error("❌ Error al inicializar Oracle Client:", err);
    // Si ya estaba inicializado, el error se puede ignorar
}

// ... después sigue tu código de Sequelize normal

// Credenciales para PostgreSQL
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

// --- NUEVO: Credenciales para Oracle ---
// Asegúrate de tener estas variables en tu archivo .env
const { ORA_USER, ORA_PASSWORD, ORA_HOST, ORA_SERVICE_NAME, ORA_PORT } = process.env;

/**
 * Configuración de la instancia de Sequelize para PostgreSQL
 */
const sequelize = new Sequelize( `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    logging: false,      
    native: false,       
    port: DB_PORT,       
    define: {
        freezeTableName: true 
    } 
} );

/**
 * NUEVO: Configuración de la instancia de Sequelize para Oracle
 * Se utiliza el dialecto 'oracle'. Importante: Requiere instalar la librería 'oracledb'.
 */

// console.log("Intentando conectar a:", ORA_HOST, ORA_PORT, ORA_SERVICE_NAME);
const sequelizeOracle = new Sequelize(ORA_SERVICE_NAME, ORA_USER, ORA_PASSWORD, {
    host: ORA_HOST,
    port: ORA_PORT, 
    dialect: 'oracle',
    logging: false,
    dialectOptions: {
       
        // connectString: `${ORA_HOST}:${ORA_PORT || 1521}/${ORA_SERVICE_NAME}` 
        connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${ORA_HOST})(PORT=${ORA_PORT}))(CONNECT_DATA=(SID=${ORA_SERVICE_NAME})))`
    },
    define: {
        freezeTableName: true // Mantenemos la consistencia de no pluralizar tablas
    }
});

// Importa y define el modelo 'solicitud' pasándole la instancia de sequelize (Postgres)
//require( path.join( __dirname, '/models/solicitud' ) )( sequelize );

// NUEVO: Aquí podrías importar modelos específicos para Oracle
//require( path.join( __dirname, '/models/modserv' ) )( sequelizeOracle );


//codigo inteligente para leer las carpetas de modelos y cargar automáticamente cada modelo en su respectiva instancia de Sequelize
// 1. Cargar modelos de Postgres
const pgModelsPath = path.join(__dirname, '/models/postgres');
if (fs.existsSync(pgModelsPath)) {
    fs.readdirSync(pgModelsPath)
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            require(path.join(pgModelsPath, file))(sequelize);
        });
}

// 2. Cargar modelos de Oracle
const oraModelsPath = path.join(__dirname, '/models/oracle');
if (fs.existsSync(oraModelsPath)) {
    fs.readdirSync(oraModelsPath)
        .filter(file => file.endsWith('.js'))
        .forEach(file => {
            require(path.join(oraModelsPath, file))(sequelizeOracle);
        });
}
 
/**
 * Estandarización de nombres de modelos (Postgres):
 */
let entries = Object.entries( sequelize.models );
let capsEntries = entries.map( ( entry ) => [ entry[ 0 ][ 0 ].toUpperCase() + entry[ 0 ].slice( 1 ), entry[ 1 ] ] );
sequelize.models = Object.fromEntries( capsEntries );

/**
 * NUEVO: Estandarización de nombres de modelos (Oracle):
 * Aplicamos la misma lógica de capitalización para los modelos de Oracle.
 */
let oraEntries = Object.entries( sequelizeOracle.models );
let oraCapsEntries = oraEntries.map( ( entry ) => [ entry[ 0 ][ 0 ].toUpperCase() + entry[ 0 ].slice( 1 ), entry[ 1 ] ] );
sequelizeOracle.models = Object.fromEntries( oraCapsEntries );

// Exportación de los modelos y las conexiones
module.exports = {
    ...sequelize.models,       // Modelos de Postgres  
    ...sequelizeOracle.models, // Modelos de Oracle
    conn: sequelize,           // Conexión principal Postgres
    connOracle: sequelizeOracle // Nueva conexión Oracle
};