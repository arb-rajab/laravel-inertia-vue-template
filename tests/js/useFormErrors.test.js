import { describe, expect, it } from 'vitest'
import { useFormErrors } from '../../resources/js/composables/useFormErrors'

const describeCode = (code) => (code === 'VALIDATION_FAILED' ? 'Please check the highlighted fields.' : `Failed (${code})`)

describe('useFormErrors', () => {
  it('surfaces a banner and per-field messages from a VALIDATION_FAILED body', () => {
    const { fieldErrors, formError, fieldError, applyError } = useFormErrors()

    applyError({ error: 'VALIDATION_FAILED', fields: { name: ['The name field is required.'] } }, describeCode)

    expect(formError.value).toBe('Please check the highlighted fields.')
    expect(fieldErrors.value).toEqual({ name: ['The name field is required.'] })
    expect(fieldError('name')).toBe('The name field is required.')
    expect(fieldError('other')).toBe('')
  })

  it('sets only the banner for a non-validation error', () => {
    const { fieldErrors, formError, applyError } = useFormErrors()

    applyError({ error: 'TOO_MANY_REQUESTS' }, describeCode)

    expect(fieldErrors.value).toEqual({})
    expect(formError.value).toBe('Failed (TOO_MANY_REQUESTS)')
  })

  it('replaces the previous attempt wholesale instead of merging', () => {
    const { fieldErrors, applyError } = useFormErrors()

    applyError({ error: 'VALIDATION_FAILED', fields: { a: ['x'] } }, describeCode)
    applyError({ error: 'VALIDATION_FAILED', fields: { b: ['y'] } }, describeCode)

    expect(fieldErrors.value).toEqual({ b: ['y'] })
  })

  it('lists messages for fields the form has no input for', () => {
    const { applyError, otherFieldErrors } = useFormErrors()

    applyError({ error: 'VALIDATION_FAILED', fields: { name: ['n'], extra: ['e1', 'e2'] } }, describeCode)

    expect(otherFieldErrors(['name'])).toEqual(['e1', 'e2'])
  })

  it('clear() resets both', () => {
    const { fieldErrors, formError, applyError, clear } = useFormErrors()

    applyError({ error: 'VALIDATION_FAILED', fields: { a: ['x'] } }, describeCode)
    clear()

    expect(fieldErrors.value).toEqual({})
    expect(formError.value).toBeNull()
  })
})
