const { EvaluacionTransporte, conn } = require('../db');
const { Op } = require('sequelize');

const getNextSequentialId = async (model, prefix, transaction) => {
  const existingIds = await model.findAll({
    where: { id: { [Op.like]: `${prefix}%` } },
    attributes: ['id'],
    transaction,
  });

  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const idPattern = new RegExp(`^${escapedPrefix}-?(\\d+)$`);
  const highestNumber = existingIds.reduce((highest, evaluation) => {
    const match = String(evaluation.id).match(idPattern);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `${prefix}${String(highestNumber + 1).padStart(4, '0')}`;
};

exports.getAll = async (req, res) => {
  try {
    const evaluaciones = await EvaluacionTransporte.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ statusCode: 200, statusText: 'OK', result: evaluaciones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al obtener evaluaciones', error: err.message });
  }
};

exports.postEvaluacion = async (req, res) => {
  const {
    codigoSolicitud,
    tipoSolicitud,
    subtipo,
    evaluadorNombre,
    evaluadorCedula,
    evaluadorCorreo,
    puntualidad,
    calidad,
    comunicacion,
    seguridad,
    satisfaccion,
    comentarios
  } = req.body;

  if (!codigoSolicitud || !evaluadorNombre || puntualidad == null || calidad == null || comunicacion == null || seguridad == null || satisfaccion == null) {
    return res.status(400).json({
      statusCode: 400,
      statusText: 'Faltan campos obligatorios para crear la evaluación',
      required: ['codigoSolicitud', 'evaluadorNombre', 'puntualidad', 'calidad', 'comunicacion', 'seguridad', 'satisfaccion']
    });
  }

  try {
    const nuevaEvaluacion = await conn.transaction(async (transaction) => {
      // Serializa los generadores EV entre solicitudes simultáneas en PostgreSQL.
      await conn.query(
        'SELECT pg_advisory_xact_lock(hashtext(:scope), hashtext(:prefix))',
        {
          replacements: { scope: 'evaluacionTransporte', prefix: 'EV' },
          transaction,
        },
      );

      const id = await getNextSequentialId(EvaluacionTransporte, 'EV', transaction);
      return EvaluacionTransporte.create({
        id,
        codigoSolicitud,
        tipoSolicitud,
        subtipo,
        evaluadorNombre,
        evaluadorCedula,
        evaluadorCorreo,
        fecha: new Date(),
        puntualidad,
        calidad,
        comunicacion,
        seguridad,
        satisfaccion,
        comentarios
      }, { transaction });
    });

    res.status(201).json({ statusCode: 201, statusText: 'Evaluación registrada', result: nuevaEvaluacion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al crear evaluación', error: err.message });
  }
};