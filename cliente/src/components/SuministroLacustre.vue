<template>
  <h4 class="text-primary mb-4">{{ titulo }}</h4>
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
          <div class="col-md-6">
            <label class="form-label">Tipo de Servicio</label>
            <input v-model="form.tipoServicio" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Persona que Envía</label>
            <input v-model="form.personaEnvia" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción Persona que Envía</label>
            <input v-model="form.descripcionPersonaEnvia" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Persona que Recibe</label>
            <input v-model="form.personaRecibe" type="text" class="form-control form-control-sm" required>
          </div>
          <div class="col-md-6">
            <label class="form-label">Descripción Persona que Recibe</label>
            <input v-model="form.descripcionPersonaRecibe" type="text" class="form-control form-control-sm" required>
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

      <fieldset class="border p-3 mb-4 rounded">
        <legend class="w-auto px-2 fs-5 text-primary">Materiales a Transportar</legend>
        <div v-for="(mat, index) in form.materiales" :key="index" class="border p-3 mb-3 rounded">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Material</label>
              <select v-model="mat.materialId" class="form-control form-control-sm" @change="selectMaterial(index)">
                <option value="">Seleccionar material</option>
                <option v-for="m in materiales" :key="m.id" :value="m.id">{{ m.descripcion }} ({{ m.renglon }})</option>
              </select>
            </div>
            <div class="col-md-3">
              <label class="form-label">Cantidad</label>
              <input v-model.number="mat.cantidad" type="number" class="form-control form-control-sm" required>
            </div>
            <div class="col-md-3">
              <label class="form-label">Fecha Entrega en Muelle</label>
              <input v-model="mat.fechaEntregaMuelle" type="date" class="form-control form-control-sm" required>
            </div>
            <div class="col-md-11">
              <label class="form-label">Observación</label>
              <textarea v-model="mat.observacion" class="form-control form-control-sm" rows="2"></textarea>
            </div>
            <div class="col-md-1 d-flex align-items-end">
              <button type="button" class="btn btn-sm btn-outline-danger" @click="removeMaterial(index)">X</button>
            </div>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-outline-primary" @click="addMaterial">Agregar Material</button>
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
import { postSuministroLacustre } from '@/services/postSuministroLacustre';
import { getMateriales } from '@/services/getMateriales';
import { useAuthStore } from '@/stores/auth';
import { v4 as uuidv4 } from 'uuid';

export default {
  name: 'SuministroLacustre',
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
        fechaFin: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        tipoServicio: '',
        personaEnvia: '',
        descripcionPersonaEnvia: '',
        personaRecibe: '',
        descripcionPersonaRecibe: '',
        aprobador: '',
        correo: '',
        solicitante: '',
        cedulaSolicitante: '',
        fecha: '',
        tipoSolicitud: 'Suministro Lacustre',
        subtipo: 'Ocasional',
        materiales: []
      },
      materiales: [],
      loading: false
    };
  },
  mounted() {
    if (this.$route.query.subtipo) {
      this.form.subtipo = this.$route.query.subtipo;
    }
    this.form.id = uuidv4();
    this.form.fecha = new Date().toISOString().split('T')[0];
    const authStore = useAuthStore();
    const user = authStore.user?.value;
    if (user) {
      this.form.solicitante = `${user.nombres} ${user.apellidos}`;
      this.form.cedulaSolicitante = user.cedula;
    }
    this.loadMateriales();
  },
  computed: {
    titulo() {
      return `Crear Solicitud (${this.form.subtipo}) - Suministro Lacustre`;
    },
    sumatoriaPorcentaje() {
      return this.form.multiplesCcOi.reduce((sum, cc) => sum + (cc.porcentaje || 0), 0);
    }
  },
  methods: {
    async loadMateriales() {
      try {
        this.materiales = await getMateriales();
      } catch (error) {
        console.error('Error cargando materiales:', error);
      }
    },
    addCcOi() {
      this.form.multiplesCcOi.push({ ccOi: '', porcentaje: 0 });
    },
    removeCcOi(index) {
      this.form.multiplesCcOi.splice(index, 1);
    },
    addMaterial() {
      this.form.materiales.push({
        materialId: '',
        renglon: '',
        descripcion: '',
        cantidad: 1,
        fechaEntregaMuelle: '',
        observacion: ''
      });
    },
    removeMaterial(index) {
      this.form.materiales.splice(index, 1);
    },
    selectMaterial(index) {
      const mat = this.form.materiales[index];
      const selected = this.materiales.find(m => m.id === mat.materialId);
      if (selected) {
        mat.renglon = selected.renglon;
        mat.descripcion = selected.descripcion;
      }
    },
    async enviar() {
      if (this.sumatoriaPorcentaje !== 100 && this.form.multiplesCcOi.length > 0) {
        alert('La suma de porcentajes debe ser 100%');
        return;
      }
      if (this.form.materiales.length === 0) {
        alert('Debe agregar al menos un material');
        return;
      }
      this.loading = true;
      try {
        const dataToSend = { ...this.form };
        delete dataToSend.id;
        // Map materiales to include renglon and descripcion
        dataToSend.materiales = dataToSend.materiales.map(m => ({
          renglon: m.renglon,
          descripcion: m.descripcion,
          cantidad: m.cantidad,
          fechaEntregaMuelle: m.fechaEntregaMuelle,
          observacion: m.observacion
        }));
        await postSuministroLacustre(dataToSend);
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
      const currentFecha = this.form.fecha;
      Object.assign(this.form, {
        id: uuidv4(),
        descripcion: '',
        origen: '',
        descripcionOrigen: '',
        destino: '',
        descripcionDestino: '',
        fechaInicio: '',
        fechaFin: '',
        organizacionCcOi: '',
        multiplesCcOi: [],
        tipoServicio: '',
        personaEnvia: '',
        descripcionPersonaEnvia: '',
        personaRecibe: '',
        descripcionPersonaRecibe: '',
        aprobador: '',
        correo: '',
        solicitante: currentSolicitante,
        cedulaSolicitante: currentCedula,
        fecha: currentFecha,
        tipoSolicitud: 'Suministro Lacustre',
        subtipo: currentSubtipo,
        materiales: []
      });
    }
  }
};
</script>

<style scoped>
</style>