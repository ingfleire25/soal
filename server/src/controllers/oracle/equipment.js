const {Equipment} = require('../../db'); // Ajusta la ruta a tu modelo Equipment
const { Op } = require('sequelize');

/**
 * Obtiene una lista simplificada de equipos activos/utilizados (EQ7 = 'U')
 * Filtra dinámicamente según el texto que ingresa por el query string (?q=...)
 * Trae solo: eqnum y description
 */
const getBasicEquipment = async (req, res) => {
    try {
        // Capturamos el texto de búsqueda, lo convertimos a mayúsculas y limpiamos espacios vacíos
        const searchQuery = (req.query.q || '').toString().toUpperCase().trim();

        // Condición fija de negocio: EQ7 siempre debe ser igual a 'U'
        const whereClause = {
            eq7: 'U'
        };

        // Si el usuario escribió algo en el input, acoplamos los filtros de coincidencia parcial
        if (searchQuery.length > 0) {
            whereClause[Op.or] = [
                { eqnum: { [Op.like]: `%${searchQuery}%` } },
                { description: { [Op.like]: `%${searchQuery}%` } }
            ];
        }

        // Ejecutamos la consulta optimizada seleccionando solo los atributos estrictamente necesarios
        const equipmentList = await Equipment.findAll({
            attributes: ['eqnum', 'description'],
            where: whereClause,
            order: [['eqnum', 'ASC']]
            // limit: 50
        });

        return res.status(200).json(equipmentList || []);

    } catch (error) {
        console.error("Error al obtener equipos de Oracle:", error);
        return res.status(500).json({
          message: "Error interno del servidor al consultar equipos",
          error: error.message
        });
    }
};

module.exports = {
    getBasicEquipment
};