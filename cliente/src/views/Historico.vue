<script setup>
import { ref, onMounted, computed } from 'vue';
import { getSolicitudes } from '@/services/getSolicitudes';

const lista = ref([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');

const ahora = () => new Date();

const obtenerFecha = (solicitud) => {
  if (solicitud.fechaFin) {
    const fecha = new Date(solicitud.fechaFin);
    if (!Number.isNaN(fecha.getTime())) return fecha;
  }
  if (solicitud.fechaInicio) {
    const fecha = new Date(solicitud.fechaInicio);
    if (!Number.isNaN(fecha.getTime())) return fecha;
  }
  return null;
};

const esHistorico = (solicitud) => {
  const fecha = obtenerFecha(solicitud);
  const vencida = fecha ? fecha < ahora() : false;
  const estado = (solicitud.estado || '').toLowerCase();

  if (estado === 'rechazada' || estado === 'cancelada') return true;
  if (estado === 'pendiente' && vencida) return true;
  if (estado === 'aprobada' && vencida) return true;
  return false;
};

const obtenerMotivoHistorico = (solicitud) => {
  const estado = (solicitud.estado || '').toLowerCase();
  const fecha = obtenerFecha(solicitud);
  const vencida = fecha ? fecha < ahora() : false;

  if (estado === 'rechazada' || estado === 'cancelada') {
    return 'Cancelada';
  }
  if (estado === 'pendiente' && vencida) {
    return 'Caducada sin respuesta';
  }
  if (estado === 'aprobada' && vencida) {
    return 'Aprobada y tiempo terminado';
  }
  return '-';
};

const listaHistorica = computed(() => lista.value.filter(esHistorico));

const listaFiltrada = computed(() => {
  const termino = searchQuery.value.trim().toLowerCase();
  if (!termino) return listaHistorica.value;
  return listaHistorica.value.filter((solicitud) => {
    const texto = [
      solicitud.id,
      solicitud.tipoSolicitud,
      solicitud.subtipo,
      solicitud.descripcion,
      solicitud.solicitante,
      solicitud.cedulaSolicitante,
      solicitud.aprobador,
      solicitud.origen,
      solicitud.destino,
      solicitud.estado,
      solicitud.motivoRechazo,
      solicitud.tipoServicio
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return texto.includes(termino);
  });
});

const formatoFecha = (valor) => {
  if (!valor) return '-';
  const fecha = new Date(valor);
  if (Number.isNaN(fecha.getTime())) return '-';
  return fecha.toLocaleDateString();
};

const cargarSolicitudes = async () => {
  loading.value = true;
  error.value = '';
  try {
    const datos = await getSolicitudes();
    lista.value = Array.isArray(datos) ? datos : [];
  } catch (e) {
    error.value = e.statusText || 'No se pudieron cargar las solicitudes.';
  } finally {
    loading.value = false;
  }
};

onMounted(cargarSolicitudes);
</script>

<template>
  <div class="tabla-container">
    <h1>Histórico de solicitudes</h1>
    <p class="text-muted mb-3">Esta tabla muestra solicitudes canceladas, caducadas sin respuesta o aprobadas cuya vigencia ya terminó.</p>

    <div class="d-flex flex-wrap gap-2 mb-3 align-items-center">
      <div class="flex-grow-1">
        <input
          type="search"
          class="form-control"
          v-model="searchQuery"
          placeholder="Buscar en histórico por ID, tipo, solicitante, aprobador, estado..."
        />
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="loading" class="text-info">Cargando histórico...</div>

    <div class="table-responsive">
      <table v-if="!loading && listaFiltrada.length" class="table table-striped table-hover table-left">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Subtipo</th>
            <th>Solicitante</th>
            <th>Cédula</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Estado</th>
            <th>Razón</th>
            <th>Motivo Rechazo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sol in listaFiltrada" :key="sol.id">
            <td>{{ sol.id }}</td>
            <td>{{ sol.tipoSolicitud }}</td>
            <td>{{ sol.subtipo || '-' }}</td>
            <td>{{ sol.solicitante || '-' }}</td>
            <td>{{ sol.cedulaSolicitante || '-' }}</td>
            <td>{{ sol.origen || '-' }}</td>
            <td>{{ sol.destino || '-' }}</td>
            <td>{{ formatoFecha(sol.fechaInicio) }}</td>
            <td>{{ formatoFecha(sol.fechaFin) }}</td>
            <td>
              <span
                :class="{
                  'badge bg-warning': sol.estado === 'pendiente',
                  'badge bg-success': sol.estado === 'aprobada',
                  'badge bg-danger': sol.estado === 'rechazada' || sol.estado === 'cancelada'
                }"
              >
                {{ sol.estado }}
              </span>
            </td>
            <td>{{ obtenerMotivoHistorico(sol) }}</td>
            <td>{{ sol.motivoRechazo || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && !listaFiltrada.length" class="alert alert-secondary">
      No hay solicitudes históricas para mostrar.
    </div>
  </div>
</template>
