const { WoStatus } = require('../../../db');

// Wrapper simple para crear registros de estado de work order en Oracle.
const createWoStatusRecord = async ({ payload, transaction }) => {
  return WoStatus.create(payload, { transaction });
};

module.exports = {
  createWoStatusRecord,
};
