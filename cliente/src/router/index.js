import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from '@/stores/auth';

// two simple views: create request and see list
const Login = () => import('@/views/Login.vue');
const Crear = () => import('@/views/CrearSolicitud.vue');
const Tabla = () => import('@/views/Solicitudes.vue');
const Dashboard = () => import('@/views/Dashboard.vue');
const Administracion = () => import('@/views/Administracion.vue');
const NoAutorizado = () => import('@/views/NoAutorizado.vue');
const TransportePersonal = () => import('@/components/TransportePersonal.vue');
const MovimientoUnidadesMayores = () => import('@/components/MovimientoUnidadesMayores.vue');
const SuministroLacustre = () => import('@/components/SuministroLacustre.vue');
const ServiciosPortuarios = () => import('@/components/ServiciosPortuarios.vue');

const routes = [
  { path: '/', redirect: '/iniciar-sesion' },
  { path: '/iniciar-sesion', name: 'login', component: Login },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { roles: ['Gerente', 'Subgerente', 'Supervisor', 'Analista'] }
  },
  {
    path: '/crearViejo',
    name: 'crearViejo',
    component: Crear,
    meta: { roles: ['Gerente', 'Subgerente', 'Supervisor', 'Analista'] }
  },
  {
    path: '/solicitudes',
    name: 'tabla',
    component: Tabla,
    meta: { roles: ['Gerente', 'Subgerente', 'Supervisor', 'Analista'] }
  },
  {
    path: '/administracion',
    name: 'administracion',
    component: Administracion,
    meta: { roles: ['Gerente'] }
  },
  {
    path: '/crear/transporte-personal',
    name: 'transporte-personal',
    component: TransportePersonal,
    meta: { roles: ['Gerente', 'Subgerente', 'Supervisor', 'Analista'] }
  },
  {
    path: '/crear/movimiento-unidades-mayores',
    name: 'movimiento-unidades-mayores',
    component: MovimientoUnidadesMayores,
    meta: { roles: ['Gerente', 'Subgerente', 'Supervisor', 'Analista'] }
  },
  {
    path: '/crear/suministro-lacustre',
    name: 'suministro-lacustre',
    component: SuministroLacustre,
    meta: { roles: ['Gerente', 'Subgerente', 'Supervisor', 'Analista'] }
  },
  {
    path: '/crear/servicios-portuarios',
    name: 'crear-servicios-portuarios',
    component: ServiciosPortuarios,
    meta: { roles: ['Gerente', 'Subgerente', 'Supervisor', 'Analista'] }
  },
  {
    path: '/no-autorizado',
    name: 'no-autorizado',
    component: NoAutorizado
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from) => {
  const auth = useAuthStore();

  if (to.name === 'login') {
    if (auth.isAuthenticated.value) {
      return { name: 'dashboard' };
    }
    return true;
  }

  if (!auth.isAuthenticated.value) {
    return { name: 'login' };
  }

  const requiredRoles = to.meta?.roles;
  if (requiredRoles && requiredRoles.length > 0 && !auth.hasAnyRole(requiredRoles)) {
    return { name: 'no-autorizado' };
  }

  return true;
});

export default router;