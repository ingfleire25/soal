const { Modserv } = require('../db');

// Controlador para MODSERV

// Obtener todos los registros
exports.getAll = async (req, res) => {
  try {
    const modservs = await Modserv.findAll({ 
      order: [['modnum', 'ASC']] 
    });
    res.status(200).json({ 
      statusCode: 200, 
      statusText: 'OK', 
      result: modservs 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      statusCode: 500, 
      statusText: 'Error al obtener servicios', 
      error: err.message 
    });
  }
};

// Obtener un registro por MODNUM
exports.getByModnum = async (req, res) => {
  const { modnum } = req.params;
  
  try {
    const modserv = await Modserv.findOne({ 
      where: { modnum: modnum } 
    });
    
    if (!modserv) {
      return res.status(404).json({ 
        statusCode: 404, 
        statusText: 'Servicio no encontrado' 
      });
    }
    
    res.status(200).json({ 
      statusCode: 200, 
      statusText: 'OK', 
      result: modserv 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      statusCode: 500, 
      statusText: 'Error al obtener servicio', 
      error: err.message 
    });
  }
};

// Crear un nuevo servicio
exports.create = async (req, res) => {
  const { 
    rowstamp, modnum, description, hours, days, 
    mod1, mod2, mod3, mod4, mod5, ldkey 
  } = req.body;
  
  // Validar campos obligatorios (según restricciones de la BD)
  if (!modnum || !hours || !days) {
    return res.status(400).json({ 
      statusCode: 400, 
      statusText: 'Faltan campos obligatorios: modnum, hours, days son requeridos' 
    });
  }

  try {
    const nuevo = await Modserv.create({ 
      rowstamp, 
      modnum, 
      description, 
      hours, 
      days, 
      mod1, 
      mod2, 
      mod3, 
      mod4, 
      mod5, 
      ldkey 
    });
    
    res.status(201).json({ 
      statusCode: 201, 
      statusText: 'Servicio creado', 
      result: nuevo 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      statusCode: 500, 
      statusText: 'Error al crear servicio', 
      error: err.message 
    });
  }
};

// Actualizar un servicio existente
exports.update = async (req, res) => {
  const { modnum } = req.params;
  const updateData = req.body;
  
  try {
    const modserv = await Modserv.findOne({ 
      where: { modnum: modnum } 
    });
    
    if (!modserv) {
      return res.status(404).json({ 
        statusCode: 404, 
        statusText: 'Servicio no encontrado' 
      });
    }
    
    await modserv.update(updateData);
    
    res.status(200).json({ 
      statusCode: 200, 
      statusText: 'Servicio actualizado', 
      result: modserv 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      statusCode: 500, 
      statusText: 'Error al actualizar servicio', 
      error: err.message 
    });
  }
};

// Eliminar un servicio
exports.delete = async (req, res) => {
  const { modnum } = req.params;
  
  try {
    const modserv = await Modserv.findOne({ 
      where: { modnum: modnum } 
    });
    
    if (!modserv) {
      return res.status(404).json({ 
        statusCode: 404, 
        statusText: 'Servicio no encontrado' 
      });
    }
    
    await modserv.destroy();
    
    res.status(200).json({ 
      statusCode: 200, 
      statusText: 'Servicio eliminado correctamente' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      statusCode: 500, 
      statusText: 'Error al eliminar servicio', 
      error: err.message 
    });
  }
};

// Obtener servicios filtrados por horas
exports.getByHours = async (req, res) => {
  const { min, max } = req.query;
  
  try {
    let whereCondition = {};
    
    if (min || max) {
      whereCondition.hours = {};
      if (min) whereCondition.hours[Op.gte] = parseInt(min);
      if (max) whereCondition.hours[Op.lte] = parseInt(max);
    }
    
    const modservs = await Modserv.findAll({ 
      where: whereCondition,
      order: [['hours', 'ASC']] 
    });
    
    res.status(200).json({ 
      statusCode: 200, 
      statusText: 'OK', 
      result: modservs 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      statusCode: 500, 
      statusText: 'Error al obtener servicios por horas', 
      error: err.message 
    });
  }
};

// Buscar servicios por descripción
exports.searchByDescription = async (req, res) => {
  const { term } = req.query;
  const { Op } = require('sequelize');
  
  if (!term) {
    return res.status(400).json({ 
      statusCode: 400, 
      statusText: 'Se requiere un término de búsqueda' 
    });
  }
  
  try {
    const modservs = await Modserv.findAll({ 
      where: {
        description: {
          [Op.like]: `%${term}%`
        }
      },
      order: [['description', 'ASC']] 
    });
    
    res.status(200).json({ 
      statusCode: 200, 
      statusText: 'OK', 
      result: modservs 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      statusCode: 500, 
      statusText: 'Error al buscar servicios', 
      error: err.message 
    });
  }
};