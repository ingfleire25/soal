const { Sequelize } = require("sequelize");

// Utilidades compartidas para normalizar los datos de solicitud antes de construir los payloads de Oracle.
// Esto evita errores por nombres de campos distintos o valores faltantes en el formulario.
const normalizeText = (value, maxLength = 50) => {
  if (value === undefined || value === null) return "";
  return String(value).trim().substring(0, maxLength);
};

const parseDateString = (value) => {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "number") {
    const timestamp = Number(value);
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const isoMatch = normalized.match(
    /^\d{4}[\-/]\d{1,2}[\-/]\d{1,2}(?:[T\s]\d{2}:\d{2}(?::\d{2})?)?$/,
  );
  if (isoMatch) {
    const date = new Date(normalized.replace(/-/g, "/"));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const dmyMatch = normalized.match(
    /^(\d{1,2})[\-/\.](\d{1,2})[\-/\.](\d{4})(?:[T\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s*(a\.? ?m\.?|p\.? ?m\.?|am|pm))?)?$/i,
  );
  if (dmyMatch) {
    const [
      ,
      day,
      month,
      year,
      hour = "0",
      minute = "0",
      second = "0",
      meridiem,
    ] = dmyMatch;

    let parsedHour = Number(hour);
    if (meridiem) {
      const normalizedMeridiem = meridiem.replace(/\s+/g, "").toLowerCase();
      if (normalizedMeridiem.startsWith("p")) {
        if (parsedHour < 12) parsedHour += 12;
      } else if (normalizedMeridiem.startsWith("a")) {
        if (parsedHour === 12) parsedHour = 0;
      }
    }

    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      parsedHour,
      Number(minute),
      Number(second),
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeDate = (value) => {
  return parseDateString(value);
};

const normalizeDateOnly = (value) => {
  const date = parseDateString(value);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const getTimezoneOffset = (date) => {
  const totalMinutes = -date.getTimezoneOffset();
  const sign = totalMinutes >= 0 ? "+" : "-";
  const absMinutes = Math.abs(totalMinutes);
  const hours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
  const minutes = String(absMinutes % 60).padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
};



// Helpers de apoyo que ya utilizas en tu archivo
const normalizeDate1 = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};




// // Array con las abreviaturas de los meses en inglés (estándar para 'DEC', 'NOV', etc.)
// // Si tu base de datos de Oracle está configurada en español ('DIC', 'ENE', etc.), 
// // simplemente reemplaza los nombres en este array.
// const MONTHS_3_LETTERS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// /**
//  * Formatea fechas tipo STATUSDATE o WO1 -> '01/DEC/1999'
//  * Envía a Oracle el string en el formato exacto que el trigger espera por defecto.
//  */
// const formatOracleDate = (value) => {
//   const date = normalizeDate1(value);
//   if (!date) return null;

//   const year = date.getFullYear();
//   const month = MONTHS_3_LETTERS[date.getMonth()]; // Ej: 'DEC'
//   const day = pad2(date.getDate()); // Asegura dos dígitos, ej: '01'

//   // Retornamos el string directo que el trigger de Oracle interpretará implícitamente sin fallar
//   return Sequelize.literal(`'${day}/${month}/${year}'`);
// };

// /**
//  * Formatea fechas tipo TARGSTARTDATE -> '01/DEC/1999 13:16:02'
//  * Mantiene el formato DD/MON/YYYY requerido por el trigger para la porción de la fecha, 
//  * junto con la hora en formato de 24 horas.
//  */
// const formatOracleTimestampTz = (value) => {
//   const date = normalizeDate1(value);
//   if (!date) return null;

//   const year = date.getFullYear();
//   const month = MONTHS_3_LETTERS[date.getMonth()]; // Ej: 'DEC'
//   const day = pad2(date.getDate());
  
//   const hours = pad2(date.getHours());
//   const minutes = pad2(date.getMinutes());
//   const seconds = pad2(date.getSeconds());

//   // Si el trigger también procesa timestamps de forma implícita o mediante TO_DATE,
//   // aquí forzamos la máscara DD/MON/YYYY que espera para la fecha.
//   return Sequelize.literal(
//     `TO_DATE('${day}/${month}/${year} ${hours}:${minutes}:${seconds}', 'DD/MON/YYYY HH24:MI:SS')`
//   );
// };

//**
 /* Asegura dos dígitos para el formato de fecha (ej. 01, 09, 12)
 */

/**
 * Formatea fechas tipo STATUSDATE o WO1 (Solo fecha)
 * Forzamos a Oracle a interpretar los componentes exactos.
 */
const formatOracleDate = (value) => {
  const date = normalizeDate1(value);
  if (!date) return null;

  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());

  // Al usar TO_DATE explícito con 'DD/MM/YYYY', Oracle ignora cualquier otra configuración
  // y procesa exactamente la longitud de la cadena enviada.
  return Sequelize.literal(`TO_DATE('${day}/${month}/${year}', 'DD/MM/YYYY')`);
};

/**
 * Formatea fechas con tiempo tipo TARGSTARTDATE (Fecha + Hora)
 * Usamos TO_TIMESTAMP para evitar conflictos de longitud o microsegundos.
 */
const formatOracleTimestampTz = (value) => {
  const date = normalizeDate1(value);
  if (!date) return null;

  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  
  const hours = pad2(date.getHours());
  const minutes = pad2(date.getMinutes());
  const seconds = pad2(date.getSeconds());

  // Usamos la máscara exacta 'DD/MM/YYYY HH24:MI:SS' para que Oracle consuma
  // cada parte del string sin que sobre ni falte nada.
  return Sequelize.literal(
    `TO_DATE('${day}/${month}/${year} ${hours}:${minutes}:${seconds}', 'DD/MM/YYYY HH24:MI:SS')`
  );
};

// nueva funcion arriba

const pad2 = (value) => String(value).padStart(2, "0");

const formatDateOnly = (value) => {
  const date = normalizeDate1(value);
  if (!date) return null;
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
};

const formatDateTime = (value) => {
  const date = normalizeDate1(value);
  if (!date) return null;
  const hours = date.getHours();
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const ampm = hours >= 12 ? "p. m." : "a. m.";
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${hour12}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())} ${ampm}`;
};

const normalizeDia = (value) => {
  const letra = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^CF]/g, "")
    .charAt(0);
  return letra || "F";
};

const getFirstValue = (source = {}, keys = [], fallback = "") => {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return fallback;
};

const normalizeTipoSolicitud = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  if (
    normalized.includes("movimiento") ||
    normalized.includes("unidades") ||
    normalized.includes("oum")
  ) {
    return "Movimiento Unidades Mayores";
  }
  if (
    normalized.includes("suministro") ||
    normalized.includes("lacustre") ||
    normalized.includes("sl")
  ) {
    return "Suministro Lacustre";
  }
  return "Transporte de Personal";
};

const getTipoSolicitud = (solicitud = {}) => {
  return normalizeTipoSolicitud(
    getFirstValue(
      solicitud,
      ["tipoSolicitud", "tipo", "tipoServicio", "servicio", "categoria"],
      "Transporte de Personal",
    ),
  );
};

const buildDefaultDescription = (context) => {
  if (context.tipoSolicitud === "Movimiento Unidades Mayores") {
    return `Movimiento de unidades mayores ${context.origen || "origen"} - ${context.destino || "destino"}`;
  }
  if (context.tipoSolicitud === "Suministro Lacustre") {
    return `Suministro lacustre ${context.origen || "origen"} - ${context.destino || "destino"}`;
  }
  return `Transporte personal ${context.origen || "origen"} - ${context.destino || "destino"}`;
};

const buildBaseContext = (solicitud = {}) => {
  const today = new Date();
  const tipoSolicitud = getTipoSolicitud(solicitud);
  const origen = getFirstValue(
    solicitud,
    ["origen", "ubicacionOrigen", "lugarOrigen", "source"],
    "",
  );
  const destino = getFirstValue(
    solicitud,
    ["destino", "ubicacionDestino", "lugarDestino", "target"],
    "",
  );
  const fechaInicio = normalizeDate(
    getFirstValue(solicitud, [
      "fechaInicio",
      "fecha",
      "fechaSolicitud",
      "fechaProgramada",
      "inicio",
    ]),
  );
  const fechaFin = normalizeDate(
    getFirstValue(solicitud, ["fechaFin", "fechaFinal", "fechaHasta", "fin"]),
  );

  // --- NUEVA LÓGICA: Obtener Unidad a Movilizar ---
  const unidadMovilizar = getFirstValue(
    solicitud,
    [
      "unidadMovilizar",       // Formato frontend (camelCase)
      "unidad_movilizar",     // Posible formato Postgres (snake_case)
      "eqnum",                // Código nativo de equipos/Maximo
      "unidad"                // Alternativa genérica
    ],
    "",
  );

  // --- NUEVA LÓGICA: Obtener Descripción de la Unidad ---
  const descripcionUnidad = getFirstValue(
    solicitud,
    [
      "descripcionUnidad",    // Formato frontend (camelCase)
      "descripcion_unidad",   // Posible formato Postgres (snake_case)
      "description",          // Propiedad nativa de tu getEquipment
      "unidadDescripcion"     // Alternativa genérica
    ],
    "",
  );

  const context = {
    solicitud,
    tipoSolicitud,
    fechaInicio,
    fechaFin,
    fechaSolicitud:
      normalizeDate(
        getFirstValue(solicitud, [
          "fechaSolicitud",
          "fecha",
          "fechaInicio",
          "fechaProgramada",
        ]),
      ) || today,
    today,
    descripcion: normalizeText(
      getFirstValue(solicitud, [
        "descripcion",
        "motivo",
        "observaciones",
        "detalle",
        "descripcionSolicitud",
      ]),
      50,
    ),
    origen: normalizeText(origen, 15),
    descripcionOrigen:
      normalizeText(
        getFirstValue(
          solicitud,
          [
            "descripcionOrigen",
            "descripcionOrigenSolicitud",
            "origenDescripcion",
          ],
          "",
        ),
      ) || normalizeText(origen, 50),
    destino: normalizeText(destino, 15),
    descripcionDestino:
      normalizeText(
        getFirstValue(
          solicitud,
          [
            "descripcionDestino",
            "descripcionDestinoSolicitud",
            "destinoDescripcion",
          ],
          "",
        ),
      ) || normalizeText(destino, 50),
    organizacion: normalizeText(
      getFirstValue(
        solicitud,
        ["organizacionCcOi", "codigoOrganizacion", "organizacion", "ccoi"],
        "101181D",
      ),
      18,
    ),
    aprobador:
      normalizeText(
        getFirstValue(solicitud, [
          "aprobador",
          "supervisor",
          "aprobadorNombre",
        ]),
        12,
      ) || "SIN_SUPERV",
    solicitante:
      normalizeText(
        getFirstValue(solicitud, [
          "solicitante",
          "nombreSolicitante",
          "usuario",
        ]),
        18,
      ) || "SISTEMA",
    correo: normalizeText(
      getFirstValue(solicitud, ["correo", "email", "correoSolicitante"]),
      50,
    ),
    gerencia:
      normalizeText(
        getFirstValue(solicitud, ["gerencia", "departamento", "area"]),
        50,
      ) || "MANTENIMIENTO",
    cedulaSolicitante:
      normalizeText(
        getFirstValue(solicitud, [
          "cedulaSolicitante",
          "cedula",
          "identificacion",
        ]),
        20,
      ) || "0",
    modserv:
      normalizeText(
        getFirstValue(solicitud, ["modserv", "modalidad", "modalidadServicio"]),
        10,
      ) || "LANTRP",
    tipoServicio: normalizeText(
      getFirstValue(solicitud, ["tipoServicio", "servicio", "tipo"]),
      10,
    ),
    subtipo: normalizeText(
      getFirstValue(solicitud, ["subtipo", "categoria"]),
      20,
    ),

    // -------------------------------------------------------------
    // MAPEO A CONTEXT: Se añaden las propiedades normalizadas
    // Se limita el código a 15-20 caracteres y la descripción a 50
    // según los estándares que manejas en tu base Oracle
    // -------------------------------------------------------------
    unidadMovilizar: normalizeText(unidadMovilizar, 8),
    descripcionUnidad: normalizeText(descripcionUnidad, 50),
    // -------------------------------------------------------------
    cantidadPasajeros: Number.isInteger(
      parseInt(
        getFirstValue(solicitud, [
          "cantidadPasajeros",
          "pasajeros",
          "numeroPasajeros",
        ]),
        10,
      ),
    )
      ? parseInt(
          getFirstValue(solicitud, [
            "cantidadPasajeros",
            "pasajeros",
            "numeroPasajeros",
          ]),
          10,
        )
      : 1,
    changeby:
      normalizeText(
        getFirstValue(solicitud, [
          "solicitante",
          "nombreSolicitante",
          "usuario",
        ]),
        18,
      ) || "SISTEMA",
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
  formatDateOnly,
  formatDateTime,
  normalizeDateOnly,
  formatOracleDate,
  formatOracleTimestampTz,
};
