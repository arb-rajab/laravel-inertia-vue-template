import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from '../../resources/js/Components/Alert.vue'
import Button from '../../resources/js/Components/Button.vue'
import DataTable from '../../resources/js/Components/DataTable.vue'
import EmptyState from '../../resources/js/Components/EmptyState.vue'
import FormField from '../../resources/js/Components/FormField.vue'
import Modal from '../../resources/js/Components/Modal.vue'
import Pagination from '../../resources/js/Components/Pagination.vue'
import Spinner from '../../resources/js/Components/Spinner.vue'
import TextInput from '../../resources/js/Components/TextInput.vue'

describe('Button', () => {
  it('renders its slot, defaults to type=button and honours disabled', () => {
    const wrapper = mount(Button, { props: { disabled: true }, slots: { default: 'Save' } })

    expect(wrapper.text()).toBe('Save')
    expect(wrapper.attributes('type')).toBe('button')
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('emits click when enabled', async () => {
    const wrapper = mount(Button, { slots: { default: 'Go' } })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('styles the link variant differently from the primary one', () => {
    const primary = mount(Button)
    const link = mount(Button, { props: { variant: 'link' } })

    expect(primary.classes()).toContain('bg-gray-900')
    expect(link.classes()).toContain('underline')
  })
})

describe('Alert', () => {
  it('uses role=alert for errors and role=status for info', () => {
    expect(mount(Alert, { slots: { default: 'Broken' } }).attributes('role')).toBe('alert')
    expect(mount(Alert, { props: { kind: 'info' }, slots: { default: 'FYI' } }).attributes('role')).toBe('status')
  })
})

describe('TextInput', () => {
  it('binds v-model and links the label to the input', async () => {
    const wrapper = mount(TextInput, { props: { id: 'email', label: 'Email', modelValue: '' } })

    expect(wrapper.find('label').attributes('for')).toBe('email')

    await wrapper.find('input').setValue('a@example.test')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['a@example.test'])
  })

  it('shows the field error and marks the input invalid', () => {
    const wrapper = mount(TextInput, { props: { id: 'email', label: 'Email', error: 'The email field is required.' } })

    expect(wrapper.text()).toContain('The email field is required.')
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
  })

  it('shows no error text when valid', () => {
    const wrapper = mount(TextInput, { props: { id: 'name', label: 'Name' } })

    expect(wrapper.find('p').exists()).toBe(false)
    expect(wrapper.find('input').attributes('aria-invalid')).toBeUndefined()
  })
})

describe('FormField', () => {
  it('wraps any control with a label and an error', () => {
    const wrapper = mount(FormField, {
      props: { id: 'role', label: 'Role', error: 'Pick a role.' },
      slots: { default: '<select id="role"></select>' },
    })

    expect(wrapper.find('label').text()).toBe('Role')
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.text()).toContain('Pick a role.')
  })
})

describe('Spinner', () => {
  it('is an accessible status element with a label', () => {
    const wrapper = mount(Spinner, { props: { label: 'Saving' } })

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.attributes('aria-label')).toBe('Saving')
  })
})

describe('EmptyState', () => {
  it('shows the title, description and actions slot', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'No items', description: 'Create your first one.' },
      slots: { default: '<button>Create</button>' },
    })

    expect(wrapper.text()).toContain('No items')
    expect(wrapper.text()).toContain('Create your first one.')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('omits the description and actions when not given', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Nothing' } })

    expect(wrapper.find('p').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(false)
  })
})

describe('Modal', () => {
  it('renders nothing while closed', () => {
    expect(mount(Modal, { props: { open: false, title: 'Confirm' } }).find('[role="dialog"]').exists()).toBe(false)
  })

  it('renders a labelled dialog and emits close on Escape, the close button and the backdrop', async () => {
    const wrapper = mount(Modal, {
      props: { open: true, title: 'Confirm' },
      slots: { default: 'Are you sure?', footer: '<button>OK</button>' },
    })
    const dialog = wrapper.find('[role="dialog"]')

    expect(dialog.attributes('aria-modal')).toBe('true')
    expect(dialog.attributes('aria-labelledby')).toBe(wrapper.find('h2').attributes('id'))
    expect(wrapper.text()).toContain('Are you sure?')

    await dialog.trigger('keydown', { key: 'Escape' })
    await wrapper.find('button[aria-label="Close"]').trigger('click')
    await wrapper.find('[data-testid="modal-backdrop"]').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(3)
  })

  it('does not close when the dialog body itself is clicked', async () => {
    const wrapper = mount(Modal, { props: { open: true, title: 'Confirm' } })

    await wrapper.find('[role="dialog"]').trigger('click')

    expect(wrapper.emitted('close')).toBeUndefined()
  })
})

describe('Pagination', () => {
  const meta = { current_page: 2, per_page: 10, total: 35, last_page: 4 }

  it('emits the neighbouring page numbers', async () => {
    const wrapper = mount(Pagination, { props: { meta } })
    const [previous, next] = wrapper.findAll('button')

    await previous.trigger('click')
    await next.trigger('click')

    expect(wrapper.text()).toContain('Page 2 of 4')
    expect(wrapper.emitted('change')).toEqual([[1], [3]])
  })

  it('disables previous on the first page and next on the last', () => {
    const first = mount(Pagination, { props: { meta: { ...meta, current_page: 1 } } })
    const last = mount(Pagination, { props: { meta: { ...meta, current_page: 4 } } })

    expect(first.findAll('button')[0].attributes('disabled')).toBeDefined()
    expect(last.findAll('button')[1].attributes('disabled')).toBeDefined()
  })

  it('renders nothing for a single page', () => {
    expect(mount(Pagination, { props: { meta: { ...meta, current_page: 1, last_page: 1 } } }).find('nav').exists()).toBe(false)
  })
})

describe('DataTable', () => {
  const columns = [{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]
  const rows = [{ id: 'a', name: 'Ada', role: 'admin' }, { id: 'b', name: 'Bo', role: 'member' }]

  it('renders a header per column and a row per record', () => {
    const wrapper = mount(DataTable, { props: { columns, rows } })

    expect(wrapper.findAll('th').map((th) => th.text())).toEqual(['Name', 'Role'])
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.text()).toContain('Ada')
  })

  it('lets a cell slot override the default rendering', () => {
    const wrapper = mount(DataTable, {
      props: { columns, rows },
      slots: { 'cell-role': '<template #cell-role="{ value }"><strong>{{ value }}!</strong></template>' },
    })

    expect(wrapper.findAll('strong').map((el) => el.text())).toEqual(['admin!', 'member!'])
  })

  it('shows a spinner while loading, and the empty state when there are no rows', () => {
    const loading = mount(DataTable, { props: { columns, rows, loading: true } })
    const empty = mount(DataTable, { props: { columns, rows: [], emptyTitle: 'No users' } })

    expect(loading.find('[role="status"]').exists()).toBe(true)
    expect(loading.find('table').exists()).toBe(false)
    expect(empty.text()).toContain('No users')
    expect(empty.find('table').exists()).toBe(false)
  })
})
