import { Link, useLoaderData } from 'react-router'
import type { propertiesLoader } from './handlers.ts'
import { PropertyStatusBadge } from './PropertyStatusBadge.tsx'

export function PropertiesPage() {
  const properties = useLoaderData<typeof propertiesLoader>()

  return (
    <>
      <div className="page-header">
        <h1>Properties</h1>
        <Link to="/properties/new" className="button button-primary">
          Add property
        </Link>
      </div>

      {properties.length === 0 ? (
        <p className="empty-state">You don't manage any properties yet. Add your first one to get started.</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td>
                    <Link to={`/properties/${property.id}`}>{property.name}</Link>
                  </td>
                  <td>{property.city}</td>
                  <td>{property.address}</td>
                  <td>
                    <PropertyStatusBadge status={property.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
