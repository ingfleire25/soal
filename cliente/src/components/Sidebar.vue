<!-- modificado por leonardo fleire 27/03/2026 -->

<template>
  <aside id="sidebar" :class="{ 'collapsed': !isExpanded }">
    <div class="sidebar-top px-3 py-2">
      <button class="toggle-btn" @click="toggleSidebar">
        <i class="material-icons">menu</i>
        <span v-if="isExpanded" class="ms-2 fw-bold">MENÚ</span>
      </button>
    </div>

    <hr />
    <div class="px-3 py-2 user-info">
      <small>Usuario: <strong>{{ username }}</strong></small><br>
      <small>Rol: <strong>{{ (auth.user?.value?.roles || []).join(', ') || 'N/A' }}</strong></small>
    </div>
    <hr />

   <ul class="sidebar-nav p-0 m-0">  <!-- Todo el cuerpo del sidebar -->
      <li class="sidebar-item"><!-- LI para crear solicitudes -->
        <a href="#" class="sidebar-link d-flex align-items-center justify-content-between px-3" 
           @click.prevent="toggleSubmenu('crear')">
          <div class="d-flex align-items-center">
            <i class="material-icons">add_circle</i>
            <span v-if="isExpanded" class="link-text ms-2">Crear Solicitudes</span>
          </div>
          <i v-if="isExpanded" class="material-icons arrow-icon" :class="{ 'rotate': submenus.crear }">expand_more</i>
        </a>

        <ul v-if="isExpanded && submenus.crear" class="submenu p-0">
          
          <li class="sidebar-item">
            <a href="#" class="sidebar-link d-flex align-items-center justify-content-between ps-4 pe-3" 
               @click.prevent="toggleSubmenu('transporte')">
              <div class="d-flex align-items-center">
                <i class="material-icons">directions_bus</i>
                <span class="link-text ms-2">Transporte de personal</span>
              </div>
              <i class="material-icons arrow-icon" :class="{ 'rotate': submenus.transporte }">expand_more</i>
            </a>
            
            <ul v-if="submenus.transporte" class="submenu-inner p-0">
              <li>
                <a href="#" class="sidebar-link ps-5" @click.prevent="navigateTo('transporte-ocasional','crear')">
                  <span class="link-text small">• Ocasional</span>
                </a>
              </li>
              <li>
                <a href="#" class="sidebar-link ps-5" @click.prevent="navigateTo('transporte-recurrente','crear')">
                  <span class="link-text small">• Recurrente</span>
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#" class="sidebar-link ps-4" @click.prevent="navigateTo('movimiento-unidades')">
              <i class="material-icons">local_shipping</i>
              <span class="link-text ms-2">Unidades Mayores</span>
            </a>
          </li>
          <li>
            <a href="#" class="sidebar-link ps-4" @click.prevent="navigateTo('suministro-lacustre')">
              <i class="material-icons">water</i>
              <span class="link-text ms-2">Suministro Lacustre</span>
            </a>
          </li>
          <li>
            <a href="#" class="sidebar-link ps-4" @click.prevent="navigateTo('servicios-portuarios')">
              <i class="material-icons">anchor</i>
              <span class="link-text ms-2">Servicios Portuarios</span>
            </a>
          </li>
        </ul>
      </li><!-- LI cierra crear solicitudes -->

      <li class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center justify-content-between px-3" 
           @click.prevent="navigateTo('ver-todas')">
          <div class="d-flex align-items-center">
            <i class="material-icons">add_circle</i>
            <span v-if="isExpanded" class="link-text ms-2">Ver Solicitudes</span>
          </div>
          <i v-if="isExpanded" class="material-icons arrow-icon" :class="{ 'rotate': submenus.tabla }">expand_more</i>
        </a>

        <ul v-if="isExpanded && submenus.tabla" class="submenu p-0">
          
          <li class="sidebar-item">
            <a href="#" class="sidebar-link d-flex align-items-center justify-content-between ps-4 pe-3" 
               @click.prevent="toggleSubmenu('transporte')">
              <div class="d-flex align-items-center">
                <i class="material-icons">directions_bus</i>
                <span class="link-text ms-2">Transporte de personal</span>
              </div>
              <i class="material-icons arrow-icon" :class="{ 'rotate': submenus.transporte }">expand_more</i>
            </a>
            
            <ul v-if="submenus.transporte" class="submenu-inner p-0">
              <li>
                <a href="#" class="sidebar-link ps-5" @click.prevent="navigateTo('transporte-ocasional','ver')">
                  <span class="link-text small">• Ocasional</span>
                </a>
              </li>
              <li>
                <a href="#" class="sidebar-link ps-5" @click.prevent="navigateTo('transporte-recurrente','ver')">
                  <span class="link-text small">• Recurrente</span>
                </a>
              </li>
            </ul>
          </li>

          <li>
            <a href="#" class="sidebar-link ps-4" @click.prevent="navigateTo('movimiento-unidades', 'ver')">
              <i class="material-icons">local_shipping</i>
              <span class="link-text ms-2">Unidades mayores</span>
            </a>
          </li>
          <li>
            <a href="#" class="sidebar-link ps-4" @click.prevent="navigateTo('suministro-lacustre', 'ver')">
              <i class="material-icons">water</i>
              <span class="link-text ms-2">Suministro lacustre</span>
            </a>
          </li>
          <li>
            <a href="#" class="sidebar-link ps-4" @click.prevent="navigateTo('servicios-portuarios', 'ver')">
              <i class="material-icons">anchor</i>
              <span class="link-text ms-2">Servicios portuarios</span>
            </a>
          </li>
        </ul>
      </li>
      <!-- LI para ODST -->
      <li v-if="isSupervisor || isGerente || isSubgerente" class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center justify-content-between px-3" 
           @click.prevent="toggleSubmenu('ODTS')">
          <div class="d-flex align-items-center">
            <i class="material-icons">add_circle</i>
            <span v-if="isExpanded" class="link-text ms-2">ODST</span>
          </div>
          <i v-if="isExpanded" class="material-icons arrow-icon" :class="{ 'rotate': submenus.ODTS }">expand_more</i>
        </a>
      </li>
      <!-- LI para PLAN -->
      <li v-if="isGerente || isSubgerente" class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center justify-content-between px-3" 
           @click.prevent="navigateTo('crearViejo')">
          <div class="d-flex align-items-center">
            <i class="material-icons">add_circle</i>
            <span v-if="isExpanded" class="link-text ms-2">PLAN</span>
          </div>
          <i v-if="isExpanded" class="material-icons arrow-icon" :class="{ 'rotate': submenus.plan }">expand_more</i>
        </a>
      </li>
      <!-- LI para Evaluacion -->
      <li v-if="isGerente || isSubgerente || isSupervisor || isAnalista" class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center justify-content-between px-3" 
           @click.prevent="toggleSubmenu('evaluacion')">
          <div class="d-flex align-items-center">
            <i class="material-icons">add_circle</i>
            <span v-if="isExpanded" class="link-text ms-2">Evaluacion</span>
          </div>
          <i v-if="isExpanded" class="material-icons arrow-icon" :class="{ 'rotate': submenus.evaluacion }">expand_more</i>
        </a>
      </li>
      <!-- LI para Administracion -->
      <li v-if="isGerente" class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center justify-content-between px-3" 
           @click.prevent="navigateTo('administracion')">
          <div class="d-flex align-items-center">
            <i class="material-icons">admin_panel_settings</i>
            <span v-if="isExpanded" class="link-text ms-2">Administracion</span>
          </div>
        </a>
      </li>
      <!-- LI para ayuda -->
      <li class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center justify-content-between px-3" 
           @click.prevent="toggleSubmenu('ayuda')">
          <div class="d-flex align-items-center">
            <i class="material-icons">add_circle</i>
            <span v-if="isExpanded" class="link-text ms-2">Ayuda</span>
          </div>
          <i v-if="isExpanded" class="material-icons arrow-icon" :class="{ 'rotate': submenus.ayuda }">expand_more</i>
        </a>
      </li>

      <!-- Logout -->
      <li class="sidebar-item">
        <a href="#" class="sidebar-link d-flex align-items-center justify-content-between px-3" @click.prevent="auth.logout()">
          <div class="d-flex align-items-center">
            <i class="material-icons">logout</i>
            <span v-if="isExpanded" class="link-text ms-2">Cerrar sesión</span>
          </div>
        </a>
      </li>

    </ul><!-- cierre del cuerpo del sidebar -->
  </aside>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const isExpanded = ref(true)

const isGerente = computed(() => auth.hasRole('Gerente'))
const isSubgerente = computed(() => auth.hasRole('Subgerente'))
const isSupervisor = computed(() => auth.hasRole('Supervisor'))
const isAnalista = computed(() => auth.hasRole('Analista'))

const username = computed(() => (auth.user?.value?.username) || 'Invitado')

// Estado para controlar qué menús están abiertos
const submenus = reactive({
  crear: false,
  transporte: false
})

function toggleSidebar() {
  isExpanded.value = !isExpanded.value
  // Si cerramos el sidebar, cerramos los submenús para que no se vean raros al reabrir
  if (!isExpanded.value) {
    submenus.crear = false
    submenus.transporte = false
  }
}

function toggleSubmenu(menu) {
  // Si el sidebar está colapsado, lo abrimos primero
  if (!isExpanded.value) {
    isExpanded.value = true
  }
  submenus[menu] = !submenus[menu]
}

function navigateTo(name, mode = 'crear') {
  if (name === 'transporte-ocasional') {
    if (mode === 'crear') {
      router.push({ name: 'transporte-personal', query: { subtipo: 'Ocasional' } });
    } else {
      router.push({ name: 'tabla', query: { tipoSolicitud: 'Transporte de Personal', subtipo: 'Ocasional' } });
    }
  } else if (name === 'transporte-recurrente') {
    if (mode === 'crear') {
      router.push({ name: 'transporte-personal', query: { subtipo: 'Recurrente' } });
    } else {
      router.push({ name: 'tabla', query: { tipoSolicitud: 'Transporte de Personal', subtipo: 'Recurrente' } });
    }
  } else if (name === 'movimiento-unidades') {
    if (mode === 'crear') {
      router.push({ name: 'movimiento-unidades-mayores' });
    } else {
      router.push({ name: 'tabla', query: { tipoSolicitud: 'Movimiento Unidades Mayores' } });
    }
  } else if (name === 'suministro-lacustre') {
    if (mode === 'crear') {
      router.push({ name: 'suministro-lacustre' });
    } else {
      router.push({ name: 'tabla', query: { tipoSolicitud: 'Suministro Lacustre' } });
    }
  } else if (name === 'servicios-portuarios') {
    if (mode === 'crear') {
      router.push({ name: 'crear-servicios-portuarios' });
    } else {
      router.push({ name: 'tabla', query: { tipoSolicitud: 'Servicios Portuarios' } });
    }
  } else if (name === 'ver-todas') {
    router.push({ name: 'tabla' });
  } else if (name === 'administracion') {
    router.push({ name: 'administracion' });
  } else if (name === 'crearViejo') {
    router.push({ name: 'crearViejo' });
  } else {
    router.push({ name });
  }
}

const handleResize = () => {
  isExpanded.value = window.innerWidth >= 768
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
#sidebar {
  width: 284px; /* Un poco más ancho para acomodar el texto largo */
  background: #f5f5f5;
  min-height: 100vh;
  transition: width 0.3s ease;
}

#sidebar.collapsed {
  width: 80px;
}

.sidebar-top {
  display: flex;
  align-items: center;
  height: 60px;
}

.toggle-btn {
  background: transparent;
  border: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
}

.sidebar-nav {
  list-style: none;
}

.sidebar-link {
  color: #333;
  text-decoration: none;
  min-height: 50px;
  display: flex;
  align-items: center;
  transition: background 0.2s;
  cursor: pointer;
}

.sidebar-link:hover {
  background: #e0e0e0;
}

/* Estilos de Submenús */
.submenu, .submenu-inner {
  list-style: none;
  background: #ededed; /* Color ligeramente distinto para notar profundidad */
}

.submenu-inner {
  background: #e5e5e5;
}

.link-text {
  white-space: nowrap;
  font-size: 0.95rem;
}

.small {
  font-size: 0.85rem;
}

.arrow-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.rotate {
  transform: rotate(180deg);
}
</style>