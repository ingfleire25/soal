const { Chartofaccounts, Companies } = require('../../db');
const { Op } = require('sequelize');

const getChartWithCompanies = async (req, res) => {
  try {
    const results = await Chartofaccounts.findAll({
      attributes: ['glaccount'],
      where: {
        ch1: {
          [Op.ne]: null // CH1 IS NOT NULL
        },
        ch2: {
          [Op.gt]: new Date() // CH2 > SYSDATE
        }
      },
      include: [{
        model: Companies,
        as: 'companyData',
        attributes: ['name'],
        required: true
      }],
      order: [
        ['ch3', 'ASC']
      ]
    });

    const cleanData = results.map(item => ({
      GLACCOUNT: item.glaccount,
      NAME: item.companyData ? item.companyData.name : null
    }));

    return res.status(200).json(cleanData);
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    return res.status(500).json({
      error: 'No se pudo obtener Chartofaccounts con Companies',
      details: error.message
    });
  }
};

module.exports = { getChartWithCompanies }; 
