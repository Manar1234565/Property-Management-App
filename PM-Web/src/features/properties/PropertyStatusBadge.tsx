import type { PropertyStatus } from './api.ts'

export function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  return <span className={`badge badge-${status}`}>{status}</span>
}
