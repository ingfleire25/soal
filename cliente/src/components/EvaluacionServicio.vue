<template>
  <div class="evaluacion-servicio container py-4">
    <h1 class="mb-4">Evaluar servicio de transporte</h1>
   </div>
 <div>
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <p class="text-muted">Registre la evaluación asociada al código de solicitud. La información de quien evalúa se completa desde el usuario logueado.</p>
      </div>
    </div>

    <form @submit.prevent="enviarEvaluacion" class="card shadow-sm p-4">
      <div class="row gy-3">
        <div class="col-md-6">
          <label class="form-label">Código de solicitud</label>
          <input v-model="form.codigoSolicitud" type="text" class="form-control" placeholder="Ej: TP-0001" required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Tipo de solicitud</label>
          <input v-model="form.tipoSolicitud" type="text" class="form-control" placeholder="Opcional: Transporte de Personal" />
        </div>

        <div class="col-md-4">
          <label class="form-label">Evaluador</label>
          <input v-model="form.evaluadorNombre" type="text" class="form-control bg-light" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label">Cédula evaluador</label>
          <input v-model="form.evaluadorCedula" type="text" class="form-control bg-light" readonly />
        </div>
        <div class="col-md-4">
          <label class="form-label">Correo evaluador</label>
          <input v-model="form.evaluadorCorreo" type="email" class="form-control bg-light" readonly />
        </div>

        <div class="col-md-12">
          <h5 class="mb-3">Valoración del servicio</h5>
        </div>

        <div class="col-md-4" v-for="item in preguntas" :key="item.key">
          <label class="form-label">{{ item.label }}</label>
          <select v-model.number="form[item.key]" class="form-select" required>
            <option value="">Seleccione</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} - {{ valoracionTexto(n) }}</option>
          </select>
        </div>

        <div class="col-12">
          <label class="form-label">Comentarios adicionales</label>
          <textarea v-model="form.comentarios" class="form-control" rows="4" placeholder="Describe cualquier detalle adicional"></textarea>
        </div>

        <div class="col-12 text-end">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Enviar evaluación
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { postEvaluacion } from '@/services/postEvaluacion';

export default {
  name: 'EvaluacionServicio',
  data() {
    return {
      loading: false,
      preguntas: [
        { key: 'puntualidad', label: 'Puntualidad del servicio' },
        { key: 'calidad', label: 'Calidad del transporte' },
        { key: 'comunicacion', label: 'Comunicación del personal' },
        { key: 'seguridad', label: 'Condiciones de seguridad' },
        { key: 'satisfaccion', label: 'Satisfacción general' }
      ],
      form: {
        codigoSolicitud: '',
        tipoSolicitud: '',
        subtipo: '',
        evaluadorNombre: '',
        evaluadorCedula: '',
        evaluadorCorreo: '',
        puntualidad: null,
        calidad: null,
        comunicacion: null,
        seguridad: null,
        satisfaccion: null,
        comentarios: ''
      }
    };
  },
  mounted() {
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.evaluadorNombre = `${user.nombres || user.username || ''} ${user.apellidos || ''}`.trim();
      this.form.evaluadorCedula = user.cedula || '';
      this.form.evaluadorCorreo = user.email || user.correo || user.username || '';
    }
  },
  methods: {
    valoracionTexto(value) {
      const labels = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
      return labels[value - 1] || '';
    },
    async enviarEvaluacion() {
      if (!this.form.codigoSolicitud.trim()) {
        alert('Debe ingresar el código de solicitud a evaluar.');
        return;
      }
      this.loading = true;
      try {
        await postEvaluacion(this.form);
        alert('Evaluación registrada correctamente.');
        this.resetForm();
      } catch (error) {
        alert('Error al registrar evaluación: ' + (error.statusText || 'Error desconocido'));
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form.codigoSolicitud = '';
      this.form.tipoSolicitud = '';
      this.form.subtipo = '';
      this.form.puntualidad = null;
      this.form.calidad = null;
      this.form.comunicacion = null;
      this.form.seguridad = null;
      this.form.satisfaccion = null;
      this.form.comentarios = '';
    }
  }
};
</script>

<style scoped>
.evaluacion-servicio { max-width: 900px; margin: auto; }
</style>
