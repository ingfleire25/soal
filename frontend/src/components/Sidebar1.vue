<template>
  <aside class="app-sidebar">
    
    <nav class="menu">
      <ul>
        <Sidebaritem
          v-for="item in filteredMenuItems"
          :key="item.id"
          :icon="item.icon"
          :text="item.title"
          :to="{ name: item.routeName }"
        />
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import menuData from '@/data/menu.json'
import Sidebaritem from './Sidebaritem.vue'

const authStore = useAuthStore()
const rawMenuItems = menuData.menuItems || []

// Permisos por nombre de ruta (routeName -> roles permitidos)
// Usamos claves normalizadas en minúsculas: 'admin', 'supervisor', 'analista', 'invitado'
const permissions = {
  solicitudes: ['admin', 'supervisor', 'analista', 'invitado'],
  asignaranalista: ['admin', 'supervisor'],
  estadisticas: ['admin', 'supervisor', 'analista'],
  asignarsupervisores: ['admin']
}

function normalizeRoleName(r) {
  if (!r) return ''
  const s = String(r).toLowerCase()
  if (s.includes('admin') || s.includes('administrador')) return 'admin'
  if (s.includes('supervisor')) return 'supervisor'
  if (s.includes('analista')) return 'analista'
  if (s.includes('invit') || s.includes('invitado') || s.includes('guest')) return 'invitado'
  return s
}

function getUserRolesSet() {
  const u = authStore.user || {}
  const rolesRaw = u.co_roles || u.roles || u.rolesArray || []
  const set = new Set()
  if (!rolesRaw) return set
  if (Array.isArray(rolesRaw)) {
    rolesRaw.forEach(r => {
      if (!r) return
      if (typeof r === 'string') set.add(normalizeRoleName(r))
      else if (r.tx_nombre) set.add(normalizeRoleName(r.tx_nombre))
      else if (r.name) set.add(normalizeRoleName(r.name))
    })
  } else if (typeof rolesRaw === 'string') {
    set.add(normalizeRoleName(rolesRaw))
  }
  return set
}

const filteredMenuItems = computed(() => {
  const roles = getUserRolesSet()
  // If no roles and not authenticated, treat as 'invitado'
  if ((!roles || roles.size === 0) && !authStore.isAuthenticated) roles.add('invitado')

  // If admin present, return all
  if (roles.has('admin')) return rawMenuItems

  // Otherwise filter according to permissions; items without explicit permission are visible
  return rawMenuItems.filter(item => {
    const rnRaw = item.routeName
    if (!rnRaw) return true
    const rn = String(rnRaw).toLowerCase()
    const allowed = permissions[rn]
    if (!allowed) return true
    return allowed.some(ar => roles.has(ar))
  })
})
</script>

<style scoped>
.app-sidebar { width: 260px; background: #f8f9fb; padding: 0; box-shadow: 2px 0 6px rgba(0,0,0,0.06); min-height: 100vh; }
.cintillo img { width: 100%; display:block; }
.logo-wrap { padding: 0.75rem; }
.logo-img { max-width: 140px; }
.menu { padding: 0.5rem 0; }
.menu ul { list-style: none; margin: 0; padding: 0; }
.sidebar-item { margin-bottom: 0.25rem; }
</style>
