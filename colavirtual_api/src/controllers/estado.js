// controllers/estados.js
const { Estado } = require('../db'); // Asegúrate de importar el modelo Estado

//----------- GET -----------//

/**
 * @desc Obtiene todos los estados activos o inactivos.
 * @route GET /api/estados
 * @param {Object} req.query.activo - Parámetro de consulta para filtrar por estado activo (opcional).
 */
exports.getAll = async (req, res) => {
    const { activo } = req.query;
    let opt = {
        where: {},
        order: [['tx_nombre', 'ASC']] // Ordenar por nombre alfabéticamente
    };

    // Si se proporciona el parámetro 'activo', filtrar por isActive
    // if (activo) {
    //     opt.where = { ...opt.where, isActive: (activo === 'true') };
    // }

    try {
        const estados = await Estado.findAll(opt);
        return res.status(200).json({ statusCode: 200, statusText: "OK", result: estados });
    } catch (error) {
        console.error("Error al obtener estados:", error);
        return res.status(500).json({ statusCode: 500, statusText: "Error en el servidor", message: error.message });
    }
};

/**
 * @desc Obtiene un estado por su ID.
 * @route GET /api/estados/:estadoId
 * @param {string} req.params.estadoId - El UUID del estado.
 */
exports.getPorId = async (req, res) => {
    const { estadoId } = req.params;
    try {
        const estado = await Estado.findByPk(estadoId);
        if (!estado) {
            return res.status(404).json({ statusCode: 404, statusText: "Not Found", message: "Estado no encontrado" });
        }
        return res.status(200).json({ statusCode: 200, statusText: "OK", result: estado });
    } catch (error) {
        console.error("Error al obtener estado por ID:", error);
        return res.status(500).json({ statusCode: 500, statusText: "Error en el servidor", message: error.message });
    }
};

// Puedes añadir más métodos si necesitas crear, actualizar o eliminar estados en el futuro
// Por ejemplo, para un PUT para cambiar el estado (isActive) si fuera necesario:
/*
exports.switchEstado = async (req, res) => {
    const { estadoId } = req.params;
    try {
        const estado = await Estado.findByPk(estadoId);
        if (!estado) {
            return res.status(404).json({ statusCode: 404, statusText: "Not Found", message: "Estado no encontrado" });
        }
        estado.isActive = !estado.isActive;
        await estado.save();
        return res.status(204).send(); // 204 No Content para indicar éxito sin cuerpo de respuesta
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        return res.status(400).json({ statusCode: 400, statusText: 'Error al actualizar', message: error.message });
    }
};
*/