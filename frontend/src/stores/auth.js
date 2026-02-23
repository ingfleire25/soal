import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Mapea códigos numéricos de `co_roles` a nombres de rol cortos usados por el frontend
function mapRolesFromCodes(codes) {
  if (!codes || !Array.isArray(codes)) return []
  const map = {
    1709: 'admin',
    3008: 'supervisor',
    1707: 'analista',
    1802: 'invitado'
  }
  return codes.map(c => map[c] || String(c))
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)
  
  const isAuthenticated = computed(() => !!token.value)

  // Cargar estado inicial desde localStorage/sessionStorage
  function loadFromStorage() {
    // Prioridad: localStorage -> sessionStorage
    let savedToken = localStorage.getItem('auth_token')
    let savedUser = localStorage.getItem('auth_user')
    
    if (!savedToken) {
      savedToken = sessionStorage.getItem('auth_token')
      savedUser = sessionStorage.getItem('auth_user')
    }
    
    if (savedToken && savedUser) {
      token.value = savedToken
      try {
        const parsed = JSON.parse(savedUser)
        if ((!parsed.roles || parsed.roles.length === 0) && parsed.co_roles) {
          parsed.roles = mapRolesFromCodes(parsed.co_roles)
        }
        user.value = parsed
      } catch (e) {
        user.value = null
      }
      return true
    }
    
    return false
  }

  // Login
  function login(authData) {
    const u = { ...authData.user }
    if ((!u.roles || u.roles.length === 0) && u.co_roles) {
      u.roles = mapRolesFromCodes(u.co_roles)
    }
    user.value = u
    token.value = authData.token
    
    if (authData.recordar) {
      localStorage.setItem('auth_token', authData.token)
      localStorage.setItem('auth_user', JSON.stringify(user.value))
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_user')
    } else {
      sessionStorage.setItem('auth_token', authData.token)
      sessionStorage.setItem('auth_user', JSON.stringify(user.value))
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }

  // Logout
  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    sessionStorage.removeItem('auth_token')
    sessionStorage.removeItem('auth_user')
  }

  // Verificar autenticación
  function checkAuth() {
    return loadFromStorage()
  }

  // Cargar estado al inicializar
  loadFromStorage()

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }
})