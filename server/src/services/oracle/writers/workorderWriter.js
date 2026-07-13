const db = require('../../../db');

const WorkOrder = db.WorkOrder || db.Workorder;

// Wrapper para la creación de work orders en Oracle.
// El servicio de propagación solo envía el payload y no necesita conocer el modelo subyacente.
const createWorkorderRecord = async ({ payload }) => {
  return WorkOrder.create(payload);
};

module.exports = {
  createWorkorderRecord,
};
