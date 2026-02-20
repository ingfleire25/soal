<template>
  <div class="form-group select-wrapper">
    <label v-if="label" :for="name" class="form-label">{{ label }}</label>
    <select
      :id="name"
      :name="name"
      :disabled="disabled"
      :class="['form-control', { 'has-error': error } ]"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  name: { type: String, default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' }
})
</script>

<style scoped>
.select-wrapper { margin-bottom: 0.75rem; }
.form-control { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; background: white; }
.form-control.has-error { border-color: #ef4444; }
.error { color: #ef4444; font-size: 0.85rem; margin-top: 0.25rem; }
</style>
