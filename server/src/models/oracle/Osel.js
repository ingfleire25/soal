const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Osel', {
    wonum: {
      type: DataTypes.STRING(10),
      primaryKey: true, // Asumido como identificador principal
      field: 'WONUM'
    },
    description: {
      type: DataTypes.STRING(50),
      field: 'DESCRIPTION'
    },
    worktype: {
      type: DataTypes.STRING(5),
      field: 'WORKTYPE'
    },
    status: {
      type: DataTypes.STRING(10),
      field: 'STATUS'
    },
    glaccount: {
      type: DataTypes.STRING(24),
      field: 'GLACCOUNT'
    },
    worts1: {
      type: DataTypes.STRING(50),
      field: 'WORTS1'
    },
    wol3: {
      type: DataTypes.STRING(50),
      field: 'WOL3'
    },
    req: {
      type: DataTypes.STRING(10),
      field: 'REQ'
    },
    bandera: {
      type: DataTypes.STRING(1),
      field: 'BANDERA'
    },
    correo: {
      type: DataTypes.STRING(50),
      field: 'CORREO'
    },
    pmnum: {
      type: DataTypes.STRING(8),
      field: 'PMNUM'
    }
  }, {
    tableName: 'OSEL',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true
  });
};