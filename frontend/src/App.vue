<template>
  <!-- Vista de Login si no está autenticado -->
  <Login v-if="!authStore.isAuthenticated" />

  <!-- Cuando está autenticado mostramos la vista principal con sidebar -->
  <div v-else>
    <Header />
    <div class="app-root">
      <Sidebar />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from '@/stores/auth';
import Login from "@/views/Login.vue";
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'

const authStore = useAuthStore();

// Verificar autenticación al cargar
onMounted(() => {
  authStore.checkAuth();
});
</script>

<style>
.wrapper {
  display: flex;
}
.content {
  flex-grow: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
}

.app-root { display:flex; }
.main-content { flex:1; padding: 20px; }
</style>