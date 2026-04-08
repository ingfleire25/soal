<template>
  <div class="container bg-white p-4 shadow-sm rounded">
    <form @submit.prevent="enviar">
        <fieldset class="border p-3 mb-4 rounded">
            <legend class="w-auto px-2 fs-5 text-primary">Servicio Recurrente</legend>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Nombre del Servicio</label>
                    <input v-model="form.servicioNombre" type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Año</label>
                    <input v-model="form.anio" type="number" class="form-control form-control-sm">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Tipo de Servicio</label>
                    <!-- <select v-model="form.tipoServicio" class="form-select form-select-sm">
                        <option value="">Seleccione...</option>
                        <option value="INTERNO">Interno</option>
                        <option value="EXTERNO">Externo</option>
                    </select> -->
                    <select v-model="form.tipoServicio" class="form-select form-select-sm">
                    <option value="" disabled>Seleccione una modalidad...</option>
              
              <option 
                v-for="item in modalidades" 
                :key="item.rowstamp" 
                :value="item.modnum"
              >
                {{ item.description }}
              </option>
            </select>
            
            <div class="form-text" v-if="form.tipoServicio">
              Código seleccionado: <strong>{{ form.tipoServicio }}</strong>
            </div>

                </div>
                <div class="col-md-8">
                    <label class="form-label">Organización</label>
                    <div class="input-group input-group-sm">
                        <input v-model="form.organizacion" type="text" class="form-control">
                        <button class="btn btn-outline-secondary" type="button">...</button>
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Tipo de ODST</label>
                    <input v-model="form.tipoOdst" type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Cédula Solicitante / Autorizador</label>
                    <input v-model="form.cedula" type="text" class="form-control form-control-sm" placeholder="Cédula">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Teléfono</label>
                    <input v-model="form.telefono" type="tel" class="form-control form-control-sm">
                </div>
            </div>
        </fieldset>

        <fieldset class="border p-3 mb-4 rounded">
            <legend class="w-auto px-2 fs-5 text-primary">Detalles</legend>
            <div class="row g-3">
                <div class="col-md-8">
                    <label class="form-label">Unidad (Location)</label>
                    <input v-model="form.unidad" type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Modalidad (Desde Oracle)</label>
                    <select v-model="form.modalidad" class="form-select form-select-sm">
                        <option value="">Seleccione...</option>
                        <option v-for="mod in modalidades" :key="mod.modnum" :value="mod.modnum">
                            {{ mod.description }}
                        </option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Origen</label>
                    <input v-model="form.origen" type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Destino</label>
                    <input v-model="form.destino" type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Fecha Inicio</label>
                    <input v-model="form.fechaInicio" type="date" class="form-control form-control-sm">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Fecha Finalización</label>
                    <input v-model="form.fechaFin" type="date" class="form-control form-control-sm">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Días Req.</label>
                    <div class="d-flex gap-2 pt-2">
                        <div v-for="dia in ['L','M','X','J','V','S','D']" :key="dia">
                            <input type="checkbox" :value="dia" v-model="form.diasSeleccionados" class="form-check-input"> {{ dia }}
                        </div>
                    </div>
                </div>
            </div>
        </fieldset>

        <div v-if="mensaje" :class="['alert', mensaje.includes('Error') ? 'alert-danger' : 'alert-success']">
            {{ mensaje }}
        </div>

        <div class="text-end">
            <button type="button" @click="limpiarForm" class="btn btn-secondary me-2">Limpiar</button>
            <button type="submit" class="btn btn-primary">Guardar Servicio</button>
        </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { postSolicitud } from '@/services/postSolicitud';
import axios from 'axios'; // Asegúrate de tener axios instalado
import router from '@/router';

// 1. Variable Reactiva del Formulario Completo
const form = reactive({
  servicioNombre: '',
  anio: new Date().getFullYear(),
  tipoServicio: '',
  organizacion: '',
  tipoOdst: '',
  cedula: '',
  telefono: '',
  unidad: '',
  modalidad: '',
  origen: '',
  destino: '',
  fechaInicio: '',
  fechaFin: '',
  diasSeleccionados: [], // Array para los checkboxes
  modificadoPor: 'LEO_USER',
  fechaModificado: new Date().toISOString().split('T')[0]
});

const modalidades = ref([]);
const mensaje = ref('');

// 2. Cargar Modalidades desde tu nueva API de Oracle
async function cargarModalidades() {
  try {
    // Reemplaza por tu URL real de la API
    const { data } = await axios.get('http://localhost:3001/api/consultasOracle/modserv/'); 
    modalidades.value = data.result; 
  } catch (err) {
    console.error("Error cargando modalidades:", err);
    mensaje.value = "Error al conectar con la base de datos Oracle";
  }
}

onMounted(() => {
  cargarModalidades();
});

// 3. Enviar Formulario
async function enviar() {
  try {
    mensaje.value = 'Enviando...';
    const res = await postSolicitud(form);
    mensaje.value = `¡Éxito! Servicio guardado.`;
    setTimeout(() => router.push({ name: 'tabla' }), 2000);
  } catch (err) {
    mensaje.value = 'Error al enviar la solicitud';
  }
}

function limpiarForm() {
    Object.assign(form, {
        servicioNombre: '',
        tipoServicio: '',
        organizacion: '',
        modalidad: '',
        diasSeleccionados: []
    });
}
</script>

<style scoped>
.form-container { max-width: 500px; margin: auto; }
.field { margin-bottom: 12px; }
.message { margin-top: 1rem; color: green; }

</style> 