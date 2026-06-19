const { Pm } = require('../../db'); // Ajusta esta ruta según la estructura de tus carpetas
const { Op, Sequelize } = require('sequelize');

/**
 * 1. OBTENER REGISTROS (GET)
 * Diseñado específicamente para bases de datos Oracle antiguas.
 * Utiliza ROWNUM para evitar el error ORA-00933 provocado por cláusulas LIMIT modernas.
 */
const getPms = async (req, res) => {
  try {
    const { pmnum } = req.query;
    
    // Objeto base para las condiciones de búsqueda
    const whereCondition = {};
    
    // Si el usuario envía un pmnum por la URL (ej: ?pmnum=PM-100), se aplica el filtro
    if (pmnum) {
      whereCondition.pmnum = { [Op.like]: `%${pmnum}%` };
    }

    // Inyección segura de ROWNUM para limitar a un máximo de 20 filas sin romper la sintaxis de Oracle
    whereCondition[Op.and] = Sequelize.literal('ROWNUM <= 20');

    const pms = await Pm.findAll({
      where: whereCondition
    });

    return res.status(200).json(pms);
  } catch (error) {
    console.error('Error al obtener registros PM:', error);
    return res.status(500).json({
      message: 'Error al obtener registros PM',
      error: error.message
    });
  }
};

/**
 * 2. CREAR UN REGISTRO NUEVO (POST)
 * Recibe el JSON completo desde el cliente y realiza el insert en el esquema MAXIMO.
 */
const createPm = async (req, res) => {
  try {
    const data = req.body;
    
    // Ejecuta la inserción directa usando el modelo Sequelize
    const nuevoPm = await Pm.create(data);
    
    return res.status(201).json(nuevoPm);
  } catch (error) {
    console.error('Error creando registro PM:', error);
    return res.status(500).json({
      message: 'Error al crear registro PM',
      error: error.message
    });
  }
};

// Exportación limpia de ambos controladores
module.exports = {
  getPms,
  createPm
};