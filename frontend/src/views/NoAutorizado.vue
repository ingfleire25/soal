<template>
  <div class="card card-styles">
    <div class="card-header">
      <h3 class="card-title" style="color:darkred">No Autorizado</h3>
    </div>
    <div class="card-body">
      <div class="not-authorized">
        <h1>403 - No autorizado</h1>
        <p>No tienes permisos para ver esta página.</p>
        <router-link :to="{ name: 'solicitudes' }" class="btn btn-primary">Volver a Solicitudes</router-link>
        <router-link :to="{ name: 'login' }" class="btn btn-link ms-2">Cerrar sesión / Cambiar usuario</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// simple static view
</script>

<style scoped>
.not-authorized { text-align:center; padding:2rem; margin-top:50px }
.not-authorized h1 { color:#dc3545 }
.btn { margin-top: 1rem }
</style>
