import { api } from '../../lib/api.ts'

export type PropertyStatus = 'available' | 'occupied' | 'maintenance' | 'inactive'

export type Property = {
  id: string
  name: string
  address: string
  city: string
  description: string
  status: PropertyStatus
}

/** New properties start as `available`; the API sets the status. */
export type NewProperty = Omit<Property, 'id' | 'status'>

export const listProperties = () => api.get<Property[]>('/properties')
export const getProperty = (id: string) => api.get<Property>(`/properties/${encodeURIComponent(id)}`)
export const createProperty = (property: NewProperty) => api.post<Property>('/properties', property)
