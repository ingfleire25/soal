<template>
  <!-- APERTURA DE ETIQUETA PRIINCIPAL -->
  <!-- <div class="plan-dashboard container py-4"> -->
    <h1 class="mb-3">Planificación semanal</h1>
    <p class="text-muted mb-4">
      Solicitudes aprobadas y vigentes en la semana del
      <strong>{{ formatoFecha(startOfWeek) }}</strong> al
      <strong>{{ formatoFecha(endOfWeek) }}</strong>.
    </p>

    <div v-if="loading" class="alert alert-info">Cargando solicitudes...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="!loading && !error" class="row gy-3 mb-4">
      <!-- Etiquetas por tipo de solicitud -->
      <div class="col-md-4 col-lg-2-4">
        <div class="card shadow-sm h-100 bg-light">
          <div class="card-body text-center">
            <h6 class="card-title small">Transporte Personal Ocasional</h6>
            <p class="display-6 mb-0">{{ countTransporteOcasional }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-lg-2-4">
        <div class="card shadow-sm h-100 bg-light">
          <div class="card-body text-center">
            <h6 class="card-title small">Transporte Personal Recurrente</h6>
            <p class="display-6 mb-0">{{ countTransporteRecurrente }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-lg-2-4">
        <div class="card shadow-sm h-100 bg-light">
          <div class="card-body text-center">
            <h6 class="card-title small">Movimiento Unidades Mayores</h6>
            <p class="display-6 mb-0">{{ countMovimientoUnidades }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-lg-2-4">
        <div class="card shadow-sm h-100 bg-light">
          <div class="card-body text-center">
            <h6 class="card-title small">Suministro Lacustre</h6>
            <p class="display-6 mb-0">{{ countSuministroLacustre }}</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-lg-2-4">
        <div class="card shadow-sm h-100 bg-light">
          <div class="card-body text-center">
            <h6 class="card-title small">Servicios Portuarios</h6>
            <p class="display-6 mb-0">{{ countServiciosPortuarios }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && filteredSolicitudes.length" class="table-responsive">
      <table class="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Subtipo</th>
            <th>Descripción</th>
            <th>Solicitante</th>
            <th>Aprobador</th>
            <th>Correo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Origen</th>
            <th>Destino</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sol in filteredSolicitudes" :key="sol.id">
            <td>{{ sol.id }}</td>
            <td>{{ sol.tipoSolicitud }}</td>
            <td>{{ sol.subtipo || '-' }}</td>
            <td>{{ sol.descripcion || '-' }}</td>
            <td>{{ sol.solicitante }}</td>
            <td>{{ sol.aprobador || '-' }}</td>
            <td>{{ sol.correo || '-' }}</td>
            <td>{{ formatoFecha(sol.fechaInicio) }}</td>
            <td>{{ sol.fechaFin ? formatoFecha(sol.fechaFin) : '-' }}</td>
            <td>{{ sol.origen }}</td>
            <td>{{ sol.destino }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && !filteredSolicitudes.length" class="alert alert-secondary">
      No hay solicitudes aprobadas vigentes para esta semana.
    </div>
    <!-- CIERRE DE DIV PRINCIPAL LE FALTAN ESTILOS -->
  <!-- </div> -->
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getSolicitudes } from '@/services/getSolicitudes';

const solicitudes = ref([]);
const loading = ref(false);
const error = ref('');

const today = new Date();
const startOfWeek = new Date(today);
const dayOfWeek = today.getDay();
const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
startOfWeek.setDate(today.getDate() + mondayOffset);
startOfWeek.setHours(0, 0, 0, 0);

const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 6);
endOfWeek.setHours(23, 59, 59, 999);

const formatoFecha = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleDateString();
};

const esVigenteEnSemana = (solicitud) => {
  const inicio = solicitud.fechaInicio ? new Date(solicitud.fechaInicio) : null;
  const fin = solicitud.fechaFin ? new Date(solicitud.fechaFin) : null;
  if (!inicio || !fin) return false;
  return inicio <= endOfWeek && fin >= startOfWeek;
};

const filteredSolicitudes = computed(() => {
  return solicitudes.value.filter((sol) => {
    return sol.estado === 'aprobada' && esVigenteEnSemana(sol);
  });
});

const totalSolicitudes = computed(() => filteredSolicitudes.value.length);

const countTransporteOcasional = computed(() => {
  return filteredSolicitudes.value.filter((sol) =>
    sol.tipoSolicitud === 'Transporte de Personal' && sol.subtipo === 'Ocasional'
  ).length;
});

const countTransporteRecurrente = computed(() => {
  return filteredSolicitudes.value.filter((sol) =>
    sol.tipoSolicitud === 'Transporte de Personal' && sol.subtipo === 'Recurrente'
  ).length;
});

const countMovimientoUnidades = computed(() => {
  return filteredSolicitudes.value.filter((sol) =>
    sol.tipoSolicitud === 'Movimiento Unidades Mayores'
  ).length;
});

const countSuministroLacustre = computed(() => {
  return filteredSolicitudes.value.filter((sol) =>
    sol.tipoSolicitud === 'Suministro Lacustre'
  ).length;
});

const countServiciosPortuarios = computed(() => {
  return filteredSolicitudes.value.filter((sol) =>
    sol.tipoSolicitud === 'Servicios Portuarios'
  ).length;
});

const countByType = (tipo) => {
  return filteredSolicitudes.value.filter((sol) => sol.tipoSolicitud === tipo).length;
};

const cargarSolicitudes = async () => {
  loading.value = true;
  error.value = '';
  try {
    const datos = await getSolicitudes();
    solicitudes.value = datos || [];
  } catch (err) {
    error.value = err.statusText || 'Error al cargar solicitudes';
  } finally {
    loading.value = false;
  }
};

onMounted(cargarSolicitudes);
</script>

<style scoped>
.plan-dashboard { max-width: 1100px; margin: auto; }
</style>
