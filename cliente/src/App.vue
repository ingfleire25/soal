<template>
  <!-- Mostrar siempre el router-view (rutas públicas funcionarán) -->
  <div>
    <Header v-if="authStore.isAuthenticated.value" />
    <div class="app-root">
      <Sidebar v-if="authStore.isAuthenticated.value" />
      <main class="main-content">
        <router-view :key="$route.fullPath" />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Sidebar from '@/components/Sidebar.vue'
import Header from '@/components/Header.vue'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.checkAuth) authStore.checkAuth()
})
</script>

<style>
.app-root { display: flex; }
.main-content { flex: 1; padding: 20px; transition: margin-left 0.3s ease; }
</style>