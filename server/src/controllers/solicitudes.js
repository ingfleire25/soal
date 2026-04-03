const { Solicitud, SuministroLacustre, ServiciosPortuarios, Materiales } = require('../db');

// Controller for storing and retrieving transport requests

exports.getAll = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({ order: [['createdAt', 'DESC']] });
    const suministro = await SuministroLacustre.findAll({ include: [{ model: Materiales, as: 'materiales' }], order: [['createdAt', 'DESC']] });
    const servicios = await ServiciosPortuarios.findAll({ order: [['createdAt', 'DESC']] });
    const all = [
      ...solicitudes.map(s => ({ ...s.dataValues, tipoTabla: 'solicitudes' })),
      ...suministro.map(s => ({ ...s.dataValues, tipoTabla: 'suministroLacustre' })),
      ...servicios.map(s => ({ ...s.dataValues, tipoTabla: 'serviciosPortuarios' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ statusCode: 200, statusText: 'OK', result: all });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al obtener solicitudes', error: err.message });
  }
};

exports.postSolicitud = async (req, res) => {
  const {
    descripcion, origen, descripcionOrigen, destino, descripcionDestino,
    fechaInicio, fechaFin, organizacionCcOi, multiplesCcOi,
    lunes, martes, miercoles, jueves, viernes, sabado, domingo,
    cantidadPasajeros, tipoServicio, aprobador, correo, solicitante,
    cedulaSolicitante, tipoSolicitud, subtipo, unidadMovilizar, descripcionUnidad, fecha
  } = req.body;

  // Required fields validation based on tipoSolicitud
  const requiredFields = ['descripcion', 'origen', 'destino', 'fechaInicio', 'organizacionCcOi', 'tipoServicio', 'aprobador', 'correo', 'solicitante', 'cedulaSolicitante', 'tipoSolicitud'];
  if (tipoSolicitud === 'Transporte de Personal') {
    requiredFields.push('fechaFin', 'cantidadPasajeros');
  }

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ statusCode: 400, statusText: `Falta el campo obligatorio: ${field}` });
    }
  }

  try {
    // Calculate sumatoriaPorcentaje if multiplesCcOi provided
    let sumatoriaPorcentaje = null;
    if (multiplesCcOi && Array.isArray(multiplesCcOi)) {
      sumatoriaPorcentaje = multiplesCcOi.reduce((sum, item) => sum + (item.porcentaje || 0), 0);
      if (sumatoriaPorcentaje !== 100) {
        return res.status(400).json({ statusCode: 400, statusText: 'La suma de porcentajes debe ser 100%' });
      }
    }

    const nueva = await Solicitud.create({
      descripcion,
      origen,
      descripcionOrigen,
      destino,
      descripcionDestino,
      fechaInicio,
      fechaFin,
      organizacionCcOi,
      multiplesCcOi,
      sumatoriaPorcentaje,
      lunes: lunes || false,
      martes: martes || false,
      miercoles: miercoles || false,
      jueves: jueves || false,
      viernes: viernes || false,
      sabado: sabado || false,
      domingo: domingo || false,
      cantidadPasajeros,
      tipoServicio,
      aprobador,
      correo,
      solicitante,
      cedulaSolicitante,
      tipoSolicitud,
      subtipo,
      estado: 'pendiente',
      motivoRechazo: null,
      unidadMovilizar,
      descripcionUnidad,
      fecha
    });
    res.status(201).json({ statusCode: 201, statusText: 'Solicitud creada', result: nueva });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al crear solicitud', error: err.message });
  }
};

exports.updateSolicitud = async (req, res) => {
  const { id } = req.params;
  const {
    descripcion, origen, descripcionOrigen, destino, descripcionDestino,
    fechaInicio, fechaFin, organizacionCcOi, multiplesCcOi,
    lunes, martes, miercoles, jueves, viernes, sabado, domingo,
    cantidadPasajeros, tipoServicio, aprobador, correo, tipoSolicitud,
    subtipo
  } = req.body;

  try {
    let solicitud = await Solicitud.findByPk(id);
    let modelo = 'Solicitud';
    if (!solicitud) {
      solicitud = await SuministroLacustre.findByPk(id);
      modelo = 'SuministroLacustre';
    }

    if (!solicitud) {
      return res.status(404).json({ statusCode: 404, statusText: 'Solicitud no encontrada' });
    }

    await solicitud.update({
      descripcion, origen, descripcionOrigen, destino, descripcionDestino,
      fechaInicio, fechaFin, organizacionCcOi, multiplesCcOi,
      lunes, martes, miercoles, jueves, viernes, sabado, domingo,
      cantidadPasajeros, tipoServicio, aprobador, correo, tipoSolicitud, subtipo
    });

    res.status(200).json({ statusCode: 200, statusText: 'Solicitud actualizada', result: { ...solicitud.dataValues, tipoTabla: modelo === 'Solicitud' ? 'solicitudes' : 'suministroLacustre' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al actualizar solicitud', error: err.message });
  }
};

exports.cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado, motivoRechazo } = req.body;

  if (!['pendiente', 'aprobada', 'rechazada'].includes(estado)) {
    return res.status(400).json({ statusCode: 400, statusText: 'Estado inválido' });
  }

  try {
    let solicitud = await Solicitud.findByPk(id);
    let modelo = 'Solicitud';
    if (!solicitud) {
      solicitud = await SuministroLacustre.findByPk(id);
      modelo = 'SuministroLacustre';
    }

    if (!solicitud) {
      return res.status(404).json({ statusCode: 404, statusText: 'Solicitud no encontrada' });
    }

    await solicitud.update({
      estado,
      motivoRechazo: estado === 'rechazada' ? motivoRechazo || null : null
    });

    res.status(200).json({ statusCode: 200, statusText: 'Estado actualizado', result: { ...solicitud.dataValues, tipoTabla: modelo === 'Solicitud' ? 'solicitudes' : 'suministroLacustre' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al actualizar estado', error: err.message });
  }
};

exports.postSuministroLacustre = async (req, res) => {
  const {
    descripcion, origen, descripcionOrigen, destino, descripcionDestino,
    fechaInicio, fechaFin, organizacionCcOi, multiplesCcOi,
    tipoServicio, personaEnvia, descripcionPersonaEnvia, personaRecibe, descripcionPersonaRecibe,
    aprobador, correo, solicitante, cedulaSolicitante, fecha, subtipo, materiales
  } = req.body;

  // Required fields
  const requiredFields = ['descripcion', 'origen', 'destino', 'fechaInicio', 'fechaFin', 'organizacionCcOi', 'tipoServicio', 'personaEnvia', 'descripcionPersonaEnvia', 'personaRecibe', 'descripcionPersonaRecibe', 'aprobador', 'correo', 'solicitante', 'cedulaSolicitante', 'materiales'];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ statusCode: 400, statusText: `Falta el campo obligatorio: ${field}` });
    }
  }

  if (!Array.isArray(materiales) || materiales.length === 0) {
    return res.status(400).json({ statusCode: 400, statusText: 'Debe incluir al menos un material' });
  }

  try {
    // Calculate sumatoriaPorcentaje
    let sumatoriaPorcentaje = null;
    if (multiplesCcOi && Array.isArray(multiplesCcOi)) {
      sumatoriaPorcentaje = multiplesCcOi.reduce((sum, item) => sum + (item.porcentaje || 0), 0);
      if (sumatoriaPorcentaje !== 100) {
        return res.status(400).json({ statusCode: 400, statusText: 'La suma de porcentajes debe ser 100%' });
      }
    }

    const nueva = await SuministroLacustre.create({
      descripcion,
      origen,
      descripcionOrigen,
      destino,
      descripcionDestino,
      fechaInicio,
      fechaFin,
      organizacionCcOi,
      multiplesCcOi,
      sumatoriaPorcentaje,
      tipoServicio,
      personaEnvia,
      descripcionPersonaEnvia,
      personaRecibe,
      descripcionPersonaRecibe,
      aprobador,
      correo,
      solicitante,
      cedulaSolicitante,
      fecha,
      subtipo,
      estado: 'pendiente',
      motivoRechazo: null
    });

    // Crear materiales asociados
    for (const mat of materiales) {
      await Materiales.create({
        renglon: mat.renglon,
        descripcion: mat.descripcion,
        cantidad: mat.cantidad,
        fechaEntregaMuelle: mat.fechaEntregaMuelle,
        observacion: mat.observacion,
        suministroLacustreId: nueva.id
      });
    }

    res.status(201).json({ statusCode: 201, statusText: 'Suministro Lacustre creado', result: nueva });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al crear suministro lacustre', error: err.message });
  }
};

exports.postServiciosPortuarios = async (req, res) => {
  const {
    descripcion, origen, descripcionOrigen, destino, descripcionDestino,
    fechaInicio, organizacionCcOi, multiplesCcOi, sumatoriaPorcentaje,
    tipoServicio, unidadMovilizar, aprobador, correo, solicitante, cedulaSolicitante,
    fecha, subtipo
  } = req.body;

  const requiredFields = ['descripcion', 'origen', 'destino', 'fechaInicio', 'organizacionCcOi', 'tipoServicio', 'unidadMovilizar', 'aprobador', 'correo', 'solicitante', 'cedulaSolicitante', 'fecha'];
  for (const field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({ statusCode: 400, statusText: `Falta el campo obligatorio: ${field}` });
    }
  }

  try {
    const nuevo = await ServiciosPortuarios.create({
      descripcion,
      origen,
      descripcionOrigen,
      destino,
      descripcionDestino,
      fechaInicio,
      organizacionCcOi,
      multiplesCcOi,
      sumatoriaPorcentaje,
      tipoServicio,
      unidadMovilizar,
      aprobador,
      correo,
      solicitante,
      cedulaSolicitante,
      fecha,
      subtipo,
      estado: 'pendiente',
      motivoRechazo: null
    });

    res.status(201).json({ statusCode: 201, statusText: 'Servicio portuario creado', result: nuevo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, statusText: 'Error al crear servicio portuario', error: err.message });
  }
};
