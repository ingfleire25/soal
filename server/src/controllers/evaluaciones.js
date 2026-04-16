const { EvaluacionTransporte } = require('../db');
const { Op } = require('sequelize');

const getNextSequentialId = async (model, prefix) => {
  const latest = await model.findOne({
    where: { id: { [Op.like]: `${prefix}-%` } },
    order: [['id', 'DESC']],
    attributes: ['id']
  });

  let nextNumber = 1;
  if (latest && latest.id) {
    const match = latest.id.match(new RegExp(`^${prefix}-(\d{4})$`));
    if (match) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `${prefix}-${String(nextNumber).padStart(4, '0')}`;
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
    const id = await getNextSequentialId(EvaluacionTransporte, 'EV');
    const nuevaEvaluacion = await EvaluacionTransporte.create({
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
    });

    res.status(201).json({ statusCode: 201, statusText: 'Evaluación registrada', result: nuevaEvaluacion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al crear evaluación', error: err.message });
  }
};