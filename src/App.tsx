import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { BeratungPage } from './pages/BeratungPage'
import { HomePage } from './pages/HomePage'
import { AgbPage, DatenschutzPage, ImpressumPage } from './pages/LegalPages'
import { KontaktPage } from './pages/KontaktPage'
import { MarkenPage } from './pages/MarkenPage'
import { MagazinPage } from './pages/MagazinPage'
import { OutdoorPage } from './pages/OutdoorPage'
import { PlanungPage } from './pages/PlanungPage'
import { ServicePage } from './pages/ServicePage'
import { TerminPage } from './pages/TerminPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'beratung', element: <BeratungPage /> },
      { path: 'planung', element: <PlanungPage /> },
      { path: 'marken', element: <MarkenPage /> },
      { path: 'magazin', element: <MagazinPage /> },
      { path: 'outdoor', element: <OutdoorPage /> },
      { path: 'kuechenplanungen-2', element: <Navigate to="/planung#kueche" replace /> },
      { path: 'badeinrichtungen', element: <Navigate to="/planung#bad" replace /> },
      { path: 'bueroeinrichtungen-2', element: <Navigate to="/planung#buero" replace /> },
      { path: 'terrassenplanung', element: <Navigate to="/planung#terrasse" replace /> },
      { path: 'objekt-hoteleinrichtungen-2', element: <Navigate to="/planung#objekt" replace /> },
      { path: 'sonderanfertigungen-2', element: <Navigate to="/planung#sonder" replace /> },
      { path: 'raumgestaltung', element: <Navigate to="/planung#raumgestaltung" replace /> },
      { path: 'service', element: <ServicePage /> },
      { path: 'termin', element: <TerminPage /> },
      { path: 'kontakt', element: <KontaktPage /> },
      { path: 'impressum', element: <ImpressumPage /> },
      { path: 'datenschutz', element: <DatenschutzPage /> },
      { path: 'agb', element: <AgbPage /> },
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
