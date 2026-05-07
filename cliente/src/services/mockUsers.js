export async function getMockUsers() {
  // Simula consulta al backend de usuarios con 4 roles núcleo
  return [
    {
      username: 'administrador',
      password: '1234',
      role: 'Administrador',
      roles: ['Administrador'],
      token: 'fake-token-administrador'
    },
    {
      username: 'aprobador',
      password: '1234',
      role: 'Aprobador',
      roles: ['Aprobador'],
      token: 'fake-token-aprobador'
    },
    {
      username: 'solicitante',
      password: '1234',
      role: 'Solicitante',
      roles: ['Solicitante'],
      token: 'fake-token-solicitante'
    }
  ]
}
