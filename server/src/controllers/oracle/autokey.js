const db = require('../../db');

const AutoKey = db.AutoKey || db.Autokey;

// Controlador de AutoKey para consultar o registrar secuencias de numeración.
// Se usa como apoyo para los procesos que crean registros en Oracle y necesitan un consecutivo válido.

const getAutokeys = async (req, res) => {
  try {
    const { tbname } = req.params;

    if (tbname) {
      const registro = await AutoKey.findByPk(tbname);

      if (!registro) {
        return res.status(404).json({
          success: false,
          message: `No se encontró un AutoKey con TBNAME: ${tbname}`
        });
      }

      return res.status(200).json({
        success: true,
        data: registro
      });
    }

    const registros = await AutoKey.findAll({ limit: 50, order: [['tbname', 'ASC']] });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });
  } catch (error) {
    console.error('Error al consultar AutoKey:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al consultar AutoKey',
      error: error.message
    });
  }
};

const createAutokey = async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.tbname) {
      return res.status(400).json({
        success: false,
        message: 'El campo tbname es obligatorio.'
      });
    }

    if (!data.rowstamp) {
      data.rowstamp = String(Date.now());
    }

    const nuevo = await AutoKey.create(data);

    return res.status(201).json({
      success: true,
      message: 'AutoKey creado exitosamente.',
      data: nuevo
    });
  } catch (error) {
    console.error('Error al crear AutoKey:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un AutoKey con ese TBNAME.',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al registrar AutoKey en la base de datos.',
      error: error.message,
      detailed: error.original ? error.original.message : null
    });
  }
};

module.exports = {
  getAutokeys,
  createAutokey
};
