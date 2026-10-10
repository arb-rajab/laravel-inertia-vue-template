<script setup>
import { computed } from 'vue'
import Button from './Button.vue'

// Previous / next controls for the `meta` object of a paginated response
// ({ current_page, last_page, per_page, total }). Renders nothing for a
// single page.
const props = defineProps({
  meta: { type: Object, required: true },
})

const emit = defineEmits(['change'])

const hasPrevious = computed(() => props.meta.current_page > 1)
const hasNext = computed(() => props.meta.current_page < props.meta.last_page)
</script>

<template>
  <nav
    v-if="meta.last_page > 1"
    aria-label="Pagination"
    class="mt-4 flex items-center justify-center gap-4"
  >
    <Button
      variant="secondary"
      :disabled="!hasPrevious"
      @click="emit('change', meta.current_page - 1)"
    >
      Previous
    </Button>
    <span class="text-sm text-gray-600">
      Page {{ meta.current_page }} of {{ meta.last_page }} ({{ meta.total }} total)
    </span>
    <Button
      variant="secondary"
      :disabled="!hasNext"
      @click="emit('change', meta.current_page + 1)"
    >
      Next
    </Button>
  </nav>
</template>
