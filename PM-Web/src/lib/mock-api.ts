// Temporary in-memory backend so the web app can be built before Api/ exists.
// Enabled with VITE_API_MOCKS=true (see .env.development). Data is kept in
// localStorage. Delete this file once the real API implements these endpoints.

import type { User } from '../features/auth/api.ts'
import type { Property } from '../features/properties/api.ts'

type MockUser = User & { password: string }

type Db = {
  users: MockUser[]
  properties: Property[]
  sessionUserId: string | null
}

const STORAGE_KEY = 'pm-web-mock-db'

const seed: Db = {
  users: [{ id: '1', name: 'Demo Admin', email: 'admin@example.com', password: 'password' }],
  properties: [
    {
      id: '1',
      name: 'Seaside Apartment',
      address: '12 Harbour Road',
      city: 'Málaga',
      description: 'Two-bedroom apartment with a sea view, five minutes from the beach.',
      status: 'available',
    },
    {
      id: '2',
      name: 'Old Town Loft',
      address: '4 Calle Mayor',
      city: 'Madrid',
      description: 'Open-plan loft in the historic centre.',
      status: 'occupied',
    },
    {
      id: '3',
      name: 'Mountain Cabin',
      address: '8 Pine Trail',
      city: 'Granada',
      description: 'Wooden cabin near the Sierra Nevada ski slopes.',
      status: 'maintenance',
    },
  ],
  sessionUserId: null,
}

const load = (): Db => JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? structuredClone(seed)
const save = (db: Db) => localStorage.setItem(STORAGE_KEY, JSON.stringify(db))

const json = (body: unknown, status = 200) => Response.json(body, { status })
const fail = (status: number, message: string) => json({ message }, status)
const toUser = ({ id, name, email }: MockUser): User => ({ id, name, email })

export async function mockFetch(path: string, init: RequestInit): Promise<Response> {
  await new Promise((resolve) => setTimeout(resolve, 300)) // simulate network latency

  const db = load()
  const body = typeof init.body === 'string' ? JSON.parse(init.body) : {}
  const route = `${init.method} ${path}`

  if (route === 'POST /auth/login') {
    const user = db.users.find((u) => u.email === body.email && u.password === body.password)
    if (!user) return fail(401, 'Invalid email or password.')
    save({ ...db, sessionUserId: user.id })
    return json(toUser(user))
  }

  if (route === 'POST /auth/register') {
    if (db.users.some((u) => u.email === body.email)) {
      return fail(409, 'An account with this email already exists.')
    }
    const user: MockUser = { id: crypto.randomUUID(), name: body.name, email: body.email, password: body.password }
    save({ ...db, users: [...db.users, user] })
    return json(toUser(user), 201)
  }

  if (route === 'POST /auth/logout') {
    save({ ...db, sessionUserId: null })
    return new Response(null, { status: 204 })
  }

  const user = db.users.find((u) => u.id === db.sessionUserId)
  if (!user) return fail(401, 'Your session has expired. Please log in again.')

  if (route === 'GET /auth/me') return json(toUser(user))

  if (route === 'GET /properties') return json(db.properties)

  if (route === 'POST /properties') {
    const property: Property = { ...body, id: crypto.randomUUID(), status: 'available' }
    save({ ...db, properties: [...db.properties, property] })
    return json(property, 201)
  }

  const propertyId = path.match(/^\/properties\/([^/]+)$/)?.[1]
  if (init.method === 'GET' && propertyId) {
    const property = db.properties.find((p) => p.id === decodeURIComponent(propertyId))
    return property ? json(property) : fail(404, 'Property not found.')
  }

  return fail(404, `No mock for ${route}`)
}
