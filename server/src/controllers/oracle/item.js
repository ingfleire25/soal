const { Item } = require('../../db'); // Ajusta la ruta según donde esté tu archivo de conexión
const { Op } = require('sequelize');

/**
 * Obtiene una lista simplificada de ítems
 * Trae solo: itemnum, description y stocktype
 */
const getBasicItems = async (req, res) => {
    try {
        const items = await Item.findAll({
            // Seleccionamos solo las columnas requeridas
            attributes: ['itemnum', 'description', 'stocktype'],
            
            // Opcional: puedes agregar un límite si la tabla es muy grande
            // limit: 100, 
            
            // Opcional: ordenar por número de ítem
            order: [['itemnum', 'ASC']]
        });

        if (!items || items.length === 0) {
            return res.status(404).json({
                message: "No se encontraron ítems."
            });
        }

        return res.status(200).json(items);

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