const { Solicitud } = require('../db');

// simple controller for storing and retrieving transport requests

exports.getAll = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ statusCode: 200, statusText: 'OK', result: solicitudes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al obtener solicitudes', error: err.message });
  }
};

exports.postSolicitud = async (req, res) => {
  const { nombre, correo, origen, destino, fechaViaje, comentario } = req.body;
  if (!nombre || !correo || !origen || !destino || !fechaViaje) {
    return res.status(400).json({ statusCode: 400, statusText: 'Faltan campos obligatorios' });
  }

  try {
    const nueva = await Solicitud.create({ nombre, correo, origen, destino, fechaViaje, comentario });
    res.status(201).json({ statusCode: 201, statusText: 'Solicitud creada', result: nueva });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al crear solicitud', error: err.message });
  }
};
