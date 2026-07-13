const { WoStatus } = require('../../../db');

// Wrapper simple para crear registros de estado de work order en Oracle.
const createWoStatusRecord = async ({ payload }) => {
  return WoStatus.create(payload);
};

module.exports = {
  createWoStatusRecord,
};
