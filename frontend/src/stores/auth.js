import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
      user.value = JSON.parse(savedUser)
      return true
    }
    
    return false
  }

  // Login
  function login(authData) {
    user.value = authData.user
    token.value = authData.token
    
    if (authData.recordar) {
      localStorage.setItem('auth_token', authData.token)
      localStorage.setItem('auth_user', JSON.stringify(authData.user))
      sessionStorage.removeItem('auth_token')
      sessionStorage.removeItem('auth_user')
    } else {
      sessionStorage.setItem('auth_token', authData.token)
      sessionStorage.setItem('auth_user', JSON.stringify(authData.user))
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