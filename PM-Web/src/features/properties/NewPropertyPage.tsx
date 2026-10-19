import { Form, Link, useActionData } from 'react-router'
import { SubmitButton } from '../../components/SubmitButton.tsx'
import type { newPropertyAction } from './handlers.ts'

export function NewPropertyPage() {
  const result = useActionData<typeof newPropertyAction>()

  return (
    <div className="narrow">
      <Link to="/properties" className="back-link">
        ← All properties
      </Link>
      <h1>Add property</h1>

      {result?.error && (
        <p className="alert" role="alert">
          {result.error}
        </p>
      )}

      <Form method="post" className="form">
        <label>
          Name
          <input name="name" required />
        </label>
        <label>
          Address
          <input name="address" required />
        </label>
        <label>
          City
          <input name="city" required />
        </label>
        <label>
          Description
          <textarea name="description" rows={4} />
        </label>
        <div className="form-actions">
          <SubmitButton pendingText="Saving…">Save property</SubmitButton>
          <Link to="/properties" className="button button-ghost">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  )
}
