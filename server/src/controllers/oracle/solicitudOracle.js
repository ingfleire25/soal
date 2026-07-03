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
