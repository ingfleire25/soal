<template>
  <div class="estadisticas-container">
    <h1>Estadísticas de Evaluaciones</h1>

    <div class="row">
      <div class="col-md-6">
        <h3>Promedio de Ponderaciones</h3>
        <canvas ref="chartCanvas"></canvas>
      </div>
      <div class="col-md-6">
        <h3>Distribución por Tipo de Solicitud</h3>
        <canvas ref="pieCanvas"></canvas>
      </div>
    </div>

    <div class="mt-4">
      <h3>Reportes de Solicitudes</h3>
      <div class="d-flex gap-2 align-items-center">
        <label>Seleccionar Mes:</label>
        <select v-model="selectedMonth" class="form-select" style="width: auto;">
          <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
        </select>
        <button @click="exportExcel" class="btn btn-success">Exportar Excel</button>
        <button @click="exportPDF" class="btn btn-danger">Exportar PDF</button>
      </div>
    </div>

    <div v-if="loading" class="text-center mt-3">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div> 
    </div>

    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getEvaluaciones } from '@/services/getEvaluaciones';
import { getSolicitudes } from '@/services/getSolicitudes';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export default {
  name: 'Estadisticas',
  setup() {
    const auth = useAuthStore();
    const evaluaciones = ref([]);
    const solicitudes = ref([]);
    const loading = ref(false);
    const error = ref('');
    const chartCanvas = ref(null);
    const pieCanvas = ref(null);
    const selectedMonth = ref(new Date().toISOString().slice(0, 7)); // YYYY-MM

    const userRole = computed(() => auth.user?.value?.rol || '');
    const isAuthorized = computed(() => ['Aprobador', 'Administrador'].includes(userRole.value));

    const months = computed(() => {
      const months = [];
      const now = new Date();
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          value: date.toISOString().slice(0, 7),
          label: date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
        });
      }
      return months;
    });

    const cargarDatos = async () => {
      if (!isAuthorized.value) return;

      loading.value = true;
      error.value = '';
      try {
        evaluaciones.value = await getEvaluaciones();
        solicitudes.value = await getSolicitudes();
        renderCharts();
      } catch (e) {
        error.value = e.statusText || 'Error al cargar datos';
      } finally {
        loading.value = false;
      }
    };

    const calcularPromedios = () => {
      if (!evaluaciones.value.length) return { puntualidad: 0, calidad: 0, comunicacion: 0, seguridad: 0, satisfaccion: 0 };

      const total = evaluaciones.value.length;
      const sumas = evaluaciones.value.reduce((acc, evaluation) => {
        acc.puntualidad += evaluation.puntualidad || 0;
        acc.calidad += evaluation.calidad || 0;
        acc.comunicacion += evaluation.comunicacion || 0;
        acc.seguridad += evaluation.seguridad || 0;
        acc.satisfaccion += evaluation.satisfaccion || 0;
        return acc;
      }, { puntualidad: 0, calidad: 0, comunicacion: 0, seguridad: 0, satisfaccion: 0 });

      return {
        puntualidad: sumas.puntualidad / total,
        calidad: sumas.calidad / total,
        comunicacion: sumas.comunicacion / total,
        seguridad: sumas.seguridad / total,
        satisfaccion: sumas.satisfaccion / total
      };
    };

    const contarPorTipo = () => {
      const counts = {};
      evaluaciones.value.forEach(evaluation => {
        const tipo = evaluation.tipoSolicitud || 'Sin tipo';
        counts[tipo] = (counts[tipo] || 0) + 1;
      });
      return counts;
    };

    const renderCharts = () => {
      if (!chartCanvas.value || !pieCanvas.value) return;

      const promedios = calcularPromedios();
      const tipos = contarPorTipo();

      // Gráfico de barras
      new Chart(chartCanvas.value, {
        type: 'bar',
        data: {
          labels: ['Puntualidad', 'Calidad', 'Comunicación', 'Seguridad', 'Satisfacción'],
          datasets: [{
            label: 'Promedio',
            data: [promedios.puntualidad, promedios.calidad, promedios.comunicacion, promedios.seguridad, promedios.satisfaccion],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 5 }
          }
        }
      });

      // Gráfico de torta
      new Chart(pieCanvas.value, {
        type: 'pie',
        data: {
          labels: Object.keys(tipos),
          datasets: [{
            data: Object.values(tipos),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
          }]
        }
      });
    };

    const filtrarSolicitudesPorMes = () => {
      const [year, month] = selectedMonth.value.split('-');
      return solicitudes.value.filter(s => {
        const fecha = new Date(s.fechaInicio || s.fecha);
        return fecha.getFullYear() === parseInt(year) && fecha.getMonth() === parseInt(month) - 1;
      });
    };

    const exportExcel = () => {
      const data = filtrarSolicitudesPorMes();
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Solicitudes');
      XLSX.writeFile(wb, `solicitudes_${selectedMonth.value}.xlsx`);
    };

    const exportPDF = () => {
      const data = filtrarSolicitudesPorMes();
      const doc = new jsPDF();
      doc.text(`Solicitudes del mes ${selectedMonth.value}`, 10, 10);
      let y = 20;
      data.forEach((s, index) => {
        doc.text(`${index + 1}. ${s.id} - ${s.tipoSolicitud} - ${s.estado}`, 10, y);
        y += 10;
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      });
      doc.save(`solicitudes_${selectedMonth.value}.pdf`);
    };

    onMounted(cargarDatos);

    return {
      evaluaciones,
      solicitudes,
      loading,
      error,
      chartCanvas,
      pieCanvas,
      selectedMonth,
      months,
      exportExcel,
      exportPDF
    };
  }
};
</script>

<style scoped>
.estadisticas-container {
  padding: 2rem;
}
</style>