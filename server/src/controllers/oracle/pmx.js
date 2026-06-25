const Pmx = require('../../db'); // Ajusta la ruta a donde guardaste el modelo Pmx

/**
 * 1. OBTENER INFORMACIÓN (GET)
 * Busca un registro PMX por su llave primaria (PMNUM) o lista todos si no se envía parámetro.
 */
const getPmx = async (req, res) => {
  try {
    const { pmnum } = req.params;

    // Si viene un pmnum en la URL (ej: /api/pmx/8384), buscamos ese registro específico
    if (pmnum) {
      const registro = await Pmx.findByPk(pmnum);
      
      if (!registro) {
        return res.status(404).json({
          success: false,
          message: `No se encontró ninguna extensión PMX para el PMNUM: ${pmnum}`
        });
      }

      return res.status(200).json({
        success: true,
        data: registro
      });
    }

    // Si no viene parámetro (ej: /api/pmx), listamos los últimos 50 por rendimiento
    const registros = await Pmx.findAll({ limit: 50 });
    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros
    });

  } catch (error) {
    console.error('Error al consultar PMX:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al consultar PMX',
      error: error.message
    });
  }
};

/**
 * 2. CREAR REGISTRO (POST)
 * Valida los datos entrantes, calcula dinámicamente el totalrate e inserta en Oracle.
 */
const createPmx = async (req, res) => {
  try {
    const data = req.body;

    // Validación básica obligatoria
    if (!data.pmnum) {
      return res.status(400).json({
        success: false,
        message: 'El campo pmnum es obligatorio para asociar la extensión PMX.'
      });
    }

    // 1. Control de Concurrencia (ROWSTAMP)
    // Si el cliente no lo envía, generamos un identificador numérico basado en el tiempo actual
    if (!data.rowstamp) {
      data.rowstamp = String(Date.now());
    }

    // 2. Cálculo Automático y Dinámico del TOTALRATE
    // Recorremos los campos rate1 al rate10 del body para sumarlos limpiamente en el Backend
    let sumatoriaRates = 0;
    for (let i = 1; i <= 10; i++) {
      const valorRate = parseInt(data[`rate${i}`], 10);
      if (!isNaN(valorRate)) {
        sumatoriaRates += valorRate;
      }
    }
    data.totalrate = sumatoriaRates; // Reemplazamos o asignamos el total calculado

    // 3. Normalización de Flags de Servicio (serv1 a serv5)
    // Aseguramos que si vienen vacíos tengan un valor por defecto o nulo controlado
    for (let i = 1; i <= 5; i++) {
      if (data[`serv${i}`]) {
        data[`serv${i}`] = String(data[`serv${i}`]).toUpperCase().substring(0, 1);
      }
    }

    // 4. Inserción directa en la base de datos Oracle a través de Sequelize
    const nuevoPmx = await Pmx.create(data);

    return res.status(201).json({
      success: true,
      message: 'Extensión PMX guardada exitosamente.',
      data: nuevoPmx
    });

  } catch (error) {
    console.error('Error al insertar en PMX:', error);

    // Captura de errores específicos de Sequelize (ej: llaves duplicadas en Oracle)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una extensión configurada para este número de PM (PMNUM duplicado).',
        error: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al registrar la extensión PMX en la base de datos.',
      error: error.message,
      detailed: error.original ? error.original.message : null
    });
  }
};

module.exports = {
  getPmx,
  createPmx
};