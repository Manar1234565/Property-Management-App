import { Form, NavLink, Outlet, ScrollRestoration, useLoaderData } from 'react-router'
import { Brand } from '../components/Brand.tsx'
import type { requireUser } from '../features/auth/handlers.ts'

export function DashboardLayout() {
  const user = useLoaderData<typeof requireUser>()

  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Brand to="/properties" />
          <nav className="dashboard-nav">
            <NavLink to="/properties">Properties</NavLink>
          </nav>
          <div className="header-actions">
            <span className="muted">{user.name}</span>
            <Form method="post" action="/logout">
              <button type="submit" className="button button-ghost">
                Log out
              </button>
            </Form>
          </div>
        </div>
      </header>

      <main className="container dashboard-main">
        <Outlet />
      </main>
      <ScrollRestoration />
    </>
  )
}
