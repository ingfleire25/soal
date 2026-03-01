import { createRouter, createWebHistory } from "vue-router";

// two simple views: create request and see list
const Crear = () => import('@/views/CrearSolicitud.vue');
const Tabla = () => import('@/views/Solicitudes.vue');

const routes = [
  { path: '/', redirect: '/crear' },
  { path: '/crear', name: 'crear', component: Crear },
  { path: '/solicitudes', name: 'tabla', component: Tabla }
];

export default createRouter({
  history: createWebHistory(),
  routes
});