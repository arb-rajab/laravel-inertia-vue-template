<script setup>
defineProps({
  label: { type: String, default: 'Loading' },
})
</script>

<template>
  <span
    role="status"
    :aria-label="label"
    class="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-gray-300 border-t-gray-900"
  />
</template>
