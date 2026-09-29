export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  dateLabel: string
  category: string
  image: string
  imageAlt: string
  readingMinutes: number
  body: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'einrichtungsplanung-homburg-worauf-es-ankommt',
    title: 'Einrichtungsplanung in Homburg: Worauf es wirklich ankommt',
    excerpt:
      'Von Grundriss bis Materialwahl – so gelingt eine klare, zeitlose Einrichtungsplanung im Einrichtungshaus Homburg.',
    date: '2026-09-15',
    dateLabel: '15. September 2026',
    category: 'Einrichtungsplanung',
    image: '/images/kueche-render-1.jpg',
    imageAlt: '3D-Visualisierung einer modernen Küche',
    readingMinutes: 4,
    body: [
      'Eine gute Einrichtungsplanung beginnt nicht mit dem Sofa, sondern mit dem Raum: Licht, Wege, Proportionen und der Alltag, der darin stattfinden soll. Im Einrichtungshaus ZB Interieur in Homburg arbeiten wir deshalb zuerst mit Ihren Bedürfnissen – und erst danach mit Marken und Materialien.',
      'Für Kundinnen und Kunden aus Homburg, Saarbrücken und dem Saarland bedeutet das: weniger Katalog-Feeling, mehr Konzept. Ob Wohnen, Dining oder Schlafen – wir sortieren Prioritäten, Budget und Stilrichtung, bevor Entscheidungen getroffen werden.',
      'Besonders hilfreich sind Grundrisse, Fotos und ein realistischer Zeitrahmen. Daraus entsteht ein Plan, der Designmöbel, Farben und Stauraum sinnvoll verbindet – und im Showroom greifbar wird.',
      'Wenn Sie eine Einrichtungsplanung in Homburg suchen, vereinbaren Sie gerne einen unverbindlichen Beratungstermin. Wir zeigen Ihnen Marken, Materialien und Lösungen, die zu Ihrem Zuhause passen.',
    ],
  },
  {
    slug: 'kuechenplanung-saarland-modern-und-funktional',
    title: 'Küchenplanung im Saarland: modern, funktional, langlebig',
    excerpt:
      'Küchenplanung heißt: Arbeitswege, Stauraum und Atmosphäre zusammen denken – für Küchen, die den Alltag tragen.',
    date: '2026-08-28',
    dateLabel: '28. August 2026',
    category: 'Küchenplanung',
    image: '/images/planung/kueche-3.jpg',
    imageAlt: 'Moderne Küchenplanung mit Designmöbeln',
    readingMinutes: 5,
    body: [
      'In der Küchenplanung entscheiden Details über den Alltag: Arbeitsdreieck, Lichtführung, Geräteposition und die Frage, wie offen die Küche zum Wohnraum stehen soll. Gerade in Homburg und Saarbrücken planen wir häufig Küchen, die zugleich repräsentieren und funktionieren.',
      'Wir achten auf Materialien, die Pflege und Optik verbinden, und auf Fronten, die über Jahre ruhig wirken. Dazu gehören durchdachte Schranksysteme, sinnvolle Elektroplanung und eine klare Formensprache.',
      'Ob Neubau oder Umbau: Eine gute Küchenplanung spart später Zeit, Geld und Nerven. Im Showroom von ZB Interieur können Sie Oberflächen, Griffe und Raumstimmungen direkt vergleichen.',
      'Für eine Küchenplanung im Saarland freuen wir uns auf Ihren Termin – mit Skizzen, Wünschen und dem Anspruch an Designmöbel, die bleiben.',
    ],
  },
  {
    slug: 'designmoebel-marken-im-showroom-homburg',
    title: 'Designmöbel im Showroom Homburg: Marken mit Haltung',
    excerpt:
      'Welche Designermarken Sie bei ZB Interieur erleben – und warum kuratierte Auswahl wichtiger ist als Masse.',
    date: '2026-07-12',
    dateLabel: '12. Juli 2026',
    category: 'Designmöbel',
    image: '/images/designmoebel-1.jpg',
    imageAlt: 'Designmöbel Lounge im Showroom Homburg',
    readingMinutes: 3,
    body: [
      'Designmöbel sind mehr als schöne Objekte: Sie prägen Rhythmus, Komfort und die Atmosphäre eines Raums. Im Möbelhaus und Einrichtungshaus ZB Interieur in Homburg zeigen wir deshalb eine kuratierte Markenwelt – von Wohnen über Dining bis Outdoor.',
      'Statt endloser Regale setzen wir auf Qualität und Charakter. Marken wie Papadatos, AL2, Bonaldo, Varaschin, Mogg oder Marchetti stehen für präzise Verarbeitung und klare Designideen.',
      'Im Showroom können Sie Stoffe, Hölzer und Proportionen live prüfen. Das erleichtert Entscheidungen und macht Beratung greifbar – für Projekte in Homburg, Saarbrücken und dem gesamten Saarland.',
      'Entdecken Sie unsere Markenwelt online oder vor Ort. Ein kurzer Termin genügt oft, um Stilrichtung und nächste Schritte klar zu machen.',
    ],
  },
  {
    slug: 'outdoor-terrasse-planen-varaschin',
    title: 'Terrasse planen: Outdoormöbel mit Innenraum-Anspruch',
    excerpt:
      'Wie Terrassenplanung und Premium-Outdoormöbel den Außenbereich zum zweiten Wohnzimmer machen.',
    date: '2026-06-03',
    dateLabel: '3. Juni 2026',
    category: 'Outdoor',
    image: '/images/galerien/moebel-varaschin/03.jpg',
    imageAlt: 'Varaschin The One Outdoormöbel',
    readingMinutes: 4,
    body: [
      'Eine gelungene Terrasse verbindet Architektur, Wetterschutz und Sitzkomfort. Bei der Terrassenplanung denken wir Wege, Schatten und Blickbeziehungen mit – und wählen Outdoormöbel, die dem Innenraum in Qualität und Design nahekommen.',
      'Marken wie Varaschin und Unopiu bieten wetterfeste Lösungen mit klarer Formensprache: Lounge, Dining und Daybeds für Sommerabende in Homburg und Umgebung.',
      'Wichtig sind Pflege, Materialwahl und die Abstimmung auf Fassade und Garten. So entsteht ein Außenraum, der sich anfühlt wie ein zweites Wohnzimmer.',
      'Lassen Sie sich zu Outdoor und Terrasse beraten – im Einrichtungshaus ZB Interieur oder per Terminvereinbarung für Projekte im Saarland.',
    ],
  },
  {
    slug: 'stilpunkte-award-einrichtungshaus-homburg',
    title: 'STILPUNKTE Award: Ausgezeichnetes Einrichtungshaus in Homburg',
    excerpt:
      'Warum der STILPUNKTE Award 25/26 für ZB Interieur zählt – und was Kundinnen und Kunden davon haben.',
    date: '2026-05-20',
    dateLabel: '20. Mai 2026',
    category: 'Showroom',
    image: '/images/award.jpg',
    imageAlt: 'STILPUNKTE Award 2025/2026',
    readingMinutes: 3,
    body: [
      'Der STILPUNKTE Award würdigt Qualität, Beratung und Designkompetenz. Für ZB Interieur in Homburg ist die Auszeichnung 2025/2026 Bestätigung unserer Arbeit als Einrichtungshaus und Möbelhaus im Saarland.',
      'Hinter dem Award stehen konkrete Standards: kuratierte Marken, sorgfältige Planung und ein Showroom, in dem Designmöbel erlebbar sind – nicht nur abgebildet.',
      'Für Sie bedeutet das: Orientierung und Vertrauen bei Einrichtungsplanung, Küchenplanung und Markenauswahl. Wir freuen uns, wenn Sie den Award-Stand und unsere Ausstellung vor Ort entdecken.',
      'Mehr Inspiration finden Sie in unserem Magazin und auf der Markenseite – oder bei einem persönlichen Termin in Homburg.',
    ],
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  return blogPosts.filter((p) => p.slug !== slug).slice(0, limit)
}
