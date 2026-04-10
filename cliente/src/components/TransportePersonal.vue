<!-- <template>
<h4 class="text-primary mb-4">{{ titulo }}</h4>
  <div class="container bg-white p-4 shadow-sm rounded">
    <form @submit.prevent="enviar">
      <fieldset class="border p-3 mb-4 rounded">
        <legend class="w-auto px-2 fs-5 text-primary">Detalles de la Solicitud</legend>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-control form-control-sm" rows="2" required></textarea>
          </div>
          <div></div>
          <div class="col-md-6">
            <label class="form-label">Origen</label>
            <input v-model="form.origen" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción Origen</label>
            <textarea v-model="form.descripcionOrigen" class="form-control form-control-sm" rows="2"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Destino</label>
            <input v-model="form.destino" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción Destino</label>
            <textarea v-model="form.descripcionDestino" class="form-control form-control-sm" rows="2"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Inicio</label>
            <input v-model="form.fechaInicio" type="date" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Finalización</label>
            <input v-model="form.fechaFin" type="date" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Organización de CC/OI</label>
            <input v-model="form.organizacionCcOi" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-12">
            <label class="form-label">Múltiples CC/OI</label>
            <div v-for="(cc, index) in form.multiplesCcOi" :key="index" class="row g-2 mb-2">
              <div class="col-md-8">
                <input v-model="cc.ccOi" type="text" class="form-control form-control-sm" placeholder="CC/OI">
              </div>
              <div class="col-md-3">
                <input v-model.number="cc.porcentaje" type="number" class="form-control form-control-sm" placeholder="Porcentaje">
              </div>
              <div class="col-md-1">
                <button type="button" class="btn btn-sm btn-outline-danger" @click="removeCcOi(index)">X</button>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary" @click="addCcOi">Agregar CC/OI</button>
            <div class="mt-2">Sumatoria %: {{ sumatoriaPorcentaje }}%</div>
          </div>
          <div class="col-md-12">
            <label class="form-label">Días de la Semana</label>
            <div class="form-check form-check-inline">
              <input v-model="form.lunes" class="form-check-input" type="checkbox" id="lunes">
              <label class="form-check-label" for="lunes">L</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.martes" class="form-check-input" type="checkbox" id="martes">
              <label class="form-check-label" for="martes">M</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.miercoles" class="form-check-input" type="checkbox" id="miercoles">
              <label class="form-check-label" for="miercoles">M</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.jueves" class="form-check-input" type="checkbox" id="jueves">
              <label class="form-check-label" for="jueves">J</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.viernes" class="form-check-input" type="checkbox" id="viernes">
              <label class="form-check-label" for="viernes">V</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.sabado" class="form-check-input" type="checkbox" id="sabado">
              <label class="form-check-label" for="sabado">S</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.domingo" class="form-check-input" type="checkbox" id="domingo">
              <label class="form-check-label" for="domingo">D</label>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Cantidad de Pasajeros</label>
            <input v-model.number="form.cantidadPasajeros" type="number" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Tipo de Servicio</label>
            <select v-model="form.tipoServicio" class="form-control form-control-sm" required>
              <option value="">Seleccione un tipo de servicio</option>
              <option v-for="type in serviceTypes" :key="type.valdesc" :value="type.valdesc">
                {{ type.valdesc }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <label class="form-label">Aprobador</label>
            <input v-model="form.aprobador" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Correo</label>
            <input v-model="form.correo" type="email" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Solicitante</label>
            <input v-model="form.solicitante" type="text" class="form-control form-control-sm" readonly>
          </div>
          <div class="col-md-6">
            <label class="form-label">Cédula Solicitante</label>
            <input v-model="form.cedulaSolicitante" type="text" class="form-control form-control-sm" readonly>
          </div>
        </div>
      </fieldset>
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Enviar Solicitud
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { postSolicitud } from '@/services/postSolicitud';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'TransportePersonal',
  data() {
    return {
      form: {
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        fechaFin: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
        cantidadPasajeros: 1,
        tipoServicio: '',
        aprobador: '',
        correo: '',
        solicitante: '',
        cedulaSolicitante: '',        organizacion: '',
        codigoOrganizacion: '',        tipoSolicitud: 'Transporte de Personal',
        subtipo: 'Ocasional'
      },
      loading: false,
      
      // Tipos de servicio
      serviceTypes: []
  mounted() {
    if (this.$route.query.subtipo) {
      this.form.subtipo = this.$route.query.subtipo;
    }
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.solicitante = `${user.nombres} ${user.apellidos}`;
      this.form.cedulaSolicitante = user.cedula;
    }
    this.cargarUbicaciones();
    this.cargarServiceTypes();
  },
  computed: {
    titulo() {
      return `Crear Solicitud (${this.form.subtipo}) - Transporte de Personal`;
    },
    sumatoriaPorcentaje() {
      return this.form.multiplesCcOi.reduce((sum, cc) => sum + (cc.porcentaje || 0), 0);
    }
  },
  methods: {
    addCcOi() {
      this.form.multiplesCcOi.push({ ccOi: '', porcentaje: 0 });
    },
    removeCcOi(index) {
      this.form.multiplesCcOi.splice(index, 1);
    },
    async cargarServiceTypes() {
      try {
        this.serviceTypes = await getServiceTypes('SUBTYPETP');
      } catch (error) {
        console.error("Error cargando tipos de servicio", error);
      }
    },
    async enviar() {
      if (this.sumatoriaPorcentaje !== 100 && this.form.multiplesCcOi.length > 0) {
        alert('La suma de porcentajes debe ser 100%');
        return;
      }
      this.loading = true;
      try {
        await postSolicitud(this.form);
        alert('Solicitud enviada exitosamente');
        this.resetForm();
      } catch (error) {
        alert('Error al enviar solicitud: ' + error.statusText);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      const currentSolicitante = this.form.solicitante;
      const currentCedula = this.form.cedulaSolicitante;
      const currentSubtipo = this.form.subtipo;
      // Reset form
      Object.assign(this.form, {
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        fechaFin: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
        cantidadPasajeros: 1,
        tipoServicio: '',
        aprobador: '',
        correo: '',
        solicitante: currentSolicitante,
        cedulaSolicitante: currentCedula,
        tipoSolicitud: 'Transporte de Personal',
        subtipo: currentSubtipo
      });
    }
  }
};
</script>

<style scoped>
/* Add any specific styles if needed */
</style> -->



<!-- 
<template>
  <h4 class="text-primary mb-4">{{ titulo }}</h4>
  <div class="container bg-white p-4 shadow-sm rounded">
    <form @submit.prevent="enviar">
      <fieldset class="border p-3 mb-4 rounded">
        <legend class="w-auto px-2 fs-5 text-primary">Detalles de la Solicitud</legend>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-control form-control-sm" rows="2" required></textarea>
          </div>
          <div></div>

          <div class="col-md-6">
            <label class="form-label">Origen</label>
            <div class="input-group input-group-sm">
              <input v-model="form.origen" type="text" class="form-control" readonly placeholder="Seleccione origen..." required>
              <button class="btn btn-outline-primary" type="button" @click="abrirSelector('origen')">
                <i class="bi bi-search"></i> Buscar
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción Origen</label>
            <textarea v-model="form.descripcionOrigen" class="form-control form-control-sm" rows="2" readonly></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Destino</label>
            <div class="input-group input-group-sm">
              <input v-model="form.destino" type="text" class="form-control" readonly placeholder="Seleccione destino..." required>
              <button class="btn btn-outline-primary" type="button" @click="abrirSelector('destino')">
                <i class="bi bi-search"></i> Buscar
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción Destino</label>
            <textarea v-model="form.descripcionDestino" class="form-control form-control-sm" rows="2" readonly></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Inicio</label>
            <input v-model="form.fechaInicio" type="date" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Finalización</label>
            <input v-model="form.fechaFin" type="date" class="form-control form-control-sm" required>
          </div>
          </div>
      </fieldset>

      <div class="d-flex justify-content-end mt-3">
        <button type="submit" class="btn btn-primary" :disabled="loading || loadingLocations">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Enviar Solicitud
        </button>
      </div>
    </form>
  </div>

  <div v-if="mostrarModal" class="modal-overlay">
    <div class="modal-content shadow-lg p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="m-0">Seleccionar Ubicación ({{ campoActivo.toUpperCase() }})</h5>
        <button type="button" class="btn-close" @click="mostrarModal = false"></button>
      </div>

      <div class="mb-3">
        <input 
          type="text" 
          v-model="filtroBusqueda" 
          class="form-control" 
          placeholder="Escriba para buscar (Ej: VLA0539 o Pozo...)"
          ref="searchField"
        >
        <small class="text-muted" v-if="loadingLocations">Cargando ubicaciones...</small>
        <small class="text-muted" v-else>{{ ubicacionesFiltradas.length }} resultados encontrados</small>
      </div>

      <div class="list-group list-container">
        <button 
          v-for="(loc, index) in ubicacionesFiltradas" 
          :key="index"
          type="button"
          class="list-group-item list-group-item-action"
          @click="seleccionarUbicacion(loc)"
        >
          <strong>{{ loc.LOCATION }}</strong><br>
          <small>{{ loc.DESCRIPTION }}</small>
        </button>
        <div v-if="ubicacionesFiltradas.length === 0 && !loadingLocations" class="text-center p-3">
          No se encontraron resultados.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postSolicitud } from '@/services/postSolicitud';
import { useAuthStore } from '@/stores/auth';
import { getLocations } from '@/services/getLocations';
import { getServiceTypes } from '@/services/getServiceTypes';

export default {
  name: 'TransportePersonal',
  data() {
    return {
      form: {
        descripcion: '', origen: '', descripcionOrigen: '', destino: '', descripcionDestino: '',
        fechaInicio: '', fechaFin: '', organizacionCcOi: '', multiplesCcOi: [],
        lunes: false, martes: false, miercoles: false, jueves: false, viernes: false, sabado: false, domingo: false,
        cantidadPasajeros: 1, tipoServicio: '', aprobador: '', correo: '', solicitante: '', cedulaSolicitante: '',
        tipoSolicitud: 'Transporte de Personal', subtipo: 'Ocasional'
      },
      loading: false,
      
      // Lógica de ubicaciones
      locations: [],
      loadingLocations: false,
      mostrarModal: false,
      campoActivo: '', // 'origen' o 'destino'
      filtroBusqueda: ''
    };
  },
  computed: {
    titulo() {
      return `Crear Solicitud (${this.form.subtipo}) - Transporte de Personal`;
    },
    sumatoriaPorcentaje() {
      return this.form.multiplesCcOi.reduce((sum, cc) => sum + (cc.porcentaje || 0), 0);
    },
    // FILTRO INTELIGENTE: Filtra 40,000 registros de forma eficiente
    ubicacionesFiltradas() {
      if (!this.filtroBusqueda) return []; // No mostrar nada si no hay búsqueda para no saturar el DOM
      const term = this.filtroBusqueda.toLowerCase();
      return this.locations
        .filter(loc => 
          loc.LOCATION.toLowerCase().includes(term) || 
          loc.DESCRIPTION.toLowerCase().includes(term)
        )
        .slice(0, 50); // Limitamos a 50 resultados visibles por rendimiento
    }
  },
  mounted() {
    this.cargarUbicaciones();
    // (Tu lógica original de auth...)
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.solicitante = `${user.nombres} ${user.apellidos}`;
      this.form.cedulaSolicitante = user.cedula;
    }
  },
  methods: {
    async cargarUbicaciones() {
      this.loadingLocations = true;
      try {
        this.locations = await getLocations();
      } catch (error) {
        console.error("Error cargando locaciones", error);
      } finally {
        this.loadingLocations = false;
      }
    },
    abrirSelector(tipo) {
      this.campoActivo = tipo;
      this.filtroBusqueda = '';
      this.mostrarModal = true;
      // Pequeño timeout para dar foco al input
      setTimeout(() => this.$refs.searchField?.focus(), 100);
    },
    seleccionarUbicacion(loc) {
      if (this.campoActivo === 'origen') {
        this.form.origen = loc.LOCATION;
        this.form.descripcionOrigen = loc.DESCRIPTION;
      } else {
        this.form.destino = loc.LOCATION;
        this.form.descripcionDestino = loc.DESCRIPTION;
      }
      this.mostrarModal = false;
    },
    // ... Tus métodos addCcOi, removeCcOi, enviar y resetForm se mantienen igual
    addCcOi() { this.form.multiplesCcOi.push({ ccOi: '', porcentaje: 0 }); },
    removeCcOi(index) { this.form.multiplesCcOi.splice(index, 1); },
    async enviar() {
        if (this.sumatoriaPorcentaje !== 100 && this.form.multiplesCcOi.length > 0) {
            alert('La suma de porcentajes debe ser 100%');
            return;
        }
        this.loading = true;
        try {
            await postSolicitud(this.form);
            alert('Solicitud enviada exitosamente');
            this.resetForm();
        } catch (error) {
            alert('Error al enviar solicitud');
        } finally {
            this.loading = false;
        }
    },
    resetForm() {
        // ... misma lógica que ya tenías
    }
  }
};
</script>

<style scoped>
/* Estilos para el Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1050;
}
.modal-content {
  background: white;
  width: 90%; max-width: 600px;
  max-height: 80vh;
  border-radius: 8px;
  overflow: hidden;
}
.list-container {
  max-height: 400px;
  overflow-y: auto;
}
</style> -->

<template>
  <h4 class="text-primary mb-4">{{ titulo }}</h4>
  <div class="container bg-white p-4 shadow-sm rounded">
    <form @submit.prevent="enviar">
      <fieldset class="border p-3 mb-4 rounded">
        <legend class="w-auto px-2 fs-5 text-primary">Detalles de la Solicitud</legend>
        <div class="row g-3">
          
          <div class="col-md-6">
            <label class="form-label fw-bold">Descripción</label>
            <textarea v-model="form.descripcion" class="form-control form-control-sm" rows="2" required></textarea>
          </div>
          <div class="col-md-6"></div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Origen</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light"><i class="bi bi-geo-alt"></i></span>
              <input 
                v-model="form.origen" 
                type="text" 
                class="form-control" 
                placeholder="Click en buscar..." 
                readonly 
                required
              >
              <button class="btn btn-primary" type="button" @click="abrirSelector('origen')">
                <span v-if="loadingLocations" class="spinner-border spinner-border-sm"></span>
                <span v-else>Buscar</span>
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Descripción Origen</label>
            <textarea v-model="form.descripcionOrigen" class="form-control form-control-sm bg-light" rows="2" readonly></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Destino</label>
            <div class="input-group input-group-sm">
              <span class="input-group-text bg-light"><i class="bi bi-geo-fill"></i></span>
              <input 
                v-model="form.destino" 
                type="text" 
                class="form-control" 
                placeholder="Click en buscar..." 
                readonly 
                required
              >
              <button class="btn btn-primary" type="button" @click="abrirSelector('destino')">
                <span v-if="loadingLocations" class="spinner-border spinner-border-sm"></span>
                <span v-else>Buscar</span>
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Descripción Destino</label>
            <textarea v-model="form.descripcionDestino" class="form-control form-control-sm bg-light" rows="2" readonly></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Fecha Requerida de Inicio</label>
            <input v-model="form.fechaInicio" type="date" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Fecha Requerida de Finalización</label>
            <input v-model="form.fechaFin" type="date" class="form-control form-control-sm" required>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Organización de CC/OI</label>
            <input v-model="form.organizacionCcOi" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Organización</label>
            <div class="input-group input-group-sm">
              <input v-model="form.organizacion" type="text" class="form-control" placeholder="Buscar empresa..." readonly required>
              <button class="btn btn-outline-primary" type="button" @click="abrirSelectorEmpresa()">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Código Organización</label>
            <input v-model="form.codigoOrganizacion" type="text" class="form-control form-control-sm" readonly>
          </div>

          <div class="col-md-12">
            <label class="form-label fw-bold">Múltiples CC/OI</label>
            <div v-for="(cc, index) in form.multiplesCcOi" :key="index" class="row g-2 mb-2 align-items-center">
              <div class="col-md-8">
                <input v-model="cc.ccOi" type="text" class="form-control form-control-sm" placeholder="CC/OI">
              </div>
              <div class="col-md-3">
                <div class="input-group input-group-sm">
                  <input v-model.number="cc.porcentaje" type="number" class="form-control" placeholder="Porcentaje">
                  <span class="input-group-text">%</span>
                </div>
              </div>
              <div class="col-md-1 text-center">
                <button type="button" class="btn btn-sm btn-outline-danger w-100" @click="removeCcOi(index)">
                  <i class="bi bi-trash"></i> X
                </button>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary mt-1" @click="addCcOi">
              + Agregar CC/OI
            </button>
            <div :class="['mt-2 fw-bold', sumatoriaPorcentaje !== 100 && form.multiplesCcOi.length > 0 ? 'text-danger' : 'text-success']">
              Sumatoria %: {{ sumatoriaPorcentaje }}%
            </div>
          </div>

          <div class="col-md-12">
            <label class="form-label fw-bold d-block">Días de la Semana</label>
            <div v-for="dia in diasConfig" :key="dia.model" class="form-check form-check-inline">
              <input v-model="form[dia.model]" class="form-check-input" type="checkbox" :id="dia.model">
              <label class="form-check-label" :for="dia.model">{{ dia.label }}</label>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Cantidad de Pasajeros</label>
            <input v-model.number="form.cantidadPasajeros" type="number" class="form-control form-control-sm" min="1" required>
          </div>
          <!-- <div class="col-md-6">
            <label class="form-label fw-bold">Tipo de Servicio</label>
            <input v-model="form.tipoServicio" type="text" class="form-control form-control-sm" required>
          </div> -->
          <div class="col-md-6">
            <label class="form-label">Tipo de Servicio</label>
            <select v-model="form.tipoServicio" class="form-control form-control-sm" required>
              <option value="">Seleccione un tipo de servicio</option>
              <option v-for="type in serviceTypes" :key="type.valdesc" :value="type.valdesc">
                {{ type.valdesc }}
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Aprobador</label>
            <input v-model="form.aprobador" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Correo</label>
            <input v-model="form.correo" type="email" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold text-muted">Solicitante</label>
            <input v-model="form.solicitante" type="text" class="form-control form-control-sm bg-light" readonly>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold text-muted">Cédula Solicitante</label>
            <input v-model="form.cedulaSolicitante" type="text" class="form-control form-control-sm bg-light" readonly>
          </div>
        </div>
      </fieldset>

      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary px-5" :disabled="loading || sumatoriaInvalida">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Enviar Solicitud
        </button>
      </div>
    </form>
  </div>

  <Transition name="fade">
    <div v-if="mostrarModal" class="modal-custom-overlay" @click.self="mostrarModal = false">
      <div class="modal-custom-content shadow-lg">
        <div class="modal-header bg-primary text-white p-3 d-flex justify-content-between">
          <h5 class="mb-0">Buscar Ubicación: {{ campoActivo === 'origen' ? 'Origen' : 'Destino' }}</h5>
          <button type="button" class="btn-close btn-close-white" @click="mostrarModal = false"></button>
        </div>
        
        <div class="p-3">
          <div class="input-group mb-3">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input 
              ref="inputBusqueda"
              type="text" 
              v-model="filtroBusqueda" 
              class="form-control" 
              placeholder="Escriba código o descripción (ej: VLA05...)"
            >
          </div>

          <div class="results-container border rounded">
            <div v-if="loadingLocations" class="text-center p-5">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2 text-muted">Cargando base de datos...</p>
            </div>
            
            <div v-else-if="ubicacionesFiltradas.length > 0" class="list-group list-group-flush">
              <button 
                v-for="(loc, index) in ubicacionesFiltradas" 
                :key="index"
                type="button"
                class="list-group-item list-group-item-action py-2"
                @click="seleccionarUbicacion(loc)"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1 text-primary fw-bold">{{ loc.LOCATION }}</h6>
                </div>
                <p class="mb-1 small text-dark">{{ loc.DESCRIPTION }}</p>
              </button>
            </div>

            <div v-else class="text-center p-5 text-muted">
              {{ filtroBusqueda.length < 2 ? 'Escriba al menos 2 caracteres para buscar...' : 'No se encontraron resultados.' }}
            </div>
          </div>
          
          <div class="mt-2 d-flex justify-content-between align-items-center">
            <small class="text-muted">Mostrando {{ ubicacionesFiltradas.length }} de {{ locations.length }} locaciones.</small>
            <button class="btn btn-sm btn-secondary" @click="mostrarModal = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="fade">
    <div v-if="mostrarCompanyModal" class="modal-custom-overlay" @click.self="mostrarCompanyModal = false">
      <div class="modal-custom-content shadow-lg">
        <div class="modal-header bg-primary text-white p-3 d-flex justify-content-between">
          <h5 class="mb-0">Buscar Compañía</h5>
          <button type="button" class="btn-close btn-close-white" @click="mostrarCompanyModal = false"></button>
        </div>
        <div class="p-3">
          <div class="input-group mb-3">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input
              ref="companySearchField"
              type="text"
              v-model="filtroCompany"
              class="form-control"
              placeholder="Buscar por nombre o código"
            >
          </div>

          <div class="results-container border rounded">
            <div v-if="loadingCompanies" class="text-center p-5">
              <div class="spinner-border text-primary" role="status"></div>
              <p class="mt-2 text-muted">Cargando compañías...</p>
            </div>

            <div v-else-if="companiesFiltradas.length > 0" class="list-group list-group-flush">
              <button
                v-for="(company, index) in companiesFiltradas"
                :key="index"
                type="button"
                class="list-group-item list-group-item-action py-2"
                @click="seleccionarEmpresa(company)"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1 text-primary fw-bold">{{ company.name }}</h6>
                  <small class="text-muted">{{ company.company }}</small>
                </div>
              </button>
            </div>

            <div v-else class="text-center p-5 text-muted">
              {{ filtroCompany.length < 2 ? 'Escriba al menos 2 caracteres para buscar...' : 'No se encontraron resultados.' }}
            </div>
          </div>

          <div class="mt-2 d-flex justify-content-between align-items-center">
            <small class="text-muted">Mostrando {{ companiesFiltradas.length }} compañías.</small>
            <button class="btn btn-sm btn-secondary" @click="mostrarCompanyModal = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { postSolicitud } from '@/services/postSolicitud';
import { useAuthStore } from '@/stores/auth';
import { getLocations } from '@/services/getLocations';
import { getServiceTypes } from '@/services/getServiceTypes';
import { getCompanies } from '@/services/getCompanies';

export default {
  name: 'TransportePersonal',
  data() {
    return {
      form: {
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        fechaFin: '',
        organizacionCcOi: '',
        organizacion: '',
        codigoOrganizacion: '',
        multiplesCcOi: [],
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
        cantidadPasajeros: 1,
        tipoServicio: '',
        aprobador: '',
        correo: '',
        solicitante: '',
        cedulaSolicitante: '',
        tipoSolicitud: 'Transporte de Personal',
        subtipo: 'Ocasional'
      },
      loading: false,
      
      // Lógica de búsqueda avanzada
      locations: [],
      loadingLocations: false,
      mostrarModal: false,
      campoActivo: '', 
      filtroBusqueda: '',
      
      // Tipos de servicio
      serviceTypes: [],

      // Empresas
      companies: [],
      loadingCompanies: false,
      mostrarCompanyModal: false,
      filtroCompany: '',
      
      // Configuración de vista
      diasConfig: [
        { label: 'L', model: 'lunes' },
        { label: 'M', model: 'martes' },
        { label: 'M', model: 'miercoles' },
        { label: 'J', model: 'jueves' },
        { label: 'V', model: 'viernes' },
        { label: 'S', model: 'sabado' },
        { label: 'D', model: 'domingo' }
      ]
    };
  },
  computed: {
    titulo() {
      return `Crear Solicitud (${this.form.subtipo}) - Transporte de Personal`;
    },
    sumatoriaPorcentaje() {
      return this.form.multiplesCcOi.reduce((sum, cc) => sum + (Number(cc.porcentaje) || 0), 0);
    },
    sumatoriaInvalida() {
      return this.form.multiplesCcOi.length > 0 && this.sumatoriaPorcentaje !== 100;
    },
    // FILTRO DE MEMORIA (OPTIMIZADO PARA 40K REGISTROS)
    ubicacionesFiltradas() {
      const termino = this.filtroBusqueda.trim().toLowerCase();
      if (termino.length < 2) return []; // No procesar si la búsqueda es muy corta
      
      return this.locations
        .filter(loc => 
          loc.LOCATION.toLowerCase().includes(termino) || 
          loc.DESCRIPTION.toLowerCase().includes(termino)
        )
        .slice(0, 40); // Solo renderizamos 40 para mantener el DOM liviano
    },
    companiesFiltradas() {
      const termino = this.filtroCompany.trim().toLowerCase();
      if (termino.length < 2) return [];
      return this.companies
        .filter(company =>
          (company.name || '').toLowerCase().includes(termino) ||
          (company.company || '').toLowerCase().includes(termino)
        )
        .slice(0, 50);
    }
  },
  async mounted() {
    // 1. Cargar subtipo de la ruta
    if (this.$route.query.subtipo) {
      this.form.subtipo = this.$route.query.subtipo;
    }
    
    // 2. Cargar datos del usuario
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.solicitante = `${user.nombres} ${user.apellidos}`;
      this.form.cedulaSolicitante = user.cedula;
    }

    // 3. Precargar locaciones y compañías
    this.cargarUbicaciones();
    this.cargarCompanies();
    this.cargarServiceTypes();
  },
  methods: {
    async cargarUbicaciones() {
      if (this.locations.length > 0) return;
      this.loadingLocations = true;
      try {
        this.locations = await getLocations();
      } catch (error) {
        console.error("Error al obtener ubicaciones:", error);
      } finally {
        this.loadingLocations = false;
      }
    },
    async cargarCompanies() {
      this.loadingCompanies = true;
      try {
        this.companies = await getCompanies();
      } catch (error) {
        console.error('Error cargando empresas:', error);
      } finally {
        this.loadingCompanies = false;
      }
    },
    async cargarServiceTypes() {
      try {
        this.serviceTypes = await getServiceTypes('SUBTYPETP');
      } catch (error) {
        console.error("Error cargando tipos de servicio", error);
      }
    },
    abrirSelector(campo) {
      this.campoActivo = campo;
      this.filtroBusqueda = '';
      this.mostrarModal = true;
      // Focus automático en el input al abrir
      this.$nextTick(() => {
        this.$refs.inputBusqueda?.focus();
      });
    },

    seleccionarUbicacion(loc) {
      if (this.campoActivo === 'origen') {
        this.form.origen = loc.LOCATION;
        this.form.descripcionOrigen = loc.DESCRIPTION;
      } else {
        this.form.destino = loc.LOCATION;
        this.form.descripcionDestino = loc.DESCRIPTION;
      }
      this.mostrarModal = false;
    },

    abrirSelectorEmpresa() {
      this.filtroCompany = '';
      this.mostrarCompanyModal = true;
      if (this.companies.length === 0) {
        this.cargarCompanies();
      }
      this.$nextTick(() => {
        this.$refs.companySearchField?.focus();
      });
    },

    seleccionarEmpresa(company) {
      this.form.organizacion = company.name || '';
      this.form.codigoOrganizacion = company.company || '';
      this.mostrarCompanyModal = false;
    },

    addCcOi() {
      this.form.multiplesCcOi.push({ ccOi: '', porcentaje: 0 });
    },

    removeCcOi(index) {
      this.form.multiplesCcOi.splice(index, 1);
    },

    async enviar() {
      if (this.sumatoriaInvalida) {
        alert('La suma de porcentajes de CC/OI debe ser exactamente 100%');
        return;
      }

      this.loading = true;
      try {
        await postSolicitud(this.form);
        alert('Solicitud enviada exitosamente');
        this.resetForm();
      } catch (error) {
        alert('Error al enviar solicitud: ' + (error.response?.data?.statusText || error.message));
      } finally {
        this.loading = false;
      }
    },

    resetForm() {
      const { solicitante, cedulaSolicitante, subtipo } = this.form;
      Object.assign(this.$data.form, this.$options.data().form);
      this.form.solicitante = solicitante;
      this.form.cedulaSolicitante = cedulaSolicitante;
      this.form.subtipo = subtipo;
    }
  }
};
</script>

<style scoped>
/* Transición del Modal */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Overlay de pantalla completa */
.modal-custom-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

/* Caja del Modal */
.modal-custom-content {
  background: white;
  width: 95%;
  max-width: 650px;
  border-radius: 12px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

/* Contenedor de lista scrolleable */
.results-container {
  overflow-y: auto;
  min-height: 300px;
  max-height: 450px;
  background: #f8f9fa;
}

.list-group-item-action:hover {
  background-color: #e9ecef;
  border-left: 4px solid #0d6efd;
}

/* Estilo para los inputs de solo lectura */
input[readonly] {
  cursor: pointer;
  background-color: #fdfdfd !important;
}
</style>