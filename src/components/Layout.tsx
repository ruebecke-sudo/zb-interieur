import { Outlet, ScrollRestoration } from 'react-router-dom'
import { ContactModal } from './ContactModal'
import { Footer } from './Footer'
import { Header } from './Header'
import { ImageZoomRoot, LightboxProvider } from './ImageLightbox'
import { ScrollToTopButton } from './ScrollToTopButton'
import { Seo } from './Seo'
import { WhatsAppButton } from './WhatsAppButton'

export function Layout() {
  return (
    <LightboxProvider>
      <ImageZoomRoot>
        <div id="top" tabIndex={-1} className="min-h-screen bg-white outline-none">
          <Seo />
          <a href="#main-content" className="skip-link">
            Zum Inhalt springen
          </a>
          <Header />
          <main
            id="main-content"
            tabIndex={-1}
            className="outline-none [&_img:not([data-no-zoom])]:cursor-zoom-in"
          >
            <Outlet />
          </main>
          <Footer />
          <ScrollToTopButton />
          <WhatsAppButton />
          <ContactModal />
          <ScrollRestoration />
        </div>
      </ImageZoomRoot>
    </LightboxProvider>
  )
}
