<template>
  <h4 class="text-primary mb-4">{{ titulo }}</h4>
  <div class="container bg-white p-4 shadow-sm rounded">
    <form @submit.prevent="enviar">
      <fieldset class="border p-3 mb-4 rounded">
        <legend class="w-auto px-2 fs-5 text-primary">
          Detalles de la Solicitud
        </legend>
        <div class="row g-3">
          <div class="col-md-12">
            <label class="form-label">Descripción</label>
            <textarea
              v-model="form.descripcion"
              class="form-control form-control-sm"
              rows="2"
              required
            ></textarea>
          </div>
          <div></div>

          <div class="col-md-6">
            <label class="form-label">Origen</label>
            <div class="position-relative">
              <input
                v-model="searchOrigen"
                type="text"
                class="form-control form-control-sm"
                placeholder="Buscar ubicación..."
                required
              />
              <div
                v-if="ubicacionesFiltradasOrigen.length > 0"
                class="dropdown-menu show w-100"
                style="max-height: 200px; overflow-y: auto; z-index: 1000"
              >
                <button
                  v-for="(loc, index) in ubicacionesFiltradasOrigen"
                  :key="index"
                  type="button"
                  class="dropdown-item"
                  @click="seleccionarOrigen(loc)"
                >
                  <strong>{{ loc.LOCATION }}</strong
                  ><br />
                  <small>{{ loc.DESCRIPTION }}</small>
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Descripción Origen</label>
            <textarea
              v-model="form.descripcionOrigen"
              class="form-control form-control-sm"
              rows="2"
              readonly
            ></textarea>
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
              />
              <div
                v-if="ubicacionesFiltradasDestino.length > 0"
                class="dropdown-menu show w-100"
                style="max-height: 200px; overflow-y: auto; z-index: 1000"
              >
                <button
                  v-for="(loc, index) in ubicacionesFiltradasDestino"
                  :key="index"
                  type="button"
                  class="dropdown-item"
                  @click="seleccionarDestino(loc)"
                >
                  <strong>{{ loc.LOCATION }}</strong
                  ><br />
                  <small>{{ loc.DESCRIPTION }}</small>
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Descripción Destino</label>
            <textarea
              v-model="form.descripcionDestino"
              class="form-control form-control-sm"
              rows="2"
              readonly
            ></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Inicio</label>
            <div class="date-time-field-wrapper">
              <input
                v-model="form.fechaInicio"
                type="datetime-local"
                class="form-control form-control-sm"
                required
                @dblclick="handleDateFieldDblClick"
              />
              <button
                type="button"
                class="btn btn-sm date-time-select-button"
                @click="confirmDateSelection($event)"
              >
                Seleccionar
              </button>
            </div>
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
              />
              <div
                v-if="companiesFiltradas.length > 0"
                class="dropdown-menu show w-100"
                style="max-height: 200px; overflow-y: auto; z-index: 1000"
              >
                <button
                  v-for="(company, index) in companiesFiltradas"
                  :key="index"
                  type="button"
                  class="dropdown-item"
                  @click="seleccionarEmpresa(company)"
                >
                  <strong>{{ company.name }}</strong
                  ><br />
                  <small>{{ company.company }}</small>
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Código Organización</label>
            <input
              v-model="form.codigoOrganizacion"
              type="text"
              class="form-control form-control-sm"
              readonly
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Centro de costo CC/OI</label>
            <CentroCostoAutocomplete
              v-model="form.organizacionCcOi"
              :required="true"
              :company-code="form.codigoOrganizacion"
              :company-name="form.organizacion"
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Tipo de Servicio</label>
            <select
              v-model="form.tipoServicio"
              class="form-control form-control-sm"
              required
            >
              <option value="">Seleccione un tipo de servicio</option>
              <option
                v-for="type in serviceTypes"
                :key="type.valdesc"
                :value="type.valdesc"
              >
                {{ type.valdesc }}
              </option>
            </select>
          </div>

          <div class="col-md-6">
            <label class="form-label">Unidad a Movilizar</label>
            <div class="position-relative">
              <input
                v-model="form.unidadMovilizar"
                type="text"
                class="form-control form-control-sm"
                placeholder="Buscar unidad..."
                autocomplete="off"
                required
                @input="buscarEquipos"
                @focus="buscarEquipos"
              />
              <div
                v-if="mostrarDropdownEquipos && equipmentResults.length > 0"
                class="dropdown-menu show w-100"
                style="max-height: 220px; overflow-y: auto; z-index: 1000"
              >
                <button
                  v-for="equipo in equipmentResults"
                  :key="equipo.eqnum"
                  type="button"
                  class="dropdown-item"
                  @mousedown.prevent="seleccionarEquipo(equipo)"
                >
                  <strong>{{ equipo.eqnum }}</strong
                  ><br />
                  <small>{{ equipo.description }}</small>
                </button>
              </div>
              <div
                v-else-if="
                  mostrarDropdownEquipos &&
                  form.unidadMovilizar.trim().length >= 2 &&
                  !searchingEquipment
                "
                class="dropdown-menu show w-100"
              >
                <span class="dropdown-item text-muted"
                  >No se encontraron coincidencias</span
                >
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Descripción de la Unidad</label>
            <textarea
              v-model="form.descripcionUnidad"
              class="form-control form-control-sm"
              rows="2"
            ></textarea>
          </div>

          <div class="col-md-6">
            <label class="form-label">Aprobador</label>
            <select
              v-model="form.aprobador"
              class="form-select form-select-sm"
              :disabled="!nivelAprobacionInfo.codigo || loadingAprobadores"
              required
            >
              <option value="" disabled hidden>Seleccione un aprobador</option>
              <option
                v-for="approver in aprobadoresDisponibles"
                :key="approver.pagepin"
                :value="approver.name"
              >
                {{ approver.name }} (Nivel {{ approver.la13 }})
              </option>
            </select>
            <div class="form-text text-muted" v-if="loadingAprobadores">
              Cargando aprobadores...
            </div>
            <div
              class="form-text text-danger"
              v-else-if="
                nivelAprobacionInfo.codigo &&
                aprobadoresDisponibles.length === 0
              "
            >
              No hay aprobadores disponibles para el nivel
              {{ nivelAprobacionInfo.codigo }}.
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Correo</label>
            <input
              v-model="form.correo"
              type="email"
              class="form-control form-control-sm bg-light"
              readonly
              required
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Gerencia</label>
            <input
              v-model="form.gerencia"
              type="text"
              class="form-control form-control-sm bg-light"
              readonly
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Solicitante</label>
            <input
              v-model="form.solicitante"
              type="text"
              class="form-control form-control-sm"
              readonly
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Cédula Solicitante</label>
            <input
              v-model="form.cedulaSolicitante"
              type="text"
              class="form-control form-control-sm"
              readonly
            />
          </div>

          <div class="col-md-6">
            <label class="form-label">Fecha</label>
            <input
              v-model="form.fecha"
              type="datetime-local"
              class="form-control form-control-sm"
              readonly
            />
          </div>
          <div class="col-md-6">
            <label class="form-label">Nivel de Aprobación</label>
            <input
              :value="nivelAprobacionTexto"
              type="text"
              class="form-control form-control-sm bg-light"
              readonly
            />
          </div>
        </div>
      </fieldset>

      <div class="d-flex justify-content-end">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading || loadingLocations"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Enviar Solicitud
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { postSolicitud } from "@/services/postSolicitud";
import { useAuthStore } from "@/stores/auth";
import { getLocations } from "@/services/getLocations";
import { getServiceTypes } from "@/services/getServiceTypes";
import { getCompanies } from "@/services/getCompanies";
import { getAprobadoresLabor } from "@/services/getAprobadoresLabor";
import { getEquipment } from "@/services/getEquipment";
import CentroCostoAutocomplete from "@/components/CentroCostoAutocomplete.vue";
import { toDatetimeLocal, getNivelAprobacion } from "@/utils/dateTime";

export default {
  name: "MovimientoUnidadesMayores",
  components: {
    CentroCostoAutocomplete,
  },
  data() {
    return {
      form: {
        descripcion: "",
        origen: "",
        descripcionOrigen: "",
        destino: "",
        descripcionDestino: "",
        fechaInicio: "",
        organizacionCcOi: "",
        organizacion: "",
        codigoOrganizacion: "",
        tipoServicio: "",
        unidadMovilizar: "",
        descripcionUnidad: "",
        aprobador: "",
        correo: "",
        gerencia: "",
        solicitante: "",
        cedulaSolicitante: "",
        fecha: "",
        tipoSolicitud: "Movimiento Unidades Mayores",
        subtipo: "Ocasional",
      },
      loading: false,
      locations: [],
      loadingLocations: false,
      searchOrigen: "",
      searchDestino: "",
      serviceTypes: [],
      companies: [],
      loadingCompanies: false,
      searchOrganizacion: "",
      aprobadoresDisponibles: [],
      loadingAprobadores: false,
      equipmentResults: [],
      searchingEquipment: false,
      equipmentSearchTimer: null,
      mostrarDropdownEquipos: false,
    };
  },
  mounted() {
    if (this.$route.query.subtipo) {
      this.form.subtipo = this.$route.query.subtipo;
    }
    this.form.fecha = toDatetimeLocal();
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.solicitante = `${user.nombres} ${user.apellidos}`;
      this.form.cedulaSolicitante = user.cedula;
      this.form.correo = user.correo || user.email || user.username || "";
      this.form.gerencia = user.gerencia || "";
    }
    this.cargarUbicaciones();
    this.cargarCompanies();
    this.cargarServiceTypes();
  },
  computed: {
    titulo() {
      return `Crear Solicitud - Movimiento de Unidades Mayores`;
    },
    ubicacionesFiltradasOrigen() {
      const term = this.searchOrigen.trim().toLowerCase();
      // No mostrar si hay menos de 2 letras o si el término coincide exactamente con lo ya seleccionado
      if (term.length < 2 || term === this.form.origen?.toLowerCase())
        return [];
      return this.locations
        .filter(
          (loc) =>
            loc.LOCATION.toLowerCase().includes(term) ||
            loc.DESCRIPTION.toLowerCase().includes(term),
        )
        .slice(0, 50);
    },
    ubicacionesFiltradasDestino() {
      const term = this.searchDestino.trim().toLowerCase();
      if (term.length < 2 || term === this.form.destino?.toLowerCase())
        return [];
      return this.locations
        .filter(
          (loc) =>
            loc.LOCATION.toLowerCase().includes(term) ||
            loc.DESCRIPTION.toLowerCase().includes(term),
        )
        .slice(0, 50);
    },
    companiesFiltradas() {
      const term = this.searchOrganizacion.toLowerCase().trim();
      if (term.length < 2 || term === this.form.organizacion?.toLowerCase())
        return [];
      return this.companies
        .filter(
          (company) =>
            (company.name || "").toLowerCase().includes(term) ||
            (company.company || "").toLowerCase().includes(term),
        )
        .slice(0, 50);
    },
    nivelAprobacionInfo() {
      return getNivelAprobacion(this.form.fechaInicio, this.form.fecha);
    },
    nivelAprobacionTexto() {
      return this.nivelAprobacionInfo.texto;
    },
  },
  watch: {
    "form.fechaInicio": {
      immediate: true,
      handler() {
        this.cargarAprobadores();
      },
    },
  },
  methods: {
    async cargarAprobadores() {
      const nivel = this.nivelAprobacionInfo.codigo;
      if (!nivel) {
        this.aprobadoresDisponibles = [];
        this.form.aprobador = "";
        return;
      }
      this.loadingAprobadores = true;
      try {
        const results = await getAprobadoresLabor(nivel);
        this.aprobadoresDisponibles = Array.isArray(results) ? results : [];
        if (
          !this.aprobadoresDisponibles.some(
            (a) => a.name === this.form.aprobador,
          )
        ) {
          this.form.aprobador = "";
        }
      } catch (error) {
        console.error("Error cargando aprobadores:", error);
        this.aprobadoresDisponibles = [];
        this.form.aprobador = "";
      } finally {
        this.loadingAprobadores = false;
      }
    },
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
    async cargarServiceTypes() {
      try {
        this.serviceTypes = await getServiceTypes("SUBTYPEMUM");
      } catch (error) {
        console.error("Error cargando tipos de servicio", error);
      }
    },
    async cargarCompanies() {
      this.loadingCompanies = true;
      try {
        this.companies = await getCompanies();
      } catch (error) {
        console.error("Error cargando compañías:", error);
      } finally {
        this.loadingCompanies = false;
      }
    },
    buscarEquipos() {
      const query = (this.form.unidadMovilizar || "").trim();

      if (this.equipmentSearchTimer) {
        clearTimeout(this.equipmentSearchTimer);
      }

      if (query.length < 2) {
        this.equipmentResults = [];
        this.mostrarDropdownEquipos = false;
        this.searchingEquipment = false;
        return;
      }

      this.mostrarDropdownEquipos = true;
      this.equipmentSearchTimer = setTimeout(async () => {
        this.searchingEquipment = true;
        try {
          const results = await getEquipment(query);
          this.equipmentResults = Array.isArray(results)
            ? results.slice(0, 50)
            : [];
        } catch (error) {
          console.error("Error buscando unidades:", error);
          this.equipmentResults = [];
        } finally {
          this.searchingEquipment = false;
        }
      }, 300);
    },
    seleccionarEquipo(equipo) {
      this.form.unidadMovilizar = equipo.eqnum || "";
      this.form.descripcionUnidad = equipo.description || "";
      this.equipmentResults = [];
      this.mostrarDropdownEquipos = false;
    },
    seleccionarEmpresa(company) {
      this.form.organizacion = company.name || "";
      this.form.codigoOrganizacion = company.company || "";
      this.form.organizacionCcOi = company.company || company.name || "";
      // Asignamos el nombre al campo de búsqueda para que se mantenga visible
      this.searchOrganizacion = company.name || "";
    },
    seleccionarOrigen(loc) {
      this.form.origen = loc.LOCATION;
      this.form.descripcionOrigen = loc.DESCRIPTION;
      // Asignamos el código de ubicación al campo de búsqueda
      this.searchOrigen = loc.LOCATION;
    },
    handleDateFieldDblClick(event) {
      const input = event.target;
      if (input && typeof input.select === "function") {
        input.select();
      }
      setTimeout(() => {
        if (input && typeof input.blur === "function") {
          input.blur();
        }
      }, 0);
    },
    confirmDateSelection(event) {
      const wrapper = event.currentTarget.closest(".date-time-field-wrapper");
      const input = wrapper
        ? wrapper.querySelector('input[type="datetime-local"]')
        : null;
      if (input) {
        if (typeof input.select === "function") {
          input.select();
        }
        setTimeout(() => {
          if (typeof input.blur === "function") {
            input.blur();
          }
        }, 0);
      }
    },
    seleccionarDestino(loc) {
      this.form.destino = loc.LOCATION;
      this.form.descripcionDestino = loc.DESCRIPTION;
      // Asignamos el código de ubicación al campo de búsqueda
      this.searchDestino = loc.LOCATION;
    },
    async enviar() {
      if (!this.form.codigoOrganizacion.trim()) {
        alert("Debe seleccionar una organización");
        return;
      }
      if (!this.form.organizacionCcOi.trim()) {
        alert("Debe ingresar el Centro de costo CC/OI");
        return;
      }
      this.loading = true;
      try {
        const dataToSend = {
          ...this.form,
          nivelAprobacion: this.nivelAprobacionInfo.codigo,
        };
        delete dataToSend.id;
        await postSolicitud(dataToSend);
        alert("Solicitud enviada exitosamente");
        this.resetForm();
      } catch (error) {
        alert(
          "Error al enviar solicitud: " +
            (error.statusText || "Error desconocido"),
        );
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      const currentSolicitante = this.form.solicitante;
      const currentCedula = this.form.cedulaSolicitante;
      const currentCorreo = this.form.correo;
      const currentGerencia = this.form.gerencia;
      const currentSubtipo = this.form.subtipo;
      const currentFecha = this.form.fecha;

      Object.assign(this.form, {
        descripcion: "",
        origen: "",
        descripcionOrigen: "",
        destino: "",
        descripcionDestino: "",
        fechaInicio: "",
        organizacionCcOi: "",
        organizacion: "",
        codigoOrganizacion: "",
        tipoServicio: "",
        unidadMovilizar: "",
        descripcionUnidad: "",
        aprobador: "",
        correo: currentCorreo,
        gerencia: currentGerencia,
        solicitante: currentSolicitante,
        cedulaSolicitante: currentCedula,
        fecha: currentFecha,
        tipoSolicitud: "Movimiento Unidades Mayores",
        subtipo: currentSubtipo,
      });
      // Limpiar también los campos de búsqueda visuales
      this.searchOrigen = "";
      this.searchDestino = "";
      this.searchOrganizacion = "";
      this.equipmentResults = [];
      this.mostrarDropdownEquipos = false;
      this.searchingEquipment = false;
    },
  },
  beforeUnmount() {
    if (this.equipmentSearchTimer) {
      clearTimeout(this.equipmentSearchTimer);
    }
  },
};
</script>

<style scoped>
.dropdown-menu {
  display: block;
  top: 100%;
  left: 0;
  border: 1px solid #ddd;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.dropdown-item {
  cursor: pointer;
  padding: 8px 12px;
}
.dropdown-item:hover {
  background-color: #f8f9fa;
}
</style>
