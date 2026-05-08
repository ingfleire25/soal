export const pad2 = (value) => String(value).padStart(2, '0');

export const toDatetimeLocal = (date = new Date()) => {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const toDatetimeLocalFromISOString = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return toDatetimeLocal(date);
};

export const getNivelAprobacion = (fechaInicioLocal, fechaSolicitudLocal = null) => {
  if (!fechaInicioLocal) return { codigo: '', texto: '' };
  const fechaInicio = new Date(fechaInicioLocal);
  if (Number.isNaN(fechaInicio.getTime())) return { codigo: '', texto: '' };
  const fechaSolicitud = fechaSolicitudLocal ? new Date(fechaSolicitudLocal) : new Date();
  const baseDate = Number.isNaN(fechaSolicitud.getTime()) ? new Date() : fechaSolicitud;
  const diffMs = fechaInicio.getTime() - baseDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  let codigo = '3';
  if (diffHours <= 24) codigo = '1';
  else if (diffHours <= 360) codigo = '2';
  const nombres = {
    '1': 'Emergente',
    '2': 'Urgente',
    '3': 'Normal'
  };
  return { codigo, texto: `${codigo} - ${nombres[codigo]}` };
};
