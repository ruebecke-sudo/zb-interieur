import { Helmet } from 'react-helmet-async'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'

/** Neutral frame for Image Manager Pro – deliberately without the ZB Interieur website header, footer and widgets. */
export function ImageManagerLayout() {
  const { pathname } = useLocation()
  const isPublicLanding = pathname.replace(/\/$/, '') === '/image-manager'
  return (
    <>
      <Helmet>
        <title>Image Manager Pro</title>
        {!isPublicLanding && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}
