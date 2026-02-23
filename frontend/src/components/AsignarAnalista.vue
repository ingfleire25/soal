<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { validarFormato } from '../validaciones/validarFormato';
import { validarLlenado } from '../validaciones/validarLlenado'
import { getUsuario, postAnalista, getZonas, getAreas, getLocalidades, getUAs } from '../services'
import { onMounted, watch } from 'vue'
import FormInput from './FormInput.vue'
import FormSelect from './FormSelect.vue'

const router = useRouter()

const initialState = {
  solicitanteId: '',
  cedula: '',
  nombre: '',
  apellido: '',
  correo: '',
  estado: '0',
  indicador: '',
  zona: '0',
  area: '0',
  localidad: '0',
  uaId: '0'
}

const input = ref({ ...initialState })
const error = ref({})
const loading = ref(false)

// placeholder options (will be populated from services later)
const zonasOptions = ref([{ value: '0', label: 'Seleccione una opción' }])
const areasOptions = ref([{ value: '0', label: 'Seleccione una opción' }])
const localidadesOptions = ref([{ value: '0', label: 'Seleccione una opción' }])
const uasOptions = ref([{ value: '0', label: 'Seleccione una opción' }])

const buscarPorCI = async () => {
  if (!input.value.cedula) return
  loading.value = true
  Object.assign(input.value, {
    solicitanteId: '',
    nombre: '',
    apellido: '',
    correo: '',
    estado: '0',
    indicador: ''
  })
  try {
    const u = await getUsuario(input.value.cedula)
    Object.assign(input.value, {
      solicitanteId: u.uuid,
      nombre: u.tx_nombre,
      apellido: u.tx_apellido,
      correo: u.tx_correo,
      estado: u.tx_estado,
      indicador: u.tx_indicador
    })
  } catch (err) {
    Swal.fire(err.statusText || 'Error', '', 'error')
  } finally {
    loading.value = false
  }
}

const loadZonas = async () => {
  try {
    const res = await getZonas()
    zonasOptions.value = [ { value: '0', label: 'Seleccione una opción' }, ...res.map(z => ({ value: String(z.id || z.uuid || z.zonaId || z.pk || z.id_zona), label: z.tx_nombre })) ]
  } catch (err) {
    console.error('Error cargando zonas', err)
  }
}

const loadAreas = async (zonaId) => {
  if (!zonaId || zonaId === '0') {
    areasOptions.value = [ { value: '0', label: 'Seleccione una opción' } ]
    return
  }
  try {
    const res = await getAreas(zonaId)
    areasOptions.value = [ { value: '0', label: 'Seleccione una opción' }, ...res.map(a => ({ value: String(a.id || a.areaId), label: a.tx_nombre })) ]
  } catch (err) {
    console.error('Error cargando areas', err)
  }
}

const loadLocalidades = async (areaId) => {
  if (!areaId || areaId === '0') {
    localidadesOptions.value = [ { value: '0', label: 'Seleccione una opción' } ]
    return
  }
  try {
    const res = await getLocalidades(areaId)
    localidadesOptions.value = [ { value: '0', label: 'Seleccione una opción' }, ...res.map(l => ({ value: String(l.id || l.localidadId), label: l.tx_nombre })) ]
  } catch (err) {
    console.error('Error cargando localidades', err)
  }
}

const loadUAs = async (localidadId) => {
  if (!localidadId || localidadId === '0') {
    uasOptions.value = [ { value: '0', label: 'Seleccione una opción' } ]
    return
  }
  try {
    const res = await getUAs(localidadId)
    uasOptions.value = [ { value: '0', label: 'Seleccione una opción' }, ...res.map(u => ({ value: String(u.id || u.uaId), label: u.tx_nombre })) ]
  } catch (err) {
    console.error('Error cargando UAs', err)
  }
}

onMounted(() => {
  loadZonas()
})

watch(() => input.value.zona, (nv) => {
  // reset downstream selects
  input.value.area = '0'
  input.value.localidad = '0'
  input.value.uaId = '0'
  loadAreas(nv)
  localidadesOptions.value = [ { value: '0', label: 'Seleccione una opción' } ]
  uasOptions.value = [ { value: '0', label: 'Seleccione una opción' } ]
})

watch(() => input.value.area, (nv) => {
  input.value.localidad = '0'
  input.value.uaId = '0'
  loadLocalidades(nv)
  uasOptions.value = [ { value: '0', label: 'Seleccione una opción' } ]
})

watch(() => input.value.localidad, (nv) => {
  input.value.uaId = '0'
  loadUAs(nv)
})

const handleInput = (name, value) => {
  if (name === 'cedula') {
    if (value === '' || !isNaN(value)) input.value.cedula = value
  } else {
    input.value[name] = value
  }
  error.value = validarFormato({ ...input.value })
}

const handleSubmit = async () => {
  const err = validarLlenado(input.value)
  if (Object.keys(err).length) {
    error.value = err
    return
  }
  const result = await Swal.fire({
    title: '¿Asignar analista a la unidad de atencion?',
    icon: 'question',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Asignar',
    denyButtonText: 'Borrar',
    cancelButtonText: 'Volver',
    confirmButtonColor: '#1b26ca',
    denyButtonColor: '#ca1b26',
    html: `<ul align='center'><span class='bold'>Analista:</span>${input.value.nombre} ${input.value.apellido}</ul><br><p><span class='bold'>Unidad de Atencion:</span> ${input.value.uaId}</p>`
  })

  if (result.isConfirmed) {
    const cuerpo = { ...input.value }
    try {
      loading.value = true
      await postAnalista(cuerpo)
      Swal.fire({ title: 'Analista asignado con éxito!', html: `<p class='bold'>El analista ha sido asignado con exito en la unidad indicada<p/>`, icon: 'success' })
      router.push('/')
      stateReset()
    } catch (err) {
      Swal.fire('Error al guardar la solicitud', err.statusText || '', 'error')
    } finally {
      loading.value = false
    }
  } else if (result.isDenied) {
    stateReset()
    Swal.fire('Solicitud Eliminada', '', 'success')
  }
}

const stateReset = () => {
  Object.assign(input.value, { ...initialState })
  error.value = {}
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      Asignar Analistas
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">



      <div v-if="loading" class="loader-overlay">Cargando...</div>
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="section datos">
        <h2>Asignar analista</h2>
        <div class="input-wrapper-col">
          <label for="cedula"><strong>Cédula:</strong></label>
          <div class="input-wrapper-row">
            <FormInput id="cedula" name="cedula" v-model="input.cedula" @update:modelValue="val => handleInput('cedula', val)" />
            <button class="btn btn-primary-lined-fit" type="button" @click="buscarPorCI">Buscar</button>
          </div>
          <span class="small error">{{ error.cedula ? error.cedula : '\u00A0' }}</span>
        </div>

        <div class="input-wrapper-row">
          <div class="input-wrapper-col">
            <FormInput label="Nombre:" name="nombre" v-model="input.nombre" @update:modelValue="val => handleInput('nombre', val)" :error="error.nombre" />
          </div>
          <div class="input-wrapper-col">
            <FormInput label="Apellido:" name="apellido" v-model="input.apellido" @update:modelValue="val => handleInput('apellido', val)" :error="error.apellido" />
          </div>
          <div class="input-wrapper-col">
            <FormInput label="Correo:" name="correo" v-model="input.correo" @update:modelValue="val => handleInput('correo', val)" :error="error.correo" />
          </div>
        </div>

        <div class="input-wrapper-row" v-if="input.estado === 'ACTIVO'">
          <div class="input-wrapper-col">
            <FormInput label="Indicador:" name="indicador" v-model="input.indicador" @update:modelValue="val => handleInput('indicador', val)" :error="error.indicador" />
          </div>
        </div>
      </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="section ubicacion">
        <h2>Ubicación CAIT/CAIJ</h2>
        <div class="input-wrapper-col">
          <FormSelect label="Zona:" name="zona" v-model="input.zona" :options="zonasOptions" @update:modelValue="val => handleInput('zona', val)" :error="error.zona" />
        </div>
        <div class="input-wrapper-col">
          <FormSelect label="Área:" name="area" v-model="input.area" :options="areasOptions" @update:modelValue="val => handleInput('area', val)" :error="error.area" />
        </div>
        <div class="input-wrapper-col">
          <FormSelect label="Localidad:" name="localidad" v-model="input.localidad" :options="localidadesOptions" @update:modelValue="val => handleInput('localidad', val)" :error="error.localidad" />
        </div>
        <div class="input-wrapper-col">
          <FormSelect label="Unidad de Atención:" name="uaId" v-model="input.uaId" :options="uasOptions" @update:modelValue="val => handleInput('uaId', val)" :error="error.uaId" />
        </div>
      </div>
      </div>

      <div class="botones py-md-2" >
        <button class="btn btn-neutral-lined" type="button" @click="stateReset">Cancelar</button>
        <button class="btn btn-secondary-full" type="submit">Asignar</button>
      </div>
    </div>
          
        </form>
        </div>
    </div>
    <div class="card-footer">

    </div>
</template>

<style scoped>
.contenedor {
    margin: 8rem auto;
    width: clamp(min(10vw, 20rem), 90vw, max(90vw, 55rem));
    display: grid;
  grid-template-columns: 1fr 1fr 1fr;
    /* grid-template-rows: 1fr 1fr 1fr; */
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

.datos {
    grid-area: datos;
}
.ubicacion {
    grid-area: ubicacion;
}
.section {
  width: 100%;
  box-sizing: border-box;
}

/* Make labels match AsignarSupervisor (primary red tone) */
.form-label {
  color: var(--primary-clr-500);
}
.categorizacion {
    grid-area: categorizacion;
}
.botones {
    grid-area: botones;
    display: flex;
    justify-content: flex-end;
}
.botones button {
    margin-left: 1.25rem;
   
}
.loader-overlay {
  position: fixed;
  inset: 0;
  display:flex;
  align-items:center;
  justify-content:center;
  background: rgba(255,255,255,0.7);
  z-index: 9999;
}
</style>