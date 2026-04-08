const { Labor } = require('../db');

const getActiveLabor = async (req, res) => {
  try {
    const laborers = await Labor.findAll({
      where: { la2: 'S' },
      // Trae todos los campos como pediste
    });
    res.json(laborers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getActiveLabor };