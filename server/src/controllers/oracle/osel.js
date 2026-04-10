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

module.exports = { getOselData };