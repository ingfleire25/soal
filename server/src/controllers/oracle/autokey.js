// const { AutoKey } = require('../../db');



// // Controlador de AutoKey para consultar o registrar secuencias de numeración.
// // Se usa como apoyo para los procesos que crean registros en Oracle y necesitan un consecutivo válido.

// const getAutokeys = async (req, res) => {
//   try {
//     const { tbname } = req.params;

//     if (tbname) {
//       const registro = await AutoKey.findByPk(tbname);

//       if (!registro) {
//         return res.status(404).json({
//           success: false,
//           message: `No se encontró un AutoKey con TBNAME: ${tbname}`
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         data: registro
//       });
//     }

//     const registros = await AutoKey.findAll({ limit: 50, order: [['tbname', 'ASC']] });

//     return res.status(200).json({
//       success: true,
//       count: registros.length,
//       data: registros
//     });
//   } catch (error) {
//     console.error('Error al consultar AutoKey:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error interno del servidor al consultar AutoKey',
//       error: error.message
//     });
//   }
// };

// const createAutokey = async (req, res) => {
//   try {
//     const data = req.body || {};

//     if (!data.tbname) {
//       return res.status(400).json({
//         success: false,
//         message: 'El campo tbname es obligatorio.'
//       });
//     }

//     if (!data.rowstamp) {
//       data.rowstamp = String(Date.now());
//     }

//     const nuevo = await AutoKey.create(data);

//     return res.status(201).json({
//       success: true,
//       message: 'AutoKey creado exitosamente.',
//       data: nuevo
//     });
//   } catch (error) {
//     console.error('Error al crear AutoKey:', error);

//     if (error.name === 'SequelizeUniqueConstraintError') {
//       return res.status(409).json({
//         success: false,
//         message: 'Ya existe un AutoKey con ese TBNAME.',
//         error: error.message
//       });
//     }

//     return res.status(500).json({
//       success: false,
//       message: 'Error al registrar AutoKey en la base de datos.',
//       error: error.message,
//       detailed: error.original ? error.original.message : null
//     });
//   }
// };

// module.exports = {
//   getAutokeys,
//   createAutokey
// };


const {AutoKey, connOracle} = require('../../db');


/**
 * Consulta un AutoKey. Si se proporciona `tbname` y `increment=true` en los query params,
 * incrementa atómicamente el SEED en +1, actualiza la tabla y retorna el nuevo correlativo.
 */
const getAutokeys = async (req, res) => {
  const { tbname } = req.params;
  const shouldIncrement = req.query.increment === 'true';

  try {
    if (tbname) {
      const formattedTbname = tbname.toUpperCase();

      // Si no requiere incrementar, realiza una lectura simple sin transacción
      if (!shouldIncrement) {
        const registro = await AutoKey.findByPk(formattedTbname);

        if (!registro) {
          return res.status(404).json({
            success: false,
            message: `No se encontró un AutoKey con TBNAME: ${formattedTbname}`,
          });
        }

        return res.status(200).json({
          success: true,
          data: registro,
        });
      }

      // --- INICIO DE PROCESO ATÓMICO CON INCREMENTO ---
      const transaction = await connOracle.transaction();

      try {
        // Bloqueo FOR UPDATE para evitar colisiones concurrentes
        const registro = await AutoKey.findByPk(formattedTbname, {
          transaction,
          lock: true,
        });

        if (!registro) {
          await transaction.rollback();
          return res.status(404).json({
            success: false,
            message: `No se encontró un AutoKey con TBNAME: ${formattedTbname}`,
          });
        }

        // Incrementar SEED +1 y actualizar ROWSTAMP
        const newSeed = Number(registro.seed) + 1;
        const newRowstamp = String(Date.now());

        await AutoKey.update(
          {
            seed: newSeed,
            rowstamp: newRowstamp,
          },
          {
            where: { tbname: formattedTbname },
            transaction,
          }
        );

        await transaction.commit();

        // Formatear el resultado final (Prefijo + Seed)
        const prefix = registro.prefix ? registro.prefix.trim() : '';
        const generatedCode = `${prefix}${newSeed}`;

        return res.status(200).json({
          success: true,
          message: `SEED incrementado con éxito para ${formattedTbname}.`,
          nextCode: generatedCode,
          data: {
            tbname: registro.tbname,
            prefix: registro.prefix,
            seed: newSeed,
            rowstamp: newRowstamp,
          },
        });
      } catch (transError) {
        await transaction.rollback();
        throw transError;
      }
    }

    // Consulta general (sin paginación limit/offset por compatibilidad con versiones antiguas de Oracle)
    const registros = await AutoKey.findAll({
      order: [['tbname', 'ASC']],
    });

    return res.status(200).json({
      success: true,
      count: registros.length,
      data: registros,
    });
  } catch (error) {
    console.error('Error al consultar AutoKey:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al consultar AutoKey',
      error: error.message,
    });
  }
};

const createAutokey = async (req, res) => {
  try {
    const data = req.body || {};

    if (!data.tbname) {
      return res.status(400).json({
        success: false,
        message: 'El campo tbname es obligatorio.',
      });
    }

    data.tbname = data.tbname.toUpperCase();

    if (!data.rowstamp) {
      data.rowstamp = String(Date.now());
    }

    const nuevo = await AutoKey.create(data);

    return res.status(201).json({
      success: true,
      message: 'AutoKey creado exitosamente.',
      data: nuevo,
    });
  } catch (error) {
    console.error('Error al crear AutoKey:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un AutoKey con ese TBNAME.',
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error al registrar AutoKey en la base de datos.',
      error: error.message,
      detailed: error.original ? error.original.message : null,
    });
  }
};

module.exports = {
  getAutokeys,
  createAutokey,
};