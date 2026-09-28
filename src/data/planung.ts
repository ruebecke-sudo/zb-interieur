export type PlanungTopic = {
  id: string
  label: string
  eyebrow: string
  headline: string
  points: string[]
  bodyTitle: string
  body: string[]
  images: { src: string; alt: string }[]
  ctaLabel?: string
  ctaHref?: string
}

/** Inhalte aus den Unterseiten der Kategorie Planung auf zb-interieur.de */
export const planungTopics: PlanungTopic[] = [
  {
    id: 'kueche',
    label: 'Küchen',
    eyebrow: 'Küchenplanung',
    headline: 'Professionelle und individuelle Küchenplanungen in Homburg',
    points: [
      'Küchenplanung: Ihre Traumküche, maßgeschneidert',
      'Perfekte Küchenplanung für jedes Budget',
      'Bei Bedarf für größere Projekte: Erstellung eines 3D-Modells zur besseren Visualisierung',
    ],
    bodyTitle: 'Die Küche',
    body: [
      'Eine Küche so individuell wie Ihre Bedürfnisse. Jeder Handgriff darf sitzen, denn Sie entscheiden, wie die Küche aufgebaut ist. An welcher Stelle soll der Herd stehen oder hängen? Welche Höhe soll die Arbeitsfläche haben und aus welchem Material soll die Arbeitsplatte gefertigt sein?',
      'Wir bauen Küchen nach Maß. Trotzdem haben wir faire Preise. Überzeugen Sie sich selbst – moderne, zeitlose Designs in verschiedenen Variationen.',
    ],
    images: [
      { src: '/images/planung/kueche-1.jpg', alt: 'Maßgeschneiderte Küchenplanung' },
      { src: '/images/planung/kueche-2.jpg', alt: 'Moderne Küche mit Insel' },
      { src: '/images/planung/kueche-3.jpg', alt: 'Küchenkonzept in 3D' },
      { src: '/images/planung/kueche-4.jpg', alt: 'Zeitlose Designküche' },
    ],
  },
  {
    id: 'bad',
    label: 'Bäder',
    eyebrow: 'Badeinrichtungen',
    headline: 'Badeinrichtungen in Homburg',
    points: [
      'Funktionale & moderne Badeinrichtung',
      'Ergonomische Badeinrichtungen nach Maß',
      'Bei Bedarf für größere Projekte: Erstellung eines 3D-Modells zur besseren Visualisierung',
    ],
    bodyTitle: 'Badeinrichtungen nach Maß',
    body: [
      'Möchten Sie auch Ihr Bad in eine Wellness-Oase umwandeln, in der man sich wohlfühlt und entspannt? Und Sie legen Wert auf modernes, zeitloses Design? Dann sind wir Ihr Ansprechpartner.',
      'Fachkundige Beratung sowie Planung nach Ihren Wünschen garantieren Ihnen ein Wunschbad nach Ihren Vorstellungen.',
    ],
    images: [
      { src: '/images/planung/bad-1.jpg', alt: 'Modernes Badkonzept' },
      { src: '/images/planung/bad-2.jpg', alt: 'Badeinrichtung nach Maß' },
      { src: '/images/planung/bad-3.jpg', alt: 'Wellness-Bad Planung' },
    ],
  },
  {
    id: 'buero',
    label: 'Büros',
    eyebrow: 'Büroeinrichtungen',
    headline: 'Büroeinrichtungen in Homburg',
    points: [
      'Funktionale & ästhetische Büroeinrichtung',
      'Ergonomische Büroeinrichtungen nach Maß',
      'Perfekte Ausstattung für Ihr Büro',
      'Bei Bedarf für größere Projekte: Erstellung eines 3D-Modells zur besseren Visualisierung',
    ],
    bodyTitle: 'Büroeinrichtungen nach Maß',
    body: [
      'Wir verwandeln Ihr herkömmliches Büro in inspirierende und funktionale Räume für konzentriertes Arbeiten, Austausch und Kundenempfang. Wir verbinden modernste Technologien mit innovativem Design und funktionaler Ästhetik für ein smartes, nachhaltiges und optimal genutztes Büroumfeld.',
      'Unsere Einrichtungsprofis schaffen Lösungen für sämtliche Arbeits- und Raumsituationen in Ihrem Unternehmen. Wir beraten Sie gerne – rufen Sie uns an oder vereinbaren Sie einen Termin.',
    ],
    images: [
      { src: '/images/planung/buero-1.jpg', alt: 'Büroplanung Arbeitsplatz' },
      { src: '/images/planung/buero-2.jpg', alt: 'Modernes Bürokonzept' },
      { src: '/images/planung/buero-3.jpg', alt: 'Empfangs- und Arbeitsbereich' },
    ],
  },
  {
    id: 'terrasse',
    label: 'Terrassen',
    eyebrow: 'Terrassenplanung',
    headline: 'Wir planen & Sie genießen den Sommer',
    points: [
      'Pflegeleichte & kinderfreundliche Materialien',
      'Rutschfest & witterungsbeständig',
      'Perfekt auf Ihr Zuhause abgestimmt',
    ],
    bodyTitle: 'Familienparadies im eigenen Garten – Ihre perfekte Terrasse',
    body: [
      'Stellen Sie sich vor: Die Kinder spielen sicher auf einer warmen Holzterrasse, während Sie entspannt Ihren Kaffee genießen. Gemeinsame Grillabende, unvergessliche Sommernächte – mit unserer individuellen Terrassenplanung wird Ihr Garten zum Lieblingsort für die ganze Familie.',
    ],
    images: [
      { src: '/images/planung/terrasse-1.jpg', alt: 'Terrassenplanung Outdoor-Möbel' },
      { src: '/images/planung/terrasse-2.jpg', alt: 'Gartenterrasse Konzept' },
      { src: '/images/planung/terrasse-3.jpg', alt: 'Outdoor-Wohnbereich' },
    ],
    ctaLabel: 'Mehr Outdoor & Terrasse',
    ctaHref: '/outdoor',
  },
  {
    id: 'objekt',
    label: 'Objekt & Hotel',
    eyebrow: 'Objekt- & Hoteleinrichtungen',
    headline: 'Professionelle Objekt- und Hoteleinrichtungen in Homburg',
    points: [
      'Exklusive Designs für Ihre Einrichtung',
      'Stilvolle Objekt- & Hoteleinrichtungen',
      'Hochwertige Einrichtung für Hotels & Gewerbe',
      'Bei Bedarf für größere Projekte: Erstellung eines 3D-Modells zur besseren Visualisierung',
    ],
    bodyTitle: 'Objektplanung',
    body: [
      'Die Planung und Bearbeitung wird wesentlich durch die Erstellung von 3D-visualisierten CAD-Zeichnungen erleichtert. Alle gängigen Zeichnungsformate können aus anderen Programmen übernommen und bearbeitet werden. Das erleichtert die Zusammenarbeit und Fehlerquellen werden im Vorfeld minimiert.',
      'Die Darstellung kann von der einfachen Grundrisszeichnung bis hin zur perspektivischen Ansicht erfolgen. Anhand einer fotorealistischen Darstellung veranschaulichen wir Ihren Neubau oder Umbau sehr präzise. Formen, Farben und Materialien werden wirklichkeitsnah dargestellt – eine wesentliche Erleichterung zur Beurteilung des Konzepts.',
    ],
    images: [
      { src: '/images/planung/objekt-1.jpg', alt: 'Objektplanung Visualisierung' },
      { src: '/images/planung/objekt-2.jpg', alt: 'Hotel- und Objekteinrichtung' },
      { src: '/images/planung/objekt-3.jpg', alt: 'CAD- und 3D-Objektkonzept' },
    ],
  },
  {
    id: 'sonder',
    label: 'Sonderanfertigungen',
    eyebrow: 'Sonderanfertigungen',
    headline: 'Professionelle und individuelle Sonderanfertigungen in Homburg',
    points: [
      'Sonderanfertigungen – exakt nach Ihren Wünschen',
      'Exklusiv & individuell: Ihre Wunschanfertigung',
      'Einzigartige Lösungen für spezielle Anforderungen',
      'Bei Bedarf für größere Projekte: Erstellung eines 3D-Modells zur besseren Visualisierung',
    ],
    bodyTitle: 'Sonderanfertigungen',
    body: [
      'Wir arbeiten mit Möbeltischlereien zusammen. Wir vertrauen den langjährigen Tischlern und können so für eine sehr gute Qualität und eine reibungslose Abwicklung garantieren. Der Aufbau und die Montage vor Ort sind selbstverständlich.',
      'Fotorealistische Darstellungen ermöglichen im Vorfeld einen guten Einblick in unsere Kreativität und erleichtern somit die Beurteilung des Objekts.',
    ],
    images: [
      { src: '/images/planung/sonder-1.jpg', alt: 'Sonderanfertigung Showroom' },
      { src: '/images/planung/sonder-2.jpg', alt: 'Individuelle Wohnraumlösung' },
      { src: '/images/planung/sonder-3.jpg', alt: 'Montage und Maßanfertigung' },
    ],
  },
  {
    id: 'raumgestaltung',
    label: 'Raumgestaltung',
    eyebrow: 'Raumgestaltung',
    headline: 'Raumgestaltung in Homburg',
    points: [
      'Funktionalität: praktische Nutzung und klare Abläufe',
      'Ästhetik: Farben, Texturen und Materialien im Einklang',
      'Licht, Balance und Proportion für eine stimmige Atmosphäre',
      'Individuelle Elemente und natürliche Akzente für Charakter',
    ],
    bodyTitle: 'Raum & Farbe',
    body: [
      'Raumgestaltung bezieht sich auf den Prozess der Gestaltung und Organisation von Innenräumen, damit sie funktional, ästhetisch ansprechend und den Bedürfnissen der Nutzer entsprechend sind – zu Hause, am Arbeitsplatz oder in öffentlichen Räumen.',
      'Die Raumgestaltung umfasst Farben und Materialien, die Anordnung von Möbeln und Accessoires, Beleuchtung, Akustik und Raumtrenner. Es ist ein kreativer Prozess für eine harmonische Umgebung – und für eine Atmosphäre, die die Sinne anspricht und das Wohlbefinden fördert.',
    ],
    images: [
      { src: '/images/planung/raum-1.jpg', alt: 'Raumgestaltung Licht und Material' },
      { src: '/images/showroom-live-2.jpg', alt: 'Gestaltung Wohnatmosphäre' },
      { src: '/images/designmoebel-3.jpg', alt: 'Farb- und Formensprache' },
    ],
  },
]

export const planungProcess = [
  {
    step: '01',
    title: 'Kennenlernen',
    text: 'Im Showroom oder vor Ort klären wir Bedürfnisse, Stil und Rahmenbedingungen.',
  },
  {
    step: '02',
    title: 'Konzept',
    text: 'Wir entwickeln ein maßgeschneidertes Konzept mit Materialien, Layout und Prioritäten.',
  },
  {
    step: '03',
    title: '3D & Entscheidung',
    text: 'Bei größeren Projekten visualisieren wir fotorealistisch – für Klarheit vor der Umsetzung.',
  },
  {
    step: '04',
    title: 'Umsetzung',
    text: 'Lieferung, Montage und Feinschliff aus einer Hand – bis der Raum stimmig ist.',
  },
] as const
