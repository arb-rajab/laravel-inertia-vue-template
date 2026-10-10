<script setup>
import { ref } from 'vue'

// A minimal example of an embeddable widget. It keeps its own state and talks
// to your API with plain fetch(); it must not depend on Inertia, Blade or
// Laravel's asset manifest, because it runs on a third-party page.
const props = defineProps({
  label: { type: String, default: 'Click me' },
})

const count = ref(0)
</script>

<template>
  <button
    type="button"
    data-testid="example-widget"
    @click="count++"
  >
    {{ props.label }} ({{ count }})
  </button>
</template>
