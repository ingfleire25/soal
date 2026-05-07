<template>
  <div class="dashboard-container">
    <h1>Panel de control</h1>
    <p>Usuario: <strong>{{ authUser.username || 'Anónimo' }}</strong></p>
    <p>Rol(es): <strong>{{ authRoles.join(', ') || 'Sin rol' }}</strong></p>

    <div class="role-feature" v-if="hasAny(['Administrador'])">
      <h3>Funcionalidades de Administrador</h3>
      <ul>
        <li>Acceso completo al sistema</li>
        <li>Administrar usuarios y configurar permisos</li>
      </ul>
    </div>

    <div class="role-feature" v-if="hasAny(['Aprobador'])">
      <h3>Funcionalidades de Aprobador</h3>
      <ul>
        <li>Aprobar o rechazar solicitudes pendientes</li>
        <li>Ver el plan general y los detalles de solicitud</li>
      </ul>
    </div>

    <div class="role-feature" v-if="hasAny(['Solicitante'])">
      <h3>Funcionalidades de Solicitante</h3>
      <ul>
        <li>Crear solicitudes</li>
        <li>Ver y editar sus propias solicitudes pendientes</li>
        <li>Responder evaluaciones y ver el plan</li>
      </ul>
    </div>

    <div class="role-feature" v-if="!hasAny(['Administrador', 'Aprobador', 'Solicitante'])">
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
