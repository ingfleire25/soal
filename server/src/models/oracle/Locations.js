const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('locations', {
        // --- LLAVE PRIMARIA ---
        location: {
            type: DataTypes.STRING(15),
            allowNull: false,
            primaryKey: true, // En Maximo, 'LOCATION' identifica el registro único
            field: 'LOCATION'
        },
        // --- CAMPOS OBLIGATORIOS (NOT NULL) ---
        rowstamp: {
            type: DataTypes.STRING(40),
            allowNull: false,
            field: 'ROWSTAMP'
        },
        type: {
            type: DataTypes.STRING(15),
            allowNull: false,
            field: 'TYPE'
        },
        changeby: {
            type: DataTypes.STRING(18),
            allowNull: false,
            field: 'CHANGEBY'
        },
        changedate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'CHANGEDATE'
        },
        // --- DESCRIPCIÓN Y CLAVES ---
        description: {
            type: DataTypes.STRING(50),
            allowNull: true,
            field: 'DESCRIPTION'
        },
        ldkey: {
            type: DataTypes.INTEGER,
            field: 'LDKEY'
        },
        // --- CUENTAS CONTABLES (GL ACCOUNTS) ---
        controlacc: { type: DataTypes.STRING(24), field: 'CONTROLACC' },
        glaccount: { type: DataTypes.STRING(24), field: 'GLACCOUNT' },
        purchvaracc: { type: DataTypes.STRING(24), field: 'PURCHVARACC' },
        invoicevaracc: { type: DataTypes.STRING(24), field: 'INVOICEVARACC' },
        curvaracc: { type: DataTypes.STRING(24), field: 'CURVARACC' },
        shrinkageacc: { type: DataTypes.STRING(24), field: 'SHRINKAGEACC' },
        invcostadjacc: { type: DataTypes.STRING(24), field: 'INVCOSTADJACC' },
        receiptvaracc: { type: DataTypes.STRING(24), field: 'RECEIPTVARACC' },
        oldcontrolacc: { type: DataTypes.STRING(24), field: 'OLDCONTROLACC' },
        oldshrinkageacc: { type: DataTypes.STRING(24), field: 'OLDSHRINKAGEACC' },
        oldinvcostadjacc: { type: DataTypes.STRING(24), field: 'OLDINVCOSTADJACC' },
        // --- CAMPOS PERSONALIZADOS (LO1 - LO15) ---
        lo1: { type: DataTypes.DECIMAL(15, 3), field: 'LO1' },
        lo2: { type: DataTypes.DECIMAL(15, 3), field: 'LO2' },
        lo3: { type: DataTypes.STRING(10), field: 'LO3' },
        lo4: { type: DataTypes.STRING(50), field: 'LO4' },
        lo5: { type: DataTypes.DECIMAL(10, 2), field: 'LO5' },
        lo6: { type: DataTypes.DECIMAL(10, 2), field: 'LO6' },
        lo7: { type: DataTypes.INTEGER, field: 'LO7' },
        lo8: { type: DataTypes.INTEGER, field: 'LO8' },
        lo9: { type: DataTypes.INTEGER, field: 'LO9' },
        lo10: { type: DataTypes.INTEGER, field: 'LO10' },
        lo11: { type: DataTypes.STRING(50), field: 'LO11' },
        lo12: { type: DataTypes.INTEGER, field: 'LO12' },
        lo13: { type: DataTypes.STRING(1), field: 'LO13' },
        lo14: { type: DataTypes.DATE, field: 'LO14' },
        lo15: { type: DataTypes.STRING(15), field: 'LO15' },
        // --- OTROS ATRIBUTOS ---
        disabled: { type: DataTypes.STRING(1), field: 'DISABLED' },
        classstructureid: { type: DataTypes.STRING(8), field: 'CLASSSTRUCTUREID' },
        gisparam1: { type: DataTypes.STRING(10), field: 'GISPARAM1' },
        gisparam2: { type: DataTypes.STRING(3), field: 'GISPARAM2' },
        gisparam3: { type: DataTypes.STRING(1), field: 'GISPARAM3' },
        // --- IDENTIFICADORES DE SISTEMA E INTEGRACIÓN ---
        sourcesysid: { type: DataTypes.STRING(10), field: 'SOURCESYSID' },
        ownersysid: { type: DataTypes.STRING(10), field: 'OWNERSYSID' },
        externalrefid: { type: DataTypes.STRING(10), field: 'EXTERNALREFID' },
        apiseq: { type: DataTypes.STRING(50), field: 'APISEQ' },
        interid: { type: DataTypes.STRING(50), field: 'INTERID' },
        migchangeid: { type: DataTypes.STRING(50), field: 'MIGCHANGEID' },
        sendersysid: { type: DataTypes.STRING(50), field: 'SENDERSYSID' }
    }, {
        timestamps: false,     // Importante: No existen columnas createdAt/updatedAt
        tableName: 'LOCATIONS',
        schema: 'MAXIMO'        // Tu esquema de Oracle
    });
};