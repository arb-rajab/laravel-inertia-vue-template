<script setup>
defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  variant: { type: String, default: 'primary', validator: (value) => ['primary', 'secondary', 'link'].includes(value) },
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60',
      variant === 'primary' && 'rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-700',
      variant === 'secondary' && 'rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50',
      variant === 'link' && 'font-normal underline',
    ]"
  >
    <slot />
  </button>
</template>
