<template>
  <div class="administracion-container">
    <h1>Administración de Usuarios (Gerente)</h1>

    <div class="row mb-3">
      <div class="col-9">
        <input v-model="search" class="form-control" placeholder="Buscar usuarios por nombre, apellido, usuario, cedula..." @keyup.enter="doSearch" />
      </div>
      <div class="col-3 d-flex">
        <button class="btn btn-primary me-2" @click="doSearch">Buscar</button>
        <button class="btn btn-secondary" @click="clearSearch">Limpiar</button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <table v-if="usuarios.length" class="table table-bordered table-hover">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Cedula</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in usuarios" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ u.nombres }}</td>
          <td>{{ u.apellidos }}</td>
          <td>{{ u.cedula }}</td>
          <td>{{ u.rol }}</td>
          <td>{{ u.activo ? 'Activo' : 'Inactivo' }}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary me-1" @click="editUser(u)">Editar</button>
            <button v-if="u.activo" class="btn btn-sm btn-outline-danger" @click="deactivateUser(u.id)">Inactivo</button>
            <button v-else class="btn btn-sm btn-outline-success" @click="activateUser(u.id)">Activar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="mb-3">No se encontraron usuarios.</div>

    <hr />
    <h2>{{ editing.id ? 'Editar usuario' : 'Crear nuevo usuario' }}</h2>

    <form @submit.prevent="saveUser">
      <div class="row">
        <div class="col-md-4">
          <label>Usuario</label>
          <input class="form-control" v-model="editing.username" required />
        </div>
        <div class="col-md-4">
          <label>Contraseña</label>
          <input class="form-control" v-model="editing.password" :required="!editing.id" type="password" />
        </div>
        <div class="col-md-4">
          <label>Rol</label>
          <select class="form-control" v-model="editing.rol" required>
            <option value="Gerente">Gerente</option>
            <option value="Subgerente">Subgerente</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Analista">Analista</option>
            <option value="Invitado">Invitado</option>
          </select>
        </div>
      </div>

      <div class="row mt-2">
        <div class="col-md-4"><label>Nombres</label><input class="form-control" v-model="editing.nombres" required /></div>
        <div class="col-md-4"><label>Apellidos</label><input class="form-control" v-model="editing.apellidos" required /></div>
        <div class="col-md-4"><label>Cédula</label><input class="form-control" v-model="editing.cedula" required /></div>
      </div>

      <div class="row mt-2">
        <div class="col-md-4"><label>Teléfono</label><input class="form-control" v-model="editing.telefono" /></div>
        <div class="col-md-4"><label>Gerencia</label><input class="form-control" v-model="editing.gerencia" /></div>
        <div class="col-md-4"><label>Departamento</label><input class="form-control" v-model="editing.departamento" /></div>
      </div>

      <div class="mt-3">
        <button type="submit" class="btn btn-success">{{ editing.id ? 'Actualizar' : 'Crear' }}</button>
        <button type="button" class="btn btn-secondary ms-2" @click="resetForm">Limpiar</button>
      </div>
    </form>

    <!-- Modal de éxito -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="successModalLabel">Éxito</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ successMessage }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { searchUsuarios, createUsuario, updateUsuario } from '@/services/usuarios'

const search = ref('')
const usuarios = ref([])
const error = ref('')
const editing = ref({})
const successMessage = ref('')
const showModal = ref(false)

async function doSearch() {
  try {
    error.value = ''
    const resp = await searchUsuarios(search.value)
    if (resp.statusCode !== 200) {
      error.value = resp.statusText || 'Error en búsqueda'
      usuarios.value = []
      return
    }
    usuarios.value = resp.result || []
  } catch (err) {
    console.error(err)
    error.value = 'Fallo la consulta al servidor'
    usuarios.value = []
  }
}

function clearSearch() {
  search.value = ''
  usuarios.value = []
  error.value = ''
}

function editUser(user) {
  editing.value = { ...user, password: '' }
}

async function deactivateUser(id) {
  try {
    error.value = ''
    const resp = await updateUsuario(id, { activo: false })
    if (resp.statusCode !== 200) throw new Error(resp.statusText)
    await doSearch()
    successMessage.value = 'Usuario puesto inactivo exitosamente.'
    // Trigger Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'))
    modal.show()
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Error desactivando usuario'
  }
}

async function activateUser(id) {
  try {
    error.value = ''
    const resp = await updateUsuario(id, { activo: true })
    if (resp.statusCode !== 200) throw new Error(resp.statusText)
    await doSearch()
    successMessage.value = 'Usuario activado exitosamente.'
    // Trigger Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'))
    modal.show()
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Error activando usuario'
  }
}

async function saveUser() {
  try {
    error.value = ''
    const payload = { ...editing.value }

    if (!payload.username || !payload.nombres || !payload.apellidos || !payload.cedula || !payload.rol) {
      error.value = 'Complete campos obligatorios'
      return
    }

    if (payload.id) {
      if (!payload.password) delete payload.password
      const resp = await updateUsuario(payload.id, payload)
      if (resp.statusCode !== 200) throw new Error(resp.statusText)
      await doSearch()
      successMessage.value = 'Usuario actualizado exitosamente.'
    } else {
      if (!payload.password) {
        error.value = 'La contraseña es obligatoria para nuevo usuario'
        return
      }
      const resp = await createUsuario(payload)
      if (resp.statusCode !== 201) throw new Error(resp.statusText)
      await doSearch()
      successMessage.value = 'Usuario creado exitosamente.'
    }

    resetForm()
    // Trigger Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'))
    modal.show()
  } catch (err) {
    console.error(err)
    error.value = err.message || 'Error guardando usuario'
  }
}

function resetForm() {
  editing.value = {}
}
</script>

<style scoped>
.administracion-container { max-width: 1100px; margin: auto; }
</style>
