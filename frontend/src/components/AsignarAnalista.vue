<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { validarFormato } from '../validaciones/validarFormato';
import { validarLlenado } from '../validaciones/validarLlenado'
import { getUsuario, postAnalista } from '../services'

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
            <input id="cedula" name="cedula" type="text" v-model="input.cedula" @input="handleInput('cedula', $event.target.value)" />
            <button class="btn btn-primary-lined-fit" type="button" @click="buscarPorCI">Buscar</button>
          </div>
          <span class="small error">{{ error.cedula ? error.cedula : '\u00A0' }}</span>
        </div>

        <div class="input-wrapper-row">
          <div class="input-wrapper-col">
            <label for="nombre"><strong>Nombre:</strong></label>
            <input id="nombre" name="nombre" type="text" v-model="input.nombre" @input="handleInput('nombre', $event.target.value)" />
            <span class="small error">{{ error.nombre ? error.nombre : '\u00A0' }}</span>
          </div>
          <div class="input-wrapper-col">
            <label for="apellido"><strong>Apellido:</strong></label>
            <input id="apellido" name="apellido" type="text" v-model="input.apellido" @input="handleInput('apellido', $event.target.value)" />
            <span class="small error">{{ error.apellido ? error.apellido : '\u00A0' }}</span>
          </div>
          <div class="input-wrapper-col">
            <label for="correo"><strong>Correo:</strong></label>
            <input id="correo" name="correo" type="text" v-model="input.correo" @input="handleInput('correo', $event.target.value)" />
            <span class="small error">{{ error.correo ? error.correo : '\u00A0' }}</span>
          </div>
        </div>

        <div class="input-wrapper-row" v-if="input.estado === 'ACTIVO'">
          <div class="input-wrapper-col">
            <label for="indicador"><strong>Indicador:</strong></label>
            <input id="indicador" name="indicador" type="text" v-model="input.indicador" @input="handleInput('indicador', $event.target.value)" />
            <span class="small error">{{ error.indicador ? error.indicador : '\u00A0' }}</span>
          </div>
        </div>
      </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="section ubicacion">
        <h2>Ubicación CAIT/CAIJ</h2>
        <div class="input-wrapper-col">
          <label for="zona"><strong>Zona:</strong></label>
          <select id="zona" v-model="input.zona" @change="handleInput('zona', $event.target.value)">
            <option value="0">Seleccione una opción</option>
          </select>
          <span class="small error">{{ error.zona ? error.zona : '\u00A0' }}</span>
        </div>
        <div class="input-wrapper-col">
          <label for="area"><strong>Área:</strong></label>
          <select id="area" v-model="input.area" @change="handleInput('area', $event.target.value)">
            <option value="0">Seleccione una opción</option>
          </select>
          <span class="small error">{{ error.area ? error.area : '\u00A0' }}</span>
        </div>
        <div class="input-wrapper-col">
          <label for="localidad"><strong>Localidad:</strong></label>
          <select id="localidad" v-model="input.localidad" @change="handleInput('localidad', $event.target.value)">
            <option value="0">Seleccione una opción</option>
          </select>
          <span class="small error">{{ error.localidad ? error.localidad : '\u00A0' }}</span>
        </div>
        <div class="input-wrapper-col">
          <label for="uaId"><strong>Unidad de Atención:</strong></label>
          <select id="uaId" v-model="input.uaId" @change="handleInput('uaId', $event.target.value)">
            <option value="0">Seleccione una opción</option>
          </select>
          <span class="small error">{{ error.uaId ? error.uaId : '\u00A0' }}</span>
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