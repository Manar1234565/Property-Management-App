import { mockFetch } from './mock-api.ts'

/** Error response from the API. The body is expected to be `{ "message": "..." }`. */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export const usingMocks = import.meta.env.VITE_API_MOCKS === 'true'

async function send<T>(method: string, path: string, body?: unknown): Promise<T> {
  const init: RequestInit = {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  }
  // The session is an HttpOnly cookie set by the API. Requests go to the same
  // origin (/api is proxied to the backend in development), so the browser
  // sends it automatically and the app never handles tokens itself.
  const response = usingMocks ? await mockFetch(path, init) : await fetch(`/api${path}`, init)

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new ApiError(response.status, error?.message ?? 'Something went wrong. Please try again.')
  }
  const text = await response.text()
  return (text ? JSON.parse(text) : undefined) as T
}

export const api = {
  get: <T>(path: string) => send<T>('GET', path),
  post: <T>(path: string, body?: unknown) => send<T>('POST', path, body),
}

/** For route actions: turns an API error into a message the form can show; anything else goes to the error page. */
export function toFormError(error: unknown) {
  if (error instanceof ApiError) return { error: error.message }
  throw error
}
