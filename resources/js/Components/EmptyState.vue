<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="px-4 py-10 text-center">
    <h2 class="text-lg font-semibold">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mt-1 text-gray-600"
    >
      {{ description }}
    </p>
    <div
      v-if="$slots.default"
      class="mt-4"
    >
      <slot />
    </div>
  </div>
</template>
