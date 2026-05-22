const { Osel } = require('../../db');


const getOselData = async (req, res) => {
  try {
    const orders = await Osel.findAll({
      attributes: [
        'wonum', 'description', 'worktype', 'status', 
        'glaccount', 'worts1', 'wol3', 'req', 'bandera', 'correo'
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo registro en Osel
const createOsel = async (req, res) => {
  try {
    const data = req.body;
    const nuevoOsel = await Osel.create(data);
    return res.status(201).json(nuevoOsel);
  } catch (error) {
    console.error('Error creando Osel:', error);
    return res.status(500).json({
      message: 'Error al crear registro Osel',
      error: error.message
    });
  }
};

module.exports = { getOselData, createOsel };