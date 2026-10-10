import { afterEach, describe, expect, it, vi } from 'vitest'
import { postJson } from '../../resources/js/lib/api'

afterEach(() => vi.unstubAllGlobals())

describe('postJson', () => {
  it('sends JSON with the CSRF token and returns the parsed body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ redirect: '/dashboard' }) })
    vi.stubGlobal('fetch', fetchMock)

    const result = await postJson('/login', { email: 'a@example.test' }, 'tok')

    expect(result).toEqual({ ok: true, status: 200, data: { redirect: '/dashboard' } })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/login')
    expect(init.method).toBe('POST')
    expect(init.headers['X-CSRF-TOKEN']).toBe('tok')
    expect(init.headers.Accept).toBe('application/json')
    expect(init.body).toBe('{"email":"a@example.test"}')
  })

  it('sends no body when none is given', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)

    await postJson('/logout', undefined, 'tok')

    expect(fetchMock.mock.calls[0][1].body).toBeUndefined()
  })

  it('returns an error body untouched with ok=false', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 422, json: async () => ({ error: 'VALIDATION_FAILED', fields: { a: ['x'] } }) }))

    const result = await postJson('/x', {}, 't')

    expect(result).toEqual({ ok: false, status: 422, data: { error: 'VALIDATION_FAILED', fields: { a: ['x'] } } })
  })

  it('tolerates a non-JSON response body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502, json: async () => { throw new SyntaxError('bad json') } }))

    expect(await postJson('/x', {}, 't')).toEqual({ ok: false, status: 502, data: {} })
  })

  it('maps a network failure to NETWORK_ERROR', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    expect(await postJson('/x', {}, 't')).toEqual({ ok: false, status: 0, data: { error: 'NETWORK_ERROR' } })
  })
})
