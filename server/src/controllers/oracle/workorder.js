const db = require('../../db');

const WorkOrder = db.WorkOrder || db.Workorder;

// Controlador de lectura/creación de WorkOrder para la integración con Oracle.
// Permite consultar un registro por WONUM o crear uno nuevo cuando la propagación lo requiera.

const getWorkorders = async (req, res) => {
  try {
    const { wonum } = req.params;

    if (wonum) {
      const registro = await WorkOrder.findByPk(wonum);

      if (!registro) {
        return res.status(404).json({
          success: false,
          message: `No se encontró un WorkOrder con WONUM: ${wonum}`
        });
      }

      return res.status(200).json({
        success: true,
        data: registro
      });
    }

    const registros = await WorkOrder.findAll({ limit: 50, order: [['wonum', 'DESC']] });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    console.error('Error al consultar WorkOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al consultar WorkOrder',
      error: error.message
    });
  }
};

const createWorkorder = async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.wonum) {
      return res.status(400).json({
        success: false,
        message: 'El campo wonum es obligatorio.'
      });
    }

    if (!data.rowstamp) {
      data.rowstamp = String(Date.now());
    }

    const nuevo = await WorkOrder.create(data);

    return res.status(201).json({
      success: true,
      message: 'WorkOrder creado exitosamente.',
      data: nuevo
    });
  } catch (error) {
    console.error('Error al crear WorkOrder:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un WorkOrder con ese WONUM.',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al registrar WorkOrder en la base de datos.',
      error: error.message,
      detailed: error.original ? error.original.message : null
    });
  }
};

module.exports = {
  getWorkorders,
  createWorkorder
};
