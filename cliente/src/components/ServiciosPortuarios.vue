<!-- <template>
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
            <div class="position-relative">
              <input 
                v-model="searchOrigen" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Buscar ubicación..." 
                required
              >
              <div v-if="ubicacionesFiltradasOrigen.length > 0" class="dropdown-menu show w-100" style="max-height: 200px; overflow-y: auto;">
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
            <label class="form-label">Descripción Origen</label>
            <textarea v-model="form.descripcionOrigen" class="form-control form-control-sm" rows="2" readonly></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Destino</label>
            <div class="position-relative">
              <input 
                v-model="searchDestino" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Buscar ubicación..." 
                required
              >
              <div v-if="ubicacionesFiltradasDestino.length > 0" class="dropdown-menu show w-100" style="max-height: 200px; overflow-y: auto;">
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
            <label class="form-label">Descripción Destino</label>
            <textarea v-model="form.descripcionDestino" class="form-control form-control-sm" rows="2" readonly></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Inicio</label>
            <input v-model="form.fechaInicio" type="datetime-local" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">

            <label class="form-label">Organización</label>
            <div class="position-relative">
              <input 
                v-model="searchOrganizacion" 
                type="text" 
                class="form-control form-control-sm" 
                placeholder="Buscar empresa..." 
                required
              >
              <div v-if="companiesFiltradas.length > 0" class="dropdown-menu show w-100" style="max-height: 200px; overflow-y: auto;">
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
            <input v-model="form.fecha" type="datetime-local" class="form-control form-control-sm" readonly>
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


</template>

<script>
import { postServiciosPortuarios } from '@/services/postServiciosPortuarios';
import { useAuthStore } from '@/stores/auth';
import { getLocations } from '@/services/getLocations';
import { getCompanies } from '@/services/getCompanies';
import { toDatetimeLocal } from '@/utils/dateTime';

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
      searchOrigen: '',
      searchDestino: '',
      companies: [],
      loadingCompanies: false,
      searchOrganizacion: ''
    };
  },
  mounted() {
    this.form.fecha = toDatetimeLocal();
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
      const term = this.searchOrganizacion.trim().toLowerCase();
      if (term.length < 2) return [];
      return this.companies
        .filter(company =>
          (company.name || '').toLowerCase().includes(term) ||
          (company.company || '').toLowerCase().includes(term)
        )
        .slice(0, 50);
    },
    ubicacionesFiltradasOrigen() {
      const term = this.searchOrigen.trim().toLowerCase();
      if (term.length < 2) return [];
      return this.locations
        .filter(loc => 
          loc.LOCATION.toLowerCase().includes(term) || 
          loc.DESCRIPTION.toLowerCase().includes(term)
        )
        .slice(0, 50);
    },
    ubicacionesFiltradasDestino() {
      const term = this.searchDestino.trim().toLowerCase();
      if (term.length < 2) return [];
      return this.locations
        .filter(loc => 
          loc.LOCATION.toLowerCase().includes(term) || 
          loc.DESCRIPTION.toLowerCase().includes(term)
        )
        .slice(0, 50);
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
    seleccionarEmpresa(company) {
      this.form.organizacion = company.name || '';
      this.form.codigoOrganizacion = company.company || '';
      this.form.organizacionCcOi = company.company || company.name || '';
      this.searchOrganizacion = company.name ||'';
    },
    seleccionarOrigen(loc) {
      this.form.origen = loc.LOCATION;
      this.form.descripcionOrigen = loc.DESCRIPTION;
      this.searchOrigen = loc.LOCATION;
    },
    seleccionarDestino(loc) {
      this.form.destino = loc.LOCATION;
      this.form.descripcionDestino = loc.DESCRIPTION;
      this.searchDestino = loc.LOCATION;
    },
    addCcOi() {
      this.form.multiplesCcOi.push({ ccOi: '', porcentaje: 0 });
    },
    removeCcOi(index) {
      this.form.multiplesCcOi.splice(index, 1);
    },
    async enviar() {
      if (this.sumatoriaPorcentaje !== 100 && this.form.multiplesCcOi.length > 0) {
        alert('La suma de porcentajes debe ser 100%');
        return;
      }
      if (!this.form.codigoOrganizacion.trim()) {
        alert('Debe seleccionar una organización');
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
       this.searchOrigen = '';
      this.searchDestino = '';
      this.searchOrganizacion = '';
    }
  } 
};
</script>

<style scoped>
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
            <label class="form-label">Descripción Origen</label>
            <textarea v-model="form.descripcionOrigen" class="form-control form-control-sm" rows="2" readonly></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Destino</label>
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
            <label class="form-label">Descripción Destino</label>
            <textarea v-model="form.descripcionDestino" class="form-control form-control-sm" rows="2" readonly></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Inicio</label>
            <input v-model="form.fechaInicio" type="datetime-local" class="form-control form-control-sm" required>
          </div>

          <div class="col-md-6">
            <label class="form-label">Organización</label>
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
            <input v-model="form.fecha" type="datetime-local" class="form-control form-control-sm" readonly>
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
</template>

<script>
import { postServiciosPortuarios } from '@/services/postServiciosPortuarios';
import { useAuthStore } from '@/stores/auth';
import { getLocations } from '@/services/getLocations';
import { getCompanies } from '@/services/getCompanies';
import { toDatetimeLocal } from '@/utils/dateTime';

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
        subtipo: 'Ocasional',
        organizacion: '',
        codigoOrganizacion: ''
      },
      loading: false,
      locations: [],
      loadingLocations: false,
      searchOrigen: '',
      searchDestino: '',
      companies: [],
      loadingCompanies: false,
      searchOrganizacion: '',
      
      // CAMBIO: Nuevas banderas para controlar la visibilidad de los dropdowns independientemente
      mostrarDropdownOrigen: false,
      mostrarDropdownDestino: false,
      mostrarDropdownEmpresa: false
    };
  },
  mounted() {
    this.form.fecha = toDatetimeLocal();
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
      const term = this.searchOrganizacion.trim().toLowerCase();
      if (term.length < 2) return [];
      return this.companies
        .filter(company =>
          (company.name || '').toLowerCase().includes(term) ||
          (company.company || '').toLowerCase().includes(term)
        )
        .slice(0, 50);
    },
    ubicacionesFiltradasOrigen() {
      const term = this.searchOrigen.trim().toLowerCase();
      if (term.length < 2) return [];
      return this.locations
        .filter(loc => 
          loc.LOCATION.toLowerCase().includes(term) || 
          loc.DESCRIPTION.toLowerCase().includes(term)
        )
        .slice(0, 50);
    },
    ubicacionesFiltradasDestino() {
      const term = this.searchDestino.trim().toLowerCase();
      if (term.length < 2) return [];
      return this.locations
        .filter(loc => 
          loc.LOCATION.toLowerCase().includes(term) || 
          loc.DESCRIPTION.toLowerCase().includes(term)
        )
        .slice(0, 50);
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
    seleccionarEmpresa(company) {
      this.form.organizacion = company.name || '';
      this.form.codigoOrganizacion = company.company || '';
      this.form.organizacionCcOi = company.company || company.name || '';
      this.searchOrganizacion = company.name || '';
      // CAMBIO: Cerrar dropdown al seleccionar
      this.mostrarDropdownEmpresa = false;
    },
    seleccionarOrigen(loc) {
      this.form.origen = loc.LOCATION;
      this.form.descripcionOrigen = loc.DESCRIPTION;
      this.searchOrigen = loc.LOCATION;
      // CAMBIO: Cerrar dropdown al seleccionar
      this.mostrarDropdownOrigen = false;
    },
    seleccionarDestino(loc) {
      this.form.destino = loc.LOCATION;
      this.form.descripcionDestino = loc.DESCRIPTION;
      this.searchDestino = loc.LOCATION;
      // CAMBIO: Cerrar dropdown al seleccionar
      this.mostrarDropdownDestino = false;
    },
    addCcOi() {
      this.form.multiplesCcOi.push({ ccOi: '', porcentaje: 0 });
    },
    removeCcOi(index) {
      this.form.multiplesCcOi.splice(index, 1);
    },
    async enviar() {
      if (this.sumatoriaPorcentaje !== 100 && this.form.multiplesCcOi.length > 0) {
        alert('La suma de porcentajes debe ser 100%');
        return;
      }
      if (!this.form.codigoOrganizacion?.trim()) {
        alert('Debe seleccionar una organización');
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
    },
    resetForm() {
      const fechaActual = toDatetimeLocal();
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
/* Estilos existentes */
.dropdown-menu {
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
</style>