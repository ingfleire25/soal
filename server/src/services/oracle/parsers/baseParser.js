// Utilidades compartidas para normalizar los datos de solicitud antes de construir los payloads de Oracle.
// Esto evita errores por nombres de campos distintos o valores faltantes en el formulario.
const normalizeText = (value, maxLength = 50) => {
  if (value === undefined || value === null) return '';
  return String(value).trim().substring(0, maxLength);
};

const normalizeDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeDia = (value) => {
  const letra = String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[^CF]/g, '')
    .charAt(0);
  return letra || 'F';
};

const getFirstValue = (source = {}, keys = [], fallback = '') => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return fallback;
};

const normalizeTipoSolicitud = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized.includes('movimiento') || normalized.includes('unidades') || normalized.includes('oum')) {
    return 'Movimiento Unidades Mayores';
  }
  if (normalized.includes('suministro') || normalized.includes('lacustre') || normalized.includes('sl')) {
    return 'Suministro Lacustre';
  }
  return 'Transporte de Personal';
};

const getTipoSolicitud = (solicitud = {}) => {
  return normalizeTipoSolicitud(
    getFirstValue(solicitud, ['tipoSolicitud', 'tipo', 'tipoServicio', 'servicio', 'categoria'], 'Transporte de Personal'),
  );
};

const buildDefaultDescription = (context) => {
  if (context.tipoSolicitud === 'Movimiento Unidades Mayores') {
    return `Movimiento de unidades mayores ${context.origen || 'origen'} - ${context.destino || 'destino'}`;
  }
  if (context.tipoSolicitud === 'Suministro Lacustre') {
    return `Suministro lacustre ${context.origen || 'origen'} - ${context.destino || 'destino'}`;
  }
  return `Transporte personal ${context.origen || 'origen'} - ${context.destino || 'destino'}`;
};

const buildBaseContext = (solicitud = {}) => {
  const today = new Date();
  const tipoSolicitud = getTipoSolicitud(solicitud);
  const origen = getFirstValue(solicitud, ['origen', 'ubicacionOrigen', 'lugarOrigen', 'source'], '');
  const destino = getFirstValue(solicitud, ['destino', 'ubicacionDestino', 'lugarDestino', 'target'], '');
  const fechaInicio = normalizeDate(getFirstValue(solicitud, ['fechaInicio', 'fecha', 'fechaSolicitud', 'fechaProgramada', 'inicio']));
  const fechaFin = normalizeDate(getFirstValue(solicitud, ['fechaFin', 'fechaFinal', 'fechaHasta', 'fin']));

  const context = {
    solicitud,
    tipoSolicitud,
    fechaInicio,
    fechaFin,
    fechaSolicitud: normalizeDate(getFirstValue(solicitud, ['fechaSolicitud', 'fecha', 'fechaInicio', 'fechaProgramada'])) || today,
    today,
    descripcion: normalizeText(getFirstValue(solicitud, ['descripcion', 'motivo', 'observaciones', 'detalle', 'descripcionSolicitud']), 50),
    origen: normalizeText(origen, 15),
    descripcionOrigen: normalizeText(getFirstValue(solicitud, ['descripcionOrigen', 'descripcionOrigenSolicitud', 'origenDescripcion'], '')) || normalizeText(origen, 50),
    destino: normalizeText(destino, 15),
    descripcionDestino: normalizeText(getFirstValue(solicitud, ['descripcionDestino', 'descripcionDestinoSolicitud', 'destinoDescripcion'], '')) || normalizeText(destino, 50),
    organizacion: normalizeText(
      getFirstValue(solicitud, ['organizacionCcOi', 'codigoOrganizacion', 'organizacion', 'ccoi'], '101181D'),
      18,
    ),
    aprobador: normalizeText(getFirstValue(solicitud, ['aprobador', 'supervisor', 'aprobadorNombre']), 12) || 'SIN_SUPERV',
    solicitante: normalizeText(getFirstValue(solicitud, ['solicitante', 'nombreSolicitante', 'usuario']), 18) || 'SISTEMA',
    correo: normalizeText(getFirstValue(solicitud, ['correo', 'email', 'correoSolicitante']), 50),
    gerencia: normalizeText(getFirstValue(solicitud, ['gerencia', 'departamento', 'area']), 50) || 'MANTENIMIENTO',
    cedulaSolicitante: normalizeText(getFirstValue(solicitud, ['cedulaSolicitante', 'cedula', 'identificacion']), 20) || '0',
    modserv: normalizeText(getFirstValue(solicitud, ['modserv', 'modalidad', 'modalidadServicio']), 10) || 'LANTRP',
    tipoServicio: normalizeText(getFirstValue(solicitud, ['tipoServicio', 'servicio', 'tipo']), 10),
    subtipo: normalizeText(getFirstValue(solicitud, ['subtipo', 'categoria']), 20),
    cantidadPasajeros: Number.isInteger(parseInt(getFirstValue(solicitud, ['cantidadPasajeros', 'pasajeros', 'numeroPasajeros']), 10))
      ? parseInt(getFirstValue(solicitud, ['cantidadPasajeros', 'pasajeros', 'numeroPasajeros']), 10)
      : 1,
    changeby: normalizeText(getFirstValue(solicitud, ['solicitante', 'nombreSolicitante', 'usuario']), 18) || 'SISTEMA',
    dias: {
      lunes: normalizeDia(solicitud.lunes),
      martes: normalizeDia(solicitud.martes),
      miercoles: normalizeDia(solicitud.miercoles),
      jueves: normalizeDia(solicitud.jueves),
      viernes: normalizeDia(solicitud.viernes),
      sabado: normalizeDia(solicitud.sabado),
      domingo: normalizeDia(solicitud.domingo),
    },
  };

  context.descripcion = context.descripcion || buildDefaultDescription(context);
  return context;
};

module.exports = {
  normalizeText,
  normalizeDate,
  normalizeDia,
  getTipoSolicitud,
  buildBaseContext,
};
