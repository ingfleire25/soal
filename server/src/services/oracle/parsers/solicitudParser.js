const { buildBaseContext } = require('./baseParser');
const { buildTransportePersonalPayloads } = require('./types/transportePersonalParser');
const { buildMovimientoUnidadesMayoresPayloads } = require('./types/movimientoUnidadesMayoresParser');
const { buildSuministroLacustrePayloads } = require('./types/suministroLacustreParser');

// Este parser central decide qué builder de payload usar según el tipo de solicitud.
// Así se mantiene la lógica modular y fácil de extender si aparecen nuevos tipos.
const getWorkType = (context) => {
  return String(context.tipoSolicitud || context.solicitud?.tipoSolicitud || context.tipoServicio || context.solicitud?.tipoServicio || 'Transporte de Personal').trim();
};

const buildPayloads = (solicitud, pmnum, wonum) => {
  const context = buildBaseContext(solicitud);
  const tipo = getWorkType(context);

  if (tipo === 'Movimiento Unidades Mayores' || tipo === 'OUM') {
    return buildMovimientoUnidadesMayoresPayloads(solicitud, pmnum, wonum);
  }

  if (tipo === 'Suministro Lacustre' || tipo === 'SL') {
    return buildSuministroLacustrePayloads(solicitud, pmnum, wonum);
  }

  return buildTransportePersonalPayloads(solicitud, pmnum, wonum);
};

module.exports = {
  buildPayloads,
};
