
// // ACTUALIZACION PARA MANEJAR DOS INSTANCIAS DE BASES DE DATOS POSTGRES Y ORACLE
// // FECHA DE CAMBIO: 03/03/2026

// require('dotenv').config();
// const fs = require('fs');
// const { Sequelize } = require('sequelize');
// const path = require('path');
// const oracledb = require('oracledb');

// // --- CONFIGURACIÓN PARA MODO THICK (ORACLE) ---
// try {
//     oracledb.initOracleClient({ libDir: 'C:\\ORACLE\\instantclient_12_1' }); 
//     console.log("✅ Oracle Client inicializado en modo Thick");
// } catch (err) {
//     console.error("❌ Error al inicializar Oracle Client:", err);
// }

// // Credenciales Postgres
// const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

// // Credenciales Oracle
// const { ORA_USER, ORA_PASSWORD, ORA_HOST, ORA_SERVICE_NAME, ORA_PORT } = process.env;

// /**
//  * INSTANCIA POSTGRESQL C:\ORACLE\instantclient_10_2
//  */
// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
//     logging: false,      
//     native: false,       
//     port: DB_PORT,       
//     define: { freezeTableName: true } 
// });

// /**
//  * INSTANCIA ORACLE
//  */
// const sequelizeOracle = new Sequelize(ORA_SERVICE_NAME, ORA_USER, ORA_PASSWORD, {
//     host: ORA_HOST,
//     port: ORA_PORT, 
//     dialect: 'oracle',
//     /* MODIFICACIÓN: Se añade timezone '-04:00' para sincronizar la hora local de Venezuela 
//        con Sequelize y evitar el desfase automático hacia el formato UTC estándar (Z).
//     */
//     timezone: '-04:00',
//     logging: false,
//     dialectOptions: {
//         connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${ORA_HOST})(PORT=${ORA_PORT}))(CONNECT_DATA=(SERVICE_NAME=${ORA_SERVICE_NAME})))`
//         // connectString: `${ORA_HOST}:${ORA_PORT}/${ORA_SERVICE_NAME}`
//     },
//     define: { freezeTableName: true }
// });

// // --- CARGA AUTOMÁTICA DE MODELOS ---

// // 1. Cargar modelos de Postgres
// const pgModelsPath = path.join(__dirname, '/models/postgres');
// if (fs.existsSync(pgModelsPath)) {
//     fs.readdirSync(pgModelsPath)
//         .filter(file => file.endsWith('.js'))
//         .forEach(file => {
//             require(path.join(pgModelsPath, file))(sequelize);
//         });
// }

// // 2. Cargar modelos de Oracle
// const oraModelsPath = path.join(__dirname, '/models/oracle');
// if (fs.existsSync(oraModelsPath)) {
//     fs.readdirSync(oraModelsPath)
//         .filter(file => file.endsWith('.js'))
//         .forEach(file => {
//             require(path.join(oraModelsPath, file))(sequelizeOracle);
//         });
// }

// // --- ESTANDARIZACIÓN DE NOMBRES (CAPITALIZACIÓN) ---

// // Estandarizar Postgres
// let entries = Object.entries(sequelize.models);
// let capsEntries = entries.map(([name, model]) => [name[0].toUpperCase() + name.slice(1), model]);
// sequelize.models = Object.fromEntries(capsEntries);

// // Estandarizar Oracle
// let oraEntries = Object.entries(sequelizeOracle.models);
// let oraCapsEntries = oraEntries.map(([name, model]) => [name[0].toUpperCase() + name.slice(1), model]);
// sequelizeOracle.models = Object.fromEntries(oraCapsEntries);

// // --- DEFINICIÓN DE ASOCIACIONES ---

// // 1. Relaciones Postgres
// const { SuministroLacustre, Materiales } = sequelize.models;
// if (SuministroLacustre && Materiales) {
//     SuministroLacustre.hasMany(Materiales, { foreignKey: 'suministroLacustreId', as: 'materiales' });
//     Materiales.belongsTo(SuministroLacustre, { foreignKey: 'suministroLacustreId', as: 'suministroLacustre' });
// }

// // 2. Relaciones Oracle (Nueva relación solicitada)
// const { Chartofaccounts, Companies } = sequelizeOracle.models;
// if (Chartofaccounts && Companies) {
//     // Definimos que Chartofaccounts se une a Companies mediante CH3 -> COMPANY
//     Chartofaccounts.belongsTo(Companies, { 
//         foreignKey: 'ch3',    // campo en Chartofaccounts
//         targetKey: 'company',  // campo en Companies
//         as: 'companyData'      // alias para el include
//     });
// }

// // Exportación de modelos y conexiones
// module.exports = {
//     ...sequelize.models,       // Modelos de Postgres  
//     ...sequelizeOracle.models, // Modelos de Oracle
//     conn: sequelize,           // Conexión Postgres
//     connOracle: sequelizeOracle // Conexión Oracle
// };

// ACTUALIZACION PARA MANEJAR DOS INSTANCIAS DE BASES DE DATOS POSTGRES Y ORACLE
// FECHA DE CAMBIO: 03/03/2026

require('dotenv').config();
const fs = require('fs');
const { Sequelize } = require('sequelize');
const path = require('path');
const oracledb = require('oracledb');

// --- CONFIGURACIÓN PARA MODO THICK (ORACLE) ---
try {
    oracledb.initOracleClient({ libDir: 'C:\\ORACLE\\instantclient_12_1' }); 
    console.log("✅ Oracle Client inicializado en modo Thick");
} catch (err) {
    console.error("❌ Error al inicializar Oracle Client:", err);
}

// Credenciales Postgres
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT } = process.env;

// Credenciales Oracle
const { ORA_USER, ORA_PASSWORD, ORA_HOST, ORA_SERVICE_NAME, ORA_PORT } = process.env;

/**
 * INSTANCIA POSTGRESQL C:\ORACLE\instantclient_10_2
 */
const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
    logging: false,      
    native: false,       
    port: DB_PORT,       
    define: { freezeTableName: true } 
});

/**
 * INSTANCIA ORACLE
 */
const sequelizeOracle = new Sequelize(ORA_SERVICE_NAME, ORA_USER, ORA_PASSWORD, {
    host: ORA_HOST,
    port: ORA_PORT, 
    dialect: 'oracle',
    /* MODIFICACIÓN: Se añade timezone '-04:00' para sincronizar la hora local de Venezuela 
       con Sequelize y evitar el desfase automático hacia el formato UTC estándar (Z).
    */
    timezone: '-04:00',
    logging: false,
    dialectOptions: {
        connectString: `(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=${ORA_HOST})(PORT=${ORA_PORT}))(CONNECT_DATA=(SERVICE_NAME=${ORA_SERVICE_NAME})))`
        // connectString: `${ORA_HOST}:${ORA_PORT}/${ORA_SERVICE_NAME}`
    },
    define: { freezeTableName: true }
});

// --- HOOK PARA INICIALIZAR LA SESIÓN EN ORACLE (NLS FORMATS) ---
// Esto soluciona los errores "ORA-01843: not a valid month" lanzados por triggers PL/SQL como WORKORDER_T
sequelizeOracle.addHook('afterConnect', async (connection, config) => {
    try {
        // En Sequelize v6, el objeto 'connection' para Oracle suele ser directamente 
        // el objeto de conexión de 'oracledb'. Sin embargo, para mayor seguridad 
        // y evitar problemas de empaquetado, ejecutamos la query usando el método nativo:
        const nativeConnection = connection.connection || connection;

        const sessionQueries = [
            "ALTER SESSION SET NLS_DATE_FORMAT = 'DD/MM/YYYY'",
            "ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'DD/MM/YYYY HH24:MI:SS'",
            "ALTER SESSION SET NLS_DATE_LANGUAGE = 'SPANISH'"
            // "ALTER SESSION SET NLS_TIMESTAMP_TZ_FORMAT = 'DD/MM/YYYY HH24:MI:SS TZH:TZM'",
        ];

        // Ejecutamos cada alter secuencialmente en la conexión nativa
        for (const query of sessionQueries) {
            await nativeConnection.execute(query);
        }
        
        console.log("✅ Parámetros NLS aplicados con éxito en la sesión de Oracle.");
    } catch (err) {
        console.error("❌ Error al aplicar los parámetros NLS en Oracle:", err.message);
    }
});


// --- CARGA AUTOMÁTICA DE MODELOS ---

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

// --- ESTANDARIZACIÓN DE NOMBRES (CAPITALIZACIÓN) ---

// Estandarizar Postgres
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([name, model]) => [name[0].toUpperCase() + name.slice(1), model]);
sequelize.models = Object.fromEntries(capsEntries);

// Estandarizar Oracle
let oraEntries = Object.entries(sequelizeOracle.models);
let oraCapsEntries = oraEntries.map(([name, model]) => [name[0].toUpperCase() + name.slice(1), model]);
sequelizeOracle.models = Object.fromEntries(oraCapsEntries);

// --- DEFINICIÓN DE ASOCIACIONES ---

// 1. Relaciones Postgres
const { SuministroLacustre, Materiales } = sequelize.models;
if (SuministroLacustre && Materiales) {
    SuministroLacustre.hasMany(Materiales, { foreignKey: 'suministroLacustreId', as: 'materiales' });
    Materiales.belongsTo(SuministroLacustre, { foreignKey: 'suministroLacustreId', as: 'suministroLacustre' });
}

// 2. Relaciones Oracle (Nueva relación solicitada)
const { Chartofaccounts, Companies } = sequelizeOracle.models;
if (Chartofaccounts && Companies) {
    // Definimos que Chartofaccounts se une a Companies mediante CH3 -> COMPANY
    Chartofaccounts.belongsTo(Companies, { 
        foreignKey: 'ch3',    // campo en Chartofaccounts
        targetKey: 'company',  // campo en Companies
        as: 'companyData'      // alias para el include
    });
}

// Exportación de modelos y conexiones
module.exports = {
    ...sequelize.models,       // Modelos de Postgres  
    ...sequelizeOracle.models, // Modelos de Oracle
    conn: sequelize,           // Conexión Postgres
    connOracle: sequelizeOracle // Conexión Oracle
};