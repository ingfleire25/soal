<template>
  <!-- Vista de Login si no está autenticado -->
  <Login v-if="!authStore.isAuthenticated" />
  
  <!-- Layout principal cuando está autenticado -->
  <div v-else>
    <Header @toggle-sidebar="toggleSidebar" />
    <div class="wrapper">
      <Sidebar :collapsed="isSidebarCollapsed" />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from '@/stores/auth';
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import Login from "@/views/Login.vue";

const authStore = useAuthStore();
const isSidebarCollapsed = ref(false);

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}

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
</style>