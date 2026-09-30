const { Usuario } = require('../db');
const { validarCredencialesLdap } = require('./ldapPrueba');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ statusCode: 400, statusText: 'Faltan datos de usuario' });
  }

  try {
    // LDAP valida la clave; Postgres solo aporta el perfil, el rol y el estado local del usuario.
    // 
    try {
      const ldapResult = await validarCredencialesLdap(username, password);
      if (!ldapResult.success) {
        return res.status(401).json({ statusCode: 401, statusText: 'Usuario o contraseña vencido o sin acceso.' });
      }
    } catch (error) {
      console.error('Error de autenticación LDAP:', error.message);
      return res.status(401).json({ statusCode: 401, statusText: 'Usuario o contraseña vencido o sin acceso.' });
    }

    // No se compara ni se guarda la contraseña recibida: solo se busca el usuario local tras validar LDAP.
    const user = await Usuario.findOne({ where: { username } });

    if (!user) {
      return res.status(403).json({ statusCode: 403, statusText: 'Usuario o contraseña vencido o sin acceso.' });
    }

//     if (user.password !== password) {
//   return res.status(401).json({ statusCode: 401, statusText: 'Credenciales inválidas' });
// }

    if (!user.activo) {
      return res.status(403).json({ statusCode: 403, statusText: 'Usuario o contraseña vencido o sin acceso.' });
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

// En auth.js, comenta el bloque que empieza en  LDAP valida la clave... y 
// termina al cerrar el catch interno. También puedes comentar el import de 
// LDAP en la línea 2 para dejar claro que no se usa.

// No basta con comentar LDAP: ahora mismo Postgres busca el usuario, pero ya no 
// compara su contraseña. Para que la prueba valide solo contra la base de datos,
//  agrega esta comprobación después del if (!user) y antes del if (!user.activo):

// if (user.password !== password) {
//   return res.status(401).json({ statusCode: 401, statusText: 'Credenciales inválidas' });
// }
// Así el login seguirá consultando en Postgres el usuario, su contraseña 
// local y su estado, sin llamar a LDAP. Es una medida temporal para pruebas; 
// cuando vuelvas a habilitar LDAP, 
// quita esa comparación local para no depender de contraseñas guardadas en Postgres.
