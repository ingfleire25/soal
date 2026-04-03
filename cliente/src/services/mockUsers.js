export async function getMockUsers() {
  // Simula consulta al backend de usuarios con 4 roles núcleo
  return [
    {
      username: 'gerente',
      password: '1234',
      role: 'Gerente',
      roles: ['Gerente'],
      token: 'fake-token-gerente'
    },
    {
      username: 'subgerente',
      password: '1234',
      role: 'Subgerente',
      roles: ['Subgerente'],
      token: 'fake-token-subgerente'
    },
    {
      username: 'supervisor',
      password: '1234',
      role: 'Supervisor',
      roles: ['Supervisor'],
      token: 'fake-token-supervisor'
    },
    {
      username: 'analista',
      password: '1234',
      role: 'Analista',
      roles: ['Analista'],
      token: 'fake-token-analista'
    }
  ]
}
