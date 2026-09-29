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

/** Markenwelten: Top-8-Bilder aus zb-interieur.de Galerien/Möbel + STILPUNKTE-Produkte. */
export const markenwelten: MarkenweltCategory[] = [
  {
    "id": "wohnen",
    "label": "Wohnen",
    "teaser": "Sofas, Sessel und Wohnatmosphäre",
    "cover": "/images/designmoebel-1.jpg",
    "items": [
      {
        "brand": "Sofas & Couches",
        "title": "Sofa Glee",
        "caption": "Sofas & Couches – Sofa Glee.",
        "image": "/images/galerien/sofas/01.jpg"
      },
      {
        "brand": "Sofas & Couches",
        "title": "Sofa Cloud",
        "caption": "Sofas & Couches – Sofa Cloud.",
        "image": "/images/galerien/sofas/02.jpg"
      },
      {
        "brand": "Sofas & Couches",
        "title": "Sofa Glee",
        "caption": "Sofas & Couches – Sofa Glee.",
        "image": "/images/galerien/sofas/03.jpg"
      },
      {
        "brand": "Sofas & Couches",
        "title": "Sofa Cloud",
        "caption": "Sofas & Couches – Sofa Cloud.",
        "image": "/images/galerien/sofas/04.jpg"
      },
      {
        "brand": "Sofas & Couches",
        "title": "Sofa Aberdeen",
        "caption": "Sofas & Couches – Sofa Aberdeen.",
        "image": "/images/galerien/sofas/05.jpg"
      },
      {
        "brand": "Sofas & Couches",
        "title": "Sofa Lennox",
        "caption": "Sofas & Couches – Sofa Lennox.",
        "image": "/images/galerien/sofas/06.jpg"
      },
      {
        "brand": "Sofas & Couches",
        "title": "Sofa Flowers",
        "caption": "Sofas & Couches – Sofa Flowers.",
        "image": "/images/galerien/sofas/07.jpg"
      },
      {
        "brand": "Sofas & Couches",
        "title": "Sofa Cloud",
        "caption": "Sofas & Couches – Sofa Cloud.",
        "image": "/images/galerien/sofas/08.jpg"
      },
      {
        "brand": "Papadatos",
        "title": "Bild 23",
        "caption": "Papadatos – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/papadatos/01.jpg"
      },
      {
        "brand": "Papadatos",
        "title": "Bild 22",
        "caption": "Papadatos – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/papadatos/02.jpg"
      },
      {
        "brand": "Papadatos",
        "title": "Bild 16",
        "caption": "Papadatos – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/papadatos/03.jpg"
      },
      {
        "brand": "Papadatos",
        "title": "Titel 9A",
        "caption": "Papadatos – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/papadatos/04.jpg"
      },
      {
        "brand": "Papadatos",
        "title": "Bild 13",
        "caption": "Papadatos – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/papadatos/08.jpg"
      },
      {
        "brand": "Giellesse",
        "title": "Giellesse Designstück",
        "caption": "Motiv aus der Giellesse-Galerie bei ZB Interieur.",
        "image": "/images/galerien/giellesse/01.jpg"
      },
      {
        "brand": "Giellesse",
        "title": "Giellesse Designstück",
        "caption": "Motiv aus der Giellesse-Galerie bei ZB Interieur.",
        "image": "/images/galerien/giellesse/02.jpg"
      },
      {
        "brand": "Giellesse",
        "title": "Giellesse Designstück",
        "caption": "Motiv aus der Giellesse-Galerie bei ZB Interieur.",
        "image": "/images/galerien/giellesse/03.jpg"
      },
      {
        "brand": "Giellesse",
        "title": "Giellesse Designstück",
        "caption": "Motiv aus der Giellesse-Galerie bei ZB Interieur.",
        "image": "/images/galerien/giellesse/04.jpg"
      }
    ]
  },
  {
    "id": "essen",
    "label": "Essen",
    "teaser": "Tische und Essbereiche",
    "cover": "/images/designmoebel-2.jpg",
    "items": [
      {
        "brand": "Tische",
        "title": "Sofa Flowers",
        "caption": "Tische – Sofa Flowers.",
        "image": "/images/galerien/tische/01.jpg"
      },
      {
        "brand": "Tische",
        "title": "Sofa Glee",
        "caption": "Tische – Sofa Glee.",
        "image": "/images/galerien/tische/02.jpg"
      },
      {
        "brand": "Tische",
        "title": "In Between 4050X2190",
        "caption": "Tische – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/tische/03.jpg"
      },
      {
        "brand": "Tische",
        "title": "L7 Seite 065",
        "caption": "Tische – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/tische/04.jpg"
      },
      {
        "brand": "Tische",
        "title": "L7 Seite 038",
        "caption": "Tische – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/tische/05.jpg"
      },
      {
        "brand": "Tische",
        "title": "Echo 001 Walnut Clara Chair 1",
        "caption": "Tische – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/tische/06.jpg"
      },
      {
        "brand": "Tische",
        "title": "L3",
        "caption": "Tische – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/tische/07.jpg"
      },
      {
        "brand": "Tische",
        "title": "Sideboard Eterna",
        "caption": "Tische – Sideboard Eterna.",
        "image": "/images/galerien/tische/08.jpg"
      },
      {
        "brand": "AL2",
        "title": "News AL2 Salone Del Mobile Milan 2019 Stand 3",
        "caption": "AL2 – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/al2/01.jpg"
      },
      {
        "brand": "AL2",
        "title": "AL2",
        "caption": "AL2 – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/al2/02.jpg"
      },
      {
        "brand": "AL2",
        "title": "AL2 Designstück",
        "caption": "Motiv aus der AL2-Galerie bei ZB Interieur.",
        "image": "/images/galerien/al2/03.jpg"
      },
      {
        "brand": "AL2",
        "title": "Sideboard Eterna",
        "caption": "Luxuriöser Designertisch mit rhythmischer Eleganz und architektonischer Symmetrie",
        "image": "/images/galerien/al2/04.jpg"
      },
      {
        "brand": "AL2",
        "title": "Sideboard Eterna",
        "caption": "Minimalistisches Luxus-Sideboard mit architektonischer Eleganz",
        "image": "/images/galerien/al2/05.jpg"
      },
      {
        "brand": "AL2",
        "title": "Tisch Dakry",
        "caption": "Organische Eleganz und skulpturales Design für luxuriöse Dining-Bereiche",
        "image": "/images/galerien/al2/06.jpg"
      },
      {
        "brand": "AL2",
        "title": "Tisch Dakry",
        "caption": "Organische Eleganz und skulpturales Design für luxuriöse Dining-Bereiche",
        "image": "/images/galerien/al2/07.jpg"
      },
      {
        "brand": "AL2",
        "title": "Tisch Dakry",
        "caption": "Organische Eleganz und skulpturales Design für luxuriöse Dining-Bereiche",
        "image": "/images/galerien/al2/08.jpg"
      },
      {
        "brand": "AL2",
        "title": "AL2 Designstück",
        "caption": "Motiv aus der AL2-Galerie bei ZB Interieur.",
        "image": "/images/galerien/moebel-al2/01.jpg"
      },
      {
        "brand": "AL2",
        "title": "AL2 Designstück",
        "caption": "Motiv aus der AL2-Galerie bei ZB Interieur.",
        "image": "/images/galerien/moebel-al2/02.jpg"
      },
      {
        "brand": "AL2",
        "title": "AL2 Designstück",
        "caption": "Motiv aus der AL2-Galerie bei ZB Interieur.",
        "image": "/images/galerien/moebel-al2/03.jpg"
      },
      {
        "brand": "AL2",
        "title": "AL2 Designstück",
        "caption": "Motiv aus der AL2-Galerie bei ZB Interieur.",
        "image": "/images/galerien/moebel-al2/04.jpg"
      }
    ]
  },
  {
    "id": "stauraum",
    "label": "Stauraum",
    "teaser": "Regale, Sideboards und Systeme",
    "cover": "/images/galerien/piure/01.jpg",
    "items": [
      {
        "brand": "Piure",
        "title": "Nexglamour 5120X3200 1 Scaled 1",
        "caption": "Piure – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/piure/01.jpg"
      },
      {
        "brand": "Piure",
        "title": "News 2560 2",
        "caption": "Piure – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/piure/02.jpg"
      },
      {
        "brand": "Piure",
        "title": "Slider Scaled 2560X1600 Nexpurregal 05",
        "caption": "Piure – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/piure/03.jpg"
      },
      {
        "brand": "Piure",
        "title": "Nexbox 5120X3200 11 Scaled",
        "caption": "Piure – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/piure/04.jpg"
      },
      {
        "brand": "Piure",
        "title": "Nexbox 5120X3200 10 Scaled",
        "caption": "Piure – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/piure/05.jpg"
      },
      {
        "brand": "Piure",
        "title": "Piure Sideboard 5120 06 Scaled",
        "caption": "Piure – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/piure/06.jpg"
      },
      {
        "brand": "Piure",
        "title": "Nexglamour 5120X3200 3 Scaled",
        "caption": "Piure – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/piure/07.jpg"
      },
      {
        "brand": "Piure",
        "title": "Nexglamour 5120X3200 4 Scaled",
        "caption": "Piure – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/piure/08.jpg"
      },
      {
        "brand": "Bonaldo",
        "title": "Arragan Sideboard (high & low)",
        "caption": "Skulpturale Luxus-Anrichten von Gabriele & Oscar Buratti mit architektonischer Eleganz",
        "image": "/images/marken/produkte/bonaldo-74caea5e65.jpg"
      },
      {
        "brand": "Papadatos",
        "title": "Barschrank Twist V",
        "caption": "Designstück aus dem STILPUNKTE-Sortiment.",
        "image": "/images/marken/produkte/papadatos-7c8ae4aa0b.jpg"
      },
      {
        "brand": "Mogg",
        "title": "Cellula",
        "caption": "Modulares Luxus-Wandregal & geometrisches Design-Stauraumsystem aus Metall",
        "image": "/images/marken/produkte/mogg-62eebf5e66.jpg"
      },
      {
        "brand": "AL2",
        "title": "El It 003 Sideboard",
        "caption": "Minimalistisches Luxus-Sideboard mit architektonischer Eleganz",
        "image": "/images/marken/produkte/al2-a5b8ae5515.jpg"
      },
      {
        "brand": "AL2",
        "title": "Eterna A 003 Sideboard",
        "caption": "Luxuriöse Design-Anrichte mit meisterhafter Holz-Handwerkskunst",
        "image": "/images/marken/produkte/al2-64ee6305f8.jpg"
      },
      {
        "brand": "Mogg",
        "title": "Metrica Regal",
        "caption": "Minimalistisches Luxus-Metallregal mit rhythmischer Geometrie",
        "image": "/images/marken/produkte/mogg-132ffd4b3a.jpg"
      },
      {
        "brand": "Mogg",
        "title": "Sideboard Ikebana",
        "caption": "Poetisches Luxus-Sideboard und minimalistisches Design-Stauraumsystem",
        "image": "/images/marken/produkte/mogg-80cbf94d7d.jpg"
      },
      {
        "brand": "AL2",
        "title": "Wandregal Muse 004",
        "caption": "Modulares Luxus-Regalsystem mit integrierter LED-Beleuchtung und architektonischer Präsenz",
        "image": "/images/marken/produkte/al2-05a8a5dd86.jpg"
      }
    ]
  },
  {
    "id": "licht",
    "label": "Licht",
    "teaser": "Leuchten und Lichtobjekte",
    "cover": "/images/galerien/lampen/02.jpg",
    "items": [
      {
        "brand": "Lampen",
        "title": "Mogg Lamp Era 19 Kopie",
        "caption": "Lampen – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/lampen/02.jpg"
      },
      {
        "brand": "Lampen",
        "title": "In Between 4050X2190",
        "caption": "Lampen – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/lampen/03.jpg"
      },
      {
        "brand": "Lampen",
        "title": "Lt40",
        "caption": "Lampen – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/lampen/04.jpg"
      },
      {
        "brand": "Lampen",
        "title": "Mogg Seat Uccio 05 640X640 Kopie",
        "caption": "Lampen – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/lampen/05.jpg"
      },
      {
        "brand": "Lampen",
        "title": "Mogg Lamp Orbit 15 640X640 Kopie",
        "caption": "Lampen – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/lampen/06.jpg"
      },
      {
        "brand": "Lampen",
        "title": "Mogg Lamp Orbit 14 640X640 Kopie",
        "caption": "Lampen – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/lampen/07.jpg"
      },
      {
        "brand": "Lampen",
        "title": "Mogg Lamp Era 09 640X640 Kopie",
        "caption": "Lampen – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/lampen/08.jpg"
      },
      {
        "brand": "Marchetti",
        "title": "Deckenlampe Maestri di Luce Rim",
        "caption": "Elegante Luxus-Ringbeleuchtung und minimalistische Design-Pendelleuchte",
        "image": "/images/marken/produkte/marchetti-5761ac33c9.jpg"
      },
      {
        "brand": "Marchetti",
        "title": "Deckenlampe Marchetti Maestri di Luce Anime",
        "caption": "Exklusive Luxus-Designerleuchte und poetische Lichtskulptur",
        "image": "/images/marken/produkte/marchetti-a00c35c09d.jpg"
      },
      {
        "brand": "Marchetti",
        "title": "Deckenlampe Marchetti Maestri di Luce Pura",
        "caption": "Minimalistische Luxus-Designerleuchte für puristische Eleganz",
        "image": "/images/marken/produkte/marchetti-3c52374ddf.jpg"
      },
      {
        "brand": "Mogg",
        "title": "Stehlampe Costantina Opal",
        "caption": "Skulpturale Luxus-Leuchte mit opalem Glasdiffusor für stimmungsvolles Ambiente",
        "image": "/images/marken/produkte/mogg-6c88c78103.jpg"
      }
    ]
  },
  {
    "id": "schlafen",
    "label": "Schlafen",
    "teaser": "Betten und Schlafzimmer",
    "cover": "/images/galerien/betten/07.jpg",
    "items": [
      {
        "brand": "Möller Design",
        "title": "Dana Daybed",
        "caption": "Dana Daybed Milieu – elegantes Daybed für exklusive Schlaf- und Ruheräume.",
        "image": "/images/galerien/betten/07.jpg"
      },
      {
        "brand": "Betten",
        "title": "Moeller Design",
        "caption": "Betten – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/betten/01.png"
      },
      {
        "brand": "Betten",
        "title": "Rose Milieu Schraeg 05",
        "caption": "Betten – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/betten/02.jpg"
      },
      {
        "brand": "Betten",
        "title": "Md 280616 6528",
        "caption": "Betten – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/betten/03.jpg"
      },
      {
        "brand": "Betten",
        "title": "Yva Milieu Frontal",
        "caption": "Betten – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/betten/04.jpg"
      },
      {
        "brand": "Betten",
        "title": "Md13 Smart 18 02",
        "caption": "Betten – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/betten/05.jpg"
      },
      {
        "brand": "Betten",
        "title": "Md13 Yoda 18 01",
        "caption": "Betten – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/betten/06.jpg"
      },
      {
        "brand": "Betten",
        "title": "Liv 034",
        "caption": "Betten – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/betten/08.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Möller Design Fold Edition",
        "caption": "Luxuriöses Designer-Boxspringbett mit ikonischem Falt-Kopfteil",
        "image": "/images/galerien/moeller/01.png"
      },
      {
        "brand": "Möller Design",
        "title": "Leanbox Carry",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moeller/02.png"
      },
      {
        "brand": "Möller Design",
        "title": "Rag Box Milieu 01",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moeller/03.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Rose Milieu Schraeg 05",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moeller/04.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Steely Topshot 4",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moeller/05.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Wood Fellas 01",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moeller/06.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Md 280616 6528",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moeller/07.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Yva Milieu Frontal",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moeller/08.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Rose Milieu Schraeg 05",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-moeller-design/01.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Steely Topshot 4",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-moeller-design/02.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Leanbox Beistelltische",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-moeller-design/03.jpg"
      },
      {
        "brand": "Möller Design",
        "title": "Md13 Yoda 18 01",
        "caption": "Möller Design – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-moeller-design/04.jpg"
      }
    ]
  },
  {
    "id": "outdoor",
    "label": "Outdoor",
    "teaser": "Terrasse und Gartenmöbel",
    "cover": "/images/galerien/varaschin/05.jpg",
    "items": [
      {
        "brand": "Varaschin",
        "title": "Outdoor Sofa Emma",
        "caption": "Lounge für Terrasse und Garten – wetterfest, elegant.",
        "image": "/images/galerien/varaschin/05.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Belt Coffee Daybed",
        "caption": "Varaschin Belt Coffee Daybed Gia0872 – Outdoor-Daybed mit großzügiger Liegefläche.",
        "image": "/images/galerien/varaschin/04.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Varaschin Tibidabo Daybed Compact Gia2489 1",
        "caption": "Varaschin – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/varaschin/01.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Outdoor Sofa Emma",
        "caption": "Outdoor Sofa Emma",
        "image": "/images/galerien/varaschin/02.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Outdoor Sofa Emma",
        "caption": "Outdoor Sofa Emma",
        "image": "/images/galerien/varaschin/03.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Outdoor Sofa Emma",
        "caption": "Outdoor Sofa Emma",
        "image": "/images/galerien/varaschin/06.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Outdoor Sofa Emma",
        "caption": "Outdoor Sofa Emma",
        "image": "/images/galerien/varaschin/07.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Varaschin Belt Coffee Daybed Dsc1486 1 1",
        "caption": "Varaschin – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/varaschin/08.jpg"
      },
      {
        "brand": "Unopiu",
        "title": "Katalog Unopi 2026 Seite 021 1",
        "caption": "Unopiu – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-unopiu/01.jpg"
      },
      {
        "brand": "Unopiu",
        "title": "Katalog Unopi 2026 Seite 015 1",
        "caption": "Unopiu – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-unopiu/02.jpg"
      },
      {
        "brand": "Unopiu",
        "title": "Katalog Unopi 2026 Seite 003 1",
        "caption": "Unopiu – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-unopiu/03.jpg"
      },
      {
        "brand": "Unopiu",
        "title": "Katalog Unopi 2026 Seite 027 1",
        "caption": "Unopiu – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-unopiu/04.jpg"
      },
      {
        "brand": "Unopiu",
        "title": "Katalog Unopi 2026 Seite 146",
        "caption": "Unopiu – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-unopiu/05.jpg"
      },
      {
        "brand": "Unopiu",
        "title": "Katalog Unopi 2026 Seite 029 1",
        "caption": "Unopiu – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-unopiu/06.jpg"
      },
      {
        "brand": "Unopiu",
        "title": "Katalog Unopi 2026 Seite 150",
        "caption": "Unopiu – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-unopiu/07.jpg"
      },
      {
        "brand": "Unopiu",
        "title": "Katalog Unopi 2026 Seite 151",
        "caption": "Unopiu – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-unopiu/08.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Varaschin The One 05",
        "caption": "Varaschin – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-varaschin/01.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Varaschin Tibidabo Daybed Compact Dsc5377 1",
        "caption": "Varaschin – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-varaschin/02.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Varaschin The One 08",
        "caption": "Varaschin – Motiv aus der ZB Interieur Galerie.",
        "image": "/images/galerien/moebel-varaschin/03.jpg"
      },
      {
        "brand": "Varaschin",
        "title": "Outdoor Sofa Emma",
        "caption": "Varaschin – Outdoor Sofa Emma.",
        "image": "/images/galerien/moebel-varaschin/04.jpg"
      }
    ]
  }
]
