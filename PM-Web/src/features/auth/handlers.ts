import { redirect, type ActionFunctionArgs } from 'react-router'
import { ApiError, toFormError } from '../../lib/api.ts'
import { getCurrentUser, login, logout, register, type Credentials, type Registration } from './api.ts'

/** Loader for routes behind login: returns the current user, or sends visitors to the login page. */
export async function requireUser() {
  try {
    return await getCurrentUser()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) throw redirect('/login')
    throw error
  }
}

export async function loginAction({ request }: ActionFunctionArgs) {
  const credentials = Object.fromEntries(await request.formData()) as Credentials
  try {
    await login(credentials)
  } catch (error) {
    return toFormError(error)
  }
  return redirect('/properties')
}

export async function registerAction({ request }: ActionFunctionArgs) {
  const registration = Object.fromEntries(await request.formData()) as Registration
  try {
    await register(registration)
  } catch (error) {
    return toFormError(error)
  }
  // The API emails a verification link; the user logs in once the address is verified.
  return redirect('/login?registered')
}

export async function logoutAction() {
  await logout()
  return redirect('/')
}
