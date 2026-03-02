<script setup>
import { ref, onMounted } from 'vue';
import { getSolicitudes } from '@/services/getSolicitudes';

const lista = ref([]);
const error = ref('');

onMounted(async () => {
  try {
    lista.value = await getSolicitudes();
  } catch (e) {
    error.value = e.statusText || 'No se pudieron cargar las solicitudes';
  }
});
</script>

<template>
  <div class="tabla-container">
    <h1>Solicitudes registradas</h1>
    <p v-if="error" class="error">{{ error }}</p>
    <table v-if="lista.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Origen</th>
          <th>Destino</th>
          <th>Fecha</th>
          <th>Comentario</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in lista" :key="s.id">
          <td>{{ s.nombre }}</td>
          <td>{{ s.correo }}</td>
          <td>{{ s.origen }}</td>
          <td>{{ s.destino }}</td>
          <td>{{ new Date(s.fechaViaje).toLocaleDateString() }}</td>
          <td>{{ s.comentario }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay solicitudes aún.</p>
  </div>
</template>

<style scoped>
.tabla-container { max-width: 800px; margin: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
.error { color: red; }
</style>
<style>

</style>