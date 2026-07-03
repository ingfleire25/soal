const { DataTypes } = require('sequelize');

module.exports = (sequelize) => { 
  return sequelize.define('Item', {
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    },
    itemnum: {
      type: DataTypes.STRING(30),
      allowNull: false,
      primaryKey: true, // Usualmente ITEMNUM es la PK en Maximo
      field: 'ITEMNUM'
    },
    description: {
      type: DataTypes.STRING(80),
      field: 'DESCRIPTION'
    },
    rotating: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'ROTATING'
    },
    stocktype: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'STOCKTYPE'
    },
    lottype: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'LOTTYPE'
    },
    capitalized: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'CAPITALIZED'
    },
    msdsnum: {
      type: DataTypes.STRING(10),
      field: 'MSDSNUM'
    },
    outside: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'OUTSIDE'
    },
    ldkey: {
      type: DataTypes.DECIMAL, // NUMBER(*,0) se mapea mejor como DECIMAL o INTEGER
      field: 'LDKEY'
    },
    // Campos de extensión IN1 - IN27
    in1: { type: DataTypes.STRING(10), field: 'IN1' },
    in2: { type: DataTypes.STRING(10), field: 'IN2' },
    in3: { type: DataTypes.STRING(10), field: 'IN3' },
    in4: { type: DataTypes.STRING(10), field: 'IN4' },
    in5: { type: DataTypes.STRING(10), field: 'IN5' },
    in6: { type: DataTypes.STRING(10), field: 'IN6' },
    in7: { type: DataTypes.STRING(10), field: 'IN7' },
    in8: { type: DataTypes.STRING(10), field: 'IN8' },
    in9: { type: DataTypes.DECIMAL(10, 2), field: 'IN9' },
    in10: { type: DataTypes.DATE, field: 'IN10' },
    in11: { type: DataTypes.DECIMAL(15, 2), field: 'IN11' },
    in12: { type: DataTypes.DECIMAL(15, 2), field: 'IN12' },
    in13: { type: DataTypes.STRING(10), field: 'IN13' },
    in14: { type: DataTypes.DECIMAL, field: 'IN14' },
    in15: { type: DataTypes.STRING(1), field: 'IN15' },
    in16: { type: DataTypes.DATE, field: 'IN16' },
    in17: { type: DataTypes.STRING(15), field: 'IN17' },
    in18: { type: DataTypes.STRING(50), field: 'IN18' },
    in19: { type: DataTypes.STRING(10), field: 'IN19' },
    in20: { type: DataTypes.STRING(10), field: 'IN20' },
    in21: { type: DataTypes.STRING(10), field: 'IN21' },
    in22: { type: DataTypes.DATE, field: 'IN22' },
    in23: { type: DataTypes.DECIMAL(15, 2), field: 'IN23' },
    in24: { type: DataTypes.STRING(1), field: 'IN24' },
    in25: { type: DataTypes.STRING(1), field: 'IN25' },
    in26: { type: DataTypes.STRING(1), field: 'IN26' },
    in27: { type: DataTypes.STRING(1), field: 'IN27' },
    // Códigos de impuestos
    tax1code: { type: DataTypes.STRING(8), field: 'TAX1CODE' },
    tax2code: { type: DataTypes.STRING(8), field: 'TAX2CODE' },
    tax3code: { type: DataTypes.STRING(8), field: 'TAX3CODE' },
    tax4code: { type: DataTypes.STRING(8), field: 'TAX4CODE' },
    tax5code: { type: DataTypes.STRING(8), field: 'TAX5CODE' },
    // Otros campos
    sparepartautoadd: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'SPAREPARTAUTOADD'
    },
    hazardid: { type: DataTypes.STRING(8), field: 'HAZARDID' },
    classstructureid: { type: DataTypes.STRING(8), field: 'CLASSSTRUCTUREID' },
    inspectionrequired: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'INSPECTIONREQUIRED'
    },
    sourcesysid: { type: DataTypes.STRING(10), field: 'SOURCESYSID' },
    ownersysid: { type: DataTypes.STRING(10), field: 'OWNERSYSID' },
    externalrefid: { type: DataTypes.STRING(10), field: 'EXTERNALREFID' },
    apiseq: { type: DataTypes.STRING(50), field: 'APISEQ' },
    interid: { type: DataTypes.STRING(50), field: 'INTERID' },
    migchangeid: { type: DataTypes.STRING(50), field: 'MIGCHANGEID' },
    sendersysid: { type: DataTypes.STRING(50), field: 'SENDERSYSID' }
  }, {
    tableName: 'ITEM',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true
  });
};



// [
//   {
//     "itemnum": "0008",
//     "description": "BOYA   #08",
//     "stocktype": "BOYA"
//   },