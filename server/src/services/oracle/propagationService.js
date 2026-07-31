// const { buildPayloads } = require('./parsers/solicitudParser');
// const { getNextPmnum, createPmRecord } = require('./writers/pmWriter');
// const { createOselRecord } = require('./writers/oselWriter');
// const { createWoStatusRecord } = require('./writers/wostatusWriter');
// const { createWorkorderRecord } = require('./writers/workorderWriter');

// // Orquesta la propagación de una solicitud aprobada a las tablas de Oracle.
// // El proceso se ejecuta en secuencia para que cada paso use el resultado del anterior cuando sea necesario.
// const propagateSolicitudToOracle = async (solicitud) => {
//   console.log('[Oracle service] propagateSolicitudToOracle start', {
//     solicitudId: solicitud?.id || solicitud?.solicitudId || null,
//     tipoSolicitud: solicitud?.tipoSolicitud || solicitud?.tipoServicio || null,
//   });

//   const pmnum = await getNextPmnum();
//   // const wonum = `WO${Date.now().toString().slice(-6)}`;
//   const wonum = `${Date.now().toString().slice(-6)}`;
//   console.log('[Oracle service] generated identifiers', { pmnum, wonum });

//   const { pmPayload, oselPayload, wostatusPayload, workorderPayload } = buildPayloads(solicitud, pmnum, wonum);
//   console.log('[Oracle service] payloads built', {
//     tipoSolicitud: solicitud?.tipoSolicitud || solicitud?.tipoServicio,
//     pmPayloadKeys: Object.keys(pmPayload || {}),
//     oselPayloadKeys: Object.keys(oselPayload || {}),
//     wostatusPayloadKeys: Object.keys(wostatusPayload || {}),
//     workorderPayloadKeys: Object.keys(workorderPayload || {}),
//   });

//   const results = {};
//   const errors = [];

//   try {
//     results.pm = await createPmRecord({ payload: pmPayload });
//     console.log('[Oracle service] created PM', { pmnum: results.pm?.pmnum || pmnum , 
//                                                  eqnum: results.pm?.eqnum || pmPayload?.eqnum});
//   } catch (error) {
//     console.error('[Oracle service] error creating PM', {
//       pmnum,
//       error: error.message,
//       stack: error.stack,
//     });
//     errors.push({ entity: 'PM', message: error.message });
//   }

//   if (results.pm) {
//     try {
//       results.osel = await createOselRecord({ payload: { ...oselPayload, pmnum: results.pm.pmnum || pmnum } });
//       console.log('[Oracle service] created OSEL', { wonum: results.osel?.wonum || wonum, pmnum: results.osel?.pmnum || pmnum });
//     } catch (error) {
//       console.error('[Oracle service] error creating OSEL', {
//         pmnum,
//         wonum,
//         error: error.message,
//         stack: error.stack,
//       });
//       errors.push({ entity: 'OSEL', message: error.message });
//     }
//   }

//   if (results.osel) {
//     try {
//       results.wostatus = await createWoStatusRecord({ payload: { ...wostatusPayload, wonum: results.osel.wonum || wonum } });
//       console.log('[Oracle service] created WOSTATUS', { wonum: results.wostatus?.wonum || wonum });
//     } catch (error) {
//       console.error('[Oracle service] error creating WOSTATUS', {
//         wonum,
//         error: error.message,
//         stack: error.stack,
//       });
//       errors.push({ entity: 'WOSTATUS', message: error.message });
//     }
//   }

//   if (results.wostatus) {
//     try {
//       results.workorder = await createWorkorderRecord({ payload: { ...workorderPayload, pmnum: results.pm?.pmnum || pmnum, wonum: results.wostatus.wonum || wonum } });
//       console.log('[Oracle service] created WORKORDER', { wonum: results.workorder?.wonum || wonum, pmnum: results.workorder?.pmnum || pmnum });
//     } catch (error) {
//       console.error('[Oracle service] error creating WORKORDER', {
//         wonum,
//         pmnum,
//         error: error.message,
//         stack: error.stack,
//       });
//       errors.push({ entity: 'WORKORDER', message: error.message });
//     }
//   }

//   const result = {
//     success: errors.length === 0,
//     partial: errors.length > 0 && Object.keys(results).length > 0,
//     results,
//     errors,
//   };

//   console.log('[Oracle service] propagateSolicitudToOracle end', result);
//   return result;
// };

// module.exports = {
//   propagateSolicitudToOracle,
// };
const db = require('../../db');
const { buildPayloads } = require('./parsers/solicitudParser');
const { createPmRecord } = require('./writers/pmWriter');
const { createOselRecord } = require('./writers/oselWriter');
const { createWoStatusRecord } = require('./writers/wostatusWriter');
const { createWorkorderRecord } = require('./writers/workorderWriter');

const AutoKey = db.AutoKey || db.Autokey;
const connOracle = db.connOracle || db.sequelize;

/**
 * Obtiene e incrementa el siguiente código desde la tabla AUTOKEY de forma atómica.
 */
const getNextSequenceFromAutoKey = async (tbname, transaction) => {
  const formattedTbname = tbname.toUpperCase();

  const autokeyRecord = await AutoKey.findByPk(formattedTbname, {
    transaction,
    lock: true,
  });

  if (!autokeyRecord) {
    throw new Error(`No se encontró un registro en AUTOKEY para TBNAME: ${formattedTbname}`);
  }

  const nextSeed = Number(autokeyRecord.seed) + 1;
  const newRowstamp = String(Date.now());

  await AutoKey.update(
    {
      seed: nextSeed,
      rowstamp: newRowstamp,
    },
    {
      where: { tbname: formattedTbname },
      transaction,
    }
  );

  const prefix = autokeyRecord.prefix ? autokeyRecord.prefix.trim() : '';
  return `${prefix}${nextSeed}`;
};

const propagateSolicitudToOracle = async (solicitud) => {
  console.log('[Oracle service] propagateSolicitudToOracle start', {
    solicitudId: solicitud?.id || solicitud?.solicitudId || null,
    tipoSolicitud: solicitud?.tipoSolicitud || solicitud?.tipoServicio || null,
  });

  const transaction = await connOracle.transaction();

  try {
    // 1. Obtener secuencias
    const pmnum = await getNextSequenceFromAutoKey('PM', transaction);
    const wonum = await getNextSequenceFromAutoKey('WORKORDER', transaction);

    console.log('[Oracle service] generated identifiers from AUTOKEY', { pmnum, wonum });

    // 2. Construir payloads
    const { pmPayload, oselPayload, wostatusPayload, workorderPayload } = buildPayloads(solicitud, pmnum, wonum);

    const results = {};
    
    // 3. Crear PM con pmnum garantizado
    const pmData = { ...pmPayload, pmnum };
    results.pm = await createPmRecord({ 
      payload: pmData, 
      transaction 
    });
    
    console.log('[Oracle service] created PM', { 
      pmnum: results.pm?.pmnum || pmnum, 
      eqnum: results.pm?.eqnum || pmData?.eqnum 
    });

    // 4. Crear OSEL con pmnum y wonum
    results.osel = await createOselRecord({ 
      payload: { ...oselPayload, pmnum: results.pm?.pmnum || pmnum, wonum }, 
      transaction 
    });

    // 5. Crear WOSTATUS con wonum
    results.wostatus = await createWoStatusRecord({ 
      payload: { ...wostatusPayload, wonum: results.osel?.wonum || wonum }, 
      transaction 
    });

    // 6. Crear WORKORDER con pmnum y wonum
    results.workorder = await createWorkorderRecord({ 
      payload: { ...workorderPayload, pmnum: results.pm?.pmnum || pmnum, wonum: results.wostatus?.wonum || wonum }, 
      transaction 
    });

    await transaction.commit();

    return {
      success: true,
      partial: false,
      results,
      errors: [],
    };

  } catch (error) {
    await transaction.rollback();

    console.error('[Oracle service] error during propagation, rolled back execution:', {
      error: error.message,
      stack: error.stack,
    });

    return {
      success: false,
      partial: false,
      results: {},
      errors: [{ entity: 'PROPAGATION', message: error.message }],
    };
  }
};

module.exports = {
  propagateSolicitudToOracle,
};