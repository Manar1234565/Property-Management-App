import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { ApiError } from '../lib/api.ts'

const messages = {
  401: { title: 'Your session has expired', text: 'Log in again to continue.', to: '/login', action: 'Log in' },
  404: { title: 'Page not found', text: "This page doesn't exist or was moved.", to: '/', action: 'Back to home' },
  500: { title: 'Something went wrong', text: 'Please try again in a moment.', to: '/', action: 'Back to home' },
}

export function ErrorPage() {
  const error = useRouteError()
  const status = isRouteErrorResponse(error) || error instanceof ApiError ? error.status : 500
  const message = status === 401 || status === 404 ? messages[status] : messages[500]

  return (
    <section className="container error-page">
      <p className="eyebrow">Error {status}</p>
      <h1>{message.title}</h1>
      <p className="muted">{message.text}</p>
      <Link to={message.to} className="button button-primary">
        {message.action}
      </Link>
    </section>
  )
}
