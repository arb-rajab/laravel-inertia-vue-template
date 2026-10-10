<script setup>
import { Head, usePage } from '@inertiajs/vue3'
import AppLayout from '../Layouts/AppLayout.vue'

const page = usePage()
</script>

<template>
  <AppLayout>
    <Head title="Dashboard" />
    <h1 class="text-2xl font-bold">
      Dashboard
    </h1>
    <p
      v-if="page.props.auth.user"
      class="mt-2 text-gray-600"
    >
      Signed in as {{ page.props.auth.user.name }} ({{ page.props.auth.user.email }}), role
      <code>{{ page.props.auth.user.role }}</code>.
    </p>
  </AppLayout>
</template>
