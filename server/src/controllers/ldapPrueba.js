// npm i ldapts
const { Client } = require('ldapts');

/**
 * Controlador para validar login mediante LDAP
 */
const loginLdap = async (req, res) => {
  const { username, password } = req.body;

  // Validar que se reciban las credenciales necesarias
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar el indicador de usuario (username) y la contraseña.'
    });
  }

  // Configuración del servidor LDAP
  const ldapHost = 'ldaps://pdvsa.com';
  const ldapPort = 636;
  const dnBase = 'DC=PDVSA,DC=com';

  // Formatear el usuario del dominio según el patrón de la empresa
  const userPrincipalName = `${username}@pdvsa.com`;

  const client = new Client({
    url: `${ldapHost}:${ldapPort}`,
    timeout: 5000,
    connectTimeout: 10000,
    tlsOptions: {
      rejectUnauthorized: false // Ajustar según los certificados del servidor
    }
  });

  try {
    // 1. Intentar autenticación (Bind)
    await client.bind(userPrincipalName, password);

    // 2. Buscar datos del usuario en el directorio
    const searchOptions = {
      scope: 'sub',
      filter: `(sAMAccountName=${username})`
    };

    const { searchEntries } = await client.search(dnBase, searchOptions);

    // 3. Respuesta exitosa
    return res.status(200).json({
      success: true,
      message: 'Conexión y autenticación exitosa a través del túnel.',
      user: searchEntries.length > 0 ? searchEntries[0] : null
    });

  } catch (error) {
    // Error en la autenticación o conexión
    console.error('Error LDAP:', error.message);

    return res.status(401).json({
      success: false,
      message: 'Error de autenticación o fallo de conexión LDAP',
      error: error.message
    });

  } finally {
    // Cerrar la conexión
    await client.unbind().catch(() => {});
  }
};

module.exports = {
  loginLdap
};