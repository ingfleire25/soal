const crypto = require("crypto");
// Validación LDAP temporalmente desactivada: conservar para reactivarla cuando vuelva el túnel.
// const { InvalidCredentialsError } = require('ldapts');
const { Op, QueryTypes } = require("sequelize");
const { Usuario, UsuarioSesion, conn } = require("../db");
// const { validarCredencialesLdap } = require('./ldapPrueba');
const exigirSesion = require("../middleware/requireSession");

// Clave incorrecta y segundo inicio comparten el contador; en el tercer fallo se bloquea al usuario y se reinicia a cero.
async function registrarIntentoFallido(userId, req) {
  return conn.transaction(async (transaction) => {
    const user = await Usuario.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!user || !user.activo) return { locked: !user?.activo };

    const failedAttempts = Number(user.intentosFallidos || 0) + 1;
    if (failedAttempts < 3) {
      await user.update({ intentosFallidos: failedAttempts }, { transaction });
      await exigirSesion.registrarEvento({
        userId,
        type: "LOGIN_FAILED",
        req,
        transaction,
      });
      return { locked: false };
    }

    await user.update({ activo: false, intentosFallidos: 0 }, { transaction });
    const activeSession = await UsuarioSesion.findOne({
      where: { usuarioId: userId, endedAt: null },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (activeSession) {
      await activeSession.update(
        { endedAt: new Date(), endReason: "account_locked" },
        { transaction },
      );
    }
    await exigirSesion.registrarEvento({
      userId,
      sessionId: activeSession?.id || null,
      type: "ACCOUNT_LOCKED",
      req,
      transaction,
    });
    return { locked: true };
  });
}

// Serializa los inicios por usuario: vence sesiones inactivas, rechaza otra sesión vigente y registra la nueva.
async function crearSesion(userId, req) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();

  const result = await conn.transaction(async (transaction) => {
    const user = await Usuario.findByPk(userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!user || !user.activo) return { locked: true };

    const expiredSessions = await UsuarioSesion.findAll({
      where: { usuarioId: userId, endedAt: null, expiresAt: { [Op.lte]: now } },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    // Una sesión cuyo plazo ya venció se cierra antes de revisar si el usuario sigue conectado.
    for (const expiredSession of expiredSessions) {
      await expiredSession.update(
        { endedAt: now, endReason: "expired" },
        { transaction },
      );
      await exigirSesion.registrarEvento({
        userId,
        sessionId: expiredSession.id,
        type: "SESSION_EXPIRED",
        req,
        transaction,
      });
    }

    const activeSession = await UsuarioSesion.findOne({
      where: { usuarioId: userId, endedAt: null },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (activeSession) {
      // Intentar entrar desde otro equipo cuenta como fallo y, al tercero, también bloquea al usuario.
      const failedAttempts = Number(user.intentosFallidos || 0) + 1;
      if (failedAttempts < 3) {
        await user.update(
          { intentosFallidos: failedAttempts },
          { transaction },
        );
        await exigirSesion.registrarEvento({
          userId,
          sessionId: activeSession.id,
          type: "DUPLICATE_LOGIN",
          req,
          transaction,
        });
        return { duplicate: true };
      }

      await user.update(
        { activo: false, intentosFallidos: 0 },
        { transaction },
      );
      await activeSession.update(
        { endedAt: now, endReason: "account_locked" },
        { transaction },
      );
      await exigirSesion.registrarEvento({
        userId,
        sessionId: activeSession.id,
        type: "ACCOUNT_LOCKED",
        req,
        transaction,
      });
      return { locked: true };
    }

    // Se guarda el hash del token, no el token utilizable; IP y navegador identifican el origen de la sesión.
    const session = await UsuarioSesion.create(
      {
        usuarioId: userId,
        tokenHash: exigirSesion.generarHuellaToken(token),
        ipAddress: req.ip,
        userAgent: req.get("user-agent") || null,
        startedAt: now,
        lastActivityAt: now,
        expiresAt: new Date(
          now.getTime() + exigirSesion.TIEMPO_INACTIVIDAD_MAXIMO_MS,
        ),
      },
      { transaction },
    );
    // Un acceso correcto sin otra sesión activa limpia los fallos acumulados.
    await user.update({ intentosFallidos: 0 }, { transaction });
    await exigirSesion.registrarEvento({
      userId,
      sessionId: session.id,
      type: "LOGIN",
      req,
      transaction,
    });
    return { session };
  });

  return { ...result, token: result.session ? token : null };
}

exports.iniciarSesion = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ statusCode: 400, statusText: "Faltan datos de usuario" });
  }

  try {
    // Postgres determina si el usuario existe, está habilitado y valida la contraseña local.
    const user = await Usuario.findOne({ where: { username } });
    if (!user || !user.activo) {
      return res
        .status(403)
        .json({
          statusCode: 403,
          statusText: "Usuario o contraseña vencido o sin acceso.",
        });
    }

    // Login temporal contra PostgreSQL. La columna usuario.password actualmente guarda la clave local.
    if (user.password !== password) {
      await registrarIntentoFallido(user.id, req);
      return res
        .status(401)
        .json({
          statusCode: 401,
          statusText: "Usuario o contraseña vencido o sin acceso.",
        });
    }

    /* Validación LDAP conservada para reactivarla cuando el túnel esté disponible.
    try {
      const ldapResult = await validarCredencialesLdap(username, password);
      if (!ldapResult.success) {
        await registrarIntentoFallido(user.id, req);
        return res.status(401).json({ statusCode: 401, statusText: 'Usuario o contraseña vencido o sin acceso.' });
      }
    } catch (error) {
      if (error instanceof InvalidCredentialsError || error.name === 'InvalidCredentialsError') {
        await registrarIntentoFallido(user.id, req);
        return res.status(401).json({ statusCode: 401, statusText: 'Usuario o contraseña vencido o sin acceso.' });
      }
      // Una caída de LDAP no es un fallo de clave y no debe acercar al usuario al bloqueo.
      console.error('Error de autenticación LDAP:', error.message);
      return res.status(503).json({ statusCode: 503, statusText: 'No fue posible validar las credenciales en este momento.' });
    }
    */

    // La validación de clave correcta no basta: crearSesion impone una sesión activa por usuario.
    const sessionResult = await crearSesion(user.id, req);
    if (sessionResult.duplicate) {
      return res
        .status(409)
        .json({
          statusCode: 409,
          statusText: "El usuario ya tiene una sesión activa en otro equipo.",
        });
    }
    if (sessionResult.locked) {
      return res
        .status(403)
        .json({
          statusCode: 403,
          statusText: "Usuario o contraseña vencido o sin acceso.",
        });
    }

    if (!user.activo) {
      return res
        .status(403)
        .json({
          statusCode: 403,
          statusText: "Usuario o contraseña vencido o sin acceso.",
        });
    }

    const responseUser = {
      id: user.id,
      username: user.username,
      nombres: user.nombres,
      apellidos: user.apellidos,
      cedula: user.cedula,
      telefono: user.telefono,
      gerencia: user.gerencia,
      departamento: user.departamento,
      rol: user.rol,
      roles: [user.rol],
    };

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      result: { user: responseUser, token: sessionResult.token },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res
      .status(500)
      .json({
        statusCode: 500,
        statusText: "Error interno",
        error: error.message,
      });
  }
};

exports.cerrarSesion = async (req, res) => {
  try {
    if (!req.authSession) {
      return res
        .status(401)
        .json({ statusCode: 401, statusText: "Sesión no válida o vencida." });
    }

    // El middleware ya validó el token; aquí se marca la hora y causa de cierre en la tabla.
    await exigirSesion.finalizarSesion(req.authSession, req, "logout");
    return res
      .status(200)
      .json({ statusCode: 200, statusText: "Sesión cerrada." });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return res
      .status(500)
      .json({
        statusCode: 500,
        statusText: "No fue posible cerrar la sesión.",
      });
  }
};

// La petición autenticada renueva el vencimiento por inactividad en el middleware.
exports.registrarActividad = (req, res) => res.status(204).end();

exports.obtenerSesiones = async (req, res) => {
  if (req.authUser?.rol !== "Administrador") {
    return res
      .status(403)
      .json({
        statusCode: 403,
        statusText: "Acceso reservado para administradores.",
      });
  }

  const paginaSolicitada = Number.parseInt(req.query.pagina, 10) || 1;
  const pagina = Math.max(1, paginaSolicitada);
  const limite = 50;
  const desplazamiento = (pagina - 1) * limite;

  try {
    // No se consulta token_hash: la vista administrativa solo requiere metadatos de la sesión.
    const sesiones = await conn.query(
      `
      SELECT
        s."id",
        s."usuario_id" AS "usuarioId",
        u."username" AS "indicador",
        concat_ws(' ', nullif(trim(u."nombres"), ''), nullif(trim(u."apellidos"), '')) AS "nombreUsuario",
        s."ip_address" AS "ipAddress",
        s."user_agent" AS "userAgent",
        s."started_at" AS "startedAt",
        s."last_activity_at" AS "lastActivityAt",
        s."expires_at" AS "expiresAt",
        s."ended_at" AS "endedAt",
        s."end_reason" AS "endReason"
      FROM "usuario_sesion" s
      INNER JOIN "usuario" u ON u."id" = s."usuario_id"
      ORDER BY s."started_at" ASC, s."id" ASC
      LIMIT :limite OFFSET :desplazamiento
    `,
      {
        replacements: { limite, desplazamiento },
        type: QueryTypes.SELECT,
      },
    );
    const [conteo] = await conn.query(
      'SELECT COUNT(*)::INTEGER AS total FROM "usuario_sesion"',
      { type: QueryTypes.SELECT },
    );
    const total = Number(conteo?.total || 0);

    return res.status(200).json({
      statusCode: 200,
      statusText: "OK",
      result: {
        sesiones,
        total,
        pagina,
        totalPaginas: Math.ceil(total / limite),
      },
    });
  } catch (error) {
    console.error("Error al consultar sesiones:", error);
    return res
      .status(500)
      .json({
        statusCode: 500,
        statusText: "No fue posible consultar las sesiones.",
      });
  }
};
