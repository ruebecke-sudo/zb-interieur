import { blogPosts, getBlogPost } from './blog'
import { markenBrands } from './marken-data'
import { site } from './site'

/** Canonical production origin */
export const siteOrigin = 'https://zb-interieur.de'

export const brandNames = markenBrands.map((b) => b.name)
export const brandNamesInline = brandNames.join(', ')

export type PageSeo = {
  path: string
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

const localKeywords = [
  'Einrichtungshaus Homburg',
  'Möbelhaus Homburg',
  'Designmöbel Homburg',
  'Einrichtungsplanung Homburg',
  'Küchenplanung Homburg',
  'Einrichtungshaus Saarland',
  'Möbelhaus Saarland',
  'Designmöbel Saarland',
  'Einrichtungsplanung Saarbrücken',
  'Küchenplanung Saarbrücken',
  'Möbelhaus Saarbrücken',
  'Einrichtungshaus Saarbrücken',
  'ZB Interieur',
]

export const defaultOgImage = `${siteOrigin}/images/designmoebel-1.jpg`

export const pageSeo: Record<string, PageSeo> = {
  '/': {
    path: '/',
    title: 'Einrichtungshaus Homburg | Designmöbel & Einrichtungsplanung | ZB Interieur',
    description:
      'ZB Interieur – Einrichtungshaus und Möbelhaus in Homburg (Saarland). Exklusive Designmöbel, Einrichtungsplanung und Küchenplanung für Homburg, Saarbrücken und das Saarland. Showroom Mainzerstr. 77.',
    keywords: [
      ...localKeywords,
      'Designmöbel',
      'Einrichtungsplanung',
      'Küchenplanung',
      'Showroom Homburg',
      ...brandNames.slice(0, 12),
    ],
    ogImage: defaultOgImage,
  },
  '/beratung': {
    path: '/beratung',
    title: 'Einrichtungsberatung & Küchenplanung Homburg | ZB Interieur Saarland',
    description:
      'Persönliche Einrichtungsberatung in Homburg: Küchenplanung, Raumgestaltung und Wohnkonzepte für Homburg, Saarbrücken und das Saarland. Termin im Showroom von ZB Interieur.',
    keywords: [
      'Einrichtungsberatung Homburg',
      'Einrichtungsplanung Homburg',
      'Küchenplanung Homburg',
      'Küchenplanung Saarbrücken',
      'Einrichtungsberatung Saarland',
      'Wohnberatung Homburg',
      ...localKeywords.slice(0, 8),
    ],
    ogImage: `${siteOrigin}/images/kueche-render-1.jpg`,
  },
  '/planung': {
    path: '/planung',
    title: 'Küchenplanung & Einrichtungsplanung Homburg | Planung ZB Interieur',
    description:
      'Küchenplanung, Bad-, Büro- und Terrassenplanung in Homburg. Individuelle Einrichtungsplanung und Raumgestaltung für Homburg, Saarbrücken und das Saarland – ZB Interieur.',
    keywords: [
      'Küchenplanung Homburg',
      'Küchenplanung Saarland',
      'Küchenplanung Saarbrücken',
      'Einrichtungsplanung Homburg',
      'Badplanung Homburg',
      'Büroplanung Homburg',
      'Terrassenplanung Homburg',
      'Raumgestaltung Saarland',
      ...localKeywords.slice(0, 6),
    ],
    ogImage: `${siteOrigin}/images/planung/kueche-3.jpg`,
  },
  '/marken': {
    path: '/marken',
    title: `Designmöbel Marken Homburg | ${brandNames.slice(0, 6).join(', ')} & mehr | ZB Interieur`,
    description: `Designmöbel und Markenwelten im Einrichtungshaus Homburg: ${brandNamesInline}. Exklusive Möbelmarken für Homburg, Saarbrücken und das Saarland bei ZB Interieur.`,
    keywords: [
      'Designmöbel Homburg',
      'Designmöbel Saarland',
      'Designmöbel Saarbrücken',
      'Möbelmarken Homburg',
      ...brandNames,
      ...localKeywords.slice(0, 6),
    ],
    ogImage: `${siteOrigin}/images/marken/produkte/papadatos-9238eb4515.jpg`,
  },
  '/magazin': {
    path: '/magazin',
    title: 'Magazin & Broschüre 2026 | Designmöbel Inspiration | ZB Interieur Homburg',
    description:
      'ZB Interieur Magazin und Broschüre 2026: Inspiration für Designmöbel, Einrichtungsplanung und Showroom-Welten aus dem Einrichtungshaus in Homburg, Saarland.',
    keywords: [
      'Designmöbel Magazin',
      'Einrichtungsmagazin Homburg',
      'Möbelbroschüre Saarland',
      'ZB Interieur Broschüre',
      ...localKeywords.slice(0, 5),
    ],
    ogImage: defaultOgImage,
  },
  '/blog': {
    path: '/blog',
    title: 'Blog | Einrichtungsplanung, Designmöbel & Küchenplanung | ZB Interieur Homburg',
    description:
      'Blog vom Einrichtungshaus ZB Interieur in Homburg: Tipps zu Designmöbeln, Einrichtungsplanung, Küchenplanung und Showroom-Themen für Saarbrücken und das Saarland.',
    keywords: [
      'Blog Einrichtungshaus Homburg',
      'Einrichtungsplanung Tipps',
      'Küchenplanung Blog Saarland',
      'Designmöbel Blog Homburg',
      ...localKeywords.slice(0, 6),
    ],
    ogImage: defaultOgImage,
  },
  '/outdoor': {
    path: '/outdoor',
    title: 'Outdoormöbel & Terrassenplanung Homburg | Varaschin | ZB Interieur',
    description:
      'Premium-Outdoormöbel und Terrassenplanung in Homburg: Varaschin und weitere Marken für Terrasse und Garten. Beratung im Einrichtungshaus ZB Interieur, Saarland & Saarbrücken.',
    keywords: [
      'Outdoormöbel Homburg',
      'Terrassenplanung Homburg',
      'Terrassenmöbel Saarland',
      'Varaschin Homburg',
      'Unopiu Saarland',
      'Outdoor Designmöbel Saarbrücken',
      ...localKeywords.slice(0, 5),
    ],
    ogImage: `${siteOrigin}/images/galerien/moebel-varaschin/03.jpg`,
  },
  '/service': {
    path: '/service',
    title: 'Service & Tipps | Einrichtungshaus Homburg | ZB Interieur',
    description:
      'Service, Pflegehinweise und Downloads vom Einrichtungshaus ZB Interieur in Homburg – für Designmöbel, Küchen und Einrichtung im Saarland.',
    keywords: [
      'Möbelservice Homburg',
      'Einrichtungsservice Saarland',
      'Möbelpflege Tipps',
      ...localKeywords.slice(0, 5),
    ],
    ogImage: defaultOgImage,
  },
  '/termin': {
    path: '/termin',
    title: 'Termin buchen | Einrichtungshaus & Möbelhaus Homburg | ZB Interieur',
    description:
      'Beratungstermin im Einrichtungshaus Homburg buchen: Showroom-Besuch, Einrichtungsplanung, Küchenplanung oder Outdoor-Beratung bei ZB Interieur – auch für Saarbrücken und das Saarland.',
    keywords: [
      'Termin Einrichtungshaus Homburg',
      'Beratungstermin Möbelhaus Homburg',
      'Küchenplanung Termin Saarland',
      ...localKeywords.slice(0, 6),
    ],
    ogImage: defaultOgImage,
  },
  '/kontakt': {
    path: '/kontakt',
    title: 'Kontakt | Einrichtungshaus Homburg Mainzerstr. 77 | ZB Interieur',
    description: `Kontakt zum Einrichtungshaus und Möbelhaus ZB Interieur in Homburg: ${site.street}, ${site.zipCity}. Telefon ${site.phone}. Anfahrt aus Saarbrücken und dem Saarland.`,
    keywords: [
      'Kontakt Einrichtungshaus Homburg',
      'Möbelhaus Homburg Adresse',
      'ZB Interieur Kontakt',
      'Showroom Homburg',
      ...localKeywords.slice(0, 5),
    ],
    ogImage: defaultOgImage,
  },
  '/impressum': {
    path: '/impressum',
    title: 'Impressum | ZB Interieur Homburg',
    description: `Impressum der ${site.legalName}, Einrichtungshaus in Homburg, Saarland.`,
    keywords: ['Impressum ZB Interieur', 'Einrichtungshaus Homburg'],
    ogImage: defaultOgImage,
  },
  '/datenschutz': {
    path: '/datenschutz',
    title: 'Datenschutz | ZB Interieur Homburg',
    description: 'Datenschutzerklärung von ZB Interieur, Einrichtungshaus in Homburg.',
    keywords: ['Datenschutz ZB Interieur'],
    ogImage: defaultOgImage,
  },
  '/barrierefreiheit': {
    path: '/barrierefreiheit',
    title: 'Barrierefreiheit | ZB Interieur Homburg',
    description:
      'Erklärung zur Barrierefreiheit der Website von ZB Interieur, Einrichtungshaus in Homburg.',
    keywords: ['Barrierefreiheit ZB Interieur', 'BFSG'],
    ogImage: defaultOgImage,
  },
  '/agb': {
    path: '/agb',
    title: 'AGB | ZB Interieur Homburg',
    description: 'Allgemeine Verkaufsbedingungen von ZB Interieur, Homburg.',
    keywords: ['AGB ZB Interieur'],
    ogImage: defaultOgImage,
  },
}

export function resolvePageSeo(pathname: string): PageSeo {
  const clean = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname

  if (clean.startsWith('/blog/') && clean !== '/blog') {
    const slug = clean.slice('/blog/'.length)
    const post = getBlogPost(slug)
    if (post) {
      return {
        path: clean,
        title: `${post.title} | Blog ZB Interieur Homburg`,
        description: post.excerpt,
        keywords: [
          post.category,
          'Blog ZB Interieur',
          'Einrichtungshaus Homburg',
          ...localKeywords.slice(0, 5),
        ],
        ogImage: absoluteUrl(post.image),
        type: 'article',
      }
    }
  }

  return pageSeo[clean] ?? {
    path: clean || '/',
    title: `${site.name} | Einrichtungshaus Homburg · Designmöbel Saarland`,
    description: pageSeo['/'].description,
    keywords: localKeywords,
    ogImage: defaultOgImage,
  }
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `${siteOrigin}${path.startsWith('/') ? path : `/${path}`}`
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['FurnitureStore', 'HomeAndConstructionBusiness', 'LocalBusiness'],
    '@id': `${siteOrigin}/#business`,
    name: site.name,
    legalName: site.legalName,
    url: siteOrigin,
    telephone: site.phoneHref.replace('tel:', ''),
    email: site.email,
    image: defaultOgImage,
    logo: `${siteOrigin}/images/logo.jpg`,
    description:
      'Einrichtungshaus und Möbelhaus in Homburg für Designmöbel, Einrichtungsplanung und Küchenplanung – Showroom für Homburg, Saarbrücken und das Saarland.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      addressLocality: 'Homburg',
      postalCode: '66424',
      addressRegion: 'Saarland',
      addressCountry: 'DE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 49.3299891,
      longitude: 7.3465506,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Homburg' },
      { '@type': 'City', name: 'Saarbrücken' },
      { '@type': 'AdministrativeArea', name: 'Saarland' },
    ],
    sameAs: [site.social.facebook, site.social.linkedin],
    priceRange: '$$$',
    brand: brandNames.map((name) => ({ '@type': 'Brand', name })),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteOrigin}/#website`,
    url: siteOrigin,
    name: site.name,
    description: pageSeo['/'].description,
    publisher: { '@id': `${siteOrigin}/#business` },
    inLanguage: 'de-DE',
  }
}

export function breadcrumbJsonLd(pathname: string, title: string) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Start',
      item: siteOrigin,
    },
  ]
  if (pathname !== '/') {
    items.push({
      '@type': 'ListItem',
      position: 2,
      name: title.split('|')[0].trim(),
      item: absoluteUrl(pathname),
    })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

export const sitemapPaths = [
  ...Object.keys(pageSeo).filter((p) => !pageSeo[p].noindex),
  ...blogPosts.map((p) => `/blog/${p.slug}`),
]
