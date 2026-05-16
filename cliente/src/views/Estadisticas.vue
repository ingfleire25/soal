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
import autoTable from 'jspdf-autotable'; // Importación necesaria para tablas limpias

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
      if (!selectedMonth.value) return '';
      const [year, month] = selectedMonth.value.split('-');
      const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
      return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    });

    const filtrarEvaluacionesPorMes = () => {
      if (!selectedMonth.value) return [];
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
      // Orientación horizontal (landscape) para que quepan todas las columnas
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
      
      // Títulos del Documento
      doc.setFontSize(18);
      doc.setTextColor(40);
      doc.text('REPORTE DE EVALUACIONES', 14, 15);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Mes y Año: ${monthYearLabel.value}`, 14, 22);

      // Definición de Columnas para AutoTable
      const tableColumn = [
        "Solicitud", 
        "Evaluador", 
        "Cédula", 
        "Correo", 
        "Punt.", 
        "Cal.", 
        "Com.", 
        "Seg.", 
        "Sat.", 
        "Comentarios"
      ];

      // Mapeo de datos para las filas
      const tableRows = filtered.map(item => [
        item.codigoSolicitud || '',
        item.evaluadorNombre || '',
        item.evaluadorCedula || '',
        item.evaluadorCorreo || '',
        item.puntualidad ?? '-',
        item.calidad ?? '-',
        item.comunicacion ?? '-',
        item.seguridad ?? '-',
        item.satisfaccion ?? '-',
        item.comentarios || ''
      ]);

      // Generación de la tabla con mejoras visuales
      autoTable(doc, {
        startY: 30,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
          valign: 'middle',
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [240, 240, 240], // Gris muy claro (no negro)
          textColor: [0, 0, 0],       // Texto negro
          fontStyle: 'bold',
          lineWidth: 0.1,
          lineColor: [200, 200, 200]
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Solicitud
          1: { cellWidth: 35 }, // Evaluador
          3: { cellWidth: 40 }, // Correo
          9: { cellWidth: 'auto' } // Comentarios ocupa el resto
        },
        // Maneja automáticamente los saltos de página
        margin: { top: 30 },
        didDrawPage: (data) => {
            // Opcional: Pie de página con número de página
            const str = 'Página ' + doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            doc.text(str, data.settings.margin.left, pageHeight - 10);
        }
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
canvas {
  max-width: 100%;
  height: auto !important;
}
</style>