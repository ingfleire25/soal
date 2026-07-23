const { propagateSolicitudToOracle } = require('../../services/oracle/propagationService');
const { buildPayloads } = require('../../services/oracle/parsers/solicitudParser');

// Punto de entrada para enviar una solicitud aprobada hacia Oracle.
// El controlador deja el trabajo pesado al servicio de propagación y al parser correspondiente.

const parseSolicitudToOraclePm = async (solicitud) => {
  console.log('[Oracle controller] parseSolicitudToOraclePm start', {
    solicitudId: solicitud?.id || solicitud?.solicitudId || null,
    tipoSolicitud: solicitud?.tipoSolicitud || solicitud?.tipoServicio || null,
  });

  const { pmPayload } = buildPayloads(solicitud, '00000000', 'WO000000');
  console.log('[Oracle controller] parseSolicitudToOraclePm result pmnum', pmPayload?.pmnum);
  return pmPayload;
};

const sendSolicitudToOracle = async (solicitud) => {
  console.log('[Oracle controller] sendSolicitudToOracle start', {
    solicitudId: solicitud?.id || solicitud?.solicitudId || null,
    tipoSolicitud: solicitud?.tipoSolicitud || solicitud?.tipoServicio || null,
  });
  const result = await propagateSolicitudToOracle(solicitud);
  console.log('[Oracle controller] sendSolicitudToOracle result', result);
  return result;
};

module.exports = {
  sendSolicitudToOracle,
  parseSolicitudToOraclePm,
};
