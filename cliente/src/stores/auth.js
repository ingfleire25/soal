import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'auth'
const EXPIRATION_MS = 20 * 60 * 1000

const state = reactive({
  user: null,
  token: null,
  isAuthenticated: false,
  remember: false,
  lastActivity: null
})

let inactivityTimer = null
let activityWatcherAttached = false

function loadAuth() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      const token = parsed.token || parsed.tokenAcceso || null
      const lastActivity = typeof parsed.lastActivity === 'number' ? parsed.lastActivity : null

      if (!token || !parsed.user) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      if (lastActivity && Date.now() - lastActivity > EXPIRATION_MS) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      state.user = parsed.user
      state.token = token
      state.isAuthenticated = true
      state.remember = true
      state.lastActivity = lastActivity || Date.now()
      attachActivityWatchers()
      resetInactivityTimer()
    } catch (error) {
      console.error('[auth] no se pudo parsear auth en localStorage', error)
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.remember = false
      state.lastActivity = null
      localStorage.removeItem(STORAGE_KEY)
    }
  }
}

function saveAuth() {
  if (state.isAuthenticated && state.user && state.token) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      user: state.user,
      token: state.token,
      tokenAcceso: state.token,
      lastActivity: state.lastActivity || Date.now()
    }))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

function updateLastActivity() {
  if (!state.isAuthenticated) return
  state.lastActivity = Date.now()
  saveAuth()
  resetInactivityTimer()
}

function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
  }
  if (!state.isAuthenticated) return
  inactivityTimer = window.setTimeout(() => {
    logout(true)
  }, EXPIRATION_MS)
}

function attachActivityWatchers() {
  if (activityWatcherAttached) return
  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
  events.forEach((eventName) => {
    window.addEventListener(eventName, updateLastActivity)
  })
  activityWatcherAttached = true
}

function detachActivityWatchers() {
  if (!activityWatcherAttached) return
  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
  events.forEach((eventName) => {
    window.removeEventListener(eventName, updateLastActivity)
  })
  activityWatcherAttached = false
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
    state.lastActivity = Date.now()
    attachActivityWatchers()
    resetInactivityTimer()
    saveAuth()
  }

  async function logout(isExpired = false) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    state.remember = false
    state.lastActivity = null
    detachActivityWatchers()
    if (inactivityTimer) {
      clearTimeout(inactivityTimer)
      inactivityTimer = null
    }
    saveAuth()
    window.location.href = '/iniciar-sesion'
  }

  function checkAuth() {
    // Si ya hay token/usuario en localStorage, asigna el estado
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return false

    try {
      const parsed = JSON.parse(saved)
      const token = parsed?.token || parsed?.tokenAcceso
      if (token && parsed?.user) {
        state.user = parsed.user
        state.token = token
        state.isAuthenticated = true
        state.remember = true
        state.lastActivity = typeof parsed.lastActivity === 'number' ? parsed.lastActivity : Date.now()
        attachActivityWatchers()
        resetInactivityTimer()
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
