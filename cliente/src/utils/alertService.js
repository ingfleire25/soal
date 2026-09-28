import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const toastDefaults = {
  toast: true,
  position: "top-end",
  timer: 3500,
  timerProgressBar: true,
  showConfirmButton: false,
  customClass: {
    popup: "swal2-borderless",
  },
};

export const notifySuccess = (message) => {
  return Swal.fire({
    ...toastDefaults,
    icon: "success",
    title: message,
  });
};

export const notifyError = (message) => {
  return Swal.fire({
    ...toastDefaults,
    icon: "error",
    title: message,
  });
};

export const notifyInfo = (message) => {
  return Swal.fire({
    ...toastDefaults,
    icon: "info",
    title: message,
  });
};

const escapeHtml = (value) =>
  String(value ?? "—").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return escapeHtml(
    new Intl.DateTimeFormat("es-VE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date),
  );
};

/** Modal compartido para confirmar una solicitud creada o aprobada. */
export const showSolicitudSummary = ({
  title,
  icon = "success",
  solicitud = {},
  oracle = null,
}) => {
  const rows = [
    ["Solicitud", solicitud.id],
    ["Tipo", solicitud.tipoSolicitud],
    ["Modalidad", solicitud.subtipo],
    ["Fecha de inicio", formatDateTime(solicitud.fechaInicio)],
    ["Fecha de finalización", formatDateTime(solicitud.fechaFin)],
    ["Origen", solicitud.origen],
    ["Destino", solicitud.destino],
  ];

  if (oracle?.wonum) rows.push(["WONUM (Oracle)", oracle.wonum]);
  if (oracle?.pmnum) rows.push(["PMNUM (Oracle)", oracle.pmnum]);

  const details = rows
    .map(
      ([label, value]) =>
        `<div class="d-flex justify-content-between gap-3 py-2 border-bottom"><strong>${escapeHtml(label)}</strong><span class="text-end">${escapeHtml(value)}</span></div>`,
    )
    .join("");

  return Swal.fire({
    icon,
    title,
    html: `<div class="text-start">${details}</div>`,
    confirmButtonText: "Cerrar",
    customClass: { popup: "swal2-borderless" },
  });
};

export const notifyWarning = (message) => {
  return Swal.fire({
    ...toastDefaults,
    icon: "warning",
    title: message,
  });
};

export const confirmAction = (options) => {
  return Swal.fire({
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
    ...options,
  });
};

export const promptAction = (options) => {
  return Swal.fire({
    icon: "question",
    input: "text",
    inputLabel: options.inputLabel || "Ingrese el motivo",
    inputPlaceholder: options.inputPlaceholder || "Escriba aquí...",
    inputAttributes: {
      maxlength: 250,
      autocapitalize: "sentences",
      autocorrect: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Enviar",
    cancelButtonText: "Cancelar",
    ...options,
  });
};
