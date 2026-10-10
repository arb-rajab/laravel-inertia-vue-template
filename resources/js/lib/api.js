/**
 * POSTs JSON to an application route and normalises the outcome, so pages
 * never branch on fetch() internals.
 *
 * Resolves to `{ ok, status, data }`. `data` is the parsed JSON body (an
 * empty object when there is none). A request that never reached the server
 * resolves to `{ ok: false, status: 0, data: { error: 'NETWORK_ERROR' } }`.
 *
 * Errors follow the backend contract (App\Exceptions\ApiExceptionRenderer):
 * `{ error: 'CODE', fields?: { field: ['message'] } }`.
 *
 * `csrfToken` is the `csrfToken` Inertia shared prop. fetch() does not go
 * through Inertia's axios instance, which would attach the equivalent header
 * automatically.
 */
export async function postJson(url, body, csrfToken) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-CSRF-TOKEN': csrfToken,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))

    return { ok: response.ok, status: response.status, data }
  } catch {
    return { ok: false, status: 0, data: { error: 'NETWORK_ERROR' } }
  }
}
