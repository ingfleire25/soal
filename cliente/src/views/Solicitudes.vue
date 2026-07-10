<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getSolicitudes } from "@/services/getSolicitudes";
import { updateSolicitud } from "@/services/updateSolicitud";
import { cambiarEstado } from "@/services/cambiarEstado";
import { getCompanies } from "@/services/getCompanies";
import { getLocations } from "@/services/getLocations";
import { getServiceTypes } from "@/services/getServiceTypes";
import { getModserv } from "@/services/getModserv";
import { getBasicItems } from "@/services/getBasicItems";
import { getAprobadoresLabor } from "@/services/getAprobadoresLabor";
import CentroCostoAutocomplete from "@/components/CentroCostoAutocomplete.vue";
import { notifyError } from '@/utils/alertService';
import {
  toDatetimeLocalFromISOString,
  getNivelAprobacion,
} from "@/utils/dateTime";

const route = useRoute();
const auth = useAuthStore();
const lista = ref([]);
const error = ref("");
const loading = ref(false);
const companies = ref([]);
const locations = ref([]);
const loadingLocations = ref(false);
const searchQuery = ref("");
const searchOrigen = ref("");
const searchDestino = ref("");
const searchOrganizacion = ref("");
const mostrarDropdownOrigen = ref(false);
const mostrarDropdownDestino = ref(false);
const mostrarDropdownEmpresa = ref(false);
const serviceTypesTP = ref([]);
const serviceTypesMUM = ref([]);
const serviceTypesSL = ref([]);
const modserv = ref([]);
const editForm = ref({});
const aprobadoresDisponibles = ref([]);
const loadingAprobadores = ref(false);
const selectedTipo = ref("");
const selectedEstado = ref("");

// Timers para debounce en búsqueda de materiales (por índice)
const materialSearchTimers = new Map();

const tipoOptions = [
  { value: "", label: "Todos los tipos" },
  { value: "Transporte de Personal", label: "TP - Transporte personal" },
  {
    value: "Movimiento Unidades Mayores",
    label: "OUM - Operaciones de unidades mayores",
  },
  { value: "Suministro Lacustre", label: "SL - Suministro lacustre" },
];

const estadoOptions = [
  { value: "", label: "Todos los estados" },
  { value: "pendiente", label: "Pendiente" },
  { value: "aprobada", label: "Aprobada" },
  { value: "rechazada", label: "Rechazada" },
];

const serviceTypes = computed(() => {
  if (editForm.value.tipoSolicitud === "Transporte de Personal")
    return serviceTypesTP.value;
  if (editForm.value.tipoSolicitud === "Movimiento Unidades Mayores")
    return serviceTypesMUM.value;
  if (editForm.value.tipoSolicitud === "Suministro Lacustre")
    return serviceTypesSL.value;
  return [];
});

const ubicacionesFiltradasOrigen = computed(() => {
  const termino = searchOrigen.value.trim().toLowerCase();
  if (termino.length < 2) return [];
  return locations.value
    .filter(
      (loc) =>
        (loc.LOCATION || "").toLowerCase().includes(termino) ||
        (loc.DESCRIPTION || "").toLowerCase().includes(termino),
    )
    .slice(0, 40);
});

const ubicacionesFiltradasDestino = computed(() => {
  const termino = searchDestino.value.trim().toLowerCase();
  if (termino.length < 2) return [];
  return locations.value
    .filter(
      (loc) =>
        (loc.LOCATION || "").toLowerCase().includes(termino) ||
        (loc.DESCRIPTION || "").toLowerCase().includes(termino),
    )
    .slice(0, 40);
});

const companiesFiltradas = computed(() => {
  const termino = searchOrganizacion.value.trim().toLowerCase();
  if (termino.length < 2) return [];
  return companies.value
    .filter(
      (company) =>
        (company.name || "").toLowerCase().includes(termino) ||
        (company.company || "").toLowerCase().includes(termino),
    )
    .slice(0, 50);
});

const nivelAprobacionInfo = computed(() =>
  getNivelAprobacion(editForm.value.fechaInicio),
);
const nivelAprobacionTexto = computed(
  () => nivelAprobacionInfo.value?.texto || "",
);

const watchFechaInicio = watch(
  () => editForm.value.fechaInicio,
  async () => {
    if (!editForm.value.fechaInicio) {
      aprobadoresDisponibles.value = [];
      editForm.value.aprobador = "";
      return;
    }
    await cargarAprobadores();
  },
);

const userFullName = computed(() => {
  const usuario = auth.user?.value;
  if (!usuario) return "";
  return `${usuario.nombres} ${usuario.apellidos}`;
});

const userRole = computed(() => auth.user?.value?.rol || "");

const esAprobador = computed(() =>
  ["Aprobador", "Administrador"].includes(userRole.value),
);

const usuarioGerencia = computed(() => auth.user?.value?.gerencia || "");
const tieneGerencia = computed(() => lista.value.some((s) => s.gerencia));

const esHistoricoSolicitud = (s) => {
  const estado = (s.estado || "").toLowerCase();
  if (estado === "rechazada" || estado === "cancelada") return true;

  const fechaFin = s.fechaFin ? new Date(s.fechaFin) : null;
  const esFechaFinValida = fechaFin && !Number.isNaN(fechaFin.getTime());
  const fechaVencida = esFechaFinValida ? fechaFin < new Date() : false;

  if ((estado === "pendiente" || estado === "aprobada") && fechaVencida)
    return true;
  return false;
};

const esVigenteODST = (s) => !esHistoricoSolicitud(s);

const listaFiltrada = computed(() => {
  return lista.value.filter((s) => {
    if (!esVigenteODST(s)) return false;

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
      s.tipoServicio,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const buscado = searchQuery.value.trim().toLowerCase();
    if (buscado && !texto.includes(buscado)) return false;
    if (selectedTipo.value && s.tipoSolicitud !== selectedTipo.value)
      return false;
    if (selectedEstado.value && s.estado !== selectedEstado.value) return false;
    if (
      usuarioGerencia.value &&
      tieneGerencia.value &&
      s.gerencia !== usuarioGerencia.value
    )
      return false;
    return true;
  });
});

const cargarSolicitudes = async () => {
  error.value = "";
  loading.value = true;
  try {
    const datos = await getSolicitudes();
    lista.value = datos;
  } catch (e) {
    error.value = e.statusText || "No se pudieron cargar las solicitudes";
  } finally {
    loading.value = false;
  }
};

const cargarCompanies = async () => {
  try {
    companies.value = await getCompanies();
  } catch (e) {
    console.error("Error cargando compañías:", e);
  }
};

const cargarUbicaciones = async () => {
  if (locations.value.length > 0) return;
  loadingLocations.value = true;
  try {
    locations.value = await getLocations();
  } catch (e) {
    console.error("Error cargando ubicaciones:", e);
  } finally {
    loadingLocations.value = false;
  }
};

const cargarServiceTypes = async () => {
  try {
    serviceTypesTP.value = await getServiceTypes("SUBTYPETP");
    serviceTypesMUM.value = await getServiceTypes("SUBTYPEMUM");
    serviceTypesSL.value = await getServiceTypes("SUBTYPESL");
  } catch (e) {
    console.error("Error cargando tipos de servicio:", e);
  }
};

const cargarModserv = async () => {
  try {
    modserv.value = await getModserv();
  } catch (e) {
    console.error("Error cargando modserv:", e);
  }
};

const seleccionarOrigen = (loc) => {
  editForm.value.origen = loc.LOCATION;
  editForm.value.descripcionOrigen = loc.DESCRIPTION;
  searchOrigen.value = loc.LOCATION || "";
  mostrarDropdownOrigen.value = false;
};

const seleccionarDestino = (loc) => {
  editForm.value.destino = loc.LOCATION;
  editForm.value.descripcionDestino = loc.DESCRIPTION;
  searchDestino.value = loc.LOCATION || "";
  mostrarDropdownDestino.value = false;
};

const seleccionarEmpresa = (company) => {
  editForm.value.organizacion = company.name || "";
  editForm.value.codigoOrganizacion = company.company || "";
  editForm.value.organizacionCcOi = "";
  searchOrganizacion.value = company.name || "";
  mostrarDropdownEmpresa.value = false;
};

const cargarAprobadores = async () => {
  const nivel = nivelAprobacionInfo.value?.codigo;
  if (!nivel) {
    aprobadoresDisponibles.value = [];
    editForm.value.aprobador = "";
    return;
  }

  loadingAprobadores.value = true;
  try {
    const results = await getAprobadoresLabor(nivel);
    aprobadoresDisponibles.value = Array.isArray(results) ? results : [];
    if (
      !aprobadoresDisponibles.value.some(
        (a) => a.name === editForm.value.aprobador,
      )
    ) {
      editForm.value.aprobador = "";
    }
  } catch (error) {
    console.error("Error cargando aprobadores:", error);
    aprobadoresDisponibles.value = [];
    editForm.value.aprobador = "";
  } finally {
    loadingAprobadores.value = false;
  }
};

const buscarMaterial = (index) => {
  const material = editForm.value.materiales?.[index];
  if (!material) return;
  const query = (material.searchQuery || "").trim();

  // debounce por índice
  if (materialSearchTimers.has(index)) {
    clearTimeout(materialSearchTimers.get(index));
  }

  const timer = setTimeout(async () => {
    material.materialId = "";
    material.renglon = "";
    material.descripcion = "";
    material.searchResults = [];

    if (query.length < 2) {
      material.searchResults = [];
      return;
    }

    material.searching = true;
    try {
      const results = await getBasicItems(query);
      material.searchResults = Array.isArray(results)
        ? results.slice(0, 50)
        : [];
    } catch (error) {
      console.error("Error buscando materiales:", error);
      material.searchResults = [];
    } finally {
      material.searching = false;
    }
  }, 300);

  materialSearchTimers.set(index, timer);
};

const seleccionarMaterial = (index, item) => {
  const material = editForm.value.materiales?.[index];
  if (!material) return;
  material.materialId = item.itemnum;
  material.renglon = item.itemnum;
  material.descripcion = item.description;
  material.searchQuery = `${item.itemnum} - ${item.description}`;
  material.searchResults = [];
};

const addMaterial = () => {
  if (!Array.isArray(editForm.value.materiales)) {
    editForm.value.materiales = [];
  }
  editForm.value.materiales.push({
    materialId: "",
    renglon: "",
    descripcion: "",
    cantidad: 1,
    fechaEntregaMuelle: "",
    observacion: "",
    searchQuery: "",
    searchResults: [],
    searching: false,
  });
};

const removeMaterial = (index) => {
  if (Array.isArray(editForm.value.materiales)) {
    editForm.value.materiales.splice(index, 1);
  }
};

const editingId = ref(null);
const modalRef = ref(null);
const modalInstance = ref(null);

const puedeEditar = (s) => {
  return s.solicitante === userFullName.value && s.estado === "pendiente";
};

const puedeAprobar = (s) => {
  return esAprobador.value && s.estado === "pendiente";
};

const aprobar = async (s) => {
  if (!confirm("¿Confirma aprobación de la solicitud?")) return;
  try {
    await cambiarEstado(s.id, { estado: "aprobada" });
    await cargarSolicitudes();
  } catch (e) {
    notifyError("Error al aprobar: " + e.statusText);
  }
};

const rechazar = async (s) => {
  const motivo = prompt("Motivo de rechazo");
  if (!motivo) return;
  try {
    await cambiarEstado(s.id, { estado: "rechazada", motivoRechazo: motivo });
    await cargarSolicitudes();
  } catch (e) {
    notifyError("Error al rechazar: " + e.statusText);
  }
};

const iniciarEdicion = async (s) => {
  editingId.value = s.id;
  editForm.value = {
    ...s,
    fechaInicio: toDatetimeLocalFromISOString(s.fechaInicio),
    fechaFin: toDatetimeLocalFromISOString(s.fechaFin),
    materiales: Array.isArray(s.materiales)
      ? s.materiales.map((item) => ({
          ...item,
          searchQuery: item.descripcion
            ? `${item.renglon || item.materialId || ""} - ${item.descripcion}`.trim()
            : "",
          searchResults: [],
          searching: false,
        }))
      : [],
  };
  searchOrganizacion.value = s.organizacion || "";
  searchOrigen.value = s.origen || "";
  searchDestino.value = s.destino || "";

  await cargarAprobadores();

  if (!modalInstance.value) {
    modalInstance.value = new bootstrap.Modal(modalRef.value);
    modalRef.value.addEventListener("hidden.bs.modal", () => {
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
  const letra = String(valor || "")
    .trim()
    .toUpperCase()
    .replace(/[^CF]/g, "")
    .slice(0, 1);
  editForm.value[campo] = letra;
};

const guardarEdicion = async () => {
  try {
    const payload = {
      descripcion: editForm.value.descripcion,
      origen: editForm.value.origen,
      descripcionOrigen: editForm.value.descripcionOrigen,
      destino: editForm.value.destino,
      descripcionDestino: editForm.value.descripcionDestino,
      fechaInicio: editForm.value.fechaInicio,
      fechaFin: editForm.value.fechaFin,
      organizacion: editForm.value.organizacion,
      codigoOrganizacion: editForm.value.codigoOrganizacion,
      organizacionCcOi: editForm.value.organizacionCcOi,
      tipoServicio: editForm.value.tipoServicio,
      aprobador: editForm.value.aprobador,
      correo: editForm.value.correo,
      gerencia: editForm.value.gerencia,
      solicitante: editForm.value.solicitante,
      cedulaSolicitante: editForm.value.cedulaSolicitante,
      tipoSolicitud: editForm.value.tipoSolicitud,
      subtipo: editForm.value.subtipo,
      modserv: editForm.value.modserv,
      personaEnvia: editForm.value.personaEnvia,
      descripcionPersonaEnvia: editForm.value.descripcionPersonaEnvia,
      personaRecibe: editForm.value.personaRecibe,
      descripcionPersonaRecibe: editForm.value.descripcionPersonaRecibe,
      unidadMovilizar: editForm.value.unidadMovilizar,
      descripcionUnidad: editForm.value.descripcionUnidad,
      lunes: editForm.value.lunes,
      martes: editForm.value.martes,
      miercoles: editForm.value.miercoles,
      jueves: editForm.value.jueves,
      viernes: editForm.value.viernes,
      sabado: editForm.value.sabado,
      domingo: editForm.value.domingo,
      cantidadPasajeros: editForm.value.cantidadPasajeros,
      nivelAprobacion: nivelAprobacionInfo.value.codigo,
    };

    if (editForm.value.fecha) {
      payload.fecha = editForm.value.fecha;
    }

    if (editForm.value.tipoSolicitud === "Suministro Lacustre") {
      payload.materiales = (editForm.value.materiales || []).map((m) => ({
        renglon: m.renglon,
        descripcion: m.descripcion,
        cantidad: m.cantidad,
        fechaEntregaMuelle: m.fechaEntregaMuelle,
        observacion: m.observacion,
      }));
    }

    await updateSolicitud(editingId.value, payload);
    await cargarSolicitudes();
    cancelarEdicion();
  } catch (e) {
    notifyError("Error al guardar edición: " + e.statusText);
  }
};

onMounted(() => {
  cargarSolicitudes();
  cargarCompanies();
  cargarUbicaciones();
  cargarServiceTypes();
  cargarModserv();
});

const limpiarFiltros = () => {
  searchQuery.value = "";
  selectedTipo.value = "";
  selectedEstado.value = "";
};

const handleDateFieldDblClick = (event) => {
  const input = event.target;
  if (input && typeof input.select === "function") {
    input.select();
  }
  setTimeout(() => {
    if (input && typeof input.blur === "function") {
      input.blur();
    }
  }, 0);
};

const confirmDateSelection = (event) => {
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
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{
            selectedTipo
              ? tipoOptions.find((option) => option.value === selectedTipo)
                  ?.label
              : "Tipo de solicitud"
          }}
        </button>
        <ul class="dropdown-menu">
          <li v-for="option in tipoOptions" :key="option.value">
            <a
              class="dropdown-item"
              href="#"
              @click.prevent="selectedTipo = option.value"
              >{{ option.label }}</a
            >
          </li>
        </ul>
      </div>

      <div class="dropdown">
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{
            selectedEstado
              ? estadoOptions.find((option) => option.value === selectedEstado)
                  ?.label
              : "Estado"
          }}
        </button>
        <ul class="dropdown-menu">
          <li v-for="option in estadoOptions" :key="option.value">
            <a
              class="dropdown-item"
              href="#"
              @click.prevent="selectedEstado = option.value"
              >{{ option.label }}</a
            >
          </li>
        </ul>
      </div>

      <button
        v-if="searchQuery || selectedTipo || selectedEstado"
        class="btn btn-outline-primary"
        @click="limpiarFiltros"
      >
        Limpiar filtros
      </button>
    </div>

    <div class="table-responsive">
      <table
        v-if="!loading && listaFiltrada.length"
        class="table table-striped table-left"
      >
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
            <td>
              {{ s.fechaFin ? new Date(s.fechaFin).toLocaleDateString() : "-" }}
            </td>
            <td>
              <span
                :class="{
                  'badge bg-warning': s.estado === 'pendiente',
                  'badge bg-success': s.estado === 'aprobada',
                  'badge bg-danger': s.estado === 'rechazada',
                }"
              >
                {{ s.estado }}
              </span>
            </td>
            <td>{{ s.motivoRechazo || "-" }}</td>
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

    <p v-if="!loading && !listaFiltrada.length" class="text-secondary">
      No hay solicitudes.
    </p>

    <div
      ref="modalRef"
      class="modal fade"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Editar solicitud</h5>
            <button
              type="button"
              class="btn-close"
              @click="cancelarEdicion"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row g-2">
              <div class="col-md-12">
                <label class="form-label">Descripción</label>
                <textarea
                  class="form-control"
                  v-model="editForm.descripcion"
                  rows="2"
                ></textarea>
              </div>

              <div class="col-md-6">
                <label class="form-label">Origen</label>
                <div class="position-relative">
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchOrigen"
                    placeholder="Buscar ubicación..."
                    @input="mostrarDropdownOrigen = true"
                  />
                  <div
                    v-if="
                      mostrarDropdownOrigen &&
                      ubicacionesFiltradasOrigen.length > 0
                    "
                    class="dropdown-menu show w-100"
                    style="max-height: 220px; overflow-y: auto; z-index: 1050"
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
                <input
                  class="form-control"
                  v-model="editForm.descripcionOrigen"
                  readonly
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Destino</label>
                <div class="position-relative">
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchDestino"
                    placeholder="Buscar ubicación..."
                    @input="mostrarDropdownDestino = true"
                  />
                  <div
                    v-if="
                      mostrarDropdownDestino &&
                      ubicacionesFiltradasDestino.length > 0
                    "
                    class="dropdown-menu show w-100"
                    style="max-height: 220px; overflow-y: auto; z-index: 1050"
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
                <input
                  class="form-control"
                  v-model="editForm.descripcionDestino"
                  readonly
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Fecha Inicio</label>
                <div class="date-time-field-wrapper">
                  <input
                    type="datetime-local"
                    class="form-control"
                    v-model="editForm.fechaInicio"
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
                <label class="form-label">Fecha Fin</label>
                <div class="date-time-field-wrapper">
                  <input
                    type="datetime-local"
                    class="form-control"
                    v-model="editForm.fechaFin"
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
                    type="text"
                    class="form-control"
                    v-model="searchOrganizacion"
                    placeholder="Buscar empresa..."
                    @input="mostrarDropdownEmpresa = true"
                  />
                  <div
                    v-if="
                      mostrarDropdownEmpresa && companiesFiltradas.length > 0
                    "
                    class="dropdown-menu show w-100"
                    style="max-height: 220px; overflow-y: auto; z-index: 1050"
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
                  class="form-control"
                  v-model="editForm.codigoOrganizacion"
                  readonly
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Centro de costo CC/OI</label>
                <CentroCostoAutocomplete
                  v-model="editForm.organizacionCcOi"
                  :required="true"
                  :company-code="editForm.codigoOrganizacion"
                  :company-name="editForm.organizacion"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label">Tipo de Servicio</label>
                <select class="form-select" v-model="editForm.tipoServicio">
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
                <label class="form-label">Subtipo</label>
                <input
                  class="form-control"
                  v-model="editForm.subtipo"
                  readonly
                />
              </div>

              <template
                v-if="editForm.tipoSolicitud === 'Transporte de Personal'"
              >
                <div class="col-md-6" v-if="editForm.subtipo === 'Recurrente'">
                  <label class="form-label">Modalidad</label>
                  <select class="form-select" v-model="editForm.modserv">
                    <option value="">Seleccione una modalidad</option>
                    <option
                      v-for="item in modserv"
                      :key="item.modnum"
                      :value="item.modnum"
                    >
                      {{ item.modnum }} - {{ item.description }}
                    </option>
                  </select>
                </div>
                <div class="col-12">
                  <div class="row g-2">
                    <div
                      class="col-md-2"
                      v-for="dia in [
                        'lunes',
                        'martes',
                        'miercoles',
                        'jueves',
                        'viernes',
                        'sabado',
                        'domingo',
                      ]"
                      :key="dia"
                    >
                      <label class="form-label text-capitalize">{{
                        dia
                      }}</label>
                      <select class="form-select" v-model="editForm[dia]">
                        <option value="">---</option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Cantidad de Pasajeros</label>
                  <input
                    type="number"
                    class="form-control"
                    min="1"
                    v-model.number="editForm.cantidadPasajeros"
                  />
                </div>
              </template>

              <template
                v-if="editForm.tipoSolicitud === 'Movimiento Unidades Mayores'"
              >
                <div class="col-md-6">
                  <label class="form-label">Unidad a Movilizar</label>
                  <input
                    class="form-control"
                    v-model="editForm.unidadMovilizar"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Descripción de la Unidad</label>
                  <input
                    class="form-control"
                    v-model="editForm.descripcionUnidad"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Persona que Envía</label>
                  <input class="form-control" v-model="editForm.personaEnvia" />
                </div>
                <div class="col-md-6">
                  <label class="form-label"
                    >Descripción Persona que Envía</label
                  >
                  <input
                    class="form-control"
                    v-model="editForm.descripcionPersonaEnvia"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Persona que Recibe</label>
                  <input
                    class="form-control"
                    v-model="editForm.personaRecibe"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label"
                    >Descripción Persona que Recibe</label
                  >
                  <input
                    class="form-control"
                    v-model="editForm.descripcionPersonaRecibe"
                  />
                </div>
              </template>

              <template v-if="editForm.tipoSolicitud === 'Suministro Lacustre'">
                <div class="col-md-6">
                  <label class="form-label">Persona que Envía</label>
                  <input class="form-control" v-model="editForm.personaEnvia" />
                </div>
                <div class="col-md-6">
                  <label class="form-label"
                    >Descripción Persona que Envía</label
                  >
                  <input
                    class="form-control"
                    v-model="editForm.descripcionPersonaEnvia"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">Persona que Recibe</label>
                  <input
                    class="form-control"
                    v-model="editForm.personaRecibe"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label"
                    >Descripción Persona que Recibe</label
                  >
                  <input
                    class="form-control"
                    v-model="editForm.descripcionPersonaRecibe"
                  />
                </div>
                <div class="col-12">
                  <fieldset class="border p-3 rounded">
                    <legend class="w-auto px-2 fs-6">
                      Materiales a Transportar
                    </legend>
                    <div
                      v-for="(mat, index) in editForm.materiales"
                      :key="index"
                      class="border p-3 mb-3 rounded"
                    >
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label class="form-label">Material</label>
                          <div class="position-relative">
                            <input
                              type="text"
                              class="form-control"
                              v-model="mat.searchQuery"
                              placeholder="Buscar material..."
                              @input="buscarMaterial(index)"
                              autocomplete="off"
                            />
                            <div
                              v-if="mat.searchResults?.length"
                              class="dropdown-menu show w-100"
                              style="
                                max-height: 220px;
                                overflow-y: auto;
                                z-index: 1050;
                              "
                            >
                              <button
                                v-for="item in mat.searchResults"
                                :key="item.itemnum"
                                type="button"
                                class="dropdown-item"
                                @click="seleccionarMaterial(index, item)"
                              >
                                <strong>{{ item.itemnum }}</strong> -
                                {{ item.description }}<br />
                                <small class="text-muted">{{
                                  item.stocktype
                                }}</small>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Cantidad</label>
                          <input
                            type="number"
                            class="form-control"
                            min="1"
                            v-model.number="mat.cantidad"
                          />
                        </div>
                        <div class="col-md-3">
                          <label class="form-label">Fecha entrega muelle</label>
                          <input
                            type="date"
                            class="form-control"
                            v-model="mat.fechaEntregaMuelle"
                          />
                        </div>
                        <div class="col-md-12">
                          <label class="form-label">Observación</label>
                          <textarea
                            class="form-control"
                            rows="2"
                            v-model="mat.observacion"
                          ></textarea>
                        </div>
                        <div class="col-12 text-end">
                          <button
                            type="button"
                            class="btn btn-link text-danger"
                            @click="removeMaterial(index)"
                          >
                            Eliminar material
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-primary"
                      @click="addMaterial"
                    >
                      Agregar material
                    </button>
                  </fieldset>
                </div>
              </template>

              <div class="col-md-4">
                <label class="form-label">Aprobador</label>
                <select
                  class="form-select"
                  v-model="editForm.aprobador"
                  :disabled="!nivelAprobacionInfo.codigo || loadingAprobadores"
                >
                  <option value="" disabled hidden>
                    Seleccione un aprobador
                  </option>
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
              <div class="col-md-4">
                <label class="form-label">Correo</label>
                <input
                  class="form-control bg-light"
                  v-model="editForm.correo"
                  readonly
                />
              </div>
              <div class="col-md-4">
                <label class="form-label">Gerencia</label>
                <input
                  class="form-control bg-light"
                  v-model="editForm.gerencia"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Solicitante</label>
                <input
                  class="form-control bg-light"
                  v-model="editForm.solicitante"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Cédula Solicitante</label>
                <input
                  class="form-control bg-light"
                  v-model="editForm.cedulaSolicitante"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Fecha creación</label>
                <input
                  class="form-control bg-light"
                  v-model="editForm.fecha"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Nivel de Aprobación</label>
                <input
                  class="form-control bg-light"
                  :value="nivelAprobacionTexto"
                  readonly
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="cancelarEdicion"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-success"
              @click="guardarEdicion"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabla-container {
  max-width: 100%;
  margin: 0;
  padding: 1rem;
}
.table-left {
  margin-left: 0;
}
.error {
  color: red;
}

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
  border: none; /* Quita el borde */
  padding: 0; /* Quita el relleno interno */
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 0.7;
}

/* Colores específicos para cada icono */
.btn-edit .material-icons {
  color: #0d6efd;
} /* Azul */
.btn-approve .material-icons {
  color: #198754;
} /* Verde */
.btn-reject .material-icons {
  color: #dc3545;
} /* Rojo */

.material-icons {
  font-size: 22px;
}
</style>
