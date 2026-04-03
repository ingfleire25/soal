import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'auth'

const state = reactive({
  user: null,
  token: null,
  isAuthenticated: false,
  remember: false
})

function loadAuth() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      state.user = parsed.user || null
      state.token = parsed.token || null
      state.isAuthenticated = !!parsed.token
      state.remember = !!parsed.token
    } catch (error) {
      console.error('[auth] no se pudo parsear auth en localStorage', error)
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.remember = false
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

function saveAuth() {
  if (state.isAuthenticated && state.user && state.token && state.remember) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user, token: state.token }))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

// Cuando cambia cualquier campo, persistir
watch(state, saveAuth, { deep: true })

loadAuth()

export function useAuthStore() {
  const roles = computed(() => (state.user?.roles ? [...state.user.roles] : []))

  function hasRole(requiredRole) {
    if (!state.isAuthenticated) return false
    if (!requiredRole) return true
    return roles.value.includes(requiredRole)
  }

  function hasAnyRole(requiredRoles = []) {
    if (!state.isAuthenticated) return false
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return true
    return requiredRoles.some(role => roles.value.includes(role))
  }

  async function login({ user, token, recordar = false }) {
    state.user = user
    state.token = token
    state.isAuthenticated = true
    state.remember = !!recordar
    saveAuth()
  }

  async function logout() {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    state.remember = false
    saveAuth()
    window.location.href = '/iniciar-sesion'
  }

  function checkAuth() {
    // Si ya hay token/usuario en localStorage, asigna el estado
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return false

    try {
      const parsed = JSON.parse(saved)
      if (parsed?.token && parsed?.user) {
        state.user = parsed.user
        state.token = parsed.token
        state.isAuthenticated = true
        state.remember = true
        return true
      }
      return false
    } catch (error) {
      console.error('[auth] checkAuth parse error', error)
      return false
    }
  }

  return {
    user: computed(() => state.user),
    token: computed(() => state.token),
    isAuthenticated: computed(() => state.isAuthenticated),
    roles,
    hasRole,
    hasAnyRole,
    login,
    logout
  }
}
