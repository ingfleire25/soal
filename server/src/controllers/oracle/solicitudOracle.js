const { propagateSolicitudToOracle } = require('../../services/oracle/propagationService');
const { buildPayloads } = require('../../services/oracle/parsers/solicitudParser');

// Punto de entrada para enviar una solicitud aprobada hacia Oracle.
// El controlador deja el trabajo pesado al servicio de propagación y al parser correspondiente.

const parseSolicitudToOraclePm = async (solicitud) => {
  const { pmPayload } = buildPayloads(solicitud, '00000000', 'WO000000');
  return pmPayload;
};

const sendSolicitudToOracle = async (solicitud) => {
  return propagateSolicitudToOracle(solicitud);
};

module.exports = {
  sendSolicitudToOracle,
  parseSolicitudToOraclePm,
};
