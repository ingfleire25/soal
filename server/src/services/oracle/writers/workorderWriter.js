const db = require('../../../db');

const WorkOrder = db.WorkOrder || db.Workorder;

// Wrapper para la creación de work orders en Oracle.
// El servicio de propagación solo envía el payload y no necesita conocer el modelo subyacente.
const createWorkorderRecord = async ({ payload }) => {
  console.log('[Oracle writer] createWorkorderRecord', {
    wonum: payload?.wonum,
    pmnum: payload?.pmnum,
    worktype: payload?.worktype,
    statusdate: payload?.statusdate,
    targstartdate: payload?.targstartdate,
    targcompdate: payload?.targcompdate,
    eqnum: payload?.eqnum,
    wo1: payload?.wo1,
  });
  return WorkOrder.create(payload);
};

module.exports = {
  createWorkorderRecord,
};
