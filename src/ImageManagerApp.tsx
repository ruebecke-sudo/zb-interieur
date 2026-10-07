import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { imageManagerRoute } from './imageManagerRoute'
import { ImageManagerGalleryPage } from './pages/ImageManagerGalleryPage'

/** Neutral SaaS site (VITE_IMAGE_MANAGER_STANDALONE=true): only Image Manager Pro, no ZB Interieur pages. */
const router = createBrowserRouter([
  imageManagerRoute,
  // Short public gallery address: /g/<slug>
  { path: '/g/:slug', element: <ImageManagerGalleryPage /> },
  { path: '*', element: <Navigate to="/image-manager/login" replace /> },
])

export default function ImageManagerApp() {
  return <RouterProvider router={router} />
}
