import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/stores/auth'

const Login = () => import('@/views/Login.vue')
const Solicitudes = () => import('@/views/Solicitudes.vue')
const AsignarSupervisor = () => import('@/views/AsignarSupervisor.vue')
const Estadisticas = () => import('@/views/Estadisticas.vue')

// const routes = [
//   //{ path: '/', redirect: '/solicitudes' },
//   { path: '/login', name: 'login', component: Login, meta: { requiresGuest: true }},
//   { path: '/solicitudes', name: 'solicitudes', component: Solicitudes, meta: { requiresAuth: true, allowedRoles: ['admin','supervisor','analista','invitado'] }},
//   { path: '/asignarAnalista', name: 'asignarAnalista', component: () => import('@/components/AsignarAnalista.vue'), meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] }},
//   { path: '/AsignarSupervisores', name: 'AsignarSupervisores', component: AsignarSupervisor, meta: { requiresAuth: true, allowedRoles: ['admin'] }},
//   { path: '/estadisticas', name: 'estadisticas', component: Estadisticas, meta: { requiresAuth: true, allowedRoles: ['admin','supervisor','analista'] }},
//   //{ path: '/no-autorizado', name: 'no-autorizado', component: () => import('@/views/NoAutorizado.vue')},
//   //{ path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFoundView.vue')},
// ];

const routes = [
  { path: '/', redirect: '/solicitudes' },
  { path: '/crear-solicitud', name: 'crear-solicitud', component: () => import('@/views/CrearSolicitud.vue') },
  { path: '/login', name: 'login', component: Login, meta: { requiresGuest: true }},
  { path: '/solicitudes', name: 'solicitudes', component: Solicitudes, meta: { requiresAuth: true, allowedRoles: ['admin','supervisor','analista','invitado'] }},
  { path: '/asignarAnalista', name: 'asignarAnalista', component: () => import('@/components/AsignarAnalista.vue'), meta: { requiresAuth: true, allowedRoles: ['admin','supervisor'] }},
  { path: '/AsignarSupervisores', name: 'AsignarSupervisores', component: AsignarSupervisor, meta: { requiresAuth: true, allowedRoles: ['admin'] }},
  { path: '/estadisticas', name: 'estadisticas', component: Estadisticas, meta: { requiresAuth: true, allowedRoles: ['admin','supervisor','analista'] }},
  { path: '/no-autorizado', name: 'no-autorizado', component: () => import('@/views/NoAutorizado.vue')},
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFoundView.vue')},
];

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/gadet/' : '/'),
  routes,
})

// Guard de navegación
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Auth checks
  if (to.meta && to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login' }
  }
  if (to.meta && to.meta.requiresGuest && isAuthenticated) {
    return { name: 'solicitudes' }
  }

  // Avoid checking for the no-autorizado route to prevent loops
  if (to.name === 'no-autorizado') return true

  // Role-based checks
  const allowed = to.meta && to.meta.allowedRoles
  if (allowed && Array.isArray(allowed) && allowed.length > 0) {
    // Build user roles set similar to Sidebar
    const u = authStore.user || {}
    // Prefer readable `roles` (strings) over numeric `co_roles`
    const rolesRaw = u.roles || u.co_roles || u.rolesArray || []
    const userRoles = new Set()
    if (Array.isArray(rolesRaw)) {
      rolesRaw.forEach(r => {
        if (!r) return
        let name = ''
        if (typeof r === 'string') name = r
        else if (r.tx_nombre) name = r.tx_nombre
        else if (r.name) name = r.name
        name = String(name).toLowerCase()
        if (name.includes('admin') || name.includes('administrador')) userRoles.add('admin')
        else if (name.includes('supervisor')) userRoles.add('supervisor')
        else if (name.includes('analista')) userRoles.add('analista')
        else if (name.includes('invit')) userRoles.add('invitado')
      })
    } else if (typeof rolesRaw === 'string') {
      const n = rolesRaw.toLowerCase()
      if (n.includes('admin')) userRoles.add('admin')
      else if (n.includes('supervisor')) userRoles.add('supervisor')
      else if (n.includes('analista')) userRoles.add('analista')
      else if (n.includes('invit')) userRoles.add('invitado')
    }

    // Default unauthenticated users to 'invitado'
    if (userRoles.size === 0 && !isAuthenticated) userRoles.add('invitado')

    // Admin bypass
    if (userRoles.has('admin')) return true

    // Check intersection
    const ok = allowed.some(ar => userRoles.has(ar))
    if (!ok) {
      // No permission -> if not authenticated send to login, else to no-autorizado
      if (!isAuthenticated) return { name: 'login' }
      return { name: 'no-autorizado' }
    }
  }

  return true
})


export default router;