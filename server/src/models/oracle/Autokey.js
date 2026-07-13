const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('AutoKey', {
    tbname: {
      type: DataTypes.STRING(18),
      allowNull: false,
      primaryKey: true, // Asumido como PK debido a su restricción de índice único (AUTOKEY_NDX)
      field: 'TBNAME'
    },
    prefix: {
      type: DataTypes.STRING(8),
      allowNull: true,
      field: 'PREFIX'
    },
    seed: {
      type: DataTypes.BIGINT, // NUMBER en Oracle sin precisión se mapea de forma segura a BIGINT
      allowNull: false,
      field: 'SEED'
    },
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    }
  }, {
    // Configuración adicional
    tableName: 'AUTOKEY',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true,

    // Mapeo del índice único original del script DDL
    indexes: [
      {
        name: 'AUTOKEY_NDX',
        unique: true, // Definido explícitamente como único
        fields: ['TBNAME']
      }
    ]
  });
};