const DOMINIO_CORREO = "@pdvsa.com.ve";
const LONGITUD_CORREO_ORACLE = 50;

export function obtenerIndicadorCorreo(correo) {
  return String(correo || "")
    .trim()
    .split("@")[0]
    .toLowerCase()
    .slice(0, LONGITUD_CORREO_ORACLE);
}

export function completarCorreo(correo) {
  const indicador = obtenerIndicadorCorreo(correo);
  return indicador ? `${indicador}${DOMINIO_CORREO}` : "";
}