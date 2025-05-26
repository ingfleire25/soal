const { Ua, Usuario, Rol, rol_usuario, analistas } = require ( '../db' )
const { conn } = require('../db');


exports.getAll = async ( req, res ) => {
    try {
        const analistas = await Usuario.findAll( {
            include: [
                { model: Rol, where: { tx_nombre: 'Analista' } },
                { model: Ua }
            ]
        } )
        return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: analistas } )
    } catch ( error ) {
      return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar, estoy en el controlador getAll' } )
    }
}

exports.getUas = async ( req, res ) => {
    const { analistaId } = req.params
    try {
        const uas = await Ua.findAll( { where: { analistaId } } )
        return res.status( 200 ).json( { statusCode: 200, statusText: 'OK', result: uas } )
    } catch ( error ) {
        console.log( error )
        return res.status( 400 ).json( { statusCode: 400, statusText: 'Error al consultar' } )
    }
} 
 

exports.asignarUsuarioAUbicacion = async (req, res) => {
  const { uaId, solicitanteId } = req.body;
  
  if (!uaId || !solicitanteId) {
    return res.status(400).json({
      statusCode: 400,
      statusText: 'Faltan parámetros requeridos (uaId o solicitanteId)',
    });
  }

  const transaction = await conn.transaction();
  
  try {
    // 1. Validar que exista la Unidad de Atención
    const ua = await Ua.findByPk(uaId, { transaction });
    if (!ua) {
      await transaction.rollback();
      return res.status(404).json({
        statusCode: 404,
        statusText: 'Unidad de Atención no encontrada',
      });
    }

    // 2. Validar que exista el usuario
    const usuario = await Usuario.findByPk(solicitanteId, {
      include: [{ model: Rol }],
      transaction
    });
    
    if (!usuario) {
      await transaction.rollback();
      return res.status(404).json({
        statusCode: 404,
        statusText: 'Usuario no encontrado',
      });
    }

    // 3. Verificar si el usuario ya está asignado a esta UA específica
    const yaAsignadoAUa = await ua.hasAnalista(solicitanteId, { transaction });
    if (yaAsignadoAUa) {
      await transaction.rollback();
      return res.status(409).json({
        statusCode: 409,
        statusText: 'El usuario ya está asignado a esta Unidad de Atención',
      });
    }

    // 4. Obtener el rol de Analista
    const rolAnalista = await Rol.findOne({
      where: { tx_nombre: 'Analista' },
      transaction
    });

    if (!rolAnalista) {
      await transaction.rollback();
      return res.status(404).json({
        statusCode: 404,
        statusText: 'Rol "Analista" no encontrado',
      });
    }

    // 5. Verificar si el usuario ya tiene alguna UA asignada
    const uaActual = await Ua.findOne({
      include: [{
        model: Usuario,
        as: 'analistas',
        where: { uuid: solicitanteId },
        required: true
      }],
      transaction
    });

    if (uaActual) {
      // Si ya tiene una UA, la actualizamos
      await uaActual.removeAnalista(solicitanteId, { transaction });
      await ua.addAnalista(solicitanteId, { transaction });
    } else {
      // Si no tiene UA asignada, creamos nueva relación
      await ua.addAnalista(solicitanteId, { transaction });
    }

    // 6. Manejo especial de la tabla rol_usuario
    // Primero verificamos si el usuario ya tiene el rol de analista
    const tieneRolAnalista = await rol_usuario.findOne({
      where: {
        uuid: solicitanteId,
        rolId: rolAnalista.rolId
      },
      transaction
    });

    if (!tieneRolAnalista) {
      // Si no tiene el rol de analista, eliminamos cualquier rol existente y asignamos el nuevo
      await rol_usuario.destroy({
        where: { uuid: solicitanteId },
        transaction
      });

      await rol_usuario.create({
        uuid: solicitanteId,
        rolId: rolAnalista.rolId,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { transaction });
    }

    await transaction.commit();
    return res.status(200).json({
      statusCode: 200,
      statusText: 'Usuario asignado correctamente a la Unidad de Atención',
      data: {
        uaId: ua.uaId,
        usuarioId: solicitanteId,
        rol: 'Analista'
      }
    });
    
  } catch (error) {
    if (transaction) await transaction.rollback();
    
    console.error('Error al asignar usuario a la ubicación:', error);
    return res.status(500).json({
      statusCode: 500,
      statusText: 'Error interno del servidor al asignar el usuario', 
      error: error.message,
    });
  }
};