import { Link } from 'react-router'

export function Brand({ to }: { to: string }) {
  return (
    <Link to={to} className="brand">
      <svg className="brand-mark" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5V21h-6.5v-6h-5v6H3z" />
      </svg>
      Property Manager
    </Link>
  )
}
