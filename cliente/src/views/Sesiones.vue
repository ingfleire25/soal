<template>
  <section class="sesiones-view">
    <header class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
      <h1 class="h3 mb-0">Registro de sesiones</h1>
      <button class="btn btn-outline-secondary" type="button" :disabled="cargando" @click="cargarSesiones(pagina)">
        <i class="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
        Actualizar
      </button>
    </header>

    <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div v-else-if="cargando" class="py-3" role="status">Cargando sesiones...</div>
    <div v-else-if="!sesiones.length" class="py-3">No hay sesiones registradas.</div>

    <template v-else>
      <div class="table-responsive">
        <table class="table table-sm table-hover table-bordered align-middle sesiones-table">
          <thead class="table-light">
            <tr>
              <th scope="col">N.º</th>
              <th scope="col">Indicador</th>
              <th scope="col">Usuario</th>
              <th scope="col">IP</th>
              <th scope="col">Equipo / navegador</th>
              <th scope="col">Inicio</th>
              <th scope="col">Última actividad</th>
              <th scope="col">Vencimiento</th>
              <th scope="col">Cierre</th>
              <th scope="col">Estado</th>
              <th scope="col">Motivo</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sesion in sesiones" :key="sesion.id">
              <td>{{ sesion.id }}</td>
              <td>{{ sesion.indicador }}</td>
              <td>{{ sesion.nombreUsuario || '-' }}</td>
              <td>{{ sesion.ipAddress || '-' }}</td>
              <td class="user-agent" :title="sesion.userAgent || ''">{{ sesion.userAgent || '-' }}</td>
              <td>{{ mostrarFecha(sesion.startedAt) }}</td>
              <td>{{ mostrarFecha(sesion.lastActivityAt) }}</td>
              <td>{{ mostrarFecha(sesion.expiresAt) }}</td>
              <td>{{ mostrarFecha(sesion.endedAt) }}</td>
              <td>
                <span class="badge" :class="claseEstado(sesion)">{{ estadoSesion(sesion) }}</span>
              </td>
              <td>{{ motivoCierre(sesion.endReason) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
        <span>{{ total }} sesiones</span>
        <nav v-if="totalPaginas > 1" class="d-flex align-items-center gap-2" aria-label="Paginación de sesiones">
          <button class="btn btn-sm btn-outline-secondary" :disabled="pagina <= 1 || cargando" @click="cargarSesiones(pagina - 1)">
            Anterior
          </button>
          <span>Página {{ pagina }} de {{ totalPaginas }}</span>
          <button class="btn btn-sm btn-outline-secondary" :disabled="pagina >= totalPaginas || cargando" @click="cargarSesiones(pagina + 1)">
            Siguiente
          </button>
        </nav>
      </footer>
    </template>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { consultarSesiones } from '@/services/auth'
import { usarEstadoAutenticacion } from '@/stores/auth'

const auth = usarEstadoAutenticacion()
const sesiones = ref([])
const pagina = ref(1)
const total = ref(0)
const totalPaginas = ref(0)
const cargando = ref(false)
const error = ref('')

async function cargarSesiones(paginaSolicitada = 1) {
  if (auth.user.value?.rol !== 'Administrador') {
    error.value = 'Acceso reservado para administradores.'
    return
  }

  cargando.value = true
  error.value = ''
  try {
    const respuesta = await consultarSesiones(paginaSolicitada)
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
  if (sesion.endedAt) return 'text-bg-secondary'
  return estadoSesion(sesion) === 'Activa' ? 'text-bg-success' : 'text-bg-warning'
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
  max-width: 100%;
}

.sesiones-table {
  min-width: 1150px;
}

.user-agent {
  max-width: 280px;
  overflow-wrap: anywhere;
}
</style>