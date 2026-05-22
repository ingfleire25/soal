const { Item } = require('../../db'); // Ajusta la ruta según donde esté tu archivo de conexión
const { Op, fn, col, where } = require('sequelize');

/**
 * Obtiene una lista simplificada de ítems
 * Trae solo: itemnum, description y stocktype
 */
const getBasicItems = async (req, res) => {
    try {
        const searchQuery = (req.query.q || '').toString().toUpperCase().trim();
        const whereClause = {};

        if (searchQuery.length > 0) {
            // Buscar coincidencias parciales en los tres campos (simple Op.like)
            whereClause[Op.or] = [
                { itemnum: { [Op.like]: `%${searchQuery}%` } },
                { description: { [Op.like]: `%${searchQuery}%` } },
                { stocktype: { [Op.like]: `%${searchQuery}%` } }
            ]; 
        }

        const items = await Item.findAll({
            // Seleccionamos solo las columnas requeridas
            attributes: ['itemnum', 'description', 'stocktype'],
            where: whereClause,
            order: [['itemnum', 'ASC']] 
        });

        return res.status(200).json(items || []);

    } catch (error) {
        console.error("Error al obtener ítems de Oracle:", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

module.exports = {
    getBasicItems
};