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
      <h3>Reportes de Evaluaciones</h3>
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
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

export default {
  name: 'Estadisticas',
  setup() {
    const auth = useAuthStore();
    const evaluaciones = ref([]);
    const loading = ref(false);
    const error = ref('');
    const chartCanvas = ref(null);
    const pieCanvas = ref(null);
    const selectedMonth = ref('');

    const userRole = computed(() => auth.user?.value?.rol || '');
    const isAuthorized = computed(() => ['Aprobador', 'Administrador'].includes(userRole.value));

    const months = computed(() => {
      if (!evaluaciones.value.length) {
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
      }

      const unique = new Map();
      evaluaciones.value.forEach(item => {
        const fecha = new Date(item.fecha || item.createdAt);
        if (!isNaN(fecha.getTime())) {
          const value = fecha.toISOString().slice(0, 7);
          if (!unique.has(value)) {
            unique.set(value, {
              value,
              label: fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
            });
          }
        }
      });

      return Array.from(unique.values()).sort((a, b) => b.value.localeCompare(a.value));
    });

    const cargarDatos = async () => {
      if (!isAuthorized.value) return;

      loading.value = true;
      error.value = '';
      try {
        evaluaciones.value = await getEvaluaciones();
        if (!selectedMonth.value && months.value.length) {
          selectedMonth.value = months.value[0].value;
        }
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

    const monthYearLabel = computed(() => {
      const [year, month] = selectedMonth.value.split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
      return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    });

    const filtrarEvaluacionesPorMes = () => {
      const [year, month] = selectedMonth.value.split('-');
      return evaluaciones.value.filter(evaluation => {
        const fecha = new Date(evaluation.fecha || evaluation.createdAt);
        return fecha.getFullYear() === parseInt(year, 10) && fecha.getMonth() === parseInt(month, 10) - 1;
      });
    };

    const exportExcel = () => {
      const filtered = filtrarEvaluacionesPorMes();
      const data = filtered.map(item => ({
        'Código de la Solicitud': item.codigoSolicitud,
        'Tipo de Solicitud': item.tipoSolicitud || '',
        'Subtipo': item.subtipo || '',
        'Evaluador': item.evaluadorNombre,
        'Cédula Evaluador': item.evaluadorCedula || '',
        'Correo Evaluador': item.evaluadorCorreo || '',
        'Puntualidad': item.puntualidad,
        'Calidad': item.calidad,
        'Comunicación': item.comunicacion,
        'Seguridad': item.seguridad,
        'Satisfacción': item.satisfaccion,
        'Comentarios': item.comentarios || '',
        'Fecha evaluación': item.fecha ? new Date(item.fecha).toLocaleString('es-ES') : ''
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');
      XLSX.writeFile(wb, `reporte_evaluaciones_${selectedMonth.value}.xlsx`);
    };

    const exportPDF = () => {
      const filtered = filtrarEvaluacionesPorMes();
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('REPORTE DE EVALUACIONES', 14, 14);
      doc.setFontSize(10);
      doc.text(`Mes y Año: ${monthYearLabel.value}`, 14, 22);
      doc.setFontSize(9);

      const headers = ['Solicitud', 'Evaluador', 'Cédula', 'Correo', 'Puntualidad', 'Calidad', 'Comunicación', 'Seguridad', 'Satisfacción', 'Comentarios'];
      const startX = 14;
      const startY = 32;
      const rowHeight = 8;
      const colWidths = [28, 36, 24, 46, 16, 16, 18, 18, 18, 60];

      let y = startY;
      let x = startX;

      doc.setFillColor(240, 240, 240);
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.2);
      headers.forEach((header, index) => {
        doc.rect(x, y - rowHeight + 2, colWidths[index], rowHeight, 'FD');
        doc.text(header, x + 1, y);
        x += colWidths[index];
      });
      y += rowHeight;

      filtered.forEach((item) => {
        x = startX;
        const row = [
          item.codigoSolicitud || '',
          item.evaluadorNombre || '',
          item.evaluadorCedula || '',
          item.evaluadorCorreo || '',
          item.puntualidad != null ? String(item.puntualidad) : '',
          item.calidad != null ? String(item.calidad) : '',
          item.comunicacion != null ? String(item.comunicacion) : '',
          item.seguridad != null ? String(item.seguridad) : '',
          item.satisfaccion != null ? String(item.satisfaccion) : '',
          item.comentarios ? item.comentarios.toString() : ''
        ];

        const maxLines = row.reduce((max, cell, index) => {
          const lines = doc.splitTextToSize(cell, colWidths[index] - 2).length;
          return Math.max(max, lines);
        }, 1);

        const pageBottom = 200;
        if (y + rowHeight * maxLines > pageBottom) {
          doc.addPage('landscape');
          y = startY;
          x = startX;
          doc.setFillColor(240, 240, 240);
          headers.forEach((header, index) => {
            doc.rect(x, y - rowHeight + 2, colWidths[index], rowHeight, 'F');
            doc.text(header, x + 1, y);
            x += colWidths[index];
          });
          y += rowHeight;
        }

        row.forEach((cell, index) => {
          const cellText = cell ? cell.toString() : '';
          const splitText = doc.splitTextToSize(cellText, colWidths[index] - 2);
          doc.text(splitText, x + 1, y);
          doc.rect(x, y - rowHeight + 2, colWidths[index], rowHeight * maxLines, 'S');
          x += colWidths[index];
        });

        y += rowHeight * maxLines;
      });

      doc.save(`reporte_evaluaciones_${selectedMonth.value}.pdf`);
    };

    onMounted(cargarDatos);

    return {
      evaluaciones,
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