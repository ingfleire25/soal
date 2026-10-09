import { reactive, computed, watch } from "vue";
import router from "@/router";
import { registrarActividadApi, cerrarSesionApi } from "@/services/auth";

const STORAGE_KEY = "auth";
const EXPIRATION_MS = 20 * 60 * 1000;
const HEARTBEAT_MS = 60 * 1000;
const ACTIVITY_EVENTS = [
  "pointerdown",
  "pointermove",
  "keydown",
  "touchstart",
  "wheel",
  "scroll",
  "click",
  "input",
  "change",
];

const state = reactive({
  user: null,
  token: null,
  isAuthenticated: false,
  remember: false,
  lastActivity: null,
});

let inactivityTimer = null;
let activityWatcherAttached = false;
let lastServerActivitySent = 0;
let sessionValidated = false

function validarSesionRestaurada() {
  if (sessionValidated || !state.isAuthenticated) return
  sessionValidated = true
  lastServerActivitySent = Date.now()
  registrarActividadApi().catch((error) => manejarErrorActividad(error))
}

function manejarErrorActividad(error) {
  if (error.response?.status === 401) {
    manejarSesionNoValida()
  } else {
    // Permitir que la siguiente interacción reintente si hubo un fallo transitorio de red.
    lastServerActivitySent = 0
  }
}

function obtenerAutenticacionGuardada() {
  const persistida = localStorage.getItem(STORAGE_KEY);
  if (persistida) return { value: persistida, remember: true };
  const temporal = sessionStorage.getItem(STORAGE_KEY);
  return temporal ? { value: temporal, remember: false } : null;
}

function cargarAutenticacion() {
  const saved = obtenerAutenticacionGuardada();
  if (saved) {
    try {
      const parsed = JSON.parse(saved.value);
      const token = parsed.token || parsed.tokenAcceso || null;
      const lastActivity =
        typeof parsed.lastActivity === "number" ? parsed.lastActivity : null;

      if (!token || !parsed.user) {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      if (lastActivity && Date.now() - lastActivity > EXPIRATION_MS) {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        return;
      }

      state.user = parsed.user;
      state.token = token;
      state.isAuthenticated = true;
      state.remember = saved.remember;
      state.lastActivity = lastActivity || Date.now();
      conectarObservadoresActividad();
      reiniciarTemporizadorInactividad();
      validarSesionRestaurada()
    } catch (error) {
      console.error(
        "[auth] no se pudo recuperar la autenticación guardada",
        error,
      );
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.remember = false;
      state.lastActivity = null;
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }
}

function guardarAutenticacion() {
  if (state.isAuthenticated && state.user && state.token) {
    const serialized = JSON.stringify({
      user: state.user,
      token: state.token,
      tokenAcceso: state.token,
      remember: state.remember,
      lastActivity: state.lastActivity || Date.now(),
    });
    if (state.remember) {
      localStorage.setItem(STORAGE_KEY, serialized);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, serialized);
      localStorage.removeItem(STORAGE_KEY);
    }
  } else {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

function actualizarUltimaActividad() {
  if (!state.isAuthenticated) return;
  const now = Date.now();
  state.lastActivity = now;
  guardarAutenticacion();
  reiniciarTemporizadorInactividad();
  // El temporizador local responde de inmediato; el pulso mantiene alineado el vencimiento autoritativo del servidor.
  if (now - lastServerActivitySent >= HEARTBEAT_MS) {
    lastServerActivitySent = now;
    registrarActividadApi().catch(manejarErrorActividad);
  }
}

function limpiarEstadoAutenticacion() {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.remember = false;
  state.lastActivity = null;
  lastServerActivitySent = 0;
  sessionValidated = false
  desconectarObservadoresActividad();
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
  guardarAutenticacion();
}

function navegarAlLogin() {
  router.replace({ name: "login" }).catch(() => {
    window.location.href = "/iniciar-sesion";
  });
}

function manejarSesionNoValida() {
  limpiarEstadoAutenticacion();
  navegarAlLogin();
}

function reiniciarTemporizadorInactividad() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }
  if (!state.isAuthenticated) return;
  // El vencimiento local no envía /logout: el cierre de servidor queda reservado
  // al botón explícito; el servidor invalida esta sesión por su propio plazo de inactividad.
  inactivityTimer = window.setTimeout(() => {
    const restante = EXPIRATION_MS - (Date.now() - (state.lastActivity || 0));
    if (restante > 0) {
      reiniciarTemporizadorInactividad();
      return;
    }
    limpiarEstadoAutenticacion();
    navegarAlLogin();
  }, Math.max(0, EXPIRATION_MS - (Date.now() - (state.lastActivity || Date.now()))));
}

function conectarObservadoresActividad() {
  if (activityWatcherAttached) return;
  ACTIVITY_EVENTS.forEach((eventName) => {
    window.addEventListener(eventName, actualizarUltimaActividad);
  });
  activityWatcherAttached = true;
}

function desconectarObservadoresActividad() {
  if (!activityWatcherAttached) return;
  ACTIVITY_EVENTS.forEach((eventName) => {
    window.removeEventListener(eventName, actualizarUltimaActividad);
  });
  activityWatcherAttached = false;
}

// Cuando cambia cualquier campo, persistir
watch(state, guardarAutenticacion, { deep: true });

cargarAutenticacion();
window.addEventListener("auth:unauthorized", manejarSesionNoValida);

export function usarEstadoAutenticacion() {
  const roles = computed(() =>
    state.user?.roles ? [...state.user.roles] : [],
  );

  function tieneRol(requiredRole) {
    if (!state.isAuthenticated) return false;
    if (!requiredRole) return true;
    return roles.value.includes(requiredRole);
  }

  function tieneAlgunoDeLosRoles(requiredRoles = []) {
    if (!state.isAuthenticated) return false;
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0)
      return true;
    return requiredRoles.some((role) => roles.value.includes(role));
  }

  async function iniciarSesion({ user, token, recordar = false }) {
    state.user = user;
    state.token = token;
    state.isAuthenticated = true;
    state.remember = !!recordar;
    state.lastActivity = Date.now();
    lastServerActivitySent = state.lastActivity;
    conectarObservadoresActividad();
    reiniciarTemporizadorInactividad();
    validarSesionRestaurada()
    guardarAutenticacion();
  }

  async function cerrarSesion(
    isExpired = false,
    cerrarSesionEnServidor = true,
  ) {
    // Primero se invalida la sesión persistida; luego se limpia el estado local y se vuelve al login.
    if (cerrarSesionEnServidor && state.token) {
      try {
        await cerrarSesionApi();
      } catch (error) {
        console.warn(
          "[auth] no se pudo cerrar la sesión en el servidor",
          error,
        );
      }
    }
    limpiarEstadoAutenticacion();
    // Navegar sin recargar la página para evitar remounts innecesarios
    navegarAlLogin();
  }

  function verificarAutenticacion() {
    // El token local solo restaura la interfaz; el servidor valida la sesión en cada API.
    const saved = obtenerAutenticacionGuardada();
    if (!saved) return false;

    try {
      const parsed = JSON.parse(saved.value);
      const token = parsed?.token || parsed?.tokenAcceso;
      if (token && parsed?.user) {
        state.user = parsed.user;
        state.token = token;
        state.isAuthenticated = true;
        state.remember = saved.remember;
        state.lastActivity =
          typeof parsed.lastActivity === "number"
            ? parsed.lastActivity
            : Date.now();
        conectarObservadoresActividad();
        reiniciarTemporizadorInactividad();
        return true;
      }
      return false;
    } catch (error) {
      console.error("[auth] error al verificar la autenticación", error);
      return false;
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
    verificarAutenticacion,
  };
}
