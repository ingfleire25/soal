const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('WoStatus', {
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    },
    wonum: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true, // Parte de la clave compuesta para Sequelize
      field: 'WONUM'
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true, // Parte de la clave compuesta para Sequelize
      field: 'STATUS'
    },
    changedate: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true, // Parte de la clave compuesta para Sequelize
      field: 'CHANGEDATE'
    },
    changeby: {
      type: DataTypes.STRING(18),
      allowNull: false,
      field: 'CHANGEBY'
    },
    memo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'MEMO'
    },
    glaccount: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: 'GLACCOUNT'
    },
    fincntrlid: {
      type: DataTypes.STRING(8),
      allowNull: true,
      field: 'FINCNTRLID'
    }
  }, {
    // Configuración adicional
    tableName: 'WOSTATUS',
    schema: 'MAXIMO', // Especifica el esquema original de Oracle Maximo
    timestamps: false, // Desactiva createdAt y updatedAt automáticos
    freezeTableName: true, // Evita la pluralización automática de la tabla

    // Mapeo de los índices originales del script DDL
    indexes: [
      {
        name: 'WOSTATRANS_NDX1',
        fields: ['WONUM']
      },
      {
        name: 'WOSTATRANS_NDX2',
        fields: ['STATUS']
      },
      {
        name: 'WOSTATUS_NDX1',
        fields: ['CHANGEDATE', 'WONUM']
      }
    ]
  });
};