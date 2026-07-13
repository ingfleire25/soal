const { buildPayloads } = require('./parsers/solicitudParser');
const { getNextPmnum, createPmRecord } = require('./writers/pmWriter');
const { createOselRecord } = require('./writers/oselWriter');
const { createWoStatusRecord } = require('./writers/wostatusWriter');
const { createWorkorderRecord } = require('./writers/workorderWriter');

// Orquesta la propagación de una solicitud aprobada a las tablas de Oracle.
// El proceso se ejecuta en secuencia para que cada paso use el resultado del anterior cuando sea necesario.
const propagateSolicitudToOracle = async (solicitud) => {
  const pmnum = await getNextPmnum();
  const wonum = `WO${Date.now().toString().slice(-6)}`;

  const { pmPayload, oselPayload, wostatusPayload, workorderPayload } = buildPayloads(solicitud, pmnum, wonum);
  const results = {};
  const errors = [];

  try {
    results.pm = await createPmRecord({ payload: pmPayload });
  } catch (error) {
    errors.push({ entity: 'PM', message: error.message });
  }

  if (results.pm) {
    try {
      results.osel = await createOselRecord({ payload: { ...oselPayload, pmnum: results.pm.pmnum || pmnum } });
    } catch (error) {
      errors.push({ entity: 'OSEL', message: error.message });
    }
  }

  if (results.osel) {
    try {
      results.wostatus = await createWoStatusRecord({ payload: { ...wostatusPayload, wonum: results.osel.wonum || wonum } });
    } catch (error) {
      errors.push({ entity: 'WOSTATUS', message: error.message });
    }
  }

  if (results.wostatus) {
    try {
      results.workorder = await createWorkorderRecord({ payload: { ...workorderPayload, pmnum: results.pm?.pmnum || pmnum, wonum: results.wostatus.wonum || wonum } });
    } catch (error) {
      errors.push({ entity: 'WORKORDER', message: error.message });
    }
  }

  return {
    success: errors.length === 0,
    partial: errors.length > 0 && Object.keys(results).length > 0,
    results,
    errors,
  };
};

module.exports = {
  propagateSolicitudToOracle,
};
