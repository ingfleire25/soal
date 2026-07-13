const { Osel } = require('../../../db');

// Wrapper simple para crear registros OSEL sin mezclar esa lógica con el servicio principal.
const createOselRecord = async ({ payload }) => {
  return Osel.create(payload);
};

module.exports = {
  createOselRecord,
};
