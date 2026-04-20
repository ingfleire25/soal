const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Chartofaccounts', {
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    },
    glaccount: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: 'GLACCOUNT'
    },
    glcomp01: { type: DataTypes.STRING(24), field: 'GLCOMP01' },
    glcomp02: { type: DataTypes.STRING(24), field: 'GLCOMP02' },
    glcomp03: { type: DataTypes.STRING(24), field: 'GLCOMP03' },
    glcomp04: { type: DataTypes.STRING(24), field: 'GLCOMP04' },
    glcomp05: { type: DataTypes.STRING(24), field: 'GLCOMP05' },
    glcomp06: { type: DataTypes.STRING(24), field: 'GLCOMP06' },
    glcomp07: { type: DataTypes.STRING(24), field: 'GLCOMP07' },
    glcomp08: { type: DataTypes.STRING(24), field: 'GLCOMP08' },
    glcomp09: { type: DataTypes.STRING(24), field: 'GLCOMP09' },
    glcomp10: { type: DataTypes.STRING(24), field: 'GLCOMP10' },
    glcomp11: { type: DataTypes.STRING(24), field: 'GLCOMP11' },
    glcomp12: { type: DataTypes.STRING(24), field: 'GLCOMP12' },
    glcomp13: { type: DataTypes.STRING(24), field: 'GLCOMP13' },
    glcomp14: { type: DataTypes.STRING(24), field: 'GLCOMP14' },
    glcomp15: { type: DataTypes.STRING(24), field: 'GLCOMP15' },
    glcomp16: { type: DataTypes.STRING(24), field: 'GLCOMP16' },
    glcomp17: { type: DataTypes.STRING(24), field: 'GLCOMP17' },
    glcomp18: { type: DataTypes.STRING(24), field: 'GLCOMP18' },
    glcomp19: { type: DataTypes.STRING(24), field: 'GLCOMP19' },
    glcomp20: { type: DataTypes.STRING(24), field: 'GLCOMP20' },
    accountname: { type: DataTypes.STRING(50), field: 'ACCOUNTNAME' },
    glacctype: { type: DataTypes.STRING(3), field: 'GLACCTYPE' },
    ch1: { type: DataTypes.DATE, field: 'CH1' },
    ch2: { type: DataTypes.DATE, field: 'CH2' },
    ch3: { type: DataTypes.STRING(18), field: 'CH3' },
    ch4: { type: DataTypes.DECIMAL(15, 2), field: 'CH4' },
    ch5: { type: DataTypes.DECIMAL, field: 'CH5' },
    disabled: { type: DataTypes.STRING(1), allowNull: false, field: 'DISABLED' },
    ldkey: { type: DataTypes.DECIMAL, field: 'LDKEY' },
    sourcesysid: { type: DataTypes.STRING(10), field: 'SOURCESYSID' },
    ownersysid: { type: DataTypes.STRING(10), field: 'OWNERSYSID' },
    externalrefid: { type: DataTypes.STRING(10), field: 'EXTERNALREFID' },
    apiseq: { type: DataTypes.STRING(50), field: 'APISEQ' },
    interid: { type: DataTypes.STRING(50), field: 'INTERID' },
    migchangeid: { type: DataTypes.STRING(50), field: 'MIGCHANGEID' },
    sendersysid: { type: DataTypes.STRING(50), field: 'SENDERSYSID' }
  }, {
    tableName: 'CHARTOFACCOUNTS',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true
  });
};
