<script setup>
import { computed } from 'vue'
import { Head, Link } from '@inertiajs/vue3'
import AppLayout from '../Layouts/AppLayout.vue'

// Rendered by App\Exceptions\InertiaErrorPage for 403, 404, 500 and 503.
const props = defineProps({
  status: { type: Number, required: true },
})

const messages = {
  403: ['Forbidden', 'You do not have permission to view this page.'],
  404: ['Page not found', 'The page you are looking for does not exist.'],
  503: ['Service unavailable', 'We are doing some maintenance. Please try again shortly.'],
}

const content = computed(() => messages[props.status] ?? ['Something went wrong', 'An unexpected error occurred. Please try again.'])
</script>

<template>
  <AppLayout>
    <Head :title="content[0]" />
    <div class="mx-auto max-w-lg py-12 text-center">
      <p class="text-sm font-semibold text-gray-500">
        {{ status }}
      </p>
      <h1 class="mt-1 text-2xl font-bold">
        {{ content[0] }}
      </h1>
      <p class="mt-2 text-gray-600">
        {{ content[1] }}
      </p>
      <Link
        href="/"
        class="mt-6 inline-block underline"
      >
        Back to the home page
      </Link>
    </div>
  </AppLayout>
</template>
