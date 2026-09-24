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

export const nav = [
  {
    label: 'Öffnungszeiten',
    href: '/#oeffnungszeiten',
  },
  {
    label: 'Möbel',
    href: '/galerien',
    children: [
      { label: 'Neuheiten im Showroom', href: '/galerien#neuheiten' },
      { label: 'Sofas & Couches', href: '/galerien#sofas' },
      { label: 'Tische', href: '/galerien#tische' },
      { label: 'Betten', href: '/galerien#betten' },
      { label: 'Lampen', href: '/galerien#lampen' },
      { label: 'Küchen', href: '/galerien#kuechen' },
      { label: 'Tapeten & Stoffe', href: '/galerien#tapeten' },
      { label: 'Accessoires', href: '/galerien#accessoires' },
    ],
  },
  {
    label: 'Planung',
    href: '/planung',
    children: [
      { label: 'Einrichtungsberatung', href: '/beratung' },
      { label: 'Küchen · Bäder · Büros', href: '/planung' },
      { label: 'Terrassen & Outdoor', href: '/outdoor' },
      { label: 'Raumgestaltung', href: '/planung#raumgestaltung' },
    ],
  },
  {
    label: 'Service',
    href: '/service',
    children: [
      { label: 'Einrichtungstipps (PDF)', href: '/docs/40-profitipps.pdf' },
      { label: 'Pflegetipps (PDF)', href: '/docs/pflege-tipps.pdf' },
      { label: 'News & Info', href: '/service' },
    ],
  },
  {
    label: 'Galerien',
    href: '/galerien',
  },
  {
    label: 'Kontakt',
    href: '/kontakt',
  },
] as const

export const galleries = [
  {
    id: 'neuheiten',
    title: 'Neuheiten im Showroom',
    image: '/images/showroom-1.jpg',
    blurb: 'Aktuelle Highlights direkt aus unserem Showroom in Homburg.',
  },
  {
    id: 'sofas',
    title: 'Sofas & Couches',
    image: '/images/sofa-aria.jpg',
    blurb: 'Designer-Sofas von Papadatos, Aria und weiteren Premium-Marken.',
  },
  {
    id: 'tische',
    title: 'Tische',
    image: '/images/tisch.jpg',
    blurb: 'Ess- und Beistelltische mit klarer Formensprache.',
  },
  {
    id: 'betten',
    title: 'Betten',
    image: '/images/ledersofa.jpg',
    blurb: 'Rückzugsorte mit hochwertigen Materialien und ruhigem Design.',
  },
  {
    id: 'lampen',
    title: 'Lampen',
    image: '/images/showroom-2.jpg',
    blurb: 'Lichtdesign, das Räume strukturiert und Atmosphäre schafft.',
  },
  {
    id: 'kuechen',
    title: 'Küchen',
    image: '/images/planen.jpg',
    blurb: 'Individuelle Küchenplanung – funktional, elegant, maßgeschneidert.',
  },
  {
    id: 'tapeten',
    title: 'Tapeten & Stoffe',
    image: '/images/blumen.jpg',
    blurb: 'Harlequin und weitere Textilmarken für Wand und Fläche.',
  },
  {
    id: 'accessoires',
    title: 'Accessoires',
    image: '/images/blumen-ausschnitt.jpg',
    blurb: 'Deko, Kuscheldecken und Details, die Räume fertigstellen.',
  },
  {
    id: 'outdoor',
    title: 'Outdoor · Varaschin & Sifas',
    image: '/images/giellesse.jpg',
    blurb: 'Premium-Outdoor für Terrasse und Garten.',
  },
  {
    id: 'marken',
    title: 'Papadatos · AL2 · Moeller · Giellesse · Fine · Piure',
    image: '/images/sofa-papadatos.jpg',
    blurb: 'Ausgewählte Designermarken – einzigartig und außergewöhnlich.',
  },
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
