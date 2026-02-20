<template>
  <div class="form-group input-wrapper">
    <label v-if="label" :for="name" class="form-label">{{ label }}</label>
    <input
      :id="name"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="['form-control', { 'has-error': error } ]"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @change="$emit('change', $event)"
    />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  name: { type: String, default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: '' }
})
</script>

<style scoped>
.input-wrapper { margin-bottom: 0.75rem; }
.form-label { display: block; margin-bottom: 0.25rem; font-weight: 600; }
.form-control { width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 6px; }
.form-control.has-error { border-color: #ef4444; }
.error { color: #ef4444; font-size: 0.85rem; margin-top: 0.25rem; }
</style>
