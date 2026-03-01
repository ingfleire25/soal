<template>
  <div class="form-container">
    <h1>Crear solicitud de transporte acuático</h1>
    <form @submit.prevent="enviar">
      <div class="field">
        <label>Nombre</label>
        <input v-model="form.nombre" required />
      </div>
      <div class="field">
        <label>Correo electrónico</label>
        <input type="email" v-model="form.correo" required />
      </div>
      <div class="field">
        <label>Origen</label>
        <input v-model="form.origen" required />
      </div>
      <div class="field">
        <label>Destino</label>
        <input v-model="form.destino" required />
      </div>
      <div class="field">
        <label>Fecha de viaje</label>
        <input type="date" v-model="form.fechaViaje" required />
      </div>
      <div class="field">
        <label>Comentario (opcional)</label>
        <textarea v-model="form.comentario"></textarea>
      </div>
      <button type="submit">Enviar</button>
    </form>
    <p v-if="mensaje" class="message">{{ mensaje }}</p>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { postSolicitud } from '@/services/postSolicitud';
import router from '@/router';

const form = reactive({
  nombre: '',
  correo: '',
  origen: '',
  destino: '',
  fechaViaje: '',
  comentario: ''
});

const mensaje = ref('');

async function enviar() {
  try {
    const res = await postSolicitud(form);
    mensaje.value = `Solicitud creada con ID ${res.id}`;
    // opcional: redirigir a lista
    router.push({ name: 'tabla' });
  } catch (err) {
    mensaje.value = err.statusText || 'Error al enviar';
  }
}
</script>

<style scoped>
.form-container { max-width: 500px; margin: auto; }
.field { margin-bottom: 12px; }
.message { margin-top: 1rem; color: green; }

</style>