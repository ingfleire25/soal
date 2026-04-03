<template>
  <div class="dashboard-container">
    <h1>Panel de control</h1>
    <p>Usuario: <strong>{{ authUser.username || 'Anónimo' }}</strong></p>
    <p>Rol(es): <strong>{{ authRoles.join(', ') || 'Sin rol' }}</strong></p>

    <div class="role-feature" v-if="hasAny(['Gerente', 'Subgerente'])">
      <h3>Funcionalidades de Gestión</h3>
      <ul>
        <li>Ver reportes y métricas generales</li>
        <li>Administrar ciclos de aprobación</li>
      </ul>
    </div>

    <div class="role-feature" v-if="hasAny(['Supervisor'])">
      <h3>Funcionalidades de Supervisor</h3>
      <ul>
        <li>Revisar solicitudes en cola</li>
        <li>Asignar tareas a analistas</li>
      </ul>
    </div>

    <div class="role-feature" v-if="hasAny(['Analista'])">
      <h3>Funcionalidades de Analista</h3>
      <ul>
        <li>Completar y validar solicitudes asignadas</li>
        <li>Historial de acciones</li>
      </ul>
    </div>

    <div class="role-feature" v-if="!hasAny(['Gerente', 'Subgerente', 'Supervisor', 'Analista'])">
      <h3>Usuario sin roles conocidos</h3>
      <p>Contacte al administrador para asignar roles.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const authUser = computed(() => auth.user || {})
const authRoles = computed(() => auth.roles.value || [])

function hasAny(roles) {
  return auth.hasAnyRole(roles)
}
</script>

<style scoped>
.dashboard-container { max-width: 960px; margin: auto; }
.role-feature { margin-top: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
</style>
