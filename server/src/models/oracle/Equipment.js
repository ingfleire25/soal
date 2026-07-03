const { DataTypes } = require("sequelize");
// Ajusta la ruta a tu archivo de conexión

module.exports = (sequelize) => {
  return sequelize.define(
    "Equipment",
    {
      rowstamp: {
        type: DataTypes.STRING(40),
        allowNull: false,
        field: "ROWSTAMP",
      },
      eqnum: {
        type: DataTypes.STRING(8),
        primaryKey: true, // Único según EQUIPMENT_NDX1
        allowNull: false,
        field: "EQNUM",
      },
      parent: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "PARENT",
      },
      serialnum: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: "SERIALNUM",
      },
      assetnum: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: "ASSETNUM",
      },
      location: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: "LOCATION",
      },
      description: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "DESCRIPTION",
      },
      vendor: {
        type: DataTypes.STRING(12),
        allowNull: false,
        field: "VENDOR",
      },
      failurecode: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "FAILURECODE",
      },
      manufacturer: {
        type: DataTypes.STRING(12),
        allowNull: true,
        field: "MANUFACTURER",
      },
      purchaseprice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "PURCHASEPRICE",
      },
      replacecost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "REPLACECOST",
      },
      installdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "INSTALLDATE",
      },
      warrantyexpdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WARRANTYEXPDATE",
      },
      meterreading: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: "METERREADING",
      },
      avgmeterunit: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: "AVGMETERUNIT",
      },
      totalcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "TOTALCOST",
      },
      ytdcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "YTDCOST",
      },
      budgetcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "BUDGETCOST",
      },
      classification: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "CLASSIFICATION",
      },
      calnum: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "CALNUM",
      },
      isrunning: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "ISRUNNING",
      },
      itemnum: {
        type: DataTypes.STRING(30),
        allowNull: true,
        field: "ITEMNUM",
      },
      readingdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "READINGDATE",
      },
      unchargedcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "UNCHARGEDCOST",
      },
      totunchargedcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "TOTUNCHARGEDCOST",
      },
      totdowntime: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "TOTDOWNTIME",
      },
      statusdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "STATUSDATE",
      },
      changedate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "CHANGEDATE",
      },
      changeby: {
        type: DataTypes.STRING(18),
        allowNull: false,
        field: "CHANGEBY",
      },

      // Campos de extensión personalizados (EQ1 al EQ24)
      eq1: { type: DataTypes.STRING(15), allowNull: false, field: "EQ1" },
      eq2: { type: DataTypes.STRING(10), allowNull: true, field: "EQ2" },
      eq3: { type: DataTypes.STRING(50), allowNull: true, field: "EQ3" },
      eq4: { type: DataTypes.STRING(10), allowNull: true, field: "EQ4" },
      eq5: { type: DataTypes.DECIMAL(10, 2), allowNull: true, field: "EQ5" },
      eq6: { type: DataTypes.STRING(10), allowNull: true, field: "EQ6" },
      eq7: { type: DataTypes.STRING(1), allowNull: false, field: "EQ7" },
      eq8: { type: DataTypes.STRING(8), allowNull: true, field: "EQ8" },
      eq9: { type: DataTypes.STRING(1), allowNull: true, field: "EQ9" },
      eq10: { type: DataTypes.STRING(10), allowNull: true, field: "EQ10" },
      eq11: { type: DataTypes.STRING(15), allowNull: true, field: "EQ11" },
      eq12: { type: DataTypes.INTEGER, allowNull: true, field: "EQ12" },
      eq13: { type: DataTypes.STRING(15), allowNull: true, field: "EQ13" },
      eq14: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Mapea el DEFAULT SYSDATE de Oracle
        field: "EQ14",
      },
      eq15: { type: DataTypes.STRING(10), allowNull: true, field: "EQ15" },
      eq16: { type: DataTypes.DECIMAL(15, 7), allowNull: true, field: "EQ16" },
      eq17: { type: DataTypes.DECIMAL(15, 7), allowNull: true, field: "EQ17" },
      eq18: { type: DataTypes.STRING(50), allowNull: true, field: "EQ18" },
      eq19: { type: DataTypes.DECIMAL(15, 7), allowNull: true, field: "EQ19" },
      eq20: { type: DataTypes.INTEGER, allowNull: true, field: "EQ20" },
      eq21: { type: DataTypes.DECIMAL(15, 7), allowNull: true, field: "EQ21" },
      eq22: { type: DataTypes.DECIMAL(15, 7), allowNull: true, field: "EQ22" },

      ldkey: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "LDKEY",
      },
      meterreading2: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: "METERREADING2",
      },
      avgmeterunit2: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        field: "AVGMETERUNIT2",
      },
      meterlabel1: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "METERLABEL1",
      },
      meterlabel2: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "METERLABEL2",
      },
      meterunit1: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "METERUNIT1",
      },
      meterunit2: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "METERUNIT2",
      },
      readingdate2: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "READINGDATE2",
      },
      eq23: { type: DataTypes.STRING(10), allowNull: true, field: "EQ23" },
      eq24: { type: DataTypes.STRING(5), allowNull: true, field: "EQ24" },

      priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "PRIORITY",
      },
      invcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "INVCOST",
      },
      glaccount: {
        type: DataTypes.STRING(24),
        allowNull: true,
        field: "GLACCOUNT",
      },
      rotsuspacct: {
        type: DataTypes.STRING(24),
        allowNull: true,
        field: "ROTSUSPACCT",
      },
      children: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "CHILDREN",
      },
      binnum: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "BINNUM",
      },
      disabled: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "DISABLED",
      },
      classstructureid: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "CLASSSTRUCTUREID",
      },
      inheritmeter1chang: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "INHERITMETER1CHANG",
      },
      inheritmeter2chang: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "INHERITMETER2CHANG",
      },
      meter1weightprcnt: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: "METER1WEIGHTPRCNT",
      },
      meter2weightprcnt: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        field: "METER2WEIGHTPRCNT",
      },
      importdeltameter1: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "IMPORTDELTAMETER1",
      },
      importdeltameter2: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "IMPORTDELTAMETER2",
      },
      sourcesysid: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "SOURCESYSid",
      },
      ownersysid: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "OWNERSYSID",
      },
      externalrefid: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "EXTERNALREFID",
      },
    },
    {
      tableName: "EQUIPMENT", // Nombre de la tabla en Oracle
      schema: "MAXIMO", // Ajusta al esquema correcto si difiere
      timestamps: false, // Desactiva createdAt/updatedAt automáticos
      freezeTableName: true,
    },
  );
};
