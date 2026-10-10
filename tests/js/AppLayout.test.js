import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLayout from '../../resources/js/Layouts/AppLayout.vue'

// usePage() reads Inertia's shared props from a context that only exists
// inside a running Inertia app, so the tests supply their own.
let props = {}

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props }),
  Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
}))

describe('AppLayout', () => {
  it('shows a log-in link when nobody is signed in', () => {
    props = { appName: 'Starter', auth: { user: null }, csrfToken: 't' }

    const wrapper = mount(AppLayout, { slots: { default: '<p>content</p>' } })

    expect(wrapper.text()).toContain('Log in')
    expect(wrapper.text()).toContain('content')
    expect(wrapper.text()).not.toContain('Log out')
  })

  it('renders without an auth prop, as on an error page for an unmatched route', () => {
    props = { appName: 'Starter', csrfToken: 't' }

    const wrapper = mount(AppLayout)

    expect(wrapper.text()).toContain('Log in')
  })

  it('shows the user and a log-out button when signed in, and posts the CSRF token on logout', async () => {
    props = { appName: 'Starter', auth: { user: { name: 'Ada', email: 'a@example.test', role: 'admin' } }, csrfToken: 'tok-123' }
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ redirect: '/login' }) })
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('location', { href: '' })

    const wrapper = mount(AppLayout)

    expect(wrapper.text()).toContain('Ada')

    await wrapper.find('button').trigger('click')

    expect(fetchMock).toHaveBeenCalledWith('/logout', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ 'X-CSRF-TOKEN': 'tok-123' }),
    }))
  })
})
