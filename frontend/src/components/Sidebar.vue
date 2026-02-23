<template>
  <aside id="sidebar" :class="{ 'expand': isExpanded, 'collapsed': !isExpanded }">
    <div class="my-3"></div>
    <div class="btn-group mx-3" id="m-usuario">
      <button class="btn btn-blanco1-usr dropdown-toggle d-flex sidebar-item" 
              type="button" 
              id="dropdownMenuButton" 
              data-bs-toggle="dropdown" 
              aria-expanded="false" 
              style="border: 0; border-radius: 9px;">
        <i class="icon-preview material-icons">perm_identity</i>
        <span class="d-none d-md-inline" :class="{ 'd-none': !isExpanded }">
          {{ userDisplay || 'Usuario' }}
        </span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <li v-if="isAuth">
          <a class="dropdown-item d-flex align-items-center" href="#" @click.prevent="handleLogout">
            <i class="material-icons me-2">input</i>
            <span style="font-size: 0.89rem;">Cerrar Sesión</span>
          </a>
        </li>
        <li v-else>
          <router-link class="dropdown-item d-flex align-items-center" to="/login">
            <i class="material-icons me-2">login</i>
            <span style="font-size: 0.89rem;">Iniciar Sesión</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="btn-group dropend">
      <button type="button" class="btn btn-blanco1 dropdown-toggle icon-preview3" 
              data-bs-toggle="dropdown" aria-expanded="false">
        <i class="material-icons">perm_identity</i>
      </button>
      <ul class="dropdown-menu">
        <li v-if="isAuth">
          <a class="dropdown-item d-flex align-items-center" href="#" @click.prevent="handleLogout">
            <i class="material-icons">input</i>
            <span style="font-size: 0.89rem;">Cerrar Sesión</span>
          </a>
        </li>
        <li v-else>
          <router-link class="dropdown-item d-flex align-items-center" to="/login">
            <i class="material-icons">login</i>
            <span style="font-size: 0.89rem;">Iniciar Sesión</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="d-flex mt-5">
      <div class="col-md-3" id="the-avenger">
        <button class="toggle-btn" type="button" @click="toggleSidebar">
          <div class="icon-preview col s6 m3">
            <i class="material-icons" style="color: var(--rojo1);">menu</i>
            <span id="titulo-menu" class="ms-1 fw-bold" 
                  :class="{ 'd-none': !isExpanded }" 
                  style="color:var(--rojo1);">MENÚ</span>
          </div>
        </button>
      </div>
    </div>
    <hr class="mx-3 my-0" style="border:1px solid black;opacity:1;" />
    
    <!-- Menú dinámico -->
    <ul class="sidebar-nav" id="the-hr">
      <li v-for="item in visibleMenuItems" :key="item.id" 
          :class="['sidebar-item', item.id ? `sidebar-item-${item.id}` : '']">
        
        <!-- Elemento simple del menú -->
        <a v-if="item.type === 'simple'" 
           href="#" 
           class="sidebar-link"
           @click="navigateTo(item.routeName)">
          <div class="icon-preview col s6 m3">
            <i v-if="item.icon !== 'img'" class="material-icons">{{ item.icon }}</i>
            <img v-else :src="getImageUrl(item.iconSrc)" :alt="item.title" width="23" height="23">
            <span :class="{ 'd-none': !isExpanded }">{{ item.title }}</span>
          </div>
        </a>
        
        <!-- Elemento dropdown del menú -->
        <div v-else-if="item.type === 'dropdown'">
          <a :href="`#${item.collapseId}`" 
             class="sidebar-link" 
             data-bs-toggle="collapse">
            <div class="icon-preview col s6 m3">
              <i class="material-icons">{{ item.icon }}</i>
              <span :class="{ 'd-none': !isExpanded }">{{ item.title }}</span>
            </div>
          </a>
          <ul :id="item.collapseId" 
              class="sidebar-dropdown list-unstyled collapse" 
              data-bs-parent="#sidebar">
            <li v-for="child in item.children" 
                :key="child.id" 
                class="sidebar-item" 
                style="margin-left: 5%;">
              <a href="#" 
                 class="sidebar-link"
                 @click="navigateTo(child.routeName)">
                <div class="icon-preview2 col s6 m3">
                  <i v-if="child.icon !== 'img'" class="material-icons">{{ child.icon }}</i>
                  <img v-else :src="getImageUrl(child.iconSrc)" :alt="child.title" width="23" height="23">
                  <span :class="{ 'd-none': !isExpanded }">{{ child.title }}</span>
                </div>
              </a>
            </li>
          </ul>
        </div>
        
      </li>
    </ul>

  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import MaterializeIcon from '@/assets/icons/Materialize-32x32.png';
import BootstrapIcon from '@/assets/icons/Bootstrap-32x32.png';

// Mapa de imágenes
const imageMap = {
  'Materialize-32x32.png': MaterializeIcon,
  'Bootstrap-32x32.png': BootstrapIcon
};

const router = useRouter();
const authStore = useAuthStore()
const isExpanded = ref(true);
const menuItems = ref([]);
const visibleMenuItems = ref([])
const isAuth = computed(() => authStore.isAuthenticated)
const userDisplay = computed(() => {
  const u = authStore.user
  if (!u) return ''
  return u.nombre || u.displayName || u.indicador || u.username || ''
})

// Función de navegación
function navigateTo(routeName) {
  if (routeName) {
    router.push({ name: routeName });
  }
}

// Cargar menú desde JSON
async function loadMenu() {
  try {
    const response = await import('@/data/menu.json');
    menuItems.value = response.menuItems;
  } catch (error) {
    console.error('Error cargando el menú:', error);
    // Menú por defecto en caso de error
    menuItems.value = [
      {
        id: 'home',
        title: 'Inicio',
        icon: 'home',
        routeName: 'home',
        type: 'simple'
      }
    ];
  }
}

const imageModules = import.meta.glob('@/assets/icons/*.png', { eager: true });

// Función mejorada para cargar imágenes
// Función simplificada
function getImageUrl(path) {
  const fileName = path.includes('/') ? path.split('/').pop() : path;
  //console.log('Loading image:', fileName);
  
  if (imageMap[fileName]) {
    return imageMap[fileName];
  }
  
  //console.warn('Image not found in map:', fileName);
  return '';
}

function toggleSidebar() {
  isExpanded.value = !isExpanded.value;
}

function handleLogout() {
  // Clear auth state and redirect to login
  authStore.logout()
  router.push('/login')
}

function handleResize() {
  if (window.innerWidth < 768) {
    isExpanded.value = false;
  } else {
    isExpanded.value = true;
  }
}

onMounted(() => {
  loadMenu();
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

// Recalcular visibilidad cuando cambia el usuario o el menú
watch([() => authStore.user, menuItems], () => {
  computeVisibleMenu()
}, { immediate: true })

function computeVisibleMenu() {
  const u = authStore.user || {}
  const userRolesRaw = u.roles || u.co_roles || []
  // Normalizar a set de nombres cortos en minúscula
  const userRoles = new Set()
  if (Array.isArray(userRolesRaw)) {
    userRolesRaw.forEach(r => {
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
  }

  // Helper para comprobar acceso a una ruta por nombre
  function hasAccessToRoute(routeName) {
    if (!routeName) return true
    const r = router.getRoutes().find(x => x.name === routeName)
    if (!r) return true
    const meta = r.meta || {}
    // Si requiere autenticación y el usuario no está autenticado -> ocultar
    if (meta.requiresAuth && !authStore.isAuthenticated) return false
    const allowed = meta.allowedRoles
    if (!allowed || !Array.isArray(allowed) || allowed.length === 0) return true
    // Admin bypass
    if (userRoles.has('admin')) return true
    // Intersección
    return allowed.some(ar => userRoles.has(ar))
  }

  const out = []
  menuItems.value.forEach(item => {
    if (item.type === 'simple') {
      if (hasAccessToRoute(item.routeName)) out.push(item)
    } else if (item.type === 'dropdown') {
      const children = (item.children || []).filter(c => hasAccessToRoute(c.routeName))
      if (children.length > 0) {
        out.push({ ...item, children })
      }
    } else {
      out.push(item)
    }
  })

  visibleMenuItems.value = out
}
</script>

<style scoped>
#sidebar {
  background: #c3c7d1;
  min-height: 100vh;
  transition: all 0.3s ease;
  width: 250px;
}

#sidebar.collapsed {
  width: 80px;
}

#sidebar.collapsed .sidebar-link span,
#sidebar.collapsed .dropdown-toggle span {
  display: none !important;
}

#sidebar.collapsed .sidebar-nav .sidebar-item {
  text-align: center;
}

#sidebar.collapsed .icon-preview {
  justify-content: center;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Asegurar que los iconos se centren cuando el sidebar está colapsado */
#sidebar.collapsed .icon-preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Ajustar el padding cuando está colapsado */
#sidebar.collapsed .sidebar-item {
  padding: 10px 0;
}

/* Ocultar flechas de dropdown cuando está colapsado */
#sidebar.collapsed .dropdown-toggle::after {
  display: none;
}
</style>