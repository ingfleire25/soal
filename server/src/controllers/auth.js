const { Usuario } = require('../db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ statusCode: 400, statusText: 'Faltan datos de usuario' });
  }

  try {
    const user = await Usuario.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ statusCode: 401, statusText: 'Usuario no encontrado' });
    }

    if (user.password !== password) {
      return res.status(401).json({ statusCode: 401, statusText: 'Credenciales inválidas' });
    }

    if (!user.activo) {
      return res.status(403).json({ statusCode: 403, statusText: 'Usuario inactivo' });
    }

    const token = `fake-jwt-token-${Date.now()}`;

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
      roles: [user.rol]
    };

    return res.status(200).json({ statusCode: 200, statusText: 'OK', result: { user: responseUser, token } });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ statusCode: 500, statusText: 'Error interno', error: error.message });
  }
};
