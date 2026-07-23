const { Wpmaterial } = require('../../db');

/**
 * GET: Consultar materiales asignados a una orden (WONUM)
 * Una orden (WONUM) suele tener múltiples materiales asignados.
 */
const getWpMaterialsByWonum = async (req, res) => {
  try {
    const { wonum } = req.params;

    if (!wonum) {
      return res.status(400).json({
        ok: false,
        message: 'El parámetro wonum es obligatorio en la URL.'
    });

    }
const formattedWonum = wonum.toString().trim().toUpperCase();


    // const materials = await Wpmaterial.findByPk(formattedWonum)
    const materials = await Wpmaterial.findAll({
      where: { wonum: formattedWonum },
      raw: true
    });


    return res.status(200).json({
      ok: true,
      total: materials.length,
      data: materials
    });
  } catch (error) {
    console.error('Error al consultar WPMATERIAL en Oracle 9i:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al consultar materiales.',
      error: error.message
    });
  }
};

/**
 * POST: Insertar un nuevo material en WPMATERIAL
 */
const createWpMaterial = async (req, res) => {
  try {
    const body = req.body;

    // Campos obligatorios según el DDL (NOT NULL)
    const requiredFields = ['rowstamp', 'wonum', 'itemnum', 'itemqty', 'unitcost', 'directreq', 'unitcosthaschanged'];
    const missingFields = requiredFields.filter(field => body[field] === undefined || body[field] === null);

    if (missingFields.length > 0) {
      return res.status(400).json({
        ok: false,
        message: `Faltan campos obligatorios: ${missingFields.join(', ')}`
      });
    }

    const dataToCreate = {
      ...body,
      wonum: body.wonum.toString().trim().toUpperCase(),
      itemnum: body.itemnum.toString().trim().toUpperCase()
    };

    const newMaterial = await Wpmaterial.create(dataToCreate);

    return res.status(201).json({
      ok: true,
      message: 'Material registrado exitosamente en MAXIMO.WPMATERIAL',
      data: newMaterial
    });
  } catch (error) {
    console.error('Error al insertar en WPMATERIAL:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un registro con ese rowstamp.',
        error: error.message
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al registrar el material.',
      error: error.message
    });
  }
};

module.exports = {
  getWpMaterialsByWonum,
  createWpMaterial
};