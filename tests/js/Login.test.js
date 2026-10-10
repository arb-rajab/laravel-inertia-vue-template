import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Login from '../../resources/js/Pages/Login.vue'

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props: { appName: 'Starter', auth: { user: null }, csrfToken: 'tok-123' } }),
  Head: { template: '<span />' },
  Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
}))

afterEach(() => vi.unstubAllGlobals())

async function submitWith(response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)

  const wrapper = mount(Login)
  await wrapper.find('#email').setValue('  ada@example.test ')
  await wrapper.find('#password').setValue('secret')
  await wrapper.find('form').trigger('submit.prevent')
  await flushPromises()

  return { wrapper, fetchMock }
}

describe('Login page', () => {
  it('posts the trimmed email, the password and the CSRF token as JSON', async () => {
    vi.stubGlobal('location', { href: '' })

    const { fetchMock } = await submitWith({ ok: true, json: async () => ({ redirect: '/dashboard' }) })

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/login')
    expect(init.headers['X-CSRF-TOKEN']).toBe('tok-123')
    expect(JSON.parse(init.body)).toEqual({ email: 'ada@example.test', password: 'secret' })
    expect(window.location.href).toBe('/dashboard')
  })

  it('shows the server\'s validation message when the credentials are rejected', async () => {
    const { wrapper } = await submitWith({
      ok: false,
      status: 422,
      json: async () => ({ error: 'VALIDATION_FAILED', fields: { email: ['These credentials do not match our records.'] } }),
    })

    expect(wrapper.find('[role="alert"]').text()).toBe('Please check the highlighted fields.')
    expect(wrapper.text()).toContain('These credentials do not match our records.')
    expect(wrapper.find('#email').attributes('aria-invalid')).toBe('true')
  })

  it('shows a network error banner when the request never reaches the server', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    const wrapper = mount(Login)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').text()).toBe('Could not reach the server. Please try again.')
  })
})
