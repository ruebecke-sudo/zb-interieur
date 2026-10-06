import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { imageManagerRoute } from './imageManagerRoute'

/** Neutral SaaS site (VITE_IMAGE_MANAGER_STANDALONE=true): only Image Manager Pro, no ZB Interieur pages. */
const router = createBrowserRouter([
  imageManagerRoute,
  { path: '*', element: <Navigate to="/image-manager/login" replace /> },
])

export default function ImageManagerApp() {
  return <RouterProvider router={router} />
}
