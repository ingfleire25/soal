// Importamos el modelo (ajusta la ruta según la estructura de tu proyecto)
const { Servacct } = require('../../db'); 

/**
 * Obtener registros de SERVACCT (GET)
 * Compatible con Oracle 9i (sin clausulas LIMIT / OFFSET ni subconsultas COUNT)
 */
const getServaccts = async (req, res) => {
  try {
    const { wonum } = req.params;
   
    if(!wonum){
        return res.status(400).json({
            ok:false,
            message: 'El paramatro wonum es obligatorio'
        })
    }
      // En Maximo, los folios u ordenes (WONUM) suelen guardarse en mayúsculas
formatWonum = wonum.toString().trim().toUpperCase();

    const rows = await Servacct.findByPk(formatWonum);

    return res.status(200).json({
      ok: true,
      data: rows
    });
  } catch (error) {
    console.error('Error al consultar SERVACCT en Oracle 9i:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al consultar los registros.',
      error: error.message
    });
  }
};

/**
 * Crear un nuevo registro en SERVACCT (POST)
 */
const createServacct = async (req, res) => {
  try {
    const body = req.body;

    // Validación básica de campos obligatorios en el DDL
    if (!body.rowstamp || !body.wonum) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos "rowstamp" y "wonum" son obligatorios.'
      });
    }

    // Aseguramos que los valores obligatorios vengan limpios
    const dataToCreate = {
      ...body,
      wonum: body.wonum.toString().trim().toUpperCase()
    };

    const newRecord = await Servacct.create(dataToCreate);

    return res.status(201).json({
      ok: true,
      message: 'Registro creado exitosamente en MAXIMO.SERVACCT',
      data: newRecord
    });
  } catch (error) {
    console.error('Error al insertar en SERVACCT en Oracle 9i:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un registro con esa clave primaria (rowstamp).',
        error: error.message
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al crear el registro.',
      error: error.message
    });
  }
};

module.exports = {
  getServaccts,
  createServacct
};