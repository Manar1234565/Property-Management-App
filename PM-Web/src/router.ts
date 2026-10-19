import { createBrowserRouter, redirect } from 'react-router'
import { loginAction, logoutAction, registerAction, requireUser } from './features/auth/handlers.ts'
import { LoginPage } from './features/auth/LoginPage.tsx'
import { RegisterPage } from './features/auth/RegisterPage.tsx'
import { newPropertyAction, propertiesLoader, propertyLoader } from './features/properties/handlers.ts'
import { NewPropertyPage } from './features/properties/NewPropertyPage.tsx'
import { PropertiesPage } from './features/properties/PropertiesPage.tsx'
import { PropertyPage } from './features/properties/PropertyPage.tsx'
import { DashboardLayout } from './layouts/DashboardLayout.tsx'
import { PublicLayout } from './layouts/PublicLayout.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'
import { LandingPage } from './pages/LandingPage.tsx'

export const router = createBrowserRouter([
  {
    ErrorBoundary: ErrorPage,
    children: [
      {
        Component: PublicLayout,
        children: [
          { index: true, Component: LandingPage },
          { path: 'login', Component: LoginPage, action: loginAction },
          { path: 'register', Component: RegisterPage, action: registerAction },
        ],
      },
      {
        // Everything inside this route requires a logged-in user.
        loader: requireUser,
        Component: DashboardLayout,
        children: [
          {
            // Errors in a page render inside the dashboard instead of replacing it.
            ErrorBoundary: ErrorPage,
            children: [
              { path: 'properties', Component: PropertiesPage, loader: propertiesLoader },
              { path: 'properties/new', Component: NewPropertyPage, action: newPropertyAction },
              { path: 'properties/:propertyId', Component: PropertyPage, loader: propertyLoader },
            ],
          },
        ],
      },
      { path: 'logout', action: logoutAction, loader: () => redirect('/') },
    ],
  },
])
