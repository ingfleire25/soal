<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getSolicitudes } from '@/services/getSolicitudes';
import { updateSolicitud } from '@/services/updateSolicitud';
import { cambiarEstado } from '@/services/cambiarEstado';
import { getCompanies } from '@/services/getCompanies';
import { toDatetimeLocalFromISOString } from '@/utils/dateTime';

const route = useRoute();
const auth = useAuthStore();
const lista = ref([]);
const error = ref('');
const loading = ref(false);
const companies = ref([]);
const searchQuery = ref('');
const selectedTipo = ref('');
const selectedEstado = ref('');

const tipoOptions = [
  { value: '', label: 'Todos los tipos' },
  { value: 'Transporte de Personal', label: 'TP - Transporte personal' },
  { value: 'Movimiento Unidades Mayores', label: 'OUM - Operaciones de unidades mayores' },
  { value: 'Suministro Lacustre', label: 'SL - Suministro lacustre' }
];

const estadoOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'aprobada', label: 'Aprobada' },
  { value: 'rechazada', label: 'Rechazada' }
];

const userFullName = computed(() => {
  const usuario = auth.user?.value;
  if (!usuario) return '';
  return `${usuario.nombres} ${usuario.apellidos}`;
});

const userRole = computed(() => auth.user?.value?.rol || '');

const esAprobador = computed(() => ['Aprobador', 'Administrador'].includes(userRole.value));

const usuarioGerencia = computed(() => auth.user?.value?.gerencia || '');
const tieneGerencia = computed(() => lista.value.some(s => s.gerencia));

const listaFiltrada = computed(() => {
  return lista.value.filter(s => {
    const texto = [
      s.id,
      s.tipoSolicitud,
      s.subtipo,
      s.descripcion,
      s.origen,
      s.destino,
      s.descripcionOrigen,
      s.descripcionDestino,
      s.solicitante,
      s.cedulaSolicitante,
      s.aprobador,
      s.correo,
      s.estado,
      s.motivoRechazo,
      s.tipoServicio
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const buscado = searchQuery.value.trim().toLowerCase();
    if (buscado && !texto.includes(buscado)) return false;
    if (selectedTipo.value && s.tipoSolicitud !== selectedTipo.value) return false;
    if (selectedEstado.value && s.estado !== selectedEstado.value) return false;
    if (usuarioGerencia.value && tieneGerencia.value && s.gerencia !== usuarioGerencia.value) return false;
    return true;
  });
});

const cargarSolicitudes = async () => {
  error.value = '';
  loading.value = true;
  try {
    const datos = await getSolicitudes();
    lista.value = datos;
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
  editForm.value = {
    ...s,
    fechaInicio: toDatetimeLocalFromISOString(s.fechaInicio),
    fechaFin: toDatetimeLocalFromISOString(s.fechaFin)
  };
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

const actualizarDia = (campo, valor) => {
  const letra = String(valor || '').trim().toUpperCase().replace(/[^CF]/g, '').slice(0, 1);
  editForm.value[campo] = letra;
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

const limpiarFiltros = () => {
  searchQuery.value = '';
  selectedTipo.value = '';
  selectedEstado.value = '';
};
</script>

<template>
  <div class="tabla-container">
    <h1>Solicitudes registradas</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="loading" class="text-info">Cargando solicitudes...</p>

    <div class="d-flex flex-wrap gap-2 mb-3 align-items-center">
      <div class="flex-grow-1">
        <input
          type="search"
          class="form-control"
          v-model="searchQuery"
          placeholder="Buscar solicitudes por ID, tipo, origen, destino, solicitante, aprobador, estado..."
        />
      </div>

      <div class="dropdown">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          {{ selectedTipo ? tipoOptions.find(option => option.value === selectedTipo)?.label : 'Tipo de solicitud' }}
        </button>
        <ul class="dropdown-menu">
          <li v-for="option in tipoOptions" :key="option.value">
            <a class="dropdown-item" href="#" @click.prevent="selectedTipo = option.value">{{ option.label }}</a>
          </li>
        </ul>
      </div>

      <div class="dropdown">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          {{ selectedEstado ? estadoOptions.find(option => option.value === selectedEstado)?.label : 'Estado' }}
        </button>
        <ul class="dropdown-menu">
          <li v-for="option in estadoOptions" :key="option.value">
            <a class="dropdown-item" href="#" @click.prevent="selectedEstado = option.value">{{ option.label }}</a>
          </li>
        </ul>
      </div>

      <button v-if="searchQuery || selectedTipo || selectedEstado" class="btn btn-outline-primary" @click="limpiarFiltros">
        Limpiar filtros
      </button>
    </div>

    <div class="table-responsive">
      <table v-if="!loading && listaFiltrada.length" class="table table-striped table-left">
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
          <tr v-for="s in listaFiltrada" :key="s.id">
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
            <td class="acciones-cell">
              <button 
                v-if="puedeEditar(s)" 
                @click="iniciarEdicion(s)" 
                class="btn-icon btn-edit"
                title="Editar"
              >
                <i class="material-icons">edit</i>
              </button>
              
              <button 
                v-if="puedeAprobar(s)" 
                @click="aprobar(s)" 
                class="btn-icon btn-approve" 
                title="Aprobar"
              >
                <i class="material-icons">check_circle</i>
              </button>
              
              <button 
                v-if="puedeAprobar(s)" 
                @click="rechazar(s)" 
                class="btn-icon btn-reject" 
                title="Rechazar"
              >
                <i class="material-icons">cancel</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="!loading && !listaFiltrada.length" class="text-secondary">No hay solicitudes.</p>

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
                <input type="datetime-local" class="form-control" v-model="editForm.fechaInicio" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha Fin</label>
                <input type="datetime-local" class="form-control" v-model="editForm.fechaFin" />
              </div>

              <template v-if="editForm.tipoSolicitud === 'Transporte de Personal'">
                <div class="col-12">
                  <div class="row g-2">
                    <div class="col-12 mb-2"><strong>Transporte de Personal: identifica cada día con C o F</strong></div>
                    <div class="col-md-2">
                      <label class="form-label">Lunes</label>
                      <select class="form-select" v-model="editForm.lunes">
                        <option value="">---</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label">Martes</label>
                      <select class="form-select" v-model="editForm.martes">
                        <option value="">---</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label">Miércoles</label>
                      <select class="form-select" v-model="editForm.miercoles">
                        <option value="">---</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label">Jueves</label>
                      <select class="form-select" v-model="editForm.jueves">
                        <option value="">---</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label">Viernes</label>
                      <select class="form-select" v-model="editForm.viernes">
                        <option value="">---</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label">Sábado</label>
                      <select class="form-select" v-model="editForm.sabado">
                        <option value="">---</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div class="col-md-2">
                      <label class="form-label">Domingo</label>
                      <select class="form-select" v-model="editForm.domingo">
                        <option value="">---</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  </div>
                </div>
              </template>

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
                <input class="form-control bg-light" v-model="editForm.correo" readonly />
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

/* Estilos para quitar el fondo de los botones */
.acciones-cell {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-start;
  border: none !important; /* Asegura que no haya bordes internos */
  background: transparent !important;
}

.btn-icon {
  background: transparent; /* Quita el fondo blanco */
  border: none;            /* Quita el borde */
  padding: 0;             /* Quita el relleno interno */
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 0.7;
}

/* Colores específicos para cada icono */
.btn-edit .material-icons { color: #0d6efd; }    /* Azul */
.btn-approve .material-icons { color: #198754; } /* Verde */
.btn-reject .material-icons { color: #dc3545; }  /* Rojo */

.material-icons {
  font-size: 22px;
}
</style>