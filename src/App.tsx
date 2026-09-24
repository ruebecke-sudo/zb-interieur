import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { BeratungPage } from './pages/BeratungPage'
import { HomePage } from './pages/HomePage'
import { AgbPage, DatenschutzPage, ImpressumPage } from './pages/LegalPages'
import { KontaktPage } from './pages/KontaktPage'
import { OutdoorPage } from './pages/OutdoorPage'
import { PlanungPage } from './pages/PlanungPage'
import { ServicePage } from './pages/ServicePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'beratung', element: <BeratungPage /> },
      { path: 'planung', element: <PlanungPage /> },
      { path: 'outdoor', element: <OutdoorPage /> },
      { path: 'service', element: <ServicePage /> },
      { path: 'kontakt', element: <KontaktPage /> },
      { path: 'impressum', element: <ImpressumPage /> },
      { path: 'datenschutz', element: <DatenschutzPage /> },
      { path: 'agb', element: <AgbPage /> },
      // Alte Galerie-/Blog-URLs → sinnvolle Ziele
      { path: 'galerien', element: <Navigate to="/planung" replace /> },
      { path: 'galerie', element: <Navigate to="/planung" replace /> },
      { path: 'blog', element: <Navigate to="/" replace /> },
      { path: 'blog/*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
