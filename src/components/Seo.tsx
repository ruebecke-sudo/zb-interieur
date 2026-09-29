import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import {
  absoluteUrl,
  breadcrumbJsonLd,
  defaultOgImage,
  localBusinessJsonLd,
  resolvePageSeo,
  websiteJsonLd,
} from '../data/seo'
import { faqs, site } from '../data/site'

export function Seo() {
  const { pathname } = useLocation()
  const seo = resolvePageSeo(pathname)
  const url = absoluteUrl(seo.path)
  const image = seo.ogImage || defaultOgImage
  const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'

  const graph: Record<string, unknown>[] = [
    localBusinessJsonLd(),
    websiteJsonLd(),
    breadcrumbJsonLd(seo.path, seo.title),
  ]

  if (seo.path === '/') {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    })
  }

  return (
    <Helmet prioritizeSeoTags>
      <html lang="de" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />
      <meta name="author" content={site.legalName} />
      <meta name="geo.region" content="DE-SL" />
      <meta name="geo.placename" content="Homburg" />
      <meta name="geo.position" content="49.3299891;7.3465506" />
      <meta name="ICBM" content="49.3299891, 7.3465506" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={seo.type || 'website'} />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={seo.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">{`
        ${JSON.stringify(graph)}
      `}</script>
    </Helmet>
  )
}
