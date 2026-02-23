<template>
  <div class="card">
    <div class="card-header">Crear Solicitud</div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit" class="contenedor">
        <div v-if="loading" class="loader-overlay">Cargando...</div>
      <div class="datos section section-card">
        <h2>Datos Personales</h2>
        <div class="input-wrapper-col mb-3">
          <label for="cedula"><strong>Cédula:</strong></label>
          <div class="input-wrapper-row d-flex">
            <input id="cedula" name="cedula" v-model="input.cedula" class="form-control" />
            <button class="btn btn-primary-lined-fit ms-2" type="button" @click="buscarPorCI" :disabled="loading">Buscar</button>
          </div>
          <span class="small error">{{ error.cedula ? error.cedula : '\u00A0' }}</span>
        </div>

        <div class="input-wrapper-row">
          <div class="input-wrapper-col">
            <FormInput label="Nombre:" v-model="input.nombre" :error="error.nombre" />
          </div>
          <div class="input-wrapper-col">
            <FormInput label="Apellido:" v-model="input.apellido" :error="error.apellido" />
          </div>
          <div class="input-wrapper-col">
            <FormInput label="Correo:" v-model="input.correo" :error="error.correo" />
          </div>
          <div class="input-wrapper-col">
            <label for="estado"><strong>Estado:</strong></label>
            <select id="estado" name="estado" v-model="input.estado" class="form-control">
              <option value="0">Seleccione una opción</option>
              <option value="ACTIVO">ACTIVO</option>
              <option value="JUBILADO">JUBILADO</option>
              <option value="SOBREVIVIENTE">SOBREVIVIENTE</option>
            </select>
            <span class="small error">{{ error.estado ? error.estado : '\u00A0' }}</span>
          </div>
        </div>

        <div class="input-wrapper-row">
          <div v-if="input.estado === 'ACTIVO'" class="input-wrapper-col">
            <FormInput label="Indicador:" v-model="input.indicador" :error="error.indicador" />
          </div>
        </div>
      </div>

      <div class="ubicacion section section-card">
        <h2>Ubicación CAIT/CAIJ</h2>
        <div class="input-wrapper-col">
          <FormSelect label="Zona:" v-model="input.zona" :options="zonaOptions" :error="error.zona" />
        </div>
        <div class="input-wrapper-col">
          <FormSelect label="Área:" v-model="input.area" :options="areaOptions" :error="error.area" />
        </div>
        <div class="input-wrapper-col">
          <FormSelect label="Localidad:" v-model="input.localidad" :options="localidadOptions" :error="error.localidad" />
        </div>
        <div class="input-wrapper-col">
          <FormSelect label="Unidad de Atención:" v-model="input.uaId" :options="uaOptions" :error="error.uaId" />
        </div>
      </div>

      <div class="categorizacion section section-card">
        <h2>Categorización de la Solicitud</h2>
        <div class="input-wrapper-col">
          <FormSelect label="Categoría:" v-model="input.categoria" :options="categoriaOptions" :error="error.categoria" />
        </div>
        <div class="input-wrapper-col">
          <FormCheckboxesList :url="input.categoria !== '0' ? `/api/categorias/${input.categoria}/tipos?activo=true` : ''" :state="input.tipos" label="Tipo(s) de Solicitud:" @change="handleCheckbox" :errorMsg="error.tipo" />
        </div>
        <div class="input-wrapper-col">
          <FormInput label="Fecha de Atención:" v-model="input.fh_atencion" type="date" :error="error.fh_atencion" />
        </div>
      </div>

      <div class="botones">
        <button class="btn btn-neutral-lined" type="button" @click="stateReset">Cancelar</button>
        <button class="btn btn-neutral-lined" type="button" @click="goToLogin">Volver al Login</button>
        <button class="btn btn-secondary-full" type="submit">Crear Solicitud</button>
      </div>

      <div v-if="message" class="alert mt-3" :class="messageClass">{{ message }}</div>
      </form>
    </div>
    <div class="card-footer"></div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import FormInput from '@/components/FormInput.vue'
import FormSelect from '@/components/FormSelect.vue'
import FormCheckboxesList from '@/components/FormCheckboxesList.vue'
import { getUsuario } from '@/services/getUsuario'
import { postSolicitud } from '@/services/postSolicitud'
import Swal from 'sweetalert2'
import { validarFormato, validarLlenado } from '@/utils/solicitudValidations'

const router = useRouter()
const loading = ref(false)
const message = ref('')
const messageClass = ref('')

const initialState = {
  solicitanteId: "",
  cedula: "",
  nombre: "",
  apellido: "",
  correo: "",
  estado: "0",
  indicador: "",
  zona: "0",
  area: "0",
  localidad: "0",
  uaId: "0",
  categoria: "0",
  tipos: [],
  fh_atencion: "",
  correo_alt: ""
}

const input = reactive({ ...initialState })
const error = reactive({})

// Options for selects: these are loaded from API endpoints; to keep simple we load via api GET
import { api } from '@/utils/axios'
const zonaOptions = ref([])
const areaOptions = ref([])
const localidadOptions = ref([])
const uaOptions = ref([])
const categoriaOptions = ref([])

async function loadZonas() {
  try {
    const { data } = await api.get('/api/zonas?activo=true')
    zonaOptions.value = (data.result || []).map(z => ({ value: z.id, label: z.tx_nombre }))
  } catch (e) { zonaOptions.value = [] }
}

async function loadAreas() {
  if (!input.zona || input.zona === '0') { areaOptions.value = []; return }
  try {
    const { data } = await api.get(`/api/zonas/${input.zona}/areas?activo=true`)
    areaOptions.value = (data.result || []).map(a => ({ value: a.id, label: a.tx_nombre }))
  } catch (e) { areaOptions.value = [] }
}

async function loadLocalidades() {
  if (!input.area || input.area === '0') { localidadOptions.value = []; return }
  try {
    const { data } = await api.get(`/api/areas/${input.area}/localidades?activo=true`)
    localidadOptions.value = (data.result || []).map(l => ({ value: l.id, label: l.tx_nombre }))
  } catch (e) { localidadOptions.value = [] }
}

async function loadUAs() {
  if (!input.localidad || input.localidad === '0') { uaOptions.value = []; return }
  try {
    const { data } = await api.get(`/api/localidades/${input.localidad}/unidades-atencion?activo=true`)
    uaOptions.value = (data.result || []).map(u => ({ value: u.id, label: u.tx_nombre }))
  } catch (e) { uaOptions.value = [] }
}

async function loadCategorias() {
  try {
    const { data } = await api.get('/api/categorias?activo=true')
    categoriaOptions.value = (data.result || []).map(c => ({ value: c.id, label: c.tx_nombre }))
  } catch (e) { categoriaOptions.value = [] }
}

// watch-like reactions
import { watch } from 'vue'
watch(() => input.zona, () => loadAreas())
watch(() => input.area, () => loadLocalidades())
watch(() => input.localidad, () => loadUAs())
watch(() => input.categoria, () => {})

loadZonas(); loadCategorias();

const buscarPorCI = async () => {
  if (!input.cedula) return
  loading.value = true
  // reset personal fields except cedula
  input.solicitanteId = ''
  input.nombre = ''
  input.apellido = ''
  input.correo = ''
  input.estado = '0'
  input.indicador = ''
  try {
    const u = await getUsuario(input.cedula)
    input.solicitanteId = u.uuid
    input.nombre = u.tx_nombre
    input.apellido = u.tx_apellido
    input.correo = u.tx_correo
    input.estado = u.tx_estado
    input.indicador = u.tx_indicador
  } catch (err) {
    Swal.fire(err.statusText || 'Error', '', 'error')
  } finally {
    loading.value = false
  }
}

function handleCheckbox(checked, tipo) {
  if (checked) {
    input.tipos.push(tipo)
  } else {
    const idx = input.tipos.findIndex(t => t.id === tipo.id)
    if (idx !== -1) input.tipos.splice(idx, 1)
  }
}

function stateReset() {
  Object.keys(initialState).forEach(k => input[k] = initialState[k])
  Object.keys(error).forEach(k => delete error[k])
}

function goToLogin() {
  router.push({ name: 'login' })
}

async function handleSubmit() {
  const err = validarLlenado(input)
  Object.keys(error).forEach(k => delete error[k])
  if (Object.keys(err).length) {
    Object.assign(error, err)
    return
  }

  const lista = input.tipos.slice().sort((a,b)=> a.tx_nombre.localeCompare(b.tx_nombre)).map(t => `<li>${t.tx_nombre}</li>`).join('')
  const result = await Swal.fire({
    title: '¿Crear solicitud con los siguientes tipos y fecha?',
    icon: 'question',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Crear',
    denyButtonText: 'Borrar',
    cancelButtonText: 'Volver',
    confirmButtonColor: '#1b26ca',
    denyButtonColor: '#ca1b26',
    html: `<ul align='center'><span class='bold'>Tópicos:</span>${lista}</ul><br><p><span class='bold'>Fecha:</span> ${input.fh_atencion}</p>`
  })

  if (result.isConfirmed) {
    let cuerpo = { ...input, tipos: input.tipos.map(t => t.id) }
    const crearCasoSiga = input.tipos.some(tipo => tipo.tx_nombre === 'CREAR CASO SIGA')

    if (crearCasoSiga) {
      try {
        loading.value = true
        const r = await fetch(`http://localhost:3001/api/siga/${input.cedula}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
        if (!r.ok) throw new Error('Error al crear caso en SIGA')
      } catch (e) {
        Swal.fire('Error al crear caso en SIGA', e.message, 'error')
        loading.value = false
        return
      } finally { loading.value = false }
    }

    const res = await Swal.fire({
      title: 'Copia de Solicitud',
      icon: 'question',
      text: '¿Quisiera recibir una copia de la solicitud creada en un correo alternativo?',
      input: 'email',
      inputLabel: 'Correo alternativo',
      inputPlaceholder: 'usuario@correo.com',
      showDenyButton: true,
      denyButtonText: 'No',
      confirmButtonText: 'Enviar'
    })

    if (res.isConfirmed && res.value) cuerpo = { ...cuerpo, correo_alt: res.value }

    try {
      loading.value = true
      const solicitud = await postSolicitud(cuerpo)
      await Swal.fire({ title: '¡Solicitud creada con éxito!', html: `<p class='bold'>Su número de ticket es: ${solicitud.n_ticket}</p><p>En breve llegará a su bandeja de correo un mensaje con los detalles de su solicitud<p/>`, icon: 'success' })
    } catch (e) {
      Swal.fire('Error al guardar la solicitud', e.statusText || e.message || 'Error', 'error')
    } finally {
      loading.value = false
      router.push({ name: 'login' })
    }

    stateReset()
  } else if (result.isDenied) {
    stateReset()
    Swal.fire('Solicitud Eliminada', '', 'success')
  }
}
</script>

<style scoped>
.crear-solicitud { max-width: 960px }
.contenedor {
  margin: 8rem auto;
  width: clamp(min(10vw, 20rem), 90vw, max(90vw, 55rem));
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.25rem;
  grid-template-areas:
    "datos datos ubicacion"
    "datos datos ubicacion"
    "categorizacion categorizacion categorizacion"
    "botones botones botones";
  padding-bottom: 8rem;
}
@media (max-width: 68rem) {
  .contenedor {
  grid-template-columns: 1fr;
  grid-template-areas:
    "datos"
    "ubicacion"
    "categorizacion"
    "botones";
  width: min(95vw, 720px);
  margin: 2rem auto;
  }
}

.datos { grid-area: datos; }
.ubicacion { grid-area: ubicacion; }
.section { width: 100%; box-sizing: border-box; }
.categorizacion { grid-area: categorizacion; }
.botones { grid-area: botones; display: flex; justify-content: flex-end; }
.botones button { margin-left: 1.25rem; }
.loader-overlay { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(255,255,255,0.7); z-index: 9999; }

/* Section card style: light gray background for each main area */
.section-card {
  background: #f5f6f7;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: none;
}

.section-card h2 {
  margin-top: 0;
  margin-bottom: 0.75rem;
}

</style>
