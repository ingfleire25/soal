const { Companies } = require('../db'); // Ajusta la ruta a tu archivo de unión de modelos

const getCompaniesSimple = async (req, res) => {
  try {
    const companies = await Companies.findAll({
      attributes: ['company', 'name'],
      order: [['name', 'ASC']]
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getCompaniesSimple };