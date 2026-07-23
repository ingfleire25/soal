const { Osel } = require('../../../db');

// Wrapper simple para crear registros OSEL sin mezclar esa lógica con el servicio principal.
const createOselRecord = async ({ payload }) => {
  console.log('[Oracle writer] createOselRecord', {
    wonum: payload?.wonum,
    pmnum: payload?.pmnum,
    worktype: payload?.worktype,
  });
  return Osel.create(payload);
};

module.exports = {
  createOselRecord,
};
