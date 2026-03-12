<template>
   <div class="container bg-white p-4 shadow-sm rounded">
    <form>
        <fieldset class="border p-3 mb-4 rounded">
            <legend class="w-auto px-2 fs-5 text-primary">Servicio Recurrente</legend>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Servicio Recurrente</label>
                    <input type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Año</label>
                    <input type="number" class="form-control form-control-sm">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Tipo de Servicio</label>
                    <select class="form-select form-select-sm"><option>Seleccione...</option></select>
                </div>
                <div class="col-md-8">
                    <label class="form-label">Organización</label>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control">
                        <button class="btn btn-outline-secondary" type="button">...</button>
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Tipo de ODST</label>
                    <input type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Cédula Solicitante / Autorizador</label>
                    <input type="text" class="form-control form-control-sm" placeholder="Cédula">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control form-control-sm">
                </div>
            </div>
        </fieldset>

        <fieldset class="border p-3 mb-4 rounded">
            <legend class="w-auto px-2 fs-5 text-primary">Detalles</legend>
            <div class="row g-3">
                <div class="col-md-8">
                    <label class="form-label">Unidad</label>
                    <input type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Modalidad</label>
                    <select class="form-select form-select-sm"><option>Seleccione...</option></select>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Origen</label>
                    <input type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Destino</label>
                    <input type="text" class="form-control form-control-sm">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Fecha Inicio</label>
                    <input type="date" class="form-control form-control-sm">
                </div>
                <div class="col-md-3">
                    <label class="form-label">Fecha Finalización</label>
                    <input type="date" class="form-control form-control-sm">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Días Req. (L M M J V S D)</label>
                    <div class="d-flex gap-2">
                        <input type="checkbox" class="form-check-input"> L
                        <input type="checkbox" class="form-check-input"> M
                        <input type="checkbox" class="form-check-input"> M
                        <input type="checkbox" class="form-check-input"> J
                        <input type="checkbox" class="form-check-input"> V
                        <input type="checkbox" class="form-check-input"> S
                        <input type="checkbox" class="form-check-input"> D
                    </div>
                </div>
            </div>
        </fieldset>

        <fieldset class="border p-3 mb-4 rounded bg-light">
            <legend class="w-auto px-2 fs-6 text-muted">Modificado</legend>
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label">Por:</label>
                    <input type="text" class="form-control form-control-sm" readonly placeholder="Usuario actual">
                </div>
                <div class="col-md-6">
                    <label class="form-label">Fecha:</label>
                    <input type="date" class="form-control form-control-sm">
                </div>
            </div>
        </fieldset>

        <div class="text-end">
            <button type="reset" class="btn btn-secondary">Limpiar</button>
            <button type="submit" class="btn btn-primary">Guardar Servicio</button>
        </div>
    </form>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { postSolicitud } from '@/services/postSolicitud';
import router from '@/router';

const form = reactive({
  nombre: '',
  correo: '',
  origen: '',
  destino: '',
  fechaViaje: '',
  comentario: ''
});

const mensaje = ref('');

async function enviar() {
  try {
    const res = await postSolicitud(form);
    mensaje.value = `Solicitud creada con ID ${res.id}`;
    // opcional: redirigir a lista
    router.push({ name: 'tabla' });
  } catch (err) {
    mensaje.value = err.statusText || 'Error al enviar';
  }
}
</script>

<style scoped>
.form-container { max-width: 500px; margin: auto; }
.field { margin-bottom: 12px; }
.message { margin-top: 1rem; color: green; }

</style>