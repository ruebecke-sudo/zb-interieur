export type MarkenweltItem = {
  brand: string
  title: string
  caption: string
  image: string
}

export type MarkenweltCategory = {
  id: string
  label: string
  teaser: string
  cover: string
  items: MarkenweltItem[]
}

/** Kuratierte Kategorie-Welten für die Startseite (Bild → Overlay-Galerie). */
export const markenwelten: MarkenweltCategory[] = [
  {
    id: 'wohnen',
    label: 'Wohnen',
    teaser: 'Sofas, Sessel und Loungemöbel',
    cover: '/images/designmoebel-1.jpg',
    items: [
      {
        brand: 'Papadatos',
        title: 'Sofa Naos',
        caption: 'Weiche Linien, großzügige Polsterung – Lounge mit Präsenz.',
        image: '/images/marken/produkte/papadatos-9238eb4515.jpg',
      },
      {
        brand: 'Gyform',
        title: 'Sofa Achille',
        caption: 'Italienische Polsterkunst für repräsentative Wohnräume.',
        image: '/images/marken/produkte/gyform-697e30dcd8.jpg',
      },
      {
        brand: 'Nature Design',
        title: 'Sofa Dune',
        caption: 'Organische Silhouette mit fließender Eleganz.',
        image: '/images/marken/produkte/nature-design-83d50c09a8.jpg',
      },
      {
        brand: 'Papadatos',
        title: 'Sessel Cozy',
        caption: 'Rückzug und Komfort – ein Statement für den Wohnbereich.',
        image: '/images/marken/produkte/papadatos-b94a950444.jpg',
      },
      {
        brand: 'Kolini',
        title: 'Sessel LUC',
        caption: 'Klare Form, edle Polsterung – zeitloses Sitzmöbel.',
        image: '/images/marken/produkte/kolini-5bd2de738e.jpg',
      },
      {
        brand: 'Rohleder',
        title: 'Hocker Caribbean',
        caption: 'Lounge-Pouf als flexibler Akzent im Raum.',
        image: '/images/marken/produkte/rohleder-6d34c2d0aa.jpg',
      },
    ],
  },
  {
    id: 'essen',
    label: 'Essen',
    teaser: 'Tische und Stühle für den Dining-Bereich',
    cover: '/images/designmoebel-2.jpg',
    items: [
      {
        brand: 'AL2',
        title: 'Dakry Esstisch',
        caption: 'Organische Eleganz für luxuriöse Dining-Bereiche.',
        image: '/images/marken/produkte/al2-0e7dd62587.jpg',
      },
      {
        brand: 'Bonaldo',
        title: 'Liaison Esstisch',
        caption: 'Skulpturales Meisterwerk mit architektonischer Haltung.',
        image: '/images/marken/produkte/bonaldo-8d116124ed.jpg',
      },
      {
        brand: 'Mogg',
        title: 'Esstisch Elephante',
        caption: 'Monolithisches Statement für den Essbereich.',
        image: '/images/marken/produkte/mogg-d4f1141ade.jpg',
      },
      {
        brand: 'Mogg',
        title: 'Brera Stuhl',
        caption: 'Mailänder Chic für anspruchsvolle Essplätze.',
        image: '/images/marken/produkte/mogg-0f8be09dbc.jpg',
      },
      {
        brand: 'AL2',
        title: 'Clara Stuhl',
        caption: 'Zeitlose Silhouette, edle Polsterung.',
        image: '/images/marken/produkte/al2-1d0e4d056e.jpg',
      },
      {
        brand: 'Form exclusiv',
        title: 'Tisch Madison',
        caption: 'Charaktervolles Schachbrettmuster in edlem Holz.',
        image: '/images/marken/produkte/form-exclusiv-5aba45f981.jpg',
      },
    ],
  },
  {
    id: 'stauraum',
    label: 'Stauraum',
    teaser: 'Sideboards, Regale und Anrichten',
    cover: '/images/marken/produkte/bonaldo-74caea5e65.jpg',
    items: [
      {
        brand: 'Bonaldo',
        title: 'Arragan Sideboard',
        caption: 'Skulpturale Anrichte von Buratti – high & low.',
        image: '/images/marken/produkte/bonaldo-74caea5e65.jpg',
      },
      {
        brand: 'AL2',
        title: 'El It Sideboard',
        caption: 'Minimalistisch, architektonisch, präzise gearbeitet.',
        image: '/images/marken/produkte/al2-a5b8ae5515.jpg',
      },
      {
        brand: 'Mogg',
        title: 'Sideboard Ikebana',
        caption: 'Poetisches Stauraum-Stück mit klarer Linie.',
        image: '/images/marken/produkte/mogg-80cbf94d7d.jpg',
      },
      {
        brand: 'Mogg',
        title: 'Cellula Regal',
        caption: 'Modulares Metallsystem mit geometrischer Ordnung.',
        image: '/images/marken/produkte/mogg-62eebf5e66.jpg',
      },
      {
        brand: 'Papadatos',
        title: 'Barschrank Twist V',
        caption: 'Exklusiver Stauraum mit Charakter.',
        image: '/images/marken/produkte/papadatos-7c8ae4aa0b.jpg',
      },
      {
        brand: 'AL2',
        title: 'Wandregal Muse',
        caption: 'Modular mit integrierter LED-Akzentuierung.',
        image: '/images/marken/produkte/al2-05a8a5dd86.jpg',
      },
    ],
  },
  {
    id: 'licht',
    label: 'Licht',
    teaser: 'Leuchten als Raumskulptur',
    cover: '/images/marken/produkte/marchetti-a00c35c09d.jpg',
    items: [
      {
        brand: 'Marchetti',
        title: 'Maestri di Luce Anime',
        caption: 'Poetische Lichtskulptur für besondere Räume.',
        image: '/images/marken/produkte/marchetti-a00c35c09d.jpg',
      },
      {
        brand: 'Marchetti',
        title: 'Maestri di Luce Rim',
        caption: 'Elegante Ringbeleuchtung, minimalistisch geführt.',
        image: '/images/marken/produkte/marchetti-5761ac33c9.jpg',
      },
      {
        brand: 'Marchetti',
        title: 'Maestri di Luce Pura',
        caption: 'Puristische Designerleuchte für klare Architektur.',
        image: '/images/marken/produkte/marchetti-3c52374ddf.jpg',
      },
      {
        brand: 'Mogg',
        title: 'Stehlampe Costantina',
        caption: 'Skulpturale Stehleuchte mit opalem Glas.',
        image: '/images/marken/produkte/mogg-6c88c78103.jpg',
      },
      {
        brand: 'Showroom',
        title: 'Lichtstimmungen',
        caption: 'Inszenierung im Showroom Homburg.',
        image: '/images/showroom-live-3.jpg',
      },
      {
        brand: 'Showroom',
        title: 'Abendliches Interieur',
        caption: 'Atmosphäre durch gezielte Lichtführung.',
        image: '/images/showroom-live-5.jpg',
      },
    ],
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    teaser: 'Terrasse und Gartenmöbel',
    cover: '/images/planung/terrasse-1.jpg',
    items: [
      {
        brand: 'Varaschin',
        title: 'Outdoor Sofa Emma',
        caption: 'Lounge für Terrasse und Garten – wetterfest, elegant.',
        image: '/images/marken/produkte/varaschin-efe68078b6.jpg',
      },
      {
        brand: 'Varaschin',
        title: 'Tisch System Star',
        caption: 'Klarer Outdoor-Tisch für sommerliche Geselligkeit.',
        image: '/images/marken/produkte/varaschin-8a0d2b3d48.jpg',
      },
      {
        brand: 'ZB Interieur',
        title: 'Terrassenplanung',
        caption: 'Sitzplätze, Wege und Materialien aus einem Guss.',
        image: '/images/planung/terrasse-2.jpg',
      },
      {
        brand: 'ZB Interieur',
        title: 'Outdoor-Atmosphäre',
        caption: 'Premium-Möbel abgestimmt auf Ihr Zuhause.',
        image: '/images/planung/terrasse-3.jpg',
      },
      {
        brand: 'Showroom',
        title: 'Außenräume erleben',
        caption: 'Inspiration aus dem Sortiment in Homburg.',
        image: '/images/showroom-live-7.jpg',
      },
      {
        brand: 'Showroom',
        title: 'Sommerwohnen',
        caption: 'Übergänge zwischen Innen und Außen gestalten.',
        image: '/images/showroom-live-8.jpg',
      },
    ],
  },
]
