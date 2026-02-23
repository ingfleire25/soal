<template>
  <div>
    <label v-if="label"><strong>{{ label }}</strong></label>
    <div class="input-wrapper-row">
      <div v-if="loading">Cargando...</div>
      <template v-else>
        <label v-for="opt in options" :key="opt.id" class="wrapper-checkboxes" :style="{ marginTop: '.5rem', marginRight: '1rem' }">
          <input type="checkbox" :id="opt.tx_nombre" :value="opt.id"
                 :checked="isChecked(opt)"
                 @change="onToggle($event, opt)" style="margin-right:.2rem" />
          {{ opt.tx_nombre }}
        </label>
      </template>
    </div>
    <span class="small error">{{ errorMsg || '\u00A0' }}</span>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { api } from '@/utils/axios'

const props = defineProps({
  url: { type: String, default: '' },
  label: { type: String, default: '' },
  state: { type: Array, default: () => [] },
  errorMsg: { type: String, default: '' }
})

const emit = defineEmits(['change'])

const options = ref([])
const loading = ref(false)

async function fetchOptions() {
  if (!props.url) return
  loading.value = true
  try {
    const { data } = await api.get(props.url)
    // React versión usaba data.result
    options.value = data.result || []
  } catch (err) {
    console.error('Error cargando checkboxes:', err)
    options.value = []
  } finally {
    loading.value = false
  }
}

function isChecked(opt) {
  return props.state && Array.isArray(props.state) && props.state.find(s => s.id === opt.id)
}

function onToggle(e, opt) {
  emit('change', e.target.checked, opt)
}

watch(() => props.url, () => fetchOptions(), { immediate: true })

onMounted(() => fetchOptions())
</script>

<style scoped>
.wrapper-checkboxes { display: inline-flex; align-items: center; }
.small.error { color: #ef4444; font-size: 0.85rem; }
</style>
