<script setup>
// Label + error wrapper for any control (select, textarea, custom input):
// <FormField id="role" label="Role" :error="fieldError('role')"><select id="role" /></FormField>
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  error: { type: String, default: '' },
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      :for="id"
      class="text-sm font-medium"
    >{{ label }}</label>
    <slot />
    <p
      v-if="error"
      class="text-sm text-red-700"
    >
      {{ error }}
    </p>
  </div>
</template>
