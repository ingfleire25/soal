const { Solicitud, SuministroLacustre, Materiales, conn } = require("../db");
const { Op } = require("sequelize");
const { sendSolicitudToOracle } = require("./oracle/solicitudOracle");
const mailer = require("../../utils/mailer");

const getNextSequentialId = async (model, prefix) => {
  const solicitudes = await model.findAll({
    where: { id: { [Op.like]: `${prefix}%` } },
    attributes: ["id"],
  });

  const prefixPattern = new RegExp(`^${prefix}-?(\\d+)$`);
  const highestNumber = solicitudes.reduce((highest, solicitud) => {
    const match = String(solicitud.id || "").match(prefixPattern);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return `${prefix}${String(highestNumber + 1).padStart(4, "0")}`;
};

const normalizeOrganizacionCcOi = (body) => {
  return (
    body.organizacionCcOi || body.codigoOrganizacion || body.organizacion || ""
  );
};

const normalizeDia = (value) => {
  if (value === true || value === "true") return "C";
  if (value === false || value === "false") return "F";
  const dia = value === undefined || value === null
    ? ""
    : String(value).trim().toUpperCase();
  return dia === "C" || dia === "F" ? dia : null;
};

const getApprovalLevel = (fechaInicio, fechaSolicitud = null) => {
  const fechaInicioDate = new Date(fechaInicio);
  const fechaSolicitudDate = fechaSolicitud
    ? new Date(fechaSolicitud)
    : new Date();
  if (Number.isNaN(fechaInicioDate.getTime())) return null;
  const baseDate = Number.isNaN(fechaSolicitudDate.getTime())
    ? new Date()
    : fechaSolicitudDate;
  const diffMs = fechaInicioDate.getTime() - baseDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours <= 24) return "1";
  if (diffHours <= 360) return "2";
  return "3";
};

// Controller for storing and retrieving transport requests

exports.getAll = async (req, res) => {
  try {
    const solicitudes = await Solicitud.findAll({
      order: [["createdAt", "DESC"]],
    });
    const suministro = await SuministroLacustre.findAll({
      include: [{ model: Materiales, as: "materiales" }],
      order: [["createdAt", "DESC"]],
    });
    const all = [
      ...solicitudes.map((s) => ({
        ...s.dataValues,
        tipoTabla: "solicitudes",
      })),
      ...suministro.map((s) => ({
        ...s.dataValues,
        tipoTabla: "suministroLacustre",
      })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ statusCode: 200, statusText: "OK", result: all });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      statusText: "Error al obtener solicitudes",
      error: err.message,
    });
  }
};

exports.postSolicitud = async (req, res) => {
  let {
    descripcion,
    origen,
    descripcionOrigen,
    destino,
    descripcionDestino,
    fechaInicio,
    fechaFin,
    organizacion,
    codigoOrganizacion,
    organizacionCcOi,
    multiplesCcOi,
    lunes,
    martes,
    miercoles,

    jueves,
    viernes,
    sabado,
    domingo,
    cantidadPasajeros,
    tipoServicio,
    aprobador,
    cedulaAprobador,
    correo,
    telefono,
    gerencia,
    solicitante,
    cedulaSolicitante,
    tipoSolicitud,
    subtipo,
    unidadMovilizar,
    descripcionUnidad,
    fecha,
    modserv,
  } = req.body;

  organizacionCcOi = normalizeOrganizacionCcOi(req.body);
  const payload = { ...req.body, organizacionCcOi };

  // Required fields validation based on tipoSolicitud
  const requiredFields = [
    "descripcion",
    "origen",
    "destino",
    "fechaInicio",
    "organizacionCcOi",
    "tipoServicio",
    "aprobador",
    "correo",
    "gerencia",
    "solicitante",
    "cedulaSolicitante",
    "tipoSolicitud",
  ];
  if (tipoSolicitud === "Transporte de Personal") {
    requiredFields.push(
      "fechaFin",
      "cantidadPasajeros",
      "organizacion",
      "codigoOrganizacion",
    );
  }

  for (const field of requiredFields) {
    if (!payload[field]) {
      return res.status(400).json({
        statusCode: 400,
        statusText: `Falta el campo obligatorio: ${field}`,
      });
    }
  }

  try {
    // Calculate sumatoriaPorcentaje if multiplesCcOi provided
    let sumatoriaPorcentaje = null;
    if (multiplesCcOi && Array.isArray(multiplesCcOi)) {
      sumatoriaPorcentaje = multiplesCcOi.reduce(
        (sum, item) => sum + (item.porcentaje || 0),
        0,
      );
      if (sumatoriaPorcentaje !== 100) {
        return res.status(400).json({
          statusCode: 400,
          statusText: "La suma de porcentajes debe ser 100%",
        });
      }
    }

    const nivelAprobacion = getApprovalLevel(fechaInicio, fecha);
    const prefijoSolicitud =
      tipoSolicitud === "Transporte de Personal" && subtipo === "Recurrente"
        ? "TPR"
        : tipoSolicitud === "Movimiento Unidades Mayores"
          ? "OUM"
          : "TP";
    const id = await getNextSequentialId(Solicitud, prefijoSolicitud);
    const nueva = await Solicitud.create({
      id,
      descripcion,
      origen,
      descripcionOrigen,
      destino,
      descripcionDestino,
      fechaInicio,
      fechaFin,
      nombreOrganizacion: organizacion,
      codigoOrganizacion,
      organizacionCcOi,
      centroCostoCcOi: organizacionCcOi,
      multiplesCcOi,
      sumatoriaPorcentaje,
      lunes: normalizeDia(lunes),
      martes: normalizeDia(martes),
      miercoles: normalizeDia(miercoles),
      jueves: normalizeDia(jueves),
      viernes: normalizeDia(viernes),
      sabado: normalizeDia(sabado),
      domingo: normalizeDia(domingo),
      cantidadPasajeros,
      tipoServicio,
      aprobador,
      cedulaAprobador,
      correo,
      telefono,
      gerencia,
      solicitante,
      cedulaSolicitante,
      tipoSolicitud,
      subtipo,
      nivelAprobacion,
      estado: "pendiente",
      motivoRechazo: null,
      unidadMovilizar,
      descripcionUnidad,
      fecha,
      modserv,
    });
    res
      .status(201)
      .json({ statusCode: 201, statusText: "Solicitud creada", result: nueva });

    // Enviar correo de confirmación (no bloquear la respuesta)
    try {
      if (nueva && nueva.correo) {
        mailer
          .sendSolicitudCreated(nueva.correo, nueva.dataValues)
          .catch((e) =>
            console.error("Error enviando correo de creación:", e.message),
          );
      }
    } catch (e) {
      console.error("Error iniciando envío de correo de creación:", e.message);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      statusText: "Error al crear solicitud",
      error: err.message,
    });
  }
};

exports.updateSolicitud = async (req, res) => {
  const { id } = req.params;
  let {
    descripcion,
    origen,
    descripcionOrigen,
    destino,
    descripcionDestino,
    fechaInicio,
    fechaFin,
    organizacion,
    codigoOrganizacion,
    organizacionCcOi,
    multiplesCcOi,
    lunes,
    martes,
    miercoles,
    jueves,
    viernes,
    sabado,
    domingo,
    cantidadPasajeros,
    tipoServicio,
    aprobador,
    cedulaAprobador,
    correo,
    telefono,
    gerencia,
    tipoSolicitud,
    subtipo,
    modserv,
  } = req.body;

  organizacionCcOi = normalizeOrganizacionCcOi(req.body);

  try {
    let solicitud = await Solicitud.findByPk(id);
    let modelo = "Solicitud";
    if (!solicitud) {
      solicitud = await SuministroLacustre.findByPk(id);
      modelo = "SuministroLacustre";
    }

    if (!solicitud) {
      return res
        .status(404)
        .json({ statusCode: 404, statusText: "Solicitud no encontrada" });
    }

    const nivelAprobacion = getApprovalLevel(
      fechaInicio,
      solicitud.fecha || new Date(),
    );
    await solicitud.update({
      descripcion,
      origen,
      descripcionOrigen,
      destino,
      descripcionDestino,
      fechaInicio,
      fechaFin,
      nombreOrganizacion: organizacion,
      codigoOrganizacion,
      organizacionCcOi,
      centroCostoCcOi: organizacionCcOi,
      multiplesCcOi,
      lunes: normalizeDia(lunes),
      martes: normalizeDia(martes),
      miercoles: normalizeDia(miercoles),
      jueves: normalizeDia(jueves),
      viernes: normalizeDia(viernes),
      sabado: normalizeDia(sabado),
      domingo: normalizeDia(domingo),
      cantidadPasajeros,
      tipoServicio,
      aprobador,
      cedulaAprobador,
      correo,
      telefono,
      gerencia,
      tipoSolicitud,
      subtipo,
      modserv,
      nivelAprobacion,
    });

    res.status(200).json({
      statusCode: 200,
      statusText: "Solicitud actualizada",
      result: {
        ...solicitud.dataValues,
        tipoTabla:
          modelo === "Solicitud" ? "solicitudes" : "suministroLacustre",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      statusText: "Error al actualizar solicitud",
      error: err.message,
    });
  }
};

exports.cambiarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado, motivoRechazo } = req.body;

  if (!["pendiente", "aprobada", "rechazada"].includes(estado)) {
    return res
      .status(400)
      .json({ statusCode: 400, statusText: "Estado inválido" });
  }

  try {
    let solicitud = await Solicitud.findByPk(id);
    let modelo = "Solicitud";
    if (!solicitud) {
      solicitud = await SuministroLacustre.findByPk(id);
      modelo = "SuministroLacustre";
    }

    if (!solicitud) {
      return res
        .status(404)
        .json({ statusCode: 404, statusText: "Solicitud no encontrada" });
    }

    const estadoAnterior = solicitud.estado;
    let oracleIdentifiers = null;

    await solicitud.update({
      estado,
      motivoRechazo: estado === "rechazada" ? motivoRechazo || null : null,
    });

    if (estado === "aprobada" && estadoAnterior !== "aprobada") {
      try {
        const oracleSolicitud = { ...solicitud.dataValues };
        if (modelo === "SuministroLacustre") {
          oracleSolicitud.materiales = await Materiales.findAll({
            where: { suministroLacustreId: solicitud.id },
            raw: true,
          });
        }
        const oracleResult = await sendSolicitudToOracle(oracleSolicitud);
        if (!oracleResult?.success) {
          await solicitud.update({ estado: "pendiente" });
          return res.status(500).json({
            statusCode: 500,
            statusText: "No se pudo propagar la solicitud a Oracle",
            error: oracleResult?.errors?.map((item) => item.message).join("; ") || "Error de propagación",
          });
        }
        const oracleResults = oracleResult.results || {};
        oracleIdentifiers = {
          wonum:
            oracleResults.workorder?.wonum ||
            oracleResults.workorder?.dataValues?.wonum ||
            oracleResults.osel?.wonum ||
            oracleResults.osel?.dataValues?.wonum ||
            oracleResults.wostatus?.wonum ||
            oracleResults.wostatus?.dataValues?.wonum ||
            null,
          pmnum:
            oracleResults.pm?.pmnum ||
            oracleResults.pm?.dataValues?.pmnum ||
            null,
        };
      } catch (oracleError) {
        console.error(
          "Error al enviar solicitud aprobada a Oracle:",
          oracleError,
        );
        await solicitud.update({ estado: "pendiente" });
        return res.status(500).json({
          statusCode: 500,
          statusText: "Solicitud aprobada pero no pudo enviarse a Oracle",
          error: oracleError.message,
        });
      }
    }
    if (estado === "aprobada") {
      try {
        if (solicitud?.correo) {
          await mailer
            .sendSolicitudApproved(solicitud.correo, solicitud.dataValues)
            .catch((err) =>
              console.error("Error enviando correo de aprobación:", err.message),
            );
        }
      } catch (mailErr) {
        console.error("Error iniciando envío de correo de aprobación:", mailErr.message);
      }
    }
    if (estado === "rechazada") {
      // Enviar correo de rechazo con motivo
      try {
        if (solicitud && solicitud.correo) {
          mailer
            .sendSolicitudRejected(
              solicitud.correo,
              solicitud.dataValues,
              motivoRechazo,
            )
            .catch((e) =>
              console.error("Error enviando correo de rechazo:", e.message),
            );
        }
      } catch (e) {
        console.error("Error iniciando envío de correo de rechazo:", e.message);
      }
    }
    res.status(200).json({
      statusCode: 200,
      statusText: "Estado actualizado",
      result: {
        ...solicitud.dataValues,
        oracle: oracleIdentifiers,
        tipoTabla:
          modelo === "Solicitud" ? "solicitudes" : "suministroLacustre",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      statusText: "Error al actualizar estado",
      error: err.message,
    });
  }
};

exports.postSuministroLacustre = async (req, res) => {
  let {
    descripcion,
    origen,
    descripcionOrigen,
    destino,
    descripcionDestino,
    fechaInicio,
    fechaFin,
    organizacion,
    codigoOrganizacion,
    organizacionCcOi,
    multiplesCcOi,
    tipoServicio,
    personaEnvia,
    descripcionPersonaEnvia,
    personaRecibe,
    descripcionPersonaRecibe,
    aprobador,
    cedulaAprobador,
    correo,
    telefono,
    gerencia,
    solicitante,
    cedulaSolicitante,
    fecha,
    subtipo,
    materiales,
  } = req.body;

  organizacionCcOi = normalizeOrganizacionCcOi(req.body);
  const payload = { ...req.body, organizacionCcOi };

  // Required fields
  const requiredFields = [
    "descripcion",
    "origen",
    "destino",
    "fechaInicio",
    "fechaFin",
    "organizacionCcOi",
    "tipoServicio",
    "personaEnvia",
    "descripcionPersonaEnvia",
    "personaRecibe",
    "descripcionPersonaRecibe",
    "aprobador",
    "correo",
    "gerencia",
    "solicitante",
    "cedulaSolicitante",
    "materiales",
  ];

  for (const field of requiredFields) {
    if (!payload[field]) {
      return res.status(400).json({
        statusCode: 400,
        statusText: `Falta el campo obligatorio: ${field}`,
      });
    }
  }

  if (!Array.isArray(materiales) || materiales.length === 0) {
    return res.status(400).json({
      statusCode: 400,
      statusText: "Debe incluir al menos un material",
    });
  }

  let transaction;
  try {
    // Calculate sumatoriaPorcentaje
    let sumatoriaPorcentaje = null;
    if (multiplesCcOi && Array.isArray(multiplesCcOi)) {
      sumatoriaPorcentaje = multiplesCcOi.reduce(
        (sum, item) => sum + (item.porcentaje || 0),
        0,
      );
      if (sumatoriaPorcentaje !== 100) {
        return res.status(400).json({
          statusCode: 400,
          statusText: "La suma de porcentajes debe ser 100%",
        });
      }
    }

    transaction = await conn.transaction();
    const nivelAprobacion = getApprovalLevel(fechaInicio, fecha);
    const id = await getNextSequentialId(SuministroLacustre, "SL");
    const nueva = await SuministroLacustre.create({
      id,
      descripcion,
      origen,
      descripcionOrigen,
      destino,
      descripcionDestino,
      fechaInicio,
      fechaFin,
      nombreOrganizacion: organizacion,
      codigoOrganizacion,
      organizacionCcOi,
      multiplesCcOi,
      sumatoriaPorcentaje,
      tipoServicio,
      personaEnvia,
      descripcionPersonaEnvia,
      personaRecibe,
      descripcionPersonaRecibe,
      aprobador,
      cedulaAprobador,
      correo,
      telefono,
      gerencia,
      solicitante,
      cedulaSolicitante,
      fecha,
      tipoSolicitud: "Suministro Lacustre",
      subtipo,
      nivelAprobacion,
      estado: "pendiente",
      motivoRechazo: null,
    }, { transaction });

    // Crear materiales asociados
    for (const mat of materiales) {
      await Materiales.create({
        renglon: mat.renglon,
        descripcion: mat.descripcion,
        unidadMedida: mat.unidadMedida || null,
        cantidad: mat.cantidad,
        fechaEntregaMuelle: mat.fechaEntregaMuelle,
        observacion: mat.observacion,
        suministroLacustreId: nueva.id,
      }, { transaction });
    }

    await transaction.commit();

    res.status(201).json({
      statusCode: 201,
      statusText: "Suministro Lacustre creado",
      result: nueva,
    });
  } catch (err) {
    if (transaction && !transaction.finished) await transaction.rollback();
    console.error(err);
    res.status(500).json({
      statusCode: 500,
      statusText: "Error al crear suministro lacustre",
      error: err.message,
    });
  }
};
