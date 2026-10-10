<script setup>
import { nextTick, ref, useId, watch } from 'vue'

// A dialog rendered in place (no teleport). It closes on Escape, on a click
// on the backdrop and via the close button; the parent owns the `open` state:
// <Modal :open="show" title="Delete?" @close="show = false">...</Modal>
const props = defineProps({
  open: { type: Boolean, required: true },
  title: { type: String, required: true },
})

const emit = defineEmits(['close'])

const dialog = ref(null)
const titleId = useId()

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    dialog.value?.focus()
  }
})
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
    data-testid="modal-backdrop"
    @click.self="emit('close')"
  >
    <div
      ref="dialog"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
      tabindex="-1"
      class="max-h-[90vh] w-full max-w-lg overflow-auto rounded-lg bg-white p-5 outline-none"
      @keydown.esc="emit('close')"
    >
      <header class="flex items-center justify-between">
        <h2
          :id="titleId"
          class="text-lg font-semibold"
        >
          {{ title }}
        </h2>
        <button
          type="button"
          aria-label="Close"
          class="text-2xl leading-none"
          @click="emit('close')"
        >
          &times;
        </button>
      </header>
      <div class="mt-3">
        <slot />
      </div>
      <footer
        v-if="$slots.footer"
        class="mt-4 flex justify-end gap-2"
      >
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>
