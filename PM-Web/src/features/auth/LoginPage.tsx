import { Form, Link, useActionData, useSearchParams } from 'react-router'
import { SubmitButton } from '../../components/SubmitButton.tsx'
import { usingMocks } from '../../lib/api.ts'
import type { loginAction } from './handlers.ts'

export function LoginPage() {
  const result = useActionData<typeof loginAction>()
  const [searchParams] = useSearchParams()

  return (
    <section className="auth">
      <h1>Log in</h1>
      <p className="muted">Welcome back. Log in to manage your properties.</p>

      {searchParams.has('registered') && (
        <p className="notice" role="status">
          Account created. Check your email to verify it, then log in.
        </p>
      )}
      {result?.error && (
        <p className="alert" role="alert">
          {result.error}
        </p>
      )}

      <Form method="post" className="form">
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <SubmitButton pendingText="Logging in…">Log in</SubmitButton>
      </Form>

      {usingMocks && <p className="hint">Demo account: admin@example.com / password</p>}

      <p className="muted auth-switch">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </section>
  )
}
