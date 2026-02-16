<template>
  <div class="login-container">
    <!-- Header -->
    <header class="row position-relative">
      <img class="header-h p-0" src="@/assets/img/nueva-cintilla.png" alt="cintillo">
      <a class="d-flex" href="/">
        <img class="imagen-cintillo" src="@/assets/img/Logo_PDVSA.png" alt="logo imagen pdvsa"/>
      </a>
    </header>

    <!-- Main Content -->
    <main class="row p-0 main bg-imagen-main">
      <div class="row p-0">
        <div class="encabezado-izq"></div>
        <div class="container text-center">
          <div class="right-section">
            <section class="shadow" style="border-radius: 15px;">
              <div class="container flex" style="border-radius: 15px 15px 0px 0px;">
                <img :src="nombreAppImg" class="mt-4 mx-auto img-fluid" style="width: 220px;">
              </div>

              <div class="row mx-auto p-2">
                <div class="col-12">
                  <h6 class="mt-3" style="font-weight: 900; color: #444444;">Iniciar Sesión</h6>
                  <form @submit.prevent="handleLogin">
                    <!-- Indicador Input -->
                    <div class="row">
                      <div class="col-12 p-2 position-relative">
                        <i class="bi bi-person-fill icon-input" style="font-size: 19px;"></i>
                        <input 
                          type="text" 
                          id="indicador" 
                          name="indicador" 
                          placeholder="Indicador" 
                          required 
                          class="form-control"
                          v-model="loginData.indicador"
                          :class="{ 'is-invalid': errors.indicador }"
                        >
                        <div v-if="errors.indicador" class="invalid-feedback">
                          {{ errors.indicador }}
                        </div>
                      </div>
                    </div>

                    <!-- Clave Input -->
                    <div class="row">
                      <div class="col-12 p-2 position-relative">
                        <i class="bi bi-lock-fill icon-input" style="font-size: 19px;"></i>
                        <input 
                          type="password" 
                          id="clave" 
                          name="clave" 
                          placeholder="Clave" 
                          required 
                          class="form-control"
                          v-model="loginData.clave"
                          :class="{ 'is-invalid': errors.clave }"
                        >
                        <div v-if="errors.clave" class="invalid-feedback">
                          {{ errors.clave }}
                        </div>
                      </div>
                    </div>

                    <!-- Recordar y Olvidé Contraseña -->
                    <div class="row mt-2">
                      <div class="col-6 d-flex align-items-center">
                        <input 
                          type="checkbox" 
                          class="form-check-input" 
                          id="Recordar" 
                          style="box-shadow: none; border-color: #444444; border-radius: 25px; margin-right: 5px;"
                          v-model="loginData.recordar"
                        >
                        <label for="Recordar" class="login-footer">Recordar</label>
                      </div>
                      <div class="col-6 text-end">
                        <a href="#" class="login-footer" @click.prevent="handleForgotPassword">
                          Olvidé mi Contraseña
                        </a>
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="mt-2 p-2">
                      <button 
                        type="submit" 
                        class="btn btn-small border-0 my-3" 
                        style="background-color:var(--gris2);color:#FFF;border-radius:16px;width:65%;font-weight:700"
                        :disabled="loading"
                      >
                        <span v-if="loading">
                          <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                          Validando...
                        </span>
                        <span v-else>INGRESAR</span>
                      </button>
                    </div>

                    <!-- Mensaje de error general -->
                    <div v-if="errorMessage" class="alert alert-danger mt-2 mx-3">
                      {{ errorMessage }}
                    </div>
                  </form>
                </div>
              </div>
            </section>                
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importar imágenes estáticamente (igual que en Sidebar.vue)
import nombreAppImg from '@/assets/img/nombre_del_nombre.png'
import fondoMainImg from '@/assets/img/fondo-main.png'
import bgMenuLateralImg from '@/assets/img/bg-menu-lateral.png'

const router = useRouter()
const authStore = useAuthStore()

// Data
const loading = ref(false)
const errorMessage = ref('')

const loginData = reactive({
  indicador: '',
  clave: '',
  recordar: false
})

const errors = reactive({
  indicador: '',
  clave: ''
})

// Validation
function validateForm() {
  let isValid = true
  
  // Clear previous errors
  Object.keys(errors).forEach(key => errors[key] = '')
  errorMessage.value = ''
  
  // Validate indicador
  if (!loginData.indicador.trim()) {
    errors.indicador = 'El indicador es requerido'
    isValid = false
  }
  
  // Validate clave
  if (!loginData.clave) {
    errors.clave = 'La clave es requerida'
    isValid = false
  } else if (loginData.clave.length < 4) {
    errors.clave = 'La clave debe tener al menos 4 caracteres'
    isValid = false
  }
  
  return isValid
}

// Login Handler
async function handleLogin() {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Simular autenticación - reemplazar con tu API real
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Validación de ejemplo - reemplazar con tu lógica real
    // Para demo, acepta cualquier combinación no vacía
    if (loginData.indicador && loginData.clave) {
      await authStore.login({
        user: {
          id: 1,
          indicador: loginData.indicador,
          nombre: 'Usuario ' + loginData.indicador, 
          role: 'user'
        },
        token: 'fake-jwt-token-' + Date.now(),
        recordar: loginData.recordar
      })
      
      // Redirigir al home
      router.push('/')
    } else {
      errorMessage.value = 'Indicador o clave incorrectos'
    }
  } catch (error) {
    console.error('Error en login:', error)
    errorMessage.value = 'Error al iniciar sesión. Intente nuevamente.'
  } finally {
    loading.value = false
  }
}

function handleForgotPassword() {
  alert('Funcionalidad de recuperación de contraseña no implementada')
}
</script>

<style scoped>

</style>