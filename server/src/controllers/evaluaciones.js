const { C001T_EVALUACION_TRANSP, C003T_SOLICITUD, conn } = require('../db');
const { Op } = require('sequelize');
const { completarCorreo } = require('../utils/correo');

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
    const evaluaciones = await C001T_EVALUACION_TRANSP.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ statusCode: 200, statusText: 'OK', result: evaluaciones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al obtener evaluaciones', error: err.message });
  }
};

exports.postEvaluacion = async (req, res) => {
  if (req.authUser?.rol !== 'Solicitante') {
    return res.status(403).json({
      statusCode: 403,
      statusText: 'Solo los solicitantes pueden crear evaluaciones',
    });
  }

  const {
    codigoSolicitud,
    puntualidad,
    calidad,
    comunicacion,
    seguridad,
    satisfaccion,
    comentarios
  } = req.body;

  if (!codigoSolicitud || puntualidad == null || calidad == null || comunicacion == null || seguridad == null || satisfaccion == null) {
    return res.status(400).json({
      statusCode: 400,
      statusText: 'Faltan campos obligatorios para crear la evaluación',
      required: ['codigoSolicitud', 'puntualidad', 'calidad', 'comunicacion', 'seguridad', 'satisfaccion']
    });
  }

  try {
    const solicitud = await C003T_SOLICITUD.findByPk(codigoSolicitud);
    if (!solicitud || solicitud.tipoSolicitud !== 'Transporte de Personal') {
      return res.status(404).json({
        statusCode: 404,
        statusText: 'Solo se pueden evaluar solicitudes de Transporte de Personal',
      });
    }

    const cedulaSolicitante = String(solicitud.cedulaSolicitante || '').trim();
    const cedulaUsuario = String(req.authUser.cedula || '').trim();
    if (!cedulaUsuario || cedulaSolicitante !== cedulaUsuario) {
      return res.status(403).json({
        statusCode: 403,
        statusText: 'Solo puede evaluar solicitudes de Transporte de Personal que haya creado',
      });
    }

    const evaluadorNombre = `${req.authUser.nombres || ''} ${req.authUser.apellidos || ''}`.trim()
      || req.authUser.username;

    const nuevaEvaluacion = await conn.transaction(async (transaction) => {
      // Serializa los generadores EV entre solicitudes simultáneas en PostgreSQL.
      await conn.query(
        'SELECT pg_advisory_xact_lock(hashtext(:scope), hashtext(:prefix))',
        {
          replacements: { scope: 'evaluacionTransporte', prefix: 'EV' },
          transaction,
        },
      );

      const id = await getNextSequentialId(C001T_EVALUACION_TRANSP, 'EV', transaction);
      return C001T_EVALUACION_TRANSP.create({
        id,
        codigoSolicitud,
        tipoSolicitud: solicitud.tipoSolicitud,
        subtipo: solicitud.subtipo,
        evaluadorNombre,
        evaluadorCedula: cedulaUsuario,
        evaluadorCorreo: completarCorreo(req.authUser.correo || req.authUser.username),
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