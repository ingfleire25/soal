const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('modserv', {
        rowstamp: { 
            type: DataTypes.STRING(40), 
            allowNull: false,
            field: 'ROWSTAMP'
        },
        modnum: { 
            type: DataTypes.STRING(4), 
            allowNull: false,
            primaryKey: true,
            field: 'MODNUM'
        },
        description: { 
            type: DataTypes.STRING(50), 
            allowNull: true,
            field: 'DESCRIPTION'
        },
        hours: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            field: 'HOURS'
        },
        days: { 
            type: DataTypes.INTEGER, 
            allowNull: false,
            field: 'DAYS'
        },
        mod1: { 
            type: DataTypes.STRING(1), 
            allowNull: true,
            field: 'MOD1'
        },
        mod2: { 
            type: DataTypes.STRING(1), 
            allowNull: true,
            field: 'MOD2'
        },
        mod3: { 
            type: DataTypes.STRING(1), 
            allowNull: true,
            field: 'MOD3'
        },
        mod4: { 
            type: DataTypes.STRING(1), 
            allowNull: true,
            field: 'MOD4'
        },
        mod5: { 
            type: DataTypes.STRING(1), 
            allowNull: true,
            field: 'MOD5'
        },
        ldkey: { 
            type: DataTypes.INTEGER, 
            allowNull: true,
            field: 'LDKEY'
        }
    }, { 
        timestamps: false,
        tableName: 'MODSERV',
        schema: 'MAXIMO'
    });
};