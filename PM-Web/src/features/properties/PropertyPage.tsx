import { Link, useLoaderData } from 'react-router'
import type { propertyLoader } from './handlers.ts'
import { PropertyStatusBadge } from './PropertyStatusBadge.tsx'

export function PropertyPage() {
  const property = useLoaderData<typeof propertyLoader>()

  return (
    <>
      <Link to="/properties" className="back-link">
        ← All properties
      </Link>
      <div className="page-header">
        <h1>{property.name}</h1>
        <PropertyStatusBadge status={property.status} />
      </div>

      <dl className="details">
        <div>
          <dt>Address</dt>
          <dd>{property.address}</dd>
        </div>
        <div>
          <dt>City</dt>
          <dd>{property.city}</dd>
        </div>
        <div>
          <dt>Description</dt>
          <dd>{property.description || '—'}</dd>
        </div>
      </dl>
    </>
  )
}
