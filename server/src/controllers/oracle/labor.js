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
        const results = await Labor.findAll({
            // Definimos solo las columnas solicitadas
            attributes: ['name', 'pagepin', 'la13'],
            
            // Aplicamos los filtros del WHERE
            where: {
                la3: 'S', // LA3 = 'S'
                la13: {
                    [Op.in]: ['1', '2', '3'] // La13 IN ('1','2','3')
                },
                pagepin: {
                    [Op.ne]: null // Pagepin IS NOT NULL
                }
            },

            // Opcional: Ordenar por nombre
            order: [['name', 'ASC']]
        });

        // Verificamos si hay resultados
        if (results.length === 0) {
            return res.status(404).json({
                message: "No se encontraron registros que coincidan con los criterios."
            });
        }

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