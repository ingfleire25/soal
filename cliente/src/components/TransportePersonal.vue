<template>
<h4 class="text-primary mb-4">{{ titulo }}</h4>
  <div class="container bg-white p-4 shadow-sm rounded">
    <form @submit.prevent="enviar">
      <fieldset class="border p-3 mb-4 rounded">
        <legend class="w-auto px-2 fs-5 text-primary">Detalles de la Solicitud</legend>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-control form-control-sm" rows="2" required></textarea>
          </div>
          <div></div>
          <div class="col-md-6">
            <label class="form-label">Origen</label>
            <input v-model="form.origen" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción Origen</label>
            <textarea v-model="form.descripcionOrigen" class="form-control form-control-sm" rows="2"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Destino</label>
            <input v-model="form.destino" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción Destino</label>
            <textarea v-model="form.descripcionDestino" class="form-control form-control-sm" rows="2"></textarea>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Inicio</label>
            <input v-model="form.fechaInicio" type="date" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Fecha Requerida de Finalización</label>
            <input v-model="form.fechaFin" type="date" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Organización de CC/OI</label>
            <input v-model="form.organizacionCcOi" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-12">
            <label class="form-label">Múltiples CC/OI</label>
            <div v-for="(cc, index) in form.multiplesCcOi" :key="index" class="row g-2 mb-2">
              <div class="col-md-8">
                <input v-model="cc.ccOi" type="text" class="form-control form-control-sm" placeholder="CC/OI">
              </div>
              <div class="col-md-3">
                <input v-model.number="cc.porcentaje" type="number" class="form-control form-control-sm" placeholder="Porcentaje">
              </div>
              <div class="col-md-1">
                <button type="button" class="btn btn-sm btn-outline-danger" @click="removeCcOi(index)">X</button>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary" @click="addCcOi">Agregar CC/OI</button>
            <div class="mt-2">Sumatoria %: {{ sumatoriaPorcentaje }}%</div>
          </div>
          <div class="col-md-12">
            <label class="form-label">Días de la Semana</label>
            <div class="form-check form-check-inline">
              <input v-model="form.lunes" class="form-check-input" type="checkbox" id="lunes">
              <label class="form-check-label" for="lunes">L</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.martes" class="form-check-input" type="checkbox" id="martes">
              <label class="form-check-label" for="martes">M</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.miercoles" class="form-check-input" type="checkbox" id="miercoles">
              <label class="form-check-label" for="miercoles">M</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.jueves" class="form-check-input" type="checkbox" id="jueves">
              <label class="form-check-label" for="jueves">J</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.viernes" class="form-check-input" type="checkbox" id="viernes">
              <label class="form-check-label" for="viernes">V</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.sabado" class="form-check-input" type="checkbox" id="sabado">
              <label class="form-check-label" for="sabado">S</label>
            </div>
            <div class="form-check form-check-inline">
              <input v-model="form.domingo" class="form-check-input" type="checkbox" id="domingo">
              <label class="form-check-label" for="domingo">D</label>
            </div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Cantidad de Pasajeros</label>
            <input v-model.number="form.cantidadPasajeros" type="number" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Tipo de Servicio</label>
            <input v-model="form.tipoServicio" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Aprobador</label>
            <input v-model="form.aprobador" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Correo</label>
            <input v-model="form.correo" type="email" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Solicitante</label>
            <input v-model="form.solicitante" type="text" class="form-control form-control-sm" readonly>
          </div>
          <div class="col-md-6">
            <label class="form-label">Cédula Solicitante</label>
            <input v-model="form.cedulaSolicitante" type="text" class="form-control form-control-sm" readonly>
          </div>
        </div>
      </fieldset>
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Enviar Solicitud
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { postSolicitud } from '@/services/postSolicitud';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'TransportePersonal',
  data() {
    return {
      form: {
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        fechaFin: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
        cantidadPasajeros: 1,
        tipoServicio: '',
        aprobador: '',
        correo: '',
        solicitante: '',
        cedulaSolicitante: '',
        tipoSolicitud: 'Transporte de Personal',
        subtipo: 'Ocasional'
      },
      loading: false
    };
  },
  mounted() {
    if (this.$route.query.subtipo) {
      this.form.subtipo = this.$route.query.subtipo;
    }
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.solicitante = `${user.nombres} ${user.apellidos}`;
      this.form.cedulaSolicitante = user.cedula;
    }
  },
  computed: {
    titulo() {
      return `Crear Solicitud (${this.form.subtipo}) - Transporte de Personal`;
    },
    sumatoriaPorcentaje() {
      return this.form.multiplesCcOi.reduce((sum, cc) => sum + (cc.porcentaje || 0), 0);
    }
  },
  methods: {
    addCcOi() {
      this.form.multiplesCcOi.push({ ccOi: '', porcentaje: 0 });
    },
    removeCcOi(index) {
      this.form.multiplesCcOi.splice(index, 1);
    },
    async enviar() {
      if (this.sumatoriaPorcentaje !== 100 && this.form.multiplesCcOi.length > 0) {
        alert('La suma de porcentajes debe ser 100%');
        return;
      }
      this.loading = true;
      try {
        await postSolicitud(this.form);
        alert('Solicitud enviada exitosamente');
        this.resetForm();
      } catch (error) {
        alert('Error al enviar solicitud: ' + error.statusText);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      const currentSolicitante = this.form.solicitante;
      const currentCedula = this.form.cedulaSolicitante;
      const currentSubtipo = this.form.subtipo;
      // Reset form
      Object.assign(this.form, {
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        fechaFin: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        lunes: false,
        martes: false,
        miercoles: false,
        jueves: false,
        viernes: false,
        sabado: false,
        domingo: false,
        cantidadPasajeros: 1,
        tipoServicio: '',
        aprobador: '',
        correo: '',
        solicitante: currentSolicitante,
        cedulaSolicitante: currentCedula,
        tipoSolicitud: 'Transporte de Personal',
        subtipo: currentSubtipo
      });
    }
  }
};
</script>

<style scoped>
/* Add any specific styles if needed */
</style>