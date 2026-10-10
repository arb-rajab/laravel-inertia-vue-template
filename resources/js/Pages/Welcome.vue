<script setup>
import { Head } from '@inertiajs/vue3'
import AppLayout from '../Layouts/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <Head title="Welcome" />
    <h1 class="text-2xl font-bold">
      Welcome
    </h1>
    <p class="mt-2 text-gray-600">
      A Laravel + Inertia + Vue 3 + Tailwind starter. Replace this page with your own.
    </p>
  </AppLayout>
</template>
