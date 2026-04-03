<template>
  <h4 class="text-primary mb-4">Crear Solicitud - Servicios Portuarios</h4>
  <div class="container bg-white p-4 shadow-sm rounded">
    <form @submit.prevent="enviar">
      <fieldset class="border p-3 mb-4 rounded">
        <legend class="w-auto px-2 fs-5 text-primary">Detalles de la Solicitud</legend>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Requisición</label>
            <input v-model="form.id" type="text" class="form-control form-control-sm" readonly>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción</label>
            <textarea v-model="form.descripcion" class="form-control form-control-sm" rows="2" required></textarea>
          </div>
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

          <div class="col-md-6">
            <label class="form-label">Tipo de Servicio</label>
            <input v-model="form.tipoServicio" type="text" class="form-control form-control-sm" readonly>
          </div>
          <div class="col-md-6">
            <label class="form-label">Unidad a Movilizar</label>
            <input v-model="form.unidadMovilizar" type="text" class="form-control form-control-sm" readonly>
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
          <div class="col-md-6">
            <label class="form-label">Fecha</label>
            <input v-model="form.fecha" type="date" class="form-control form-control-sm" readonly>
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
import { postServiciosPortuarios } from '@/services/postServiciosPortuarios';
import { useAuthStore } from '@/stores/auth';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'ServiciosPortuarios',
  data() {
    return {
      form: {
        id: '',
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        tipoServicio: 'Maniobras Especiales',
        unidadMovilizar: 'Tanquero Buque Petrolero',
        aprobador: '',
        correo: '',
        solicitante: '',
        cedulaSolicitante: '',
        fecha: '',
        tipoSolicitud: 'Servicios Portuarios',
        subtipo: 'Ocasional'
      },
      loading: false
    };
  },
  mounted() {
    this.form.id = uuidv4();
    this.form.fecha = new Date().toISOString().split('T')[0];
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.solicitante = `${user.nombres} ${user.apellidos}`;
      this.form.cedulaSolicitante = user.cedula;
    }
    if (this.$route.query.subtipo) {
      this.form.subtipo = this.$route.query.subtipo;
    }
  },
  computed: {
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
    resetForm() {
      const fechaActual = new Date().toISOString().split('T')[0];
      const solicitante = this.form.solicitante;
      const cedula = this.form.cedulaSolicitante;
      const subtipo = this.form.subtipo;

      Object.assign(this.form, {
        id: uuidv4(),
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        tipoServicio: 'Maniobras Especiales',
        unidadMovilizar: 'Tanquero Buque Petrolero',
        aprobador: '',
        correo: '',
        solicitante,
        cedulaSolicitante: cedula,
        fecha: fechaActual,
        tipoSolicitud: 'Servicios Portuarios',
        subtipo
      });
    },
    async enviar() {
      if (this.sumatoriaPorcentaje !== 100 && this.form.multiplesCcOi.length > 0) {
        alert('La suma de porcentajes debe ser 100%');
        return;
      }
      this.loading = true;
      try {
        const { id, ...payload } = this.form;
        await postServiciosPortuarios(payload);
        alert('Solicitud enviada exitosamente');
        this.resetForm();
      } catch (error) {
        alert('Error al enviar solicitud: ' + (error.statusText || 'Desconocido'));
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Estilos específicos si se necesitan */
</style>