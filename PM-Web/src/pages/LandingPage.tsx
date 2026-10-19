import { Link } from 'react-router'
import { PropertyStatusBadge } from '../features/properties/PropertyStatusBadge.tsx'

const features = [
  { title: 'Properties', text: 'Keep every listing, address and status up to date in one place.' },
  { title: 'Rentals', text: 'Track bookings, stay dates, agreed prices and the guests behind them.' },
  { title: 'Contracts', text: 'Create and review the rental agreement for every stay.' },
  { title: 'Inventory', text: 'Know which furniture, equipment and supplies each property has.' },
  { title: 'Housekeeping & maintenance', text: 'Schedule cleaning and follow every repair request until it is fixed.' },
  { title: 'Payments', text: 'See the payment status of every rental, processed securely by Stripe.' },
]

const preview = [
  { name: 'Seaside Apartment', city: 'Málaga', status: 'available' },
  { name: 'Old Town Loft', city: 'Madrid', status: 'occupied' },
  { name: 'Mountain Cabin', city: 'Granada', status: 'maintenance' },
] as const

export function LandingPage() {
  return (
    <>
      <section className="container hero">
        <div>
          <p className="eyebrow">For short-term rental managers</p>
          <h1>Run every property from one dashboard</h1>
          <p className="lead">
            Rentals, contracts, inventory, housekeeping and maintenance in a single place, with a mobile app that
            keeps your guests in the loop.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="button button-primary button-large">
              Get started
            </Link>
            <Link to="/login" className="button button-ghost button-large">
              Log in
            </Link>
          </div>
        </div>

        <div className="preview" aria-hidden="true">
          <p className="preview-title">Your properties</p>
          {preview.map((property) => (
            <div key={property.name} className="preview-row">
              <div>
                <strong>{property.name}</strong>
                <span className="muted">{property.city}</span>
              </div>
              <PropertyStatusBadge status={property.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Everything your properties need</h2>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title} className="card">
              <h3>{feature.title}</h3>
              <p className="muted">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="cta-band">
          <h2>Your guests get an app too</h2>
          <p className="muted">
            Guests check in, pay, read their rental agreement and report issues from the Android app, so you spend
            less time answering messages.
          </p>
          <Link to="/register" className="button button-primary button-large">
            Create your account
          </Link>
        </div>
      </section>
    </>
  )
}
