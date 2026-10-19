import { api } from '../../lib/api.ts'

export type User = {
  id: string
  name: string
  email: string
}

export type Credentials = {
  email: string
  password: string
}

export type Registration = Credentials & {
  name: string
}

export const login = (credentials: Credentials) => api.post<User>('/auth/login', credentials)
export const register = (registration: Registration) => api.post<User>('/auth/register', registration)
export const logout = () => api.post<void>('/auth/logout')
export const getCurrentUser = () => api.get<User>('/auth/me')
