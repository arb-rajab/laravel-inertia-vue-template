import { ref } from 'vue'

/**
 * Turns a failed API response body into a banner message plus per-field
 * messages, so every form follows one rule.
 *
 * The server's response is authoritative: `applyError` always replaces the
 * previous attempt's errors wholesale rather than merging, so a resubmission
 * never shows a stale field error for something the latest response accepts.
 * Native HTML validation (`required`, ...) still gives immediate feedback but
 * can only check what the browser can.
 */
export function useFormErrors() {
  const fieldErrors = ref({})
  const formError = ref(null)

  function fieldError(field) {
    return fieldErrors.value[field]?.[0] ?? ''
  }

  /** Messages for fields the form has no input for, so nothing the server reports is dropped. */
  function otherFieldErrors(knownFields) {
    return Object.entries(fieldErrors.value)
      .filter(([field]) => !knownFields.includes(field))
      .flatMap(([, messages]) => messages)
  }

  function clear() {
    fieldErrors.value = {}
    formError.value = null
  }

  /**
   * @param {{ error?: string, fields?: Record<string, string[]> }} body the response `data` from postJson()
   * @param {(code: string) => string} describe maps an error code to banner text
   */
  function applyError(body, describe) {
    const code = body?.error ?? 'UNKNOWN_ERROR'
    fieldErrors.value = code === 'VALIDATION_FAILED' && body.fields ? body.fields : {}
    formError.value = describe(code)
  }

  return { fieldErrors, formError, fieldError, otherFieldErrors, clear, applyError }
}
