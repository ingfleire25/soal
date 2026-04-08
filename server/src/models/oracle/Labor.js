const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Labor', {
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    },
    laborcode: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true, // Clave primaria típica en Maximo
      field: 'LABORCODE'
    },
    craft: {
      type: DataTypes.STRING(12),
      field: 'CRAFT'
    },
    calnum: {
      type: DataTypes.STRING(8),
      field: 'CALNUM'
    },
    quantity: {
      type: DataTypes.NUMBER,
      allowNull: false,
      field: 'QUANTITY'
    },
    name: {
      type: DataTypes.STRING(50),
      field: 'NAME'
    },
    address1: {
      type: DataTypes.STRING(36),
      field: 'ADDRESS1'
    },
    address2: {
      type: DataTypes.STRING(36),
      field: 'ADDRESS2'
    },
    address3: {
      type: DataTypes.STRING(36),
      field: 'ADDRESS3'
    },
    phonenum: {
      type: DataTypes.STRING(20),
      field: 'PHONENUM'
    },
    payrate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'PAYRATE'
    },
    otscale: {
      type: DataTypes.DECIMAL(8, 3),
      allowNull: false,
      field: 'OTSCALE'
    },
    birthdate: {
      type: DataTypes.DATE,
      field: 'BIRTHDATE'
    },
    reportedhrs: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'REPORTEDHRS'
    },
    ytdothrs: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'YTDOTHRS'
    },
    ytdhrsrefused: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'YTDHRSREFUSED'
    },
    lastevaldate: {
      type: DataTypes.DATE,
      field: 'LASTEVALDATE'
    },
    nextevaldate: {
      type: DataTypes.DATE,
      field: 'NEXTEVALDATE'
    },
    skill: {
      type: DataTypes.STRING(50),
      field: 'SKILL'
    },
    hiredate: {
      type: DataTypes.DATE,
      field: 'HIREDATE'
    },
    iscraft: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'ISCRAFT'
    },
    // Campos de extensión (LA1 - LA10)
    la1: { type: DataTypes.STRING(10), field: 'LA1' },
    la2: { type: DataTypes.STRING(1), field: 'LA2' },
    la3: { type: DataTypes.STRING(1), field: 'LA3' },
    la4: { type: DataTypes.STRING(10), field: 'LA4' },
    la5: { type: DataTypes.STRING(10), field: 'LA5' },
    la6: { type: DataTypes.STRING(18), field: 'LA6' },
    la7: { type: DataTypes.STRING(10), field: 'LA7' },
    la8: { type: DataTypes.STRING(10), field: 'LA8' },
    la9: { type: DataTypes.STRING(50), field: 'LA9' },
    la10: { type: DataTypes.STRING(1), field: 'LA10' },
    
    ldkey: {
      type: DataTypes.NUMBER,
      field: 'LDKEY'
    },
    outside: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'OUTSIDE'
    },
    availfactor: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      field: 'AVAILFACTOR'
    },
    crewid: {
      type: DataTypes.STRING(8),
      field: 'CREWID'
    },
    address4: {
      type: DataTypes.STRING(36),
      field: 'ADDRESS4'
    },
    // Campos de extensión (LA11 - LA20)
    la11: { type: DataTypes.STRING(10), field: 'LA11' },
    la12: { type: DataTypes.STRING(10), field: 'LA12' },
    la13: { type: DataTypes.DECIMAL(15, 2), field: 'LA13' },
    la14: { type: DataTypes.STRING(10), field: 'LA14' },
    la15: { type: DataTypes.DATE, field: 'LA15' },
    la16: { type: DataTypes.STRING(8), field: 'LA16' },
    la17: { type: DataTypes.STRING(50), field: 'LA17' },
    la18: { type: DataTypes.STRING(8), field: 'LA18' },
    la19: { type: DataTypes.STRING(50), field: 'LA19' },
    la20: { type: DataTypes.STRING(20), field: 'LA20' },

    callid: {
      type: DataTypes.STRING(20),
      field: 'CALLID'
    },
    type: {
      type: DataTypes.STRING(10),
      field: 'TYPE'
    },
    worklocation: {
      type: DataTypes.STRING(15),
      field: 'WORKLOCATION'
    },
    storelocation: {
      type: DataTypes.STRING(15),
      field: 'STORELOCATION'
    },
    glaccount: {
      type: DataTypes.STRING(24),
      field: 'GLACCOUNT'
    },
    controlacc: {
      type: DataTypes.STRING(24),
      field: 'CONTROLACC'
    },
    vendor: {
      type: DataTypes.STRING(12),
      field: 'VENDOR'
    },
    disabled: {
      type: DataTypes.STRING(1),
      field: 'DISABLED'
    },
    serviceprovider: {
      type: DataTypes.STRING(12),
      field: 'SERVICEPROVIDER'
    },
    pagepin: {
      type: DataTypes.STRING(50),
      field: 'PAGEPIN'
    },
    pagemethod: {
      type: DataTypes.STRING(16),
      field: 'PAGEMETHOD'
    },
    pagingavailability: {
      type: DataTypes.STRING(16),
      field: 'PAGINGAVAILABILITY'
    },
    wopriority: {
      type: DataTypes.NUMBER,
      field: 'WOPRIORITY'
    },
    supervisor: {
      type: DataTypes.STRING(12),
      field: 'SUPERVISOR'
    },
    delegate: {
      type: DataTypes.STRING(12),
      field: 'DELEGATE'
    },
    shiptolocation: {
      type: DataTypes.STRING(12),
      field: 'SHIPTOLOCATION'
    },
    favmrnum: {
      type: DataTypes.STRING(8),
      field: 'FAVMRNUM'
    },
    droppoint: {
      type: DataTypes.STRING(12),
      field: 'DROPPOINT'
    },
    wfmailelection: {
      type: DataTypes.STRING(15),
      field: 'WFMAILELECTION'
    },
    acceptingwfmail: {
      type: DataTypes.STRING(1),
      field: 'ACCEPTINGWFMAIL'
    },
    defaultstoreloc: {
      type: DataTypes.STRING(15),
      field: 'DEFAULTSTORELOC'
    },
    sourcesysid: {
      type: DataTypes.STRING(10),
      field: 'SOURCESYSID'
    },
    ownersysid: {
      type: DataTypes.STRING(10),
      field: 'OWNERSYSID'
    },
    externalrefid: {
      type: DataTypes.STRING(10),
      field: 'EXTERNALREFID'
    },
    browserinbox: {
      type: DataTypes.STRING(1),
      field: 'BROWSERINBOX'
    },
    // Campos de extensión finales (LA21 - LA25)
    la21: { type: DataTypes.STRING(10), field: 'LA21' },
    la22: { type: DataTypes.STRING(10), field: 'LA22' },
    la23: { type: DataTypes.STRING(10), field: 'LA23' },
    la24: { type: DataTypes.STRING(10), field: 'LA24' },
    la25: { type: DataTypes.STRING(10), field: 'LA25' },

    pcardnum: {
      type: DataTypes.STRING(30),
      field: 'PCARDNUM'
    },
    pcardtype: {
      type: DataTypes.STRING(20),
      field: 'PCARDTYPE'
    },
    pcardexpdate: {
      type: DataTypes.STRING(7),
      field: 'PCARDEXPDATE'
    },
    pcardverification: {
      type: DataTypes.STRING(4),
      field: 'PCARDVERIFICATION'
    },
    transemailelection: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'TRANSEMAILELECTION'
    },
    interid: {
      type: DataTypes.STRING(50),
      field: 'INTERID'
    }
  }, {
    tableName: 'LABOR',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true
  });
};