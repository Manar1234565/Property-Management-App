import type { ReactNode } from 'react'
import { useNavigation } from 'react-router'

/** Form submit button that disables itself while the form's action is running. */
export function SubmitButton({ children, pendingText }: { children: ReactNode; pendingText: string }) {
  const submitting = useNavigation().state === 'submitting'

  return (
    <button type="submit" className="button button-primary" disabled={submitting}>
      {submitting ? pendingText : children}
    </button>
  )
}
