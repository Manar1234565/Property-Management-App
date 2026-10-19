import { Form, Link, useActionData } from 'react-router'
import { SubmitButton } from '../../components/SubmitButton.tsx'
import type { registerAction } from './handlers.ts'

export function RegisterPage() {
  const result = useActionData<typeof registerAction>()

  return (
    <section className="auth">
      <h1>Create your account</h1>
      <p className="muted">Start managing your properties in minutes.</p>

      {result?.error && (
        <p className="alert" role="alert">
          {result.error}
        </p>
      )}

      <Form method="post" className="form">
        <label>
          Full name
          <input name="name" autoComplete="name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="new-password" minLength={8} required />
          <span className="hint">At least 8 characters.</span>
        </label>
        <SubmitButton pendingText="Creating account…">Sign up</SubmitButton>
      </Form>

      <p className="muted auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}
