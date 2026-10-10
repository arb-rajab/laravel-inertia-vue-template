<script setup>
import { ref } from 'vue'
import { Head, usePage } from '@inertiajs/vue3'
import { postJson } from '../lib/api'
import { useFormErrors } from '../composables/useFormErrors'
import AppLayout from '../Layouts/AppLayout.vue'
import Alert from '../Components/Alert.vue'
import Button from '../Components/Button.vue'
import TextInput from '../Components/TextInput.vue'

const page = usePage()
const { formError, fieldError, applyError, clear } = useFormErrors()

const email = ref('')
const password = ref('')
const submitting = ref(false)

function describeError(code) {
  const messages = {
    VALIDATION_FAILED: 'Please check the highlighted fields.',
    NETWORK_ERROR: 'Could not reach the server. Please try again.',
  }
  return messages[code] ?? `Login failed (${code}).`
}

async function submit() {
  submitting.value = true
  clear()

  const { ok, data } = await postJson('/login', { email: email.value.trim(), password: password.value }, page.props.csrfToken)

  if (ok) {
    window.location.href = data.redirect
    return
  }

  applyError(data, describeError)
  submitting.value = false
}
</script>

<template>
  <AppLayout>
    <Head title="Log in" />
    <div class="mx-auto max-w-sm">
      <h1 class="mb-4 text-2xl font-bold">
        Log in
      </h1>

      <form
        class="flex flex-col gap-4"
        @submit.prevent="submit"
      >
        <TextInput
          id="email"
          v-model="email"
          label="Email"
          type="email"
          autocomplete="username"
          required
          :error="fieldError('email')"
          :disabled="submitting"
        />
        <TextInput
          id="password"
          v-model="password"
          label="Password"
          type="password"
          autocomplete="current-password"
          required
          :error="fieldError('password')"
          :disabled="submitting"
        />

        <Alert v-if="formError">
          {{ formError }}
        </Alert>

        <Button
          type="submit"
          :disabled="submitting"
        >
          {{ submitting ? 'Logging in…' : 'Log in' }}
        </Button>
      </form>
    </div>
  </AppLayout>
</template>
