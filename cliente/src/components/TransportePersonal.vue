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
          <div v-if="form.subtipo === 'Recurrente'" class="col-md-6">
            <label class="form-label fw-bold">Modalidad</label>
            <select v-model="form.modserv" class="form-control form-control-sm" required>
              <option value="">Seleccione una modalidad</option>
              <option v-for="serv in modserv" :key="serv.modnum" :value="serv.modnum">{{ serv.modnum }} - {{ serv.description }}</option>
            </select>
          </div>
          <div></div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Origen</label>
            <div class="position-relative">
              <input 
                v-model="searchOrigen" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Buscar ubicación..." 
                required
                @input="mostrarDropdownOrigen = true" 
              >
              <div v-if="mostrarDropdownOrigen && ubicacionesFiltradasOrigen.length > 0" class="dropdown-menu show w-100" style="max-height: 200px; overflow-y: auto;">
                <button 
                  v-for="(loc, index) in ubicacionesFiltradasOrigen" 
                  :key="index"
                  type="button"
                  class="dropdown-item"
                  @click="seleccionarOrigen(loc)"
                >
                  <strong>{{ loc.LOCATION }}</strong><br>
                  <small>{{ loc.DESCRIPTION }}</small>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Descripción Origen</label>
            <textarea v-model="form.descripcionOrigen" class="form-control form-control-sm bg-light" rows="2" readonly></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Destino</label>
            <div class="position-relative">
              <input 
                v-model="searchDestino" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Buscar ubicación..." 
                required
                @input="mostrarDropdownDestino = true"
              >
              <div v-if="mostrarDropdownDestino && ubicacionesFiltradasDestino.length > 0" class="dropdown-menu show w-100" style="max-height: 200px; overflow-y: auto;">
                <button 
                  v-for="(loc, index) in ubicacionesFiltradasDestino" 
                  :key="index"
                  type="button"
                  class="dropdown-item"
                  @click="seleccionarDestino(loc)"
                >
                  <strong>{{ loc.LOCATION }}</strong><br>
                  <small>{{ loc.DESCRIPTION }}</small>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Descripción Destino</label>
            <textarea v-model="form.descripcionDestino" class="form-control form-control-sm bg-light" rows="2" readonly></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Fecha Requerida de Inicio</label>
            <input v-model="form.fechaInicio" type="datetime-local" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Fecha Requerida de Finalización</label>
            <input v-model="form.fechaFin" type="datetime-local" class="form-control form-control-sm" required>
          </div>

          <div class="col-md-6">
            <label class="form-label fw-bold">Organización</label>
            <div class="position-relative">
              <input 
                v-model="searchOrganizacion" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Buscar empresa..." 
                required
                @input="mostrarDropdownEmpresa = true"
              >
              <div v-if="mostrarDropdownEmpresa && companiesFiltradas.length > 0" class="dropdown-menu show w-100" style="max-height: 200px; overflow-y: auto;">
                <button 
                  v-for="(company, index) in companiesFiltradas" 
                  :key="index"
                  type="button"
                  class="dropdown-item"
                  @click="seleccionarEmpresa(company)"
                >
                  <strong>{{ company.name }}</strong><br>
                  <small>{{ company.company }}</small>
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label fw-bold">Código Organización</label>
            <input v-model="form.codigoOrganizacion" type="text" class="form-control form-control-sm" readonly>
          </div>

          <div class="col-md-12">
            <label class="form-label fw-bold">Centro de costo CC/OI</label>
            <input v-model="form.organizacionCcOi" type="text" class="form-control form-control-sm" placeholder="CC/OI" required>
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


</template>

<script>
import { postSolicitud } from '@/services/postSolicitud';
import { useAuthStore } from '@/stores/auth';
import { getLocations } from '@/services/getLocations';
import { getServiceTypes } from '@/services/getServiceTypes';
import { getCompanies } from '@/services/getCompanies';
import { getModserv } from '@/services/getModserv';

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
        subtipo: 'Ocasional',
        modserv: ''
      },
      loading: false,
      
      // Lógica de búsqueda avanzada
      locations: [],
      loadingLocations: false,
      searchOrigen: '',
      searchDestino: '',
      
      // Tipos de servicio
      serviceTypes: [],

      // Empresas
      companies: [],
      loadingCompanies: false,
      searchOrganizacion: '',
      modserv: [],
      
      // Configuración de vista 
      diasConfig: [
        { label: 'L', model: 'lunes' },
        { label: 'M', model: 'martes' },
        { label: 'M', model: 'miercoles' },
        { label: 'J', model: 'jueves' },
        { label: 'V', model: 'viernes' },
        { label: 'S', model: 'sabado' },
        { label: 'D', model: 'domingo' }
      ],


      mostrarDropdownOrigen: false,
      mostrarDropdownDestino: false,
      mostrarDropdownEmpresa: false
    };
  },
  computed: {
    titulo() {
      return `Crear Solicitud (${this.form.subtipo}) - Transporte de Personal`;
    },
    ubicacionesFiltradasOrigen() {
      const termino = this.searchOrigen.trim().toLowerCase();
      if (termino.length < 2) return [];
      
      return this.locations
        .filter(loc => 
          loc.LOCATION.toLowerCase().includes(termino) || 
          loc.DESCRIPTION.toLowerCase().includes(termino)
        )
        .slice(0, 40);
    },
    ubicacionesFiltradasDestino() {
      const termino = this.searchDestino.trim().toLowerCase();
      if (termino.length < 2) return [];
      
      return this.locations
        .filter(loc => 
          loc.LOCATION.toLowerCase().includes(termino) || 
          loc.DESCRIPTION.toLowerCase().includes(termino)
        )
        .slice(0, 40);
    },
    companiesFiltradas() {
      const termino = this.searchOrganizacion.trim().toLowerCase();
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
    this.cargarModserv();
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
    async cargarModserv() {
      try {
        this.modserv = await getModserv();
      } catch (error) {
        console.error("Error cargando modserv", error);
      }
    },


    seleccionarOrigen(loc) {
      this.form.origen = loc.LOCATION;
      this.form.descripcionOrigen = loc.DESCRIPTION;
      this.searchOrigen = loc.LOCATION;
      this.mostrarDropdownOrigen = false;
    },
    seleccionarDestino(loc) {
      this.form.destino = loc.LOCATION;
      this.form.descripcionDestino = loc.DESCRIPTION;
      this.searchDestino = loc.LOCATION;
      this.mostrarDropdownDestino = false;
    },

    seleccionarEmpresa(company) {
      this.form.organizacion = company.name || '';
      this.form.codigoOrganizacion = company.company || '';
      this.form.organizacionCcOi = company.company || company.name || '';
      this.searchOrganizacion = company.name || '';
      this.mostrarDropdownEmpresa = false;
    },

    async enviar() {
      if (!this.form.codigoOrganizacion.trim()) {
        alert('Debe seleccionar una organización');
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

      this.searchOrigen = '';
      this.searchDestino = '';
      this.searchOrganizacion = '';
      // Reset de banderas
      this.mostrarDropdownOrigen = false;
      this.mostrarDropdownDestino = false;
      this.mostrarDropdownEmpresa = false;
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