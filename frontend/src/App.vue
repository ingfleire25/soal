<template>
  <div>
    <Header />
    <div class="app-layout">
      <Sidebar />
      <main class="app-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Sidebar from './components/Sidebar.vue'
</script>

<style>
.app-layout { display: flex; min-height: calc(100vh - 56px); }
.app-main { flex: 1; padding: 1rem; }
</style>