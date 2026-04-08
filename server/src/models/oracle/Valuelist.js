const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ValueList', {
    // Definición de columnas basada en tu DDL
    listname: {
      type: DataTypes.STRING(18),
      allowNull: false,
      primaryKey: true, // Sequelize requiere una PK; ajusta si es compuesta con 'value'
      field: 'LISTNAME' // Nombre exacto en la BD
    },
    value: {
      type: DataTypes.STRING(25),
      allowNull: false,
      primaryKey: true, // Definido como PK si es parte de una clave compuesta
      field: 'VALUE'
    },
    maxvalue: {
      type: DataTypes.STRING(25),
      field: 'MAXVALUE'
    },
    valdesc: {
      type: DataTypes.STRING(30),
      field: 'VALDESC'
    },
    defaults: {
      type: DataTypes.STRING(1),
      field: 'DEFAULTS'
    },
    type: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'TYPE'
    },
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    }
  }, {
    // Configuración adicional
    tableName: 'VALUELIST',
    schema: 'MAXIMO', // Muy importante: especifica el esquema
    timestamps: false, // Desactiva createdAt y updatedAt
    freezeTableName: true // Evita que Sequelize pluralice el nombre
  });
};