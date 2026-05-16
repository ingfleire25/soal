const { Labor } = require('../../db');
const { Op } = require('sequelize');


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

/**
 * Obtiene registros de LABOR filtrados por estado, tipo y existencia de PIN
 * SQL equivalente: SELECT Name, Pagepin, La13 FROM LABOR 
 * WHERE LA3='S' AND La13 IN ('1','2','3') AND Pagepin IS NOT NULL
 */
const getFilteredLabor = async (req, res) => {
    try {
        const { nivel, name } = req.query;
        const where = {
            la3: 'S',
            pagepin: {
                [Op.ne]: null
            }
        };

        if (nivel && ['1', '2', '3'].includes(String(nivel))) {
            where.la13 = {
                [Op.gte]: Number(nivel),
                [Op.lte]: 3
            };
        } else {
            where.la13 = {
                [Op.in]: [1, 2, 3]
            };
        }

        if (name && name.trim().length > 0) {
            where[Op.or] = [
                { name: { [Op.like]: `%${name.trim()}%` } },
                { pagepin: { [Op.like]: `%${name.trim()}%` } }
            ];
        }

        const results = await Labor.findAll({
            attributes: ['name', 'pagepin', 'la13'],
            where,
            order: [['name', 'ASC']]
        });

        return res.status(200).json(results);

    } catch (error) {
        console.error("Error al consultar la tabla LABOR:", error);
        return res.status(500).json({
            message: "Error al obtener datos de mano de obra",
            error: error.message
        });
    }
};

module.exports = { getActiveLabor,
  getFilteredLabor
 };