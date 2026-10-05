import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout'
import { BeratungPage } from './pages/BeratungPage'
import { BlogPage } from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPostPage'
import { HomePage } from './pages/HomePage'
import { AgbPage, BarrierefreiheitPage, DatenschutzPage, ImpressumPage } from './pages/LegalPages'
import { KontaktPage } from './pages/KontaktPage'
import { MarkenPage } from './pages/MarkenPage'
import { MagazinPage } from './pages/MagazinPage'
import { OutdoorPage } from './pages/OutdoorPage'
import { PlanungPage } from './pages/PlanungPage'
import { ServicePage } from './pages/ServicePage'
import { TerminPage } from './pages/TerminPage'
import { ProduktUploadPage } from './pages/ProduktUploadPage'
import { BildverwaltungPage } from './pages/BildverwaltungPage'
import { ImageManagerDashboardPage } from './pages/ImageManagerDashboardPage'
import { ImageManagerAuthPage } from './pages/ImageManagerAuthPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'beratung', element: <BeratungPage /> },
      { path: 'planung', element: <PlanungPage /> },
      { path: 'marken', element: <MarkenPage /> },
      { path: 'verwaltung/produkte', element: <ProduktUploadPage /> },
      { path: 'verwaltung/bilder', element: <BildverwaltungPage /> },
      { path: 'image-manager/login', element: <ImageManagerAuthPage /> },
      { path: 'image-manager', element: <ImageManagerDashboardPage /> },
      { path: 'magazin', element: <MagazinPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'blog/:slug', element: <BlogPostPage /> },
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
      { path: 'barrierefreiheit', element: <BarrierefreiheitPage /> },
      { path: 'agb', element: <AgbPage /> },
      { path: 'galerien', element: <Navigate to="/planung" replace /> },
      { path: 'galerie', element: <Navigate to="/planung" replace /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
