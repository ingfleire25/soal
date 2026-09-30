// // npm i ldapts
// const { Client } = require('ldapts');

// // Reutilizado por la ruta de prueba y por el login real; la clave solo se usa para el bind LDAP.
// const validarCredencialesLdap = async (username, password) => {
//   // Configuración del servidor LDAP
//   const ldapHost = 'ldaps://pdvsa.com';
//   const ldapPort = 636;
//   const dnBase = 'DC=PDVSA,DC=com';

//   // Formatear el usuario del dominio según el patrón de la empresa
//   const userPrincipalName = `${username}@pdvsa.com`;

//   const client = new Client({
//     url: `${ldapHost}:${ldapPort}`,
//     timeout: 5000,
//     connectTimeout: 10000,
//     tlsOptions: {
//       rejectUnauthorized: false // Ajustar según los certificados del servidor
//     }
//   });

//   try {
//     await client.bind(userPrincipalName, password);

//     const searchOptions = {
//       scope: 'sub',
//       filter: `(sAMAccountName=${username})`
//     };
//     const { searchEntries } = await client.search(dnBase, searchOptions);

//     return {
//       success: true,
//       message: 'Conexión y autenticación exitosa a través del túnel.',
//       user: searchEntries.length > 0 ? searchEntries[0] : null
//     };
//   } finally {
//     await client.unbind().catch(() => {});
//   }
// };

// /** Controlador de prueba para validar las credenciales directamente contra LDAP. */
// const loginLdap = async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({
//       success: false,
//       message: 'Debe proporcionar el indicador de usuario (username) y la contraseña.'
//     });
//   }

//   try {
//     const result = await validarCredencialesLdap(username, password);
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error('Error LDAP:', error.message);
//     return res.status(401).json({
//       success: false,
//       message: 'Usuario o contraseña vencido o sin acceso.'
//     });
//   }
// };

// module.exports = {
//   loginLdap,
//   validarCredencialesLdap
// };

const { Client } = require('ldapts');

const validarCredencialesLdap = async (username, password) => {
  // 1. Limpiar el host de protocolos si vienen incluidos
  const ldapHost = 'ldaps://pdvsa.com';
  const ldapPort = 636;
  const dnBase = 'DC=PDVSA,DC=com';
  const userPrincipalName = `${username}@pdvsa.com`;

  const client = new Client({
    url: ldapHost,
    timeout: 10000,
    connectTimeout: 10000,
    strictDN: false,
    tlsOptions: {
      rejectUnauthorized: false,
      servername: 'pdvsa.com'
    }
  });

  try {
    await client.bind(userPrincipalName, password);

    const searchOptions = {
      scope: 'sub',
      filter: `(sAMAccountName=${username})`,
      paged: false,
      derefAliases: 0,
      referrals: false,
      attributes: ['cn', 'mail', 'sAMAccountName', 'displayName', 'memberOf'] // Traer campos específicos
    };
    
    const { searchEntries } = await client.search(dnBase, searchOptions);

    return {
      success: true,
      message: 'Conexión y autenticación exitosa a través del túnel.',
      user: searchEntries.length > 0 ? searchEntries[0] : null
    };
  } finally {
    await client.unbind().catch(() => {});
  }
};

/** Controlador de prueba para validar las credenciales directamente contra LDAP. */
const loginLdap = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Debe proporcionar el indicador de usuario (username) y la contraseña.'
    });
  }

  try {
    const result = await validarCredencialesLdap(username, password);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error LDAP:', error.message);
    
    // Devuelve el error.message para ver la causa real si vuelve a fallar
    return res.status(401).json({
      success: false,
      message: 'Error de autenticación o fallo de conexión LDAP',
      error: error.message 
    });
  }
};

module.exports = {
  loginLdap,
  validarCredencialesLdap
};