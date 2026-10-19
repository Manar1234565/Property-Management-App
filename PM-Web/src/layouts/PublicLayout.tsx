import { Link, Outlet, ScrollRestoration } from 'react-router'
import { Brand } from '../components/Brand.tsx'

const year = new Date().getFullYear()

export function PublicLayout() {
  return (
    <>
      <header className="site-header">
        <div className="container site-header-inner">
          <Brand to="/" />
          <nav className="header-actions">
            <Link to="/login" className="button button-ghost">
              Log in
            </Link>
            <Link to="/register" className="button button-primary">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">© {year} Property Manager</div>
      </footer>
      <ScrollRestoration />
    </>
  )
}
