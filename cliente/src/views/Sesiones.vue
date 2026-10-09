<template>
  <section class="container-fluid px-0 sesiones-view">
    <!-- Header principal -->
    <header class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
      <div>
        <h1 class="h3 mb-1">Registro de sesiones</h1>
        <p class="text-muted small mb-0">Monitoreo de actividad de usuarios en el sistema</p>
      </div>
      <button 
        class="btn btn-outline-secondary d-inline-flex align-items-center gap-2" 
        type="button" 
        :disabled="cargando" 
        @click="cargarSesiones(1)"
      >
        <i class="bi bi-arrow-clockwise" :class="{ 'spin': cargando }" aria-hidden="true"></i>
        <span>Actualizar</span>
      </button>
    </header>

    <!-- Barra de Búsqueda y Filtros -->
    <div class="card mb-3 border-0 shadow-sm bg-light">
      <div class="card-body p-3">
        <div class="row g-2 align-items-center">
          <!-- Búsqueda General -->
          <div class="col-12 col-md-4 col-lg-4">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input
                v-model="busqueda"
                type="search"
                class="form-control border-start-0 ps-0"
                placeholder="Buscar por usuario, IP o indicador..."
                @keyup.enter="ejecutarFiltro"
              />
            </div>
          </div>

          <!-- Filtro por Estado -->
          <div class="col-12 col-sm-6 col-md-3 col-lg-2">
            <select v-model="filtroEstado" class="form-select" @change="ejecutarFiltro">
              <option value="">Todos los estados</option>
              <option value="Activa">Activa</option>
              <option value="Cerrada">Cerrada</option>
              <option value="Vencida">Vencida</option>
            </select>
          </div>

          <!-- Filtro Fecha Desde -->
          <div class="col-6 col-sm-3 col-md-2 col-lg-2">
            <input 
              v-model="fechaDesde" 
              type="date" 
              class="form-control" 
              title="Fecha inicio"
              @change="ejecutarFiltro" 
            />
          </div>

          <!-- Filtro Fecha Hasta -->
          <div class="col-6 col-sm-3 col-md-2 col-lg-2">
            <input 
              v-model="fechaHasta" 
              type="date" 
              class="form-control" 
              title="Fecha fin"
              @change="ejecutarFiltro" 
            />
          </div>

          <!-- Botón Limpiar -->
          <div class="col-12 col-md-1 col-lg-2 text-end">
            <button 
              v-if="hayFiltrosActivos" 
              class="btn btn-link text-danger text-decoration-none p-0 small"
              @click="limpiarFiltros"
            >
              <i class="bi bi-x-circle me-1"></i>Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensajes de estado -->
    <div v-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      <div>{{ error }}</div>
    </div>

    <div v-else-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="text-muted mt-2 mb-0">Cargando registros...</p>
    </div>

    <div v-else-if="!sesiones.length" class="text-center py-5 bg-light rounded border">
      <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
      <p class="text-muted mb-0">No se encontraron sesiones que coincidan con los criterios.</p>
    </div>

    <!-- Tabla Responsiva -->
    <template v-else>
      <div class="table-responsive rounded border">
        <table class="table table-hover table-striped align-middle mb-0 w-100 table-layout-auto">
          <thead class="table-light text-nowrap">
            <tr>
              <th scope="col" style="width: 70px;">N.º</th>
              <th scope="col">Indicador</th>
              <th scope="col">Usuario</th>
              <th scope="col">IP</th>
              <th scope="col" style="min-width: 180px;">Equipo / Navegador</th>
              <th scope="col">Inicio</th>
              <th scope="col">Última actividad</th>
              <th scope="col">Vencimiento</th>
              <th scope="col">Cierre</th>
              <th scope="col" class="text-center">Estado</th>
              <th scope="col">Motivo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sesion in sesiones" :key="sesion.id">
              <td class="fw-semibold text-secondary">{{ sesion.id }}</td>
              <td><code class="text-dark">{{ sesion.indicador }}</code></td>
              <td class="fw-medium">{{ sesion.nombreUsuario || '-' }}</td>
              <td><span class="font-monospace fs-7">{{ sesion.ipAddress || '-' }}</span></td>
              <td class="user-agent text-truncate" :title="sesion.userAgent || ''">
                {{ sesion.userAgent || '-' }}
              </td>
              <td class="text-nowrap small">{{ mostrarFecha(sesion.startedAt) }}</td>
              <td class="text-nowrap small">{{ mostrarFecha(sesion.lastActivityAt) }}</td>
              <td class="text-nowrap small">{{ mostrarFecha(sesion.expiresAt) }}</td>
              <td class="text-nowrap small">{{ mostrarFecha(sesion.endedAt) }}</td>
              <td class="text-center">
                <span class="badge" :class="claseEstado(sesion)">
                  {{ estadoSesion(sesion) }}
                </span>
              </td>
              <td class="small">{{ motivoCierre(sesion.endReason) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer y Paginación -->
      <footer class="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3">
        <div class="text-muted small">
          Mostrando {{ sesiones.length }} de {{ total }} sesiones
        </div>

        <nav v-if="totalPaginas > 1" class="d-flex align-items-center gap-2" aria-label="Paginación">
          <button 
            class="btn btn-sm btn-outline-secondary" 
            :disabled="pagina <= 1 || cargando" 
            @click="cargarSesiones(pagina - 1)"
          >
            <i class="bi bi-chevron-left me-1"></i>Anterior
          </button>
          <span class="small text-muted px-2">Página {{ pagina }} de {{ totalPaginas }}</span>
          <button 
            class="btn btn-sm btn-outline-secondary" 
            :disabled="pagina >= totalPaginas || cargando" 
            @click="cargarSesiones(pagina + 1)"
          >
            Siguiente<i class="bi bi-chevron-right ms-1"></i>
          </button>
        </nav>
      </footer>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { consultarSesiones } from '@/services/auth'
import { usarEstadoAutenticacion } from '@/stores/auth'

const auth = usarEstadoAutenticacion()

// Estado principal
const sesiones = ref([])
const pagina = ref(1)
const total = ref(0)
const totalPaginas = ref(0)
const cargando = ref(false)
const error = ref('')

// Filtros
const busqueda = ref('')
const filtroEstado = ref('')
const fechaDesde = ref('')
const fechaHasta = ref('')

// Control de debounce para la búsqueda por texto
let debounceTimer = null

const hayFiltrosActivos = computed(() => {
  return busqueda.value || filtroEstado.value || fechaDesde.value || fechaHasta.value
})

async function cargarSesiones(paginaSolicitada = 1) {
  if (auth.user.value?.rol !== 'Administrador') {
    error.value = 'Acceso reservado para administradores.'
    return
  }

  cargando.value = true
  error.value = ''

  try {
    // Parámetros formateados para enviar al Backend
    const params = {
      pagina: paginaSolicitada,
      q: busqueda.value.trim() || undefined,
      estado: filtroEstado.value || undefined,
      desde: fechaDesde.value || undefined,
      hasta: fechaHasta.value || undefined
    }

    const respuesta = await consultarSesiones(params)
    if (respuesta.statusCode !== 200) throw new Error(respuesta.statusText)

    sesiones.value = respuesta.result.sesiones || []
    pagina.value = respuesta.result.pagina
    total.value = respuesta.result.total
    totalPaginas.value = respuesta.result.totalPaginas
  } catch (err) {
    error.value = err.response?.data?.statusText || err.message || 'No fue posible cargar las sesiones.'
  } finally {
    cargando.value = false
  }
}

// Búsqueda con reactividad y debounce (evita hacer múltiples peticiones por cada tecla)
watch(busqueda, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    ejecutarFiltro()
  }, 400)
})

function ejecutarFiltro() {
  cargarSesiones(1)
}

function limpiarFiltros() {
  busqueda.value = ''
  filtroEstado.value = ''
  fechaDesde.value = ''
  fechaHasta.value = ''
  cargarSesiones(1)
}

function mostrarFecha(valor) {
  if (!valor) return '-'
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? '-' : fecha.toLocaleString('es-VE')
}

function estadoSesion(sesion) {
  if (sesion.endedAt) return 'Cerrada'
  if (new Date(sesion.expiresAt).getTime() <= Date.now()) return 'Vencida'
  return 'Activa'
}

function claseEstado(sesion) {
  const estado = estadoSesion(sesion)
  if (estado === 'Activa') return 'bg-success-subtle text-success border border-success-subtle'
  if (estado === 'Vencida') return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle'
  return 'bg-secondary-subtle text-secondary border border-secondary-subtle'
}

function motivoCierre(motivo) {
  const motivos = {
    logout: 'Cierre manual',
    expired: 'Inactividad',
    account_locked: 'Bloqueo de usuario'
  }
  return motivos[motivo] || '-'
}

onMounted(() => cargarSesiones())
</script>

<style scoped>
.sesiones-view {
  width: 100%;
}

/* Manejo responsivo del user-agent */
.user-agent {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Animación icono de recarga */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Ajustes tipográficos ligeros */
.fs-7 {
  font-size: 0.85rem;
}
</style>