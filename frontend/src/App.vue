<template>
  <!-- Mostrar siempre el router-view (rutas públicas funcionarán) -->
  <div>
    <Header v-if="authStore.isAuthenticated" />
    <div class="app-root">
      <Sidebar v-if="authStore.isAuthenticated" />
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