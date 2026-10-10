<script setup>
defineProps({
  kind: { type: String, default: 'error', validator: (value) => ['error', 'info'].includes(value) },
})
</script>

<template>
  <p
    :role="kind === 'error' ? 'alert' : 'status'"
    :class="[
      'rounded-md border px-4 py-3 text-sm',
      kind === 'error' ? 'border-red-200 bg-red-50 text-red-800' : 'border-blue-200 bg-blue-50 text-blue-900',
    ]"
  >
    <slot />
  </p>
</template>
