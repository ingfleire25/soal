const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Wpmaterial', {
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    },
    wonum: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true,
      field: 'WONUM'
    },
    wpoperation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'WPOPERATION'
    },
    itemnum: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'ITEMNUM'
    },
    location: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'LOCATION'
    },
    itemqty: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'ITEMQTY'
    },
    unitcost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'UNITCOST'
    },
    ldkey: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'LDKEY'
    },
    directreq: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'DIRECTREQ'
    },
    vendor: {
      type: DataTypes.STRING(12),
      allowNull: true,
      field: 'VENDOR'
    },
    requiredate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'REQUIREDATE'
    },
    requestby: {
      type: DataTypes.STRING(18),
      allowNull: true,
      field: 'REQUESTBY'
    },
    pr: {
      type: DataTypes.STRING(8),
      allowNull: true,
      field: 'PR'
    },
    wpm1: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'WPM1'
    },
    wpm2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'WPM2'
    },
    wpm3: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'WPM3'
    },
    wpm4: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'WPM4'
    },
    wpm5: {
      type: DataTypes.STRING(15),
      allowNull: true,
      field: 'WPM5'
    },
    wpm6: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'WPM6'
    },
    prlinenum: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'PRLINENUM'
    },
    unitcosthaschanged: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'UNITCOSTHASCHANGED'
    },
    issueto: {
      type: DataTypes.STRING(12),
      allowNull: true,
      field: 'ISSUETO'
    }
  }, {
    tableName: 'WPMATERIAL',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true
  });
};