const db = require('../../db');
const { buildPayloads } = require('./parsers/solicitudParser');
const { buildBaseContext } = require('./parsers/baseParser');
const { createPmRecord } = require('./writers/pmWriter');
const { createOselRecord } = require('./writers/oselWriter');
const { createWoStatusRecord } = require('./writers/wostatusWriter');
const { createWorkorderRecord } = require('./writers/workorderWriter');
const { createWpmaterialRecords } = require('./writers/wpmaterialWriter');

const AutoKey = db.AutoKey || db.Autokey;
const connOracle = db.connOracle || db.sequelize;

const isRecurringTransport = (context) =>
  context.tipoSolicitud === 'Transporte de Personal' &&
  String(context.subtipo || '').trim().toLowerCase() === 'recurrente';

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
  const context = buildBaseContext(solicitud);
  const tipoSolicitud = context.tipoSolicitud;

  console.log('[Oracle service] propagateSolicitudToOracle start', {
    solicitudId: solicitud?.id || solicitud?.solicitudId || null,
    tipoSolicitud,
    subtipo: context.subtipo,
  });

  const esTransporteRecurrente = isRecurringTransport(context);

  // TP (ocasional y recurrente) crea PM; MUM y SL no.
  const creaPm = tipoSolicitud === 'Transporte de Personal';

  const transaction = await connOracle.transaction();

  try {
    // MUM y SL no generan PM ni consumen un número de AUTOKEY.PM.
    const pmnum = creaPm
      ? await getNextSequenceFromAutoKey('PM', transaction)
      : null;
    const wonum = await getNextSequenceFromAutoKey('WORKORDER', transaction);

    console.log('[Oracle service] generated identifiers from AUTOKEY', { pmnum, wonum });

    // 2. Construir payloads
    const { pmPayload, oselPayload, wostatusPayload, workorderPayload } = buildPayloads(solicitud, pmnum, wonum);

    const results = {};
    
    // 3. Crear PM para Transporte Personal, ocasional o recurrente.
    if (creaPm && pmPayload) {
      const pmData = { ...pmPayload, pmnum };
      results.pm = await createPmRecord({
        payload: pmData,
        transaction,
      });

      console.log('[Oracle service] created PM', {
        pmnum: results.pm?.pmnum || pmnum,
        eqnum: results.pm?.eqnum || pmData?.eqnum,
      });
    }

    const pmReference = results.pm?.pmnum || pmnum;

    // 4. Crear OSEL con wonum y pmnum solo cuando existe PM.
    const oselData = { ...oselPayload, wonum };
    if (pmReference) oselData.pmnum = pmReference;
    else delete oselData.pmnum;
    results.osel = await createOselRecord({
      payload: oselData,
      transaction,
    });

    // 5. Crear WOSTATUS con wonum
    results.wostatus = await createWoStatusRecord({ 
      payload: { ...wostatusPayload, wonum: results.osel?.wonum || wonum }, 
      transaction 
    });

    // TP recurrente crea PM, OSEL y WOSTATUS, pero no una orden WORKORDER.
    if (!esTransporteRecurrente) {
      const workorderData = {
        ...workorderPayload,
        wonum: results.wostatus?.wonum || wonum,
      };
      if (pmReference) workorderData.pmnum = pmReference;
      else delete workorderData.pmnum;
      results.workorder = await createWorkorderRecord({
        payload: workorderData,
        transaction,
      });
    }

    // Cada material de SL se guarda como una fila WPMATERIAL asociada al mismo WONUM.
    if (tipoSolicitud === 'Suministro Lacustre') {
      results.materiales = await createWpmaterialRecords({
        materials: context.materiales,
        wonum,
        solicitud: context,
        transaction,
      });
    }

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