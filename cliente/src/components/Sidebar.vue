<template>
  <aside id="sidebar" :class="{ 'collapsed': !isExpanded }">
    <div class="sidebar-top px-3 py-2">
      <button class="toggle-btn" @click="toggleSidebar">
        <i class="material-icons">menu</i>
        <span v-if="isExpanded" class="ms-2 fw-bold">MENÚ</span>
      </button>
    </div>

    <hr />

    <ul class="sidebar-nav p-0 m-0">
      <li class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center px-3" @click.prevent="navigateTo('crear')">
          <i class="material-icons">add_circle</i>
          <span v-if="isExpanded" class="link-text ms-2">Crear Solicitud</span>
        </a>
      </li>
      <li class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center px-3" @click.prevent="navigateTo('tabla')">
          <i class="material-icons">list</i>
          <span v-if="isExpanded" class="link-text ms-2">Ver Solicitudes</span>
        </a>
      </li>
    </ul>
  </aside>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// Cambiamos a true por defecto para que inicie abierta en desktop
const isExpanded = ref(true)

function toggleSidebar() {
  isExpanded.value = !isExpanded.value
}

function navigateTo(name) {
  if (name) router.push({ name })
}

// Lógica de responsividad
const handleResize = () => {
  isExpanded.value = window.innerWidth >= 768
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
#sidebar {
  width: 240px;
  background: #f5f5f5;
  min-height: 100vh;
  transition: width 0.3s ease;
  /* overflow-x: hidden; Evita que el texto "asome" durante la transición */
}

/* Cuando está colapsado, reducimos el ancho */
#sidebar.collapsed {
  width: 80px;
}

.sidebar-top {
  display: flex;
  align-items: center;
  height: 60px;
}

.toggle-btn {
  background: transparent;
  border: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.sidebar-nav {
  list-style: none;
}

.sidebar-item {
  width: 100%;
}

.sidebar-link {
  color: #333;
  text-decoration: none;
  height: 50px;
  transition: background 0.2s;
}

.sidebar-link:hover {
  background: #e0e0e0;
}

/* Eliminamos la regla que forzaba el display:none por CSS 
   para dejar que v-if de Vue maneje la lógica del DOM */
</style>