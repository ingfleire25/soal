const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pm', {
    pmnum: {
      type: DataTypes.STRING(8),
      primaryKey: true, // Establecido mediante el índice único PM_NDX1
      allowNull: false,
      field: 'PMNUM'
    },
    rowstamp: {
      type: DataTypes.STRING(40),
      allowNull: false,
      field: 'ROWSTAMP'
    },
    description: {
      type: DataTypes.STRING(50),
      field: 'DESCRIPTION'
    },
    eqnum: {
      type: DataTypes.STRING(8),
      field: 'EQNUM'
    },
    firstdate: {
      type: DataTypes.DATE,
      field: 'FIRSTDATE'
    },
    lastcompdate: {
      type: DataTypes.DATE,
      field: 'LASTCOMPDATE'
    },
    laststartdate: {
      type: DataTypes.DATE,
      field: 'LASTSTARTDATE'
    },
    usetargetdate: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'USETARGETDATE'
    },
    lastmeterreading: {
      type: DataTypes.NUMBER(15, 2),
      allowNull: false,
      field: 'LASTMETERREADING'
    },
    lastmeterdate: {
      type: DataTypes.DATE,
      field: 'LASTMETERDATE'
    },
    frequency: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'FREQUENCY'
    },
    meterfrequency: {
      type: DataTypes.NUMBER(15, 2),
      allowNull: false,
      field: 'METERFREQUENCY'
    },
    pmcounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'PMCOUNTER'
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'PRIORITY'
    },
    worktype: {
      type: DataTypes.STRING(5),
      field: 'WORKTYPE'
    },
    jpnum: {
      type: DataTypes.STRING(10),
      field: 'JPNUM'
    },
    jpseqinuse: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'JPSEQINUSE'
    },
    nextdate: {
      type: DataTypes.DATE,
      field: 'NEXTDATE'
    },
    pm17: {
      type: DataTypes.STRING(5),
      allowNull: false,
      field: 'PM17'
    },
    pm18: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'PM18'
    },
    changedate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'CHANGEDATE'
    },
    changeby: {
      type: DataTypes.STRING(18),
      allowNull: false,
      field: 'CHANGEBY'
    },
    pmeq1: {
      type: DataTypes.STRING(1),
      field: 'PMEQ1'
    },
    pm1: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: 'PM1'
    },
    pm2: {
      type: DataTypes.STRING(18),
      allowNull: false,
      field: 'PM2'
    },
    pm3: {
      type: DataTypes.STRING(50),
      field: 'PM3'
    },
    pm4: {
      type: DataTypes.STRING(50),
      field: 'PM4'
    },
    pm5: {
      type: DataTypes.STRING(18),
      allowNull: false,
      field: 'PM5'
    },
    ldkey: {
      type: DataTypes.INTEGER,
      field: 'LDKEY'
    },
    supervisor: {
      type: DataTypes.STRING(12),
      allowNull: false,
      field: 'SUPERVISOR'
    },
    calendar: {
      type: DataTypes.STRING(8),
      field: 'CALENDAR'
    },
    crewid: {
      type: DataTypes.STRING(8),
      field: 'CREWID'
    },
    interruptable: {
      type: DataTypes.STRING(1),
      field: 'INTERRUPTABLE'
    },
    downtime: {
      type: DataTypes.STRING(1),
      field: 'DOWNTIME'
    },
    pm6: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'PM6'
    },
    pm7: {
      type: DataTypes.STRING(50),
      field: 'PM7'
    },
    pm8: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'PM8'
    },
    pm9: {
      type: DataTypes.STRING(50),
      field: 'PM9'
    },
    pm10: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'PM10'
    },
    pmeq2: {
      type: DataTypes.STRING(10),
      field: 'PMEQ2'
    },
    pmeq3: {
      type: DataTypes.STRING(5),
      field: 'PMEQ3'
    },
    pmjp1: {
      type: DataTypes.STRING(1),
      field: 'PMJP1'
    },
    pmjp2: {
      type: DataTypes.STRING(1),
      field: 'PMJP2'
    },
    pmjp3: {
      type: DataTypes.STRING(1),
      field: 'PMJP3'
    },
    pmjp4: {
      type: DataTypes.STRING(1),
      field: 'PMJP4'
    },
    pmjp5: {
      type: DataTypes.STRING(1),
      field: 'PMJP5'
    },
    glaccount: {
      type: DataTypes.STRING(24),
      field: 'GLACCOUNT'
    },
    location: {
      type: DataTypes.STRING(15),
      field: 'LOCATION'
    },
    storeloc: {
      type: DataTypes.STRING(15),
      field: 'STORELOC'
    },
    parent: {
      type: DataTypes.STRING(8),
      field: 'PARENT'
    },
    haschildren: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'HASCHILDREN'
    },
    wosequence: {
      type: DataTypes.INTEGER,
      field: 'WOSEQUENCE'
    },
    usefrequency: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'USEFREQUENCY'
    },
    route: {
      type: DataTypes.STRING(8),
      field: 'ROUTE'
    },
    frequnit: {
      type: DataTypes.STRING(8),
      allowNull: false,
      field: 'FREQUNIT'
    },
    meterfrequency2: {
      type: DataTypes.NUMBER(15, 2),
      allowNull: false,
      field: 'METERFREQUENCY2'
    },
    lastmeterreading2: {
      type: DataTypes.NUMBER(15, 2),
      allowNull: false,
      field: 'LASTMETERREADING2'
    },
    lastmeterdate2: {
      type: DataTypes.DATE,
      field: 'LASTMETERDATE2'
    },
    leadtime: {
      type: DataTypes.INTEGER,
      field: 'LEADTIME'
    },
    extdate: {
      type: DataTypes.DATE,
      field: 'EXTDATE'
    },
    adjnextdue: {
      type: DataTypes.STRING(1),
      field: 'ADJNEXTDUE'
    },
    pm11: {
      type: DataTypes.DATE,
      field: 'PM11'
    },
    pm12: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'PM12'
    },
    pm13: {
      type: DataTypes.STRING(50),
      field: 'PM13'
    },
    pm14: {
      type: DataTypes.STRING(50),
      field: 'PM14'
    },
    pm15: {
      type: DataTypes.STRING(5),
      field: 'PM15'
    },
    pm16: {
      type: DataTypes.STRING(20),
      field: 'PM16'
    },
    masterpm: {
      type: DataTypes.STRING(8),
      field: 'MASTERPM'
    },
    overridemasterupd: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'OVERRIDEMASTERUPD'
    },
    ismasterpm: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'ISMASTERPM'
    },
    masterpmitemnum: {
      type: DataTypes.STRING(30),
      field: 'MASTERPMITEMNUM'
    },
    applymasterpmtoeq: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'APPLYMASTERPMTOEQ'
    },
    applymasterpmtoloc: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'APPLYMASTERPMTOLOC'
    },
    updtimebasedfreq: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'UPDTIMEBASEDFREQ'
    },
    updstartdate: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'UPDSTARTDATE'
    },
    updmeter1: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'UPDMETER1'
    },
    updmeter2: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'UPDMETER2'
    },
    updjpsequence: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'UPDJPSEQUENCE'
    },
    updextdate: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'UPDEXTDATE'
    },
    updseasonaldates: {
      type: DataTypes.STRING(1),
      allowNull: false,
      field: 'UPDSEASONALDATES'
    },
    wostatus: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'WOSTATUS'
    },
    seasonstartday: {
      type: DataTypes.INTEGER,
      field: 'SEASONSTARTDAY'
    },
    seasonstartmonth: {
      type: DataTypes.STRING(16),
      field: 'SEASONSTARTMONTH'
    },
    seasonendday: {
      type: DataTypes.INTEGER,
      field: 'SEASONENDDAY'
    },
    seasonendmonth: {
      type: DataTypes.STRING(16),
      field: 'SEASONENDMONTH'
    },
    pmjp6: {
      type: DataTypes.STRING(1),
      field: 'PMJP6'
    },
    pmjp7: {
      type: DataTypes.STRING(1),
      field: 'PMJP7'
    },
    pmjp8: {
      type: DataTypes.STRING(8),
      field: 'PMJP8'
    },
    pmjp9: {
      type: DataTypes.NUMBER(10, 2),
      field: 'PMJP9'
    },
    pmjp10: {
      type: DataTypes.DATE,
      field: 'PMJP10'
    }
  }, {
    tableName: 'PM',
    schema: 'MAXIMO',
    timestamps: false,
    freezeTableName: true
  });
};