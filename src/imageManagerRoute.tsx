import type { RouteObject } from 'react-router-dom'
import { ImageManagerLayout } from './components/ImageManagerLayout'
import { ImageManagerAuthPage } from './pages/ImageManagerAuthPage'
import { ImageManagerDashboardPage } from './pages/ImageManagerDashboardPage'
import { ImageManagerLandingPage } from './pages/ImageManagerLandingPage'

/** Image Manager Pro routes, shared by the ZB site and the neutral SaaS site. */
export const imageManagerRoute: RouteObject = {
  // Runs without the ZB Interieur website frame (white-label).
  path: '/image-manager',
  element: <ImageManagerLayout />,
  children: [
    { index: true, element: <ImageManagerLandingPage /> },
    { path: 'login', element: <ImageManagerAuthPage /> },
    { path: 'app', element: <ImageManagerDashboardPage /> },
  ],
}
