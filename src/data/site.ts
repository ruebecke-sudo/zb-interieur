export const site = {
  name: 'ZB Interieur',
  legalName: 'Interieur Joerg Zenz GmbH',
  tagline: 'Einrichtungshaus Homburg · Designmöbel · Raumgestaltung',
  phone: '+49 (0) 6841 9597223',
  phoneHref: 'tel:+4968419597223',
  /** internationale Nummer ohne Leerzeichen für WhatsApp */
  whatsapp: '4968419597223',
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
  maps: {
    embed:
      'https://www.google.com/maps?q=49.3299891,7.3465506+(ZB+Interieur)&hl=de&z=16&output=embed',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Mainzerstra%C3%9Fe+77%2C+66424+Homburg',
    place:
      'https://www.google.com/maps/search/?api=1&query=Mainzerstra%C3%9Fe+77%2C+66424+Homburg',
  },
  booking: '/termin',
  bookingExternal: 'https://zenz-ben.de/funnel-terminplanung',
} as const

export const whatsappHref = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
  'Hallo ZB Interieur, ich interessiere mich für eine Einrichtungsberatung.',
)}`

/** Schlanke Navigation – Fokus auf Beratung & Planung (ohne Blog/Galerien) */
export const nav = [
  { label: 'Beratung', href: '/beratung' },
  {
    label: 'Planung',
    href: '/planung',
    children: [
      { label: 'Küchen · Schlafzimmer · Bäder', href: '/planung' },
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
    image: '/images/kueche-render-3.jpg',
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
  '/images/kueche-render-1.jpg',
  '/images/kueche-render-2.jpg',
  '/images/kueche-render-3.jpg',
  '/images/schlafzimmer-render-1.jpg',
  '/images/ledersofa.jpg',
  '/images/showroom-1.jpg',
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

/** Kundenstimmen – bitte bei Bedarf durch Ihre echten Google-Zitate ersetzen */
export const testimonials = [
  {
    quote:
      'Von der ersten Beratung bis zur fertigen Einrichtung fühlten wir uns verstanden. Die Räume wirken jetzt endlich wie wir – und funktionieren im Alltag.',
    name: 'Familie M.',
    place: 'Saarland',
  },
  {
    quote:
      'Die Küchenplanung war präzise, ehrlich und ohne Druck. Wir haben budgetschonend entschieden und trotzdem ein Ergebnis, das sich hochwertig anfühlt.',
    name: 'Andreas K.',
    place: 'Homburg',
  },
  {
    quote:
      'Showroom und Beratung auf einem Niveau, das man selten findet. Joerg Zenz denkt in Gesamtkonzepten – nicht in Einzelstücken.',
    name: 'Sandra L.',
    place: 'Rheinland-Pfalz',
  },
] as const

export const faqs = [
  {
    q: 'Was kostet eine Einrichtungsberatung?',
    a: 'Das Erstgespräch im Showroom ist unverbindlich und dient dem Kennenlernen. Für umfassendere Planungen und 3D-Visualisierungen erstellen wir ein transparentes Angebot – abgestimmt auf Umfang und Projekt.',
  },
  {
    q: 'Wie lange dauert eine typische Planung?',
    a: 'Je nach Projekt: von wenigen Wochen bei fokussierten Räumen bis zu mehreren Monaten bei Komplettausstattung. Nach dem ersten Termin nennen wir Ihnen einen realistischen Zeitrahmen.',
  },
  {
    q: 'Was sollte ich zum Beratungstermin mitbringen?',
    a: 'Idealerweise Grundrisse oder Maße, Fotos der Räume, Budgetrahmen und Beispiele (Pinterest, Magazine), die Ihren Stil zeigen. Auch ohne Unterlagen finden wir gemeinsam einen guten Einstieg.',
  },
  {
    q: 'Plant ihr auch nur einzelne Räume?',
    a: 'Ja. Ob Wohnzimmer, Küche, Bad, Büro oder Terrasse – wir planen gezielt das, was Sie brauchen, und denken bei Bedarf später das Gesamtkonzept mit.',
  },
  {
    q: 'Kaufe ich die Möbel bei euch?',
    a: 'Ja – genau darauf sind wir ausgerichtet. Nach der Beratung und Planung beziehen Sie die Möbel und Einrichtungen über ZB Interieur: ausgewählte Designermarken, passend zu Ihrem Konzept, aus einer Hand inklusive Beratung und Umsetzung.',
  },
] as const
