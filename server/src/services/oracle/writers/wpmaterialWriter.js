const { Wpmaterial } = require('../../../db');

// Crea un registro Oracle MAXIMO.WPMATERIAL por cada material de una solicitud SL.
// Todos comparten WONUM (la solicitud); ROWSTAMP identifica de forma única cada renglón.
const createWpmaterialRecords = async ({ materials, wonum, solicitud, transaction }) => {
  // No se puede aprobar/enviar SL sin su detalle de materiales.
  if (!Array.isArray(materials) || materials.length === 0) {
    throw new Error('La solicitud SL debe incluir al menos un material para WPMATERIAL.');
  }

  const created = [];
  const rowstampBase = Date.now();

  for (const [index, material] of materials.entries()) {
    // En PostgreSQL `renglon` guarda el ITEMNUM seleccionado en el formulario.
    const itemnum = String(material.renglon || material.itemnum || '').trim().toUpperCase();
    const itemqty = Number(material.cantidad ?? material.itemqty);
    const requiredate = material.fechaEntregaMuelle || material.requiredate;

    if (!itemnum) {
      throw new Error(`Falta el código del material en el renglón ${index + 1}.`);
    }
    if (!Number.isFinite(itemqty) || itemqty <= 0) {
      throw new Error(`La cantidad del material ${itemnum} debe ser mayor que cero.`);
    }
    if (!requiredate || Number.isNaN(new Date(requiredate).getTime())) {
      throw new Error(`Falta una fecha de entrega válida para el material ${itemnum}.`);
    }

    // MAXIMO requiere un ROWSTAMP distinto por fila. Se usa la marca de tiempo
    // más el índice para que los materiales de esta misma solicitud no lo repitan.
    const rowstamp = String(rowstampBase + index);

    // `unidadMedida` proviene del ISSUEUNIT del catálogo ITEM; la observación se envía a WPM6.
    // El formulario no captura costo, así que UNITCOST se envía en cero según el ejemplo acordado.
    const payload = {
      rowstamp,
      wonum,
      itemnum,
      itemqty,
      unitcost: Number(material.unitcost ?? 0),
      directreq: material.directreq || 'N',
      requiredate: new Date(requiredate),
      requestby: solicitud.cedulaSolicitante || null,
      wpm5: material.unidadMedida || material.wpm5 || null,
      wpm6: material.observacion || material.wpm6 || null,
      unitcosthaschanged: material.unitcosthaschanged || 'N',
    };

    // Se pasa la transacción Oracle para que, si un material falla, también puedan
    // revertirse los registros OSEL/WOSTATUS/WORKORDER de esta propagación.
    created.push(await Wpmaterial.create(payload, { transaction }));
  }

  // Devuelve las filas insertadas para incluirlas en el resultado de propagación.
  return created;
};

module.exports = { createWpmaterialRecords };
