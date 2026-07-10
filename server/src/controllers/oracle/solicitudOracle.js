const { Pm, connOracle } = require("../../db");
const { QueryTypes } = require("sequelize");

const getLastPmnum = async () => {
  const rows = await connOracle.query(
    `SELECT PMNUM FROM (SELECT PMNUM FROM MAXIMO.PM ORDER BY PMNUM DESC) WHERE ROWNUM = 1`,
    { type: QueryTypes.SELECT },
  );

  const last = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  const pmnum = last ? last.PMNUM || last.pmnum : null;

  if (!pmnum) {
    return null;
  }

  const current = Number(pmnum);
  if (Number.isNaN(current)) {
    throw new Error(`PMNUM no numérico encontrado en Oracle: ${pmnum}`);
  }

  return { current, length: String(pmnum).length };
};

const getNextPmnum = async () => {
  const last = await getLastPmnum();
  if (!last) {
    return "10000001";
  }

  const nextValue = last.current + 1;
  return String(nextValue).padStart(last.length, "0");
};

const normalizeText = (value, maxLength) => {
  if (value === undefined || value === null) return "";
  return String(value).trim().substring(0, maxLength);
};

const normalizeDia = (value) => {
  const letra = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^CF]/g, "")
    .charAt(0);
  return letra || "F";
};

const parseSolicitudToOraclePm = async (solicitud) => {
  const pmnum = await getNextPmnum();
  // const pmnum = 9999;
  console.log("El codigo de pmnum es: "+ pmnum)
  const today = new Date();
  const firstdate = solicitud.fechaInicio
    ? new Date(solicitud.fechaInicio)
    : null;
  const lastcompdate = solicitud.fechaFin ? new Date(solicitud.fechaFin) : null;

  return {
    pmnum,
    rowstamp: String(Date.now()),
    // rowstamp,
    supervisor: normalizeText(solicitud.aprobador, 12) || "SIN_SUPERV",
    usetargetdate: "S",
    lastmeterreading: 0.0,
    frequency: 1,
    meterfrequency: 0.0,
    pmcounter: 0,
    priority: 1,
    jpseqinuse: "N",
    pm17: "24X7",
    pm18: firstdate || today,
    changedate: today,
    changeby: normalizeText(solicitud.solicitante, 18) || "SISTEMA",
    description: normalizeText(solicitud.descripcion, 50),
    pm6: normalizeText(solicitud.origen, 15),
    pm7: normalizeText(solicitud.descripcionOrigen, 50),
    pm8: normalizeText(solicitud.destino, 15),
    pm9: normalizeText(solicitud.descripcionDestino, 50),
    pm10: normalizeText(solicitud.modserv, 10) || "LANTRP",
    firstdate,
    nextdate: firstdate,
    lastcompdate,
    pm1: String(new Date().getFullYear()),
    pm2:
      normalizeText(
        solicitud.codigoOrganizacion ||
          solicitud.organizacionCcOi ||
          solicitud.organizacion,
        18,
      ) || "101181D",
    pm5:
      normalizeText(
        solicitud.organizacionCcOi ||
          solicitud.codigoOrganizacion ||
          solicitud.organizacion,
        18,
      ) || "101181D",
    glaccount: "10118A1A12",
    haschildren: "N",
    usefrequency: "S",
    frequnit: "MESES",
    meterfrequency2: 0.0,
    lastmeterreading2: 0.0,
    pmjp1: normalizeDia(solicitud.lunes),
    pmjp2: normalizeDia(solicitud.martes),
    pmjp3: normalizeDia(solicitud.miercoles),
    pmjp4: normalizeDia(solicitud.jueves),
    pmjp5: normalizeDia(solicitud.viernes),
    pmjp6: normalizeDia(solicitud.sabado),
    pmjp7: normalizeDia(solicitud.domingo),
    pm12: Number.isInteger(parseInt(solicitud.cantidadPasajeros, 10))
      ? parseInt(solicitud.cantidadPasajeros, 10)
      : 1,
    pm13: normalizeText(solicitud.aprobador, 50) || "SIN APROBADOR",
    pm14: normalizeText(solicitud.gerencia, 50) || "MANTENIMIENTO",
    pm16: normalizeText(solicitud.cedulaSolicitante, 20) || "0",
    pmjp8: "SR512085",
    wostatus: "PENDPROG",
    overridemasterupd: "N",
    ismasterpm: "N",
    applymasterpmtoeq: "S",
    applymasterpmtoloc: "S",
    updtimebasedfreq: "S",
    updstartdate: "S",
    updmeter1: "S",
    updmeter2: "S",
    updjpsequence: "S",
    updextdate: "S",
    updseasonaldates: "S",
  };
};

const sendSolicitudToOracle = async (solicitud) => {
  const payload = await parseSolicitudToOraclePm(solicitud);
  return Pm.create(payload);
};

module.exports = {
  sendSolicitudToOracle,
  parseSolicitudToOraclePm,
};

// Este es un registro de la base de datos de oracle para ajustar el parseo de datos:
//    	ROWSTAMP	PMNUM	DESCRIPTION	EQNUM	FIRSTDATE	LASTCOMPDATE	LASTSTARTDATE	USETARGETDATE	LASTMETERREADING	LASTMETERDATE	FREQUENCY	METERFREQUENCY	PMCOUNTER	PRIORITY	WORKTYPE	JPNUM	JPSEQINUSE	NEXTDATE	PM17	PM18	CHANGEDATE	CHANGEBY	PMEQ1	PM1	PM2	PM3	PM4	PM5	LDKEY	SUPERVISOR	CALENDAR	CREWID	INTERRUPTABLE	DOWNTIME	PM6	PM7	PM8	PM9	PM10	PMEQ2	PMEQ3	PMJP1	PMJP2	PMJP3	PMJP4	PMJP5	GLACCOUNT	LOCATION	STORELOC	PARENT	HASCHILDREN	WOSEQUENCE	USEFREQUENCY	ROUTE	FREQUNIT	METERFREQUENCY2	LASTMETERREADING2	LASTMETERDATE2	LEADTIME	EXTDATE	ADJNEXTDUE	PM11	PM12	PM13	PM14	PM15	PM16	MASTERPM	OVERRIDEMASTERUPD	ISMASTERPM	MASTERPMITEMNUM	APPLYMASTERPMTOEQ	APPLYMASTERPMTOLOC	UPDTIMEBASEDFREQ	UPDSTARTDATE	UPDMETER1	UPDMETER2	UPDJPSEQUENCE	UPDEXTDATE	UPDSEASONALDATES	WOSTATUS	SEASONSTARTDAY	SEASONSTARTMONTH	SEASONENDDAY	SEASONENDMONTH	PMJP6	PMJP7	PMJP8	PMJP9	PMJP10
// 1	324695138	1141	LANCHAS DE PASAJEROS	L-0504	1/12/1999 7:00:00 a. m.	31/12/1999 7:00:00 a. m.	6/9/2024	S	0.00		1	0.00	44	0	TP		N	6/10/2024	24X7	31/12/1999 7:00:00 a. m.	13/12/1999 10:41:00 a. m.	OCSOT423	N	1999	4456304	ZERLIN,RAFAEL	PLANTAS DE GAS	1011881	86820622	4456304					MUELLE LL-N	MUELLE LAGUNILLAS NORTE	VARIOS	VARIOS SITIOS DEL LAGO	LANTRP			F	F	F	F	F	0101188113				N		S		MESES	0.00	0.00		0			1/12/1999 7:00:00 a. m.	20	ZERLIN,RAFAEL	PLANTAS DE GAS				N	N		S	S	S	S	S	S	S	S	S	PENDPROG					F	F			
