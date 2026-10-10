import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorPage from '../../resources/js/Pages/Error.vue'

vi.mock('@inertiajs/vue3', () => ({
  usePage: () => ({ props: { appName: 'Starter', csrfToken: 't' } }),
  Head: { template: '<span />' },
  Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
}))

describe('Pages/Error', () => {
  it.each([
    [403, 'Forbidden'],
    [404, 'Page not found'],
    [503, 'Service unavailable'],
    [500, 'Something went wrong'],
  ])('explains a %i', (status, heading) => {
    const wrapper = mount(ErrorPage, { props: { status } })

    expect(wrapper.find('h1').text()).toBe(heading)
    expect(wrapper.text()).toContain(String(status))
  })
})
