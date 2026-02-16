import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/stores/auth'

const Login = () => import('@/views/Login.vue')
const Solicitudes = () => import('@/views/Solicitudes.vue')
const AsignarSupervisor = () => import('@/views/AsignarSupervisor.vue')
const Estadisticas = () => import('@/views/Estadisticas.vue')

const routes = [
  { path: '/login', name: 'login', component: Login, meta: { requiresGuest: true }},
  { path: '/solicitudes', name: 'solicitudes', component: Solicitudes},
  { path: '/asignarAnalista', name: 'asignarAnalista', component: () => import('@/components/AsignarAnalista.vue')},
  { path: '/AsignarSupervisores', name: 'AsignarSupervisores', component: AsignarSupervisor},
  { path: '/estadisticas', name: 'estadisticas', component: Estadisticas},
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/NotFoundView.vue')},
];

const router = createRouter({
  history: createWebHistory(process.env.NODE_ENV === 'production' ? '/gadet/' : '/'),
  routes,
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  } 
})


export default router;