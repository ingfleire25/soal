const DOMINIO_CORREO = "@pdvsa.com.ve";
const LONGITUD_CORREO_ORACLE = 50;

const obtenerIndicadorCorreo = (correo) =>
  String(correo || "")
    .trim()
    .split("@")[0]
    .toLowerCase()
    .substring(0, LONGITUD_CORREO_ORACLE);

const completarCorreo = (correo) => {
  const indicador = obtenerIndicadorCorreo(correo);
  return indicador ? `${indicador}${DOMINIO_CORREO}` : "";
};

module.exports = { obtenerIndicadorCorreo, completarCorreo };