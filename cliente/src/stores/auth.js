import { reactive, computed, watch } from 'vue'
import router from '@/router'
import { registrarActividadApi, cerrarSesionApi } from '@/services/auth'

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
let lastServerActivitySent = 0

function cargarAutenticacion() {
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
      conectarObservadoresActividad()
      reiniciarTemporizadorInactividad()
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

function guardarAutenticacion() {
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

function actualizarUltimaActividad() {
  if (!state.isAuthenticated) return
  const now = Date.now()
  state.lastActivity = now
  guardarAutenticacion()
  reiniciarTemporizadorInactividad()
  // El temporizador local responde de inmediato; el pulso mantiene alineado el vencimiento autoritativo del servidor.
  if (now - lastServerActivitySent >= 60 * 1000) {
    lastServerActivitySent = now
    registrarActividadApi().catch((error) => {
      if (error.response?.status === 401) cerrarSesion(false, false)
    })
  }
}

function limpiarEstadoAutenticacion() {
  state.user = null
  state.token = null
  state.isAuthenticated = false
  state.remember = false
  state.lastActivity = null
  lastServerActivitySent = 0
  desconectarObservadoresActividad()
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
  }
  guardarAutenticacion()
}

function navegarAlLogin() {
  router.replace({ name: 'login' }).catch(() => {
    window.location.href = '/iniciar-sesion'
  })
}

function manejarSesionNoValida() {
  limpiarEstadoAutenticacion()
  navegarAlLogin()
}

function reiniciarTemporizadorInactividad() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
  }
  if (!state.isAuthenticated) return
  // Si no hay interacción durante 20 minutos, se solicita el cierre también al servidor.
  inactivityTimer = window.setTimeout(() => {
    cerrarSesion(true)
  }, EXPIRATION_MS)
}

function conectarObservadoresActividad() {
  if (activityWatcherAttached) return
  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
  events.forEach((eventName) => {
    window.addEventListener(eventName, actualizarUltimaActividad)
  })
  activityWatcherAttached = true
}

function desconectarObservadoresActividad() {
  if (!activityWatcherAttached) return
  const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
  events.forEach((eventName) => {
    window.removeEventListener(eventName, actualizarUltimaActividad)
  })
  activityWatcherAttached = false
}

// Cuando cambia cualquier campo, persistir
watch(state, guardarAutenticacion, { deep: true })

cargarAutenticacion()
window.addEventListener('auth:unauthorized', manejarSesionNoValida)

export function usarEstadoAutenticacion() {
  const roles = computed(() => (state.user?.roles ? [...state.user.roles] : []))

  function tieneRol(requiredRole) {
    if (!state.isAuthenticated) return false
    if (!requiredRole) return true
    return roles.value.includes(requiredRole)
  }

  function tieneAlgunoDeLosRoles(requiredRoles = []) {
    if (!state.isAuthenticated) return false
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return true
    return requiredRoles.some(role => roles.value.includes(role))
  }

  async function iniciarSesion({ user, token, recordar = false }) {
    state.user = user
    state.token = token
    state.isAuthenticated = true
    state.remember = !!recordar
    state.lastActivity = Date.now()
    lastServerActivitySent = state.lastActivity
    conectarObservadoresActividad()
    reiniciarTemporizadorInactividad()
    guardarAutenticacion()
  }

  async function cerrarSesion(isExpired = false, cerrarSesionEnServidor = true) {
    // Primero se invalida la sesión persistida; luego se limpia el estado local y se vuelve al login.
    if (cerrarSesionEnServidor && state.token) {
      try {
        await cerrarSesionApi()
      } catch (error) {
        console.warn('[auth] no se pudo cerrar la sesión en el servidor', error)
      }
    }
    limpiarEstadoAutenticacion()
    // Navegar sin recargar la página para evitar remounts innecesarios
    navegarAlLogin()
  }

  function verificarAutenticacion() {
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
        conectarObservadoresActividad()
        reiniciarTemporizadorInactividad()
        return true
      }
      return false
    } catch (error) {
      console.error('[auth] error al verificar la autenticación', error)
      return false
    }
  }

  return {
    user: computed(() => state.user),
    token: computed(() => state.token),
    isAuthenticated: computed(() => state.isAuthenticated),
    roles,
    tieneRol,
    tieneAlgunoDeLosRoles,
    iniciarSesion,
    cerrarSesion,
    verificarAutenticacion
  }
}
