const crypto = require('crypto');
const { Usuario, UsuarioSesion, UsuarioSesionEvento, conn } = require('../db');

const TIEMPO_INACTIVIDAD_MAXIMO_MS = 20 * 60 * 1000;

function generarHuellaToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Solo se auditan método y ruta; nunca se guardan contraseñas ni cuerpos de petición.
async function registrarEvento({ userId, sessionId, type, req, transaction }) {
  await UsuarioSesionEvento.create({
    usuarioId: userId,
    sesionId: sessionId,
    tipo: type,
    metodo: req.method,
    ruta: req.originalUrl,
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || null,
    ocurridoEn: new Date()
  }, transaction ? { transaction } : undefined);
}

async function finalizarSesion(session, req, reason) {
  const endedAt = new Date();
  await session.update({ endedAt, endReason: reason });
  await registrarEvento({
    userId: session.usuarioId,
    sessionId: session.id,
    type: reason === 'logout' ? 'LOGOUT' : reason === 'expired' ? 'SESSION_EXPIRED' : 'ACCOUNT_LOCKED',
    req
  });
}

async function exigirSesion(req, res, next) {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';

  if (!token) {
    return res.status(401).json({ statusCode: 401, statusText: 'Sesión no válida o vencida.' });
  }

  try {
    // Se compara la huella del Bearer con Postgres; el token original nunca se persiste.
    const session = await UsuarioSesion.findOne({ where: { tokenHash: generarHuellaToken(token), endedAt: null } });
    if (!session) {
      return res.status(401).json({ statusCode: 401, statusText: 'Sesión no válida o vencida.' });
    }

    const now = new Date();
    if (session.expiresAt <= now) {
      await finalizarSesion(session, req, 'expired');
      return res.status(401).json({ statusCode: 401, statusText: 'La sesión venció por inactividad.' });
    }

    const user = await Usuario.findByPk(session.usuarioId);
    if (!user || !user.activo) {
      await finalizarSesion(session, req, 'account_locked');
      return res.status(401).json({ statusCode: 401, statusText: 'Usuario o sesión no habilitados.' });
    }

    // Toda petición autenticada demuestra actividad y mueve el vencimiento otros 20 minutos.
    const expiresAt = new Date(now.getTime() + TIEMPO_INACTIVIDAD_MAXIMO_MS);
    await session.update({ lastActivityAt: now, expiresAt });
    req.authUser = user;
    req.authSession = session;
    await registrarEvento({ userId: user.id, sessionId: session.id, type: 'REQUEST', req });
    return next();
  } catch (error) {
    console.error('Error al validar la sesión:', error);
    return res.status(500).json({ statusCode: 500, statusText: 'Error al validar la sesión.' });
  }
}

exigirSesion.generarHuellaToken = generarHuellaToken;
exigirSesion.registrarEvento = registrarEvento;
exigirSesion.finalizarSesion = finalizarSesion;
exigirSesion.TIEMPO_INACTIVIDAD_MAXIMO_MS = TIEMPO_INACTIVIDAD_MAXIMO_MS;

module.exports = exigirSesion;