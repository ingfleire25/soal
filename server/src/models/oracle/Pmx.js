const { DataTypes } = require("sequelize");
// const sequelize = require('../../db'); // Ajusta la ruta a tu conexión de base de datos

module.exports = (sequelize) => {
  return sequelize.define(
  "Pmx", {
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: "ROWSTAMP",
    },
    pmnum: {
      type: DataTypes.STRING(8),
      primaryKey: true, // Se define como Primary Key porque posee el índice Único en BD
      allowNull: false,
      field: "PMNUM",
    },
    description: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "DESCRIPTION",
    },

    // Matriz Dinámica Dinámica 1 al 10 (Generada ordenadamente)
    glaccount1: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT1",
    },
    company1: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY1",
    },
    rate1: { type: DataTypes.INTEGER, allowNull: true, field: "RATE1" },

    glaccount2: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT2",
    },
    company2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY2",
    },
    rate2: { type: DataTypes.INTEGER, allowNull: true, field: "RATE2" },

    glaccount3: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT3",
    },
    company3: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY3",
    },
    rate3: { type: DataTypes.INTEGER, allowNull: true, field: "RATE3" },

    glaccount4: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT4",
    },
    company4: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY4",
    },
    rate4: { type: DataTypes.INTEGER, allowNull: true, field: "RATE4" },

    glaccount5: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT5",
    },
    company5: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY5",
    },
    rate5: { type: DataTypes.INTEGER, allowNull: true, field: "RATE5" },

    glaccount6: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT6",
    },
    company6: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY6",
    },
    rate6: { type: DataTypes.INTEGER, allowNull: true, field: "RATE6" },

    glaccount7: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT7",
    },
    company7: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY7",
    },
    rate7: { type: DataTypes.INTEGER, allowNull: true, field: "RATE7" },

    glaccount8: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT8",
    },
    company8: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY8",
    },
    rate8: { type: DataTypes.INTEGER, allowNull: true, field: "RATE8" },

    glaccount9: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT9",
    },
    company9: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY9",
    },
    rate9: { type: DataTypes.INTEGER, allowNull: true, field: "RATE9" },

    glaccount10: {
      type: DataTypes.STRING(24),
      allowNull: true,
      field: "GLACCOUNT10",
    },
    company10: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: "COMPANY10",
    },
    rate10: { type: DataTypes.INTEGER, allowNull: true, field: "RATE10" },

    // Totales, banderas e IDs internos
    totalrate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "TOTALRATE",
    },
    serv1: { type: DataTypes.STRING(1), allowNull: true, field: "SERV1" },
    serv2: { type: DataTypes.STRING(1), allowNull: true, field: "SERV2" },
    serv3: { type: DataTypes.STRING(1), allowNull: true, field: "SERV3" },
    serv4: { type: DataTypes.STRING(1), allowNull: true, field: "SERV4" },
    serv5: { type: DataTypes.STRING(1), allowNull: true, field: "SERV5" },
    ldkey: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "LDKEY",
    },
  },
  {
    tableName: "PMX", // Forzar nombre exacto de la tabla en Oracle
    schema: "MAXIMO", // Apuntar al esquema correspondiente
    timestamps: false, // Evita que busque de forma automática createdAt y updatedAt
    freezeTableName: true, // Previene que Sequelize pluralice el nombre de la tabla
  });
}

