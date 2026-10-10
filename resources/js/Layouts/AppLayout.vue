<script setup>
import { computed } from 'vue'
import { Link, usePage } from '@inertiajs/vue3'
import { postJson } from '../lib/api'
import Button from '../Components/Button.vue'

// `auth`, `csrfToken` and `appName` are shared on every page by
// HandleInertiaRequests. Error pages rendered for an unmatched route may not
// have `auth` (the web middleware group never ran), so read it defensively.
const page = usePage()
const user = computed(() => page.props.auth?.user ?? null)

async function logout() {
  const { data } = await postJson('/logout', undefined, page.props.csrfToken)
  window.location.href = data.redirect ?? '/login'
}
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b border-gray-200 bg-white">
      <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          class="font-semibold"
        >
          {{ page.props.appName }}
        </Link>
        <div class="flex items-center gap-4 text-sm">
          <template v-if="user">
            <Link href="/dashboard">
              Dashboard
            </Link>
            <span class="text-gray-500">{{ user.name }}</span>
            <Button
              variant="link"
              @click="logout"
            >
              Log out
            </Button>
          </template>
          <Link
            v-else
            href="/login"
          >
            Log in
          </Link>
        </div>
      </nav>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-8">
      <slot />
    </main>
  </div>
</template>
