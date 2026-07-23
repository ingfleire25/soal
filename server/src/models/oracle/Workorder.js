const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "WorkOrder",
    {
      rowstamp: {
        type: DataTypes.STRING(40),
        allowNull: false,
        field: "ROWSTAMP",
      },
      wonum: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true, // Clave primaria principal en Maximo
        field: "WONUM",
      },
      parent: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "PARENT",
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "STATUS",
      },
      statusdate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "STATUSDATE",
      },
      worktype: {
        type: DataTypes.STRING(5),
        allowNull: false,
        field: "WORKTYPE",
      },
      leadcraft: {
        type: DataTypes.STRING(12),
        allowNull: true,
        field: "LEADCRAFT",
      },
      description: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "DESCRIPTION",
      },
      eqnum: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "EQNUM",
      },
      location: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: "LOCATION",
      },
      jpnum: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "JPNUM",
      },
      faildate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "FAILDATE",
      },
      changeby: {
        type: DataTypes.STRING(18),
        allowNull: true,
        field: "CHANGEBY",
      },
      changedate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "CHANGEDATE",
      },
      estdur: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "ESTDUR",
      },
      estlabhrs: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "ESTLABHRS",
      },
      estmatcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "ESTMATCOST",
      },
      estlabcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "ESTLABCOST",
      },
      esttoolcost: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        field: "ESTTOOLCOST",
      },
      pmnum: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "PMNUM",
      },
      actlabhrs: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "ACTLABHRS",
      },
      actmatcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "ACTMATCOST",
      },
      actlabcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "ACTLABCOST",
      },
      acttoolcost: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        field: "ACTTOOLCOST",
      },
      haschildren: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "HASCHILDREN",
      },
      outlabcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "OUTLABCOST",
      },
      outmatcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "OUTMATCOST",
      },
      outtoolcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "OUTTOOLCOST",
      },
      historyflag: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "HISTORYFLAG",
      },
      contract: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "CONTRACT",
      },
      wopriority: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WOPRIORITY",
      },
      wopm6: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: "WOPM6",
      },
      wopm7: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WOPM7",
      },
      targcompdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "TARGCOMPDATE",
      },
      targstartdate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: "TARGSTARTDATE",
      },
      woeq1: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: "WOEQ1",
      },
      woeq2: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "WOEQ2",
      },
      woeq3: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WOEQ3",
      },
      woeq4: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "WOEQ4",
      },
      woeq5: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: "WOEQ5",
      },
      woeq6: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "WOEQ6",
      },
      woeq7: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOEQ7",
      },
      woeq8: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "WOEQ8",
      },
      woeq9: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOEQ9",
      },
      woeq10: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "WOEQ10",
      },
      woeq11: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: "WOEQ11",
      },
      woeq12: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WOEQ12",
      },
      wo1: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WO1",
      },
      wo2: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WO2",
      },
      wo3: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "WO3",
      },
      wo4: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WO4",
      },
      wo5: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WO5",
      },
      wo6: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WO6",
      },
      wo7: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WO7",
      },
      wo8: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WO8",
      },
      wo9: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "WO9",
      },
      wo10: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WO10",
      },
      ldkey: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "LDKEY",
      },
      reportedby: {
        type: DataTypes.STRING(18),
        allowNull: true,
        field: "REPORTEDBY",
      },
      reportdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "REPORTDATE",
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "PHONE",
      },
      problemcode: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "PROBLEMCODE",
      },
      calendar: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "CALENDAR",
      },
      interruptable: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "INTERRUPTABLE",
      },
      downtime: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "DOWNTIME",
      },
      actstart: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ACTSTART",
      },
      actfinish: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "ACTFINISH",
      },
      schedstart: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "SCHEDSTART",
      },
      schedfinish: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "SCHEDFINISH",
      },
      remdur: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "REMDUR",
      },
      crewid: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "CREWID",
      },
      supervisor: {
        type: DataTypes.STRING(12),
        allowNull: true,
        field: "SUPERVISOR",
      },
      woeq13: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "WOEQ13",
      },
      woeq14: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: "WOEQ14",
      },
      wopm1: {
        type: DataTypes.STRING(15),
        allowNull: false,
        field: "WOPM1",
      },
      wopm2: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WOPM2",
      },
      wopm3: {
        type: DataTypes.STRING(15),
        allowNull: false,
        field: "WOPM3",
      },
      wopm4: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WOPM4",
      },
      wopm5: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: "WOPM5",
      },
      wojp1: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOJP1",
      },
      wojp2: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOJP2",
      },
      wojp3: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOJP3",
      },
      wojp4: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOJP4",
      },
      wojp5: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOJP5",
      },
      wol1: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: "WOL1",
      },
      wol2: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "WOL2",
      },
      wol3: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WOL3",
      },
      wol4: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "WOL4",
      },
      wolablnk: {
        type: DataTypes.STRING(12),
        allowNull: false,
        field: "WOLABLNK",
      },
      respondby: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "RESPONDBY",
      },
      eqlocpriority: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "EQLOCPRIORITY",
      },
      calcpriority: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "CALCPRIORITY",
      },
      chargestore: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "CHARGESTORE",
      },
      failurecode: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "FAILURECODE",
      },
      wolo1: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOLO1",
      },
      wolo2: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOLO2",
      },
      wolo3: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOLO3",
      },
      wolo4: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOLO4",
      },
      wolo5: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOLO5",
      },
      wolo6: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOLO6",
      },
      wolo7: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOLO7",
      },
      wolo8: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WOLO8",
      },
      wolo9: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WOLO9",
      },
      wolo10: {
        type: DataTypes.STRING(20),
        allowNull: true,
        field: "WOLO10",
      },
      glaccount: {
        type: DataTypes.STRING(24),
        allowNull: true,
        field: "GLACCOUNT",
      },
      estservcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "ESTSERVCOST",
      },
      actservcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "ACTSERVCOST",
      },
      disabled: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "DISABLED",
      },
      estatapprlabhrs: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: "ESTATAPPRLABHRS",
      },
      estatapprlabcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "ESTATAPPRLABCOST",
      },
      estatapprmatcost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        field: "ESTATAPPRMATCOST",
      },
      estatapprtoolcost: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        field: "ESTATAPPRTOOLCOST",
      },
      estatapprservcost: {
        type: DataTypes.DECIMAL(14, 2),
        allowNull: false,
        field: "ESTATAPPRSERVCOST",
      },
      wosequence: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WOSEQUENCE",
      },
      hasfollowupwork: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "HASFOLLOWUPWORK",
      },
      worts1: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WORTS1",
      },
      worts2: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WORTS2",
      },
      worts3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WORTS3",
      },
      worts4: {
        type: DataTypes.STRING(12),
        allowNull: true,
        field: "WORTS4",
      },
      worts5: {
        type: DataTypes.STRING(4),
        allowNull: true,
        field: "WORTS5",
      },
      wfid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "WFID",
      },
      wfactive: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "WFACTIVE",
      },
      followupfromwonum: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "FOLLOWUPFROMWONUM",
      },
      pmduedate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PMDUEDATE",
      },
      pmextdate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PMEXTDATE",
      },
      pmnextduedate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "PMNEXTDUEDATE",
      },
      viewwoasoper: {
        type: DataTypes.STRING(1),
        allowNull: false,
        field: "VIEWWOASOPER",
      },
      woassignmntqueueid: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "WOASSIGNMNTQUEUEID",
      },
      worklocation: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: "WORKLOCATION",
      },
      wowq1: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOWQ1",
      },
      wowq2: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOWQ2",
      },
      wowq3: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOWQ3",
      },
      wojp6: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOJP6",
      },
      wojp7: {
        type: DataTypes.STRING(1),
        allowNull: true,
        field: "WOJP7",
      },
      wojp8: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "WOJP8",
      },
      wojp9: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: "WOJP9",
      },
      wojp10: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WOJP10",
      },
      wo11: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "WO11",
      },
      wo12: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "WO12",
      },
      wo13: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WO13",
      },
      wo14: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: "WO14",
      },
      wo15: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        field: "WO15",
      },
      wo16: {
        type: DataTypes.DATE,
        allowNull: true,
        field: "WO16",
      },
      wo17: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "WO17",
      },
      wo18: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WO18",
      },
      wo19: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "WO19",
      },
      wo20: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "WO20",
      },
      sourcesysid: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: "SOURCESYSID",
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
      apiseq: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "APISEQ",
      },
      interid: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "INTERID",
      },
      migchangeid: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "MIGCHANGEID",
      },
      sendersysid: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: "SENDERSYSID",
      },
      expdone: {
        type: DataTypes.STRING(25),
        allowNull: true,
        field: "EXPDONE",
      },
      fincntrlid: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "FINCNTRLID",
      },
      generatedforpo: {
        type: DataTypes.STRING(8),
        allowNull: true,
        field: "GENERATEDFORPO",
      },
      genforpolineid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "GENFORPOLINEID",
      },
    },
    {
      tableName: "WORKORDER",
      schema: "MAXIMO",
      timestamps: false,
      freezeTableName: true,
    },
  );
};
