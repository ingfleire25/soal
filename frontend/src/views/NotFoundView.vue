<!-- src/views/NotFoundView.vue -->
<template>
    <div class="card card-styles">
      <div class="card-header">
        <h3 class="card-title" style="color:brown">Esta ruta no existe</h3>
      </div>
      <div class="card-body">
        <div class="not-found">
            <h1>404 - Página no encontrada</h1>
            <p>La página que buscas no existe o fue movida.</p>
            <router-link to="/" class="btn"> <i class="fas fa-undo"></i> Volver al inicio</router-link>
        </div>
      </div>
    </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 2rem;
  margin-top: 50px;
}
h1 {
  color: #dc3545;
}
.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
</style>