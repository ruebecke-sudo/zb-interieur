export const site = {
  name: 'ZB Interieur',
  legalName: 'Interieur Joerg Zenz GmbH',
  tagline: 'Einrichtungshaus Homburg · Designmöbel · Raumgestaltung',
  phone: '+49 (0) 6841 9597223',
  phoneHref: 'tel:+4968419597223',
  email: 'info@zb-interieur.de',
  street: 'Mainzerstr. 77',
  zipCity: '66424 Homburg',
  hours: [
    { days: 'Mo – Fr', time: '09 – 18 Uhr' },
    { days: 'Sa', time: '10 – 16 Uhr' },
  ],
  social: {
    facebook: 'https://www.facebook.com/ZBInterieur',
    linkedin: 'https://www.linkedin.com/company/zb-interieur',
    googleReview: 'https://g.page/r/CTkNwSsTrS2IEAE/review',
  },
  booking: 'https://zenz-ben.de/funnel-terminplanung',
} as const

/** Schlanke Navigation – Fokus auf Beratung & Planung (ohne Blog/Galerien) */
export const nav = [
  { label: 'Beratung', href: '/beratung' },
  {
    label: 'Planung',
    href: '/planung',
    children: [
      { label: 'Küchen · Bäder · Büros', href: '/planung' },
      { label: 'Raumgestaltung', href: '/planung#raumgestaltung' },
      { label: 'Terrassen & Outdoor', href: '/outdoor' },
    ],
  },
  { label: 'Service', href: '/service' },
  { label: 'Kontakt', href: '/kontakt' },
] as const

export const services = [
  {
    title: 'Einrichtungsberatung',
    href: '/beratung',
    image: '/images/joerg-zenz.jpg',
    blurb: 'Individuelle Wohnkonzepte – von der ersten Idee bis zur fertigen Atmosphäre.',
  },
  {
    title: 'Küchen · Bäder · Büros',
    href: '/planung',
    image: '/images/planen.jpg',
    blurb: 'Funktionale Planung mit hochwertigen Materialien und klarer Formensprache.',
  },
  {
    title: 'Terrassen & Outdoor',
    href: '/outdoor',
    image: '/images/giellesse.jpg',
    blurb: 'Premium-Outdoor für Terrasse und Garten – abgestimmt auf Ihr Zuhause.',
  },
] as const

export const showroomImages = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/ledersofa.jpg',
  '/images/showroom-1.jpg',
  '/images/showroom-2.jpg',
  '/images/sofa-aria.jpg',
] as const

export const reasons = [
  {
    title: 'Optimale Raumnutzung',
    text: 'Jeder Quadratmeter wird sinnvoll geplant – ohne Kompromisse bei Stil und Komfort.',
  },
  {
    title: 'Zeitersparnis',
    text: 'Weniger Suchen, weniger Fehlkäufe: Wir führen Sie zielgerichtet zum Ergebnis.',
  },
  {
    title: 'Budgetoptimierung',
    text: 'Klare Prioritäten und passende Alternativen – für Wohnqualität im geplanten Rahmen.',
  },
  {
    title: 'Persönlicher Stil',
    text: 'Ihre Persönlichkeit steht im Mittelpunkt – keine Standardlösungen von der Stange.',
  },
] as const
