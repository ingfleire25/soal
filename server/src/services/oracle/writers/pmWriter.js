const { Pm, connOracle } = require('../../../db');
const { QueryTypes } = require('sequelize');

// Encapsula la lógica de obtención y creación de PM en Oracle.
// Se separa aquí para que el servicio de propagación no conozca detalles de la tabla PM.
const getLastPmnum = async () => {
  const rows = await connOracle.query(
    `SELECT PMNUM FROM (SELECT PMNUM FROM MAXIMO.PM ORDER BY PMNUM DESC) WHERE ROWNUM = 1`,
    { type: QueryTypes.SELECT },
  );

  const last = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  const pmnum = last ? last.PMNUM || last.pmnum : null;

  if (!pmnum) return null;

  const current = Number(pmnum);
  if (Number.isNaN(current)) {
    throw new Error(`PMNUM no numérico encontrado en Oracle: ${pmnum}`);
  }

  return { current, length: String(pmnum).length };
};

const getNextPmnum = async () => {
  const last = await getLastPmnum();
  if (!last) return '10000001';
  return String(last.current + 1).padStart(last.length, '0');
};

const createPmRecord = async ({ payload }) => {
  return Pm.create(payload);
};

module.exports = {
  getNextPmnum,
  createPmRecord,
};
