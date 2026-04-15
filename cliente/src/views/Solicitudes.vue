<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getSolicitudes } from '@/services/getSolicitudes';
import { updateSolicitud } from '@/services/updateSolicitud';
import { cambiarEstado } from '@/services/cambiarEstado';
import { getCompanies } from '@/services/getCompanies';

const route = useRoute();
const auth = useAuthStore();
const lista = ref([]);
const error = ref('');
const loading = ref(false);
const companies = ref([]);

const userFullName = computed(() => {
  const usuario = auth.user?.value;
  if (!usuario) return '';
  return `${usuario.nombres} ${usuario.apellidos}`;
});

const userRole = computed(() => auth.user?.value?.rol || '');

const esAprobador = computed(() => ['Gerente', 'Subgerente', 'Supervisor'].includes(userRole.value));

const filtroTipo = computed(() => route.query.tipoSolicitud || null);
const filtroSubtipo = computed(() => route.query.subtipo || null);

const cargarSolicitudes = async () => {
  error.value = '';
  loading.value = true;
  try {
    const datos = await getSolicitudes();
    lista.value = datos
      .filter(s => (filtroTipo.value ? s.tipoSolicitud === filtroTipo.value : true))
      .filter(s => (filtroSubtipo.value ? s.subtipo === filtroSubtipo.value : true));
  } catch (e) {
    error.value = e.statusText || 'No se pudieron cargar las solicitudes';
  } finally {
    loading.value = false;
  }
};

const cargarCompanies = async () => {
  try {
    companies.value = await getCompanies();
  } catch (e) {
    console.error('Error cargando compañías:', e);
  }
};

const editingId = ref(null);
const editForm = ref({});
const modalRef = ref(null);
const modalInstance = ref(null);

const puedeEditar = (s) => {
  return s.solicitante === userFullName.value && s.estado === 'pendiente';
};

const puedeAprobar = (s) => {
  return esAprobador.value && s.estado === 'pendiente';
};

const aprobar = async (s) => {
  if (!confirm('¿Confirma aprobación de la solicitud?')) return;
  try {
    await cambiarEstado(s.id, { estado: 'aprobada' });
    await cargarSolicitudes();
  } catch (e) {
    alert('Error al aprobar: ' + e.statusText);
  }
};

const rechazar = async (s) => {
  const motivo = prompt('Motivo de rechazo');
  if (!motivo) return;
  try {
    await cambiarEstado(s.id, { estado: 'rechazada', motivoRechazo: motivo });
    await cargarSolicitudes();
  } catch (e) {
    alert('Error al rechazar: ' + e.statusText);
  }
};

const iniciarEdicion = (s) => {
  editingId.value = s.id;
  editForm.value = { ...s };
  if (!modalInstance.value) {
    modalInstance.value = new bootstrap.Modal(modalRef.value);
    modalRef.value.addEventListener('hidden.bs.modal', () => {
      editingId.value = null;
      editForm.value = {};
    });
  }
  modalInstance.value.show();
};

const cancelarEdicion = () => {
  if (modalInstance.value) {
    modalInstance.value.hide();
  }
  editingId.value = null;
  editForm.value = {};
};

const guardarEdicion = async () => {
  try {
    await updateSolicitud(editingId.value, {
      descripcion: editForm.value.descripcion,
      origen: editForm.value.origen,
      descripcionOrigen: editForm.value.descripcionOrigen,
      destino: editForm.value.destino,
      descripcionDestino: editForm.value.descripcionDestino,
      fechaInicio: editForm.value.fechaInicio,
      fechaFin: editForm.value.fechaFin,
      organizacionCcOi: editForm.value.organizacionCcOi,
      lunes: editForm.value.lunes,
      martes: editForm.value.martes,
      miercoles: editForm.value.miercoles,
      jueves: editForm.value.jueves,
      viernes: editForm.value.viernes,
      sabado: editForm.value.sabado,
      domingo: editForm.value.domingo,
      cantidadPasajeros: editForm.value.cantidadPasajeros,
      tipoServicio: editForm.value.tipoServicio,
      aprobador: editForm.value.aprobador,
      correo: editForm.value.correo,
      tipoSolicitud: editForm.value.tipoSolicitud,
      subtipo: editForm.value.subtipo
    });
    await cargarSolicitudes();
    cancelarEdicion();
  } catch (e) {
    alert('Error al guardar edición: ' + e.statusText);
  }
};

onMounted(() => {
  cargarSolicitudes();
  cargarCompanies();
});
watch([filtroTipo, filtroSubtipo], cargarSolicitudes);
</script>

<template>
  <div class="tabla-container">
    <h1>Solicitudes registradas</h1>
    <p v-if="route.query.tipoSolicitud || route.query.subtipo" class="text-muted">
      Filtrado: <span v-if="route.query.tipoSolicitud">{{ route.query.tipoSolicitud }}</span>
      <span v-if="route.query.subtipo">/ {{ route.query.subtipo }}</span>
    </p>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="text-info">Cargando solicitudes...</p>

    <div class="table-responsive">
      <table v-if="!loading && lista.length" class="table table-striped table-left">
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
            <th>Motivo Rechazo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in lista" :key="s.id">
            <td>{{ s.id }}</td>
            <td>{{ s.tipoSolicitud }}</td>
            <td>{{ s.subtipo }}</td>
            <td>{{ s.solicitante }}</td>
            <td>{{ s.cedulaSolicitante }}</td>
            <td>{{ s.origen }}</td>
            <td>{{ s.destino }}</td>
            <td>{{ new Date(s.fechaInicio).toLocaleDateString() }}</td>
            <td>{{ s.fechaFin ? new Date(s.fechaFin).toLocaleDateString() : '-' }}</td>
            <td>
              <span
                :class="{
                  'badge bg-warning': s.estado === 'pendiente',
                  'badge bg-success': s.estado === 'aprobada',
                  'badge bg-danger': s.estado === 'rechazada'
                }"
              >
                {{ s.estado }}
              </span>
            </td>
            <td>{{ s.motivoRechazo || '-' }}</td>
            <td>
              <button v-if="puedeEditar(s)" @click="iniciarEdicion(s)" class="btn btn-sm btn-primary me-1">Editar</button>
              <button v-if="puedeAprobar(s)" @click="aprobar(s)" class="btn btn-sm btn-success me-1">Aprobar</button>
              <button v-if="puedeAprobar(s)" @click="rechazar(s)" class="btn btn-sm btn-danger">Rechazar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="!loading && !lista.length" class="text-secondary">No hay solicitudes.</p>

    <!-- Modal para editar -->
    <div ref="modalRef" class="modal fade" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Editar solicitud</h5>
            <button type="button" class="btn-close" @click="cancelarEdicion" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row g-2">
              <div class="col-md-12">
                <label class="form-label">Descripción</label>
                <textarea class="form-control" v-model="editForm.descripcion" rows="2"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">Origen</label>
                <input class="form-control" v-model="editForm.origen" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Descripción Origen</label>
                <input class="form-control" v-model="editForm.descripcionOrigen" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Destino</label>
                <input class="form-control" v-model="editForm.destino" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Descripción Destino</label>
                <input class="form-control" v-model="editForm.descripcionDestino" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha Inicio</label>
                <input type="date" class="form-control" v-model="editForm.fechaInicio" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha Fin</label>
                <input type="date" class="form-control" v-model="editForm.fechaFin" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Código de Organización</label>
                <select class="form-control" v-model="editForm.organizacionCcOi">
                  <option value="">Seleccione...</option>
                  <option v-for="comp in companies" :key="comp.company" :value="comp.company">{{ comp.company }} - {{ comp.name }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Tipo servicio</label>
                <input class="form-control" v-model="editForm.tipoServicio" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Aprobador</label>
                <input class="form-control" v-model="editForm.aprobador" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Correo</label>
                <input class="form-control" v-model="editForm.correo" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Cant. Pasajeros</label>
                <input type="number" class="form-control" v-model.number="editForm.cantidadPasajeros" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelarEdicion">Cancelar</button>
            <button type="button" class="btn btn-success" @click="guardarEdicion">Guardar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabla-container { max-width: 100%; margin: 0; padding: 1rem; }
.table-left { margin-left: 0; }
.error { color: red; }
</style>
<style>

</style>