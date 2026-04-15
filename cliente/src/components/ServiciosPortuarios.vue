<template>
  <h4 class="text-primary mb-4">Crear Solicitud - Servicios Portuarios</h4>
  <div class="container bg-white p-4 shadow-sm rounded">
    <form @submit.prevent="enviar">
      <fieldset class="border p-3 mb-4 rounded">
        <legend class="w-auto px-2 fs-5 text-primary">Detalles de la Solicitud</legend>
        <div class="row g-3">
            <div class="col-md-6">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-control form-control-sm" rows="2" required></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Origen</label>
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
              <span class="input-group-text bg-light"><i class="bi bi-geo-alt"></i></span>
              <input 
                v-model="form.destino" 
                type="text" 
                class="form-control" 
                placeholder="Click en buscar..." 
                readonly 
                required
              >
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

            <label class="form-label">Organización</label>
            <div class="input-group input-group-sm">
              <input v-model="form.organizacion" type="text" class="form-control" placeholder="Buscar empresa..." readonly required>
              <button class="btn btn-outline-primary" type="button" @click="abrirSelectorEmpresa()">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Código Organización</label>
            <input v-model="form.codigoOrganizacion" type="text" class="form-control form-control-sm" readonly>
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

          <div class="col-md-6">
            <label class="form-label">Tipo de Servicio</label>
            <input v-model="form.tipoServicio" type="text" class="form-control form-control-sm" readonly>
          </div>
          <div class="col-md-6">
            <label class="form-label">Unidad a Movilizar</label>
            <input v-model="form.unidadMovilizar" type="text" class="form-control form-control-sm" readonly>
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
          <div class="col-md-6">
            <label class="form-label">Fecha</label>
            <input v-model="form.fecha" type="date" class="form-control form-control-sm" readonly>
          </div>
        </div>
      </fieldset>

      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary" :disabled="loading || loadingLocations">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Enviar Solicitud
        </button>
      </div>
    </form>
  </div>

  <!-- Modal para seleccionar ubicaciones -->
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

  <div v-if="mostrarCompanyModal" class="modal-overlay">
    <div class="modal-content shadow-lg p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="m-0">Seleccionar Organización</h5>
        <button type="button" class="btn-close" @click="mostrarCompanyModal = false"></button>
      </div>
      <div class="mb-3">
        <input
          type="text"
          ref="companySearchField"
          v-model="filtroCompany"
          class="form-control"
          placeholder="Buscar por nombre o código"
        >
        <small class="text-muted" v-if="loadingCompanies">Cargando compañías...</small>
      </div>
      <div class="list-group list-container">
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
        <div v-if="companiesFiltradas.length === 0 && !loadingCompanies" class="text-center p-3 text-muted">
          {{ filtroCompany.length < 2 ? 'Escriba al menos 2 caracteres para buscar...' : 'No se encontraron resultados.' }}
        </div>
      </div>
      <div class="mt-2 d-flex justify-content-end">
        <button class="btn btn-sm btn-secondary" type="button" @click="mostrarCompanyModal = false">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { postServiciosPortuarios } from '@/services/postServiciosPortuarios';
import { useAuthStore } from '@/stores/auth';
import { getLocations } from '@/services/getLocations';
import { getCompanies } from '@/services/getCompanies';

export default {
  name: 'ServiciosPortuarios',
  data() {
    return {
      form: {
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        tipoServicio: 'Maniobras Especiales',
        unidadMovilizar: 'Tanquero - Buque Petrolero',
        aprobador: '',
        correo: '',
        solicitante: '',
        cedulaSolicitante: '',
        fecha: '',
        tipoSolicitud: 'Servicios Portuarios',
        subtipo: 'Ocasional'
      },
      loading: false,
      
      // Lógica de ubicaciones
      locations: [],
      loadingLocations: false,
      mostrarModal: false,
      campoActivo: '', // 'origen' o 'destino'
      filtroBusqueda: '',
      companies: [],
      loadingCompanies: false,
      mostrarCompanyModal: false,
      filtroCompany: ''
    };
  },
  mounted() {
    this.form.fecha = new Date().toISOString().split('T')[0];
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.solicitante = `${user.nombres} ${user.apellidos}`;
      this.form.cedulaSolicitante = user.cedula;
    }
    this.cargarUbicaciones();
    this.cargarCompanies();
    if (this.$route.query.subtipo) {
      this.form.subtipo = this.$route.query.subtipo;
    }
  },
  computed: {
    sumatoriaPorcentaje() {
      return this.form.multiplesCcOi.reduce((sum, cc) => sum + (cc.porcentaje || 0), 0);
    },
    companiesFiltradas() {
      const term = this.filtroCompany.trim().toLowerCase();
      if (term.length < 2) return [];
      return this.companies
        .filter(company =>
          (company.name || '').toLowerCase().includes(term) ||
          (company.company || '').toLowerCase().includes(term)
        )
        .slice(0, 50);
    },
    // FILTRO INTELIGENTE: Filtra registros de forma eficiente
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
    async cargarCompanies() {
      this.loadingCompanies = true;
      try {
        this.companies = await getCompanies();
      } catch (error) {
        console.error('Error cargando compañías:', error);
      } finally {
        this.loadingCompanies = false;
      }
    },
    abrirSelectorEmpresa() {
      this.filtroCompany = '';
      this.mostrarCompanyModal = true;
      if (this.companies.length === 0) {
        this.cargarCompanies();
      }
      this.$nextTick(() => this.$refs.companySearchField?.focus());
    },
    seleccionarEmpresa(company) {
      this.form.organizacion = company.name || '';
      this.form.codigoOrganizacion = company.company || '';
      this.form.organizacionCcOi = company.company || company.name || '';
      this.mostrarCompanyModal = false;
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
    addCcOi() {
      this.form.multiplesCcOi.push({ ccOi: '', porcentaje: 0 });
    },
    removeCcOi(index) {
      this.form.multiplesCcOi.splice(index, 1);
    },
    resetForm() {
      const fechaActual = new Date().toISOString().split('T')[0];
      const solicitante = this.form.solicitante;
      const cedula = this.form.cedulaSolicitante;
      const subtipo = this.form.subtipo;

      Object.assign(this.form, {
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        organizacionCcOi: '',
        organizacion: '',
        codigoOrganizacion: '',
        multiplesCcOi: [],
        tipoServicio: 'Maniobras Especiales',
        unidadMovilizar: 'Tanquero - Buque Petrolero',
        aprobador: '',
        correo: '',
        solicitante,
        cedulaSolicitante: cedula,
        fecha: fechaActual,
        tipoSolicitud: 'Servicios Portuarios',
        subtipo
      });
    },
    async enviar() {
      if (this.sumatoriaPorcentaje !== 100 && this.form.multiplesCcOi.length > 0) {
        alert('La suma de porcentajes debe ser 100%');
        return;
      }
      this.loading = true;
      try {
        const { id, ...payload } = this.form;
        await postServiciosPortuarios(payload);
        alert('Solicitud enviada exitosamente');
        this.resetForm();
      } catch (error) {
        alert('Error al enviar solicitud: ' + (error.statusText || 'Desconocido'));
      } finally {
        this.loading = false;
      }
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
/* Estilos específicos si se necesitan */
</style>