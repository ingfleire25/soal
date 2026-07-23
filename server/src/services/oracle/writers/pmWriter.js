const { Pm, connOracle } = require("../../../db");
const { Op, Sequelize, QueryTypes } = require("sequelize");

// Encapsula la lógica de obtención y creación de PM en Oracle.
// Se separa aquí para que el servicio de propagación no conozca detalles de la tabla PM.


const getLastPmnum = async () => {
  const rows = await connOracle.query(
    `SELECT PMNUM FROM (SELECT PMNUM FROM MAXIMO.PM WHERE REGEXP_LIKE(PMNUM, '^[0-9]+$') ORDER BY TO_NUMBER(PMNUM) DESC) WHERE ROWNUM = 1`,
    { type: QueryTypes.SELECT },
  );

  const last = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  const pmnum = last ? last.PMNUM || last.pmnum : null;

  console.log("[Oracle writer] getLastPmnum returned", { rows, pmnum });

  if (!pmnum) return null;

  const current = Number(pmnum);
  if (Number.isNaN(current)) {
    throw new Error(`PMNUM no numérico encontrado en Oracle: ${pmnum}`);
  }

  return { current, length: String(pmnum).length };
};

// const getLastPmnum = async () => {
//   // 1. Consulta ORM sin escribir SQL explícito
//   const lastRecord = await Pm.findOne({
//     attributes: ['pmnum'],
//     where: {
//       pmnum: {
//         [Op.regexp]: '^[0-9]+$'
//       }
//     },
//     order: [
//       [Sequelize.cast(Sequelize.col('pmnum'), 'NUMBER'), 'DESC']
//     ],
//     raw: true // Retorna un objeto plano en lugar de una instancia Sequelize
//   });

//   // Sequelize ya resuelve el objeto normalizado
//   const pmnum = lastRecord ? lastRecord.pmnum : null;

//   console.log("[Oracle writer] getLastPmnum returned", { lastRecord, pmnum });

//   if (!pmnum) return null;

//   const current = Number(pmnum);
//   if (Number.isNaN(current)) {
//     throw new Error(`PMNUM no numérico encontrado en Oracle: ${pmnum}`);
//   }

//   return { current, length: String(pmnum).length };
// };

// fin de funcion nueva 

const getNextPmnum = async () => {
  const last = await getLastPmnum();
  const next = !last
    ? "10000001"
    : String(last.current + 1).padStart(last.length, "0");
  console.log("[Oracle writer] getNextPmnum", { last, next });
  return next;
};

const createPmRecord = async ({ payload }) => {
  console.log("[Oracle writer] createPmRecord", {
    pmnum: payload?.pmnum,
    description: payload?.description,
    supervisor: payload?.supervisor,
  });
  return Pm.create(payload);
};

module.exports = {
  getNextPmnum,
  createPmRecord,
};
