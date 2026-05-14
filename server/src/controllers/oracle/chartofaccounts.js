const { Chartofaccounts, Companies } = require('../../db');
const { QueryTypes } = require('sequelize');


const { Op } = require('sequelize');

const getChartWithCompanies = async (req, res) => {
  try {
    const results = await Chartofaccounts.findAll({
      // Seleccionamos solo GLACCOUNT de Chartofaccounts
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
        attributes: ['name'], // Seleccionamos solo NAME de Companies
        required: true // Esto fuerza un INNER JOIN (CH3 = COMPANY)
      }],
      
      order: [
        ['ch3', 'ASC'] // ORDER BY CH.CH3
      ]
    });

    // Formatear la respuesta para que sea plana como tu SQL si lo deseas
    const cleanData = results.map(item => ({
      GLACCOUNT: item.glaccount,
      NAME: item.companyData ? item.companyData.name : null
    }));

    return cleanData;
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    throw error;
  }
};


module.exports =  {getChartWithCompanies} 
