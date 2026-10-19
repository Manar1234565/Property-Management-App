import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from 'react-router'
import { toFormError } from '../../lib/api.ts'
import { createProperty, getProperty, listProperties, type NewProperty } from './api.ts'

export const propertiesLoader = () => listProperties()

export const propertyLoader = ({ params }: LoaderFunctionArgs) => getProperty(params.propertyId!)

export async function newPropertyAction({ request }: ActionFunctionArgs) {
  const newProperty = Object.fromEntries(await request.formData()) as NewProperty
  try {
    const property = await createProperty(newProperty)
    return redirect(`/properties/${property.id}`)
  } catch (error) {
    return toFormError(error)
  }
}
