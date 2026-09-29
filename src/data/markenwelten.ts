export type MarkenweltItem = {
  brand: string
  title: string
  caption: string
  image: string
  stilpunkteUrl?: string
}

export type MarkenweltCategory = {
  id: string
  label: string
  teaser: string
  cover: string
  items: MarkenweltItem[]
}

/** Kuratierte Markenwelten aus STILPUNKTE (ZB Interieur), ohne Lambert/Sifas. */
export const markenwelten: MarkenweltCategory[] = 
[
  {
    "id": "wohnen",
    "label": "Wohnen",
    "teaser": "Sofas, Sessel und Loungemöbel",
    "cover": "/images/designmoebel-1.jpg",
    "items": [
      {
        "brand": "Mogg",
        "title": "Couchtisch Bilbao",
        "caption": "Skulpturaler Luxus-Couchtisch & Beistelltisch im Retro-Modern-Look",
        "image": "/images/marken/produkte/mogg-1f50cfbd2e.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/mogg/couchtisch-bilbao-skulpturaler-luxus-couchtisch-beistelltisch-im-retro-modern-look/"
      },
      {
        "brand": "Rohleder",
        "title": "Hocker Caribbean",
        "caption": "Luxuriöser Lounge-Pouf und Designer-Hocker mit exklusiver Textilkunst",
        "image": "/images/marken/produkte/rohleder-6d34c2d0aa.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/rohleder/hocker-caribbean-luxurioeser-lounge-pouf-und-designer-hocker-mit-exklusiver-textilkunst/"
      },
      {
        "brand": "AL2",
        "title": "Meguru Beistelltisch",
        "caption": "Luxuriöser Designer-Couchtisch mit organischer Harmonie und meisterhafter Holzverarbeitung",
        "image": "/images/marken/produkte/al2-77469a5d57.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/meguru-beistelltisch-luxurioeser-designer-couchtisch-mit-organischer-harmonie-und-meisterhafter-holzverarbeitung/"
      },
      {
        "brand": "Papadatos",
        "title": "Sessel ANN",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/papadatos-bd45584d92.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/papadatos/sessel-ann/"
      },
      {
        "brand": "AL2",
        "title": "Sessel Bonet 013",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/al2-5a9c72ce99.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/sessel-bonet-013/"
      },
      {
        "brand": "Papadatos",
        "title": "Sessel Cozy",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/papadatos-b94a950444.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/papadatos/sessel-cozy/"
      },
      {
        "brand": "Kolini",
        "title": "Sessel LUC",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/kolini-5bd2de738e.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/kolini/sessel-luc-2/"
      },
      {
        "brand": "Gyform",
        "title": "Sessel Yole",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/gyform-89d3f2d368.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/gyform/sessel-yole/"
      },
      {
        "brand": "AL2",
        "title": "Siena 012 Stuhl",
        "caption": "Drehbarer Luxus-Designersessel für anspruchsvolle Essbereiche",
        "image": "/images/marken/produkte/al2-81cb89cf40.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/siena-012-stuhl-drehbarer-luxus-designersessel-fuer-anspruchsvolle-essbereiche/"
      },
      {
        "brand": "Gyform",
        "title": "Sofa Achille",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/gyform-697e30dcd8.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/gyform/sofa-achille/"
      },
      {
        "brand": "Nature Design",
        "title": "Sofa Dune",
        "caption": "Organisches Luxus-Sofa mit fließender Silhouette und italienischer Manufaktur-Exzellenz",
        "image": "/images/marken/produkte/nature-design-83d50c09a8.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/nature-design/sofa-dune-organisches-luxus-sofa-mit-flieender-silhouette-und-italienischer-manufaktur-exzellenz/"
      },
      {
        "brand": "Papadatos",
        "title": "Sofa Naos",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/papadatos-9238eb4515.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/papadatos/sofa-naos/"
      }
    ]
  },
  {
    "id": "essen",
    "label": "Essen",
    "teaser": "Tische und Stühle für den Dining-Bereich",
    "cover": "/images/designmoebel-2.jpg",
    "items": [
      {
        "brand": "AL2",
        "title": "Al B 012 Stuhl",
        "caption": "Luxuriöser Designer-Polsterstuhl mit massivem Echtholzgestell",
        "image": "/images/marken/produkte/al2-2b338ddf20.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/al-b-012-stuhl-luxurioeser-designer-polsterstuhl-mit-massivem-echtholzgestell/"
      },
      {
        "brand": "AL2",
        "title": "Bo M 013 Stuhl",
        "caption": "Minimalistischer Luxus-Polsterstuhl mit filigranem Metallgestell",
        "image": "/images/marken/produkte/al2-f19b23834b.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/bo-m-013-stuhl-minimalistischer-luxus-polsterstuhl-mit-filigranem-metallgestell/"
      },
      {
        "brand": "Mogg",
        "title": "Brera Stuhl",
        "caption": "Eleganter Luxus-Polsterstuhl im Mailänder Chic für anspruchsvolle Essbereiche",
        "image": "/images/marken/produkte/mogg-0f8be09dbc.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/mogg/brera-stuhl-eleganter-luxus-polsterstuhl-im-mailaender-chic-fuer-anspruchsvolle-essbereiche/"
      },
      {
        "brand": "AL2",
        "title": "Clara 012 Stuhl",
        "caption": "Eleganter Luxus-Polsterstuhl mit zeitloser Silhouette",
        "image": "/images/marken/produkte/al2-1d0e4d056e.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/clara-012-stuhl-eleganter-luxus-polsterstuhl-mit-zeitloser-silhouette/"
      },
      {
        "brand": "AL2",
        "title": "Dakry B 001 Esstisch",
        "caption": "Organische Eleganz und skulpturales Design für luxuriöse Dining-Bereiche",
        "image": "/images/marken/produkte/al2-0e7dd62587.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/dakry-b-001-esstisch-organische-eleganz-und-skulpturales-design-fuer-luxurioese-dining-bereiche/"
      },
      {
        "brand": "AL2",
        "title": "Echo C-001 Esstisch",
        "caption": "Luxuriöser Designertisch mit rhythmischer Eleganz und architektonischer Symmetrie",
        "image": "/images/marken/produkte/al2-e3d7c5c0db.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/echo-c-001-esstisch-luxurioeser-designertisch-mit-rhythmischer-eleganz-und-architektonischer-symmetrie/"
      },
      {
        "brand": "Mogg",
        "title": "Esstisch Elephante",
        "caption": "Monolithischer Luxus-Tisch und skulpturales Statement-Piece",
        "image": "/images/marken/produkte/mogg-d4f1141ade.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/mogg/esstisch-elephante-monolithischer-luxus-tisch-und-skulpturales-statement-piece/"
      },
      {
        "brand": "Mogg",
        "title": "Esstisch Medusa",
        "caption": "Skulpturaler Luxus-Designertisch mit organisch geschwungener Basis",
        "image": "/images/marken/produkte/mogg-92dc022e9f.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/mogg/esstisch-medusa-skulpturaler-luxus-designertisch-mit-organisch-geschwungener-basis/"
      },
      {
        "brand": "AL2",
        "title": "Fatty 012 Stuhl",
        "caption": "Extravaganter Luxus-Polsterstuhl für maximalen Komfort und gemütliche Eleganz",
        "image": "/images/marken/produkte/al2-f6f60ea228.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/fatty-012-stuhl-extravaganter-luxus-polsterstuhl-fuer-maximalen-komfort-und-gemuetliche-eleganz/"
      },
      {
        "brand": "Form exclusiv",
        "title": "Jahrhunderttisch Campus mit Mittelader aus Stahl",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/form-exclusiv-d4c9015d18.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/form-exclusiv/jahrhunderttisch-campus-mit-mittelader-aus-stahl/"
      },
      {
        "brand": "Bonaldo",
        "title": "Liaison Esstisch",
        "caption": "Skulpturales Luxus-Meisterwerk mit architektonischer Eleganz und italienischer Design-Exzellenz",
        "image": "/images/marken/produkte/bonaldo-8d116124ed.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/bonaldo/liaison-esstisch-skulpturales-luxus-meisterwerk-mit-architektonischer-eleganz-und-italienischer-design-exzellenz/"
      },
      {
        "brand": "AL2",
        "title": "Mob 012 Stuhl",
        "caption": "Skulpturaler Luxus-Designerstuhl mit ausdrucksstarker Silhouette",
        "image": "/images/marken/produkte/al2-c08e0b0e47.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/mob-012-stuhl-skulpturaler-luxus-designerstuhl-mit-ausdrucksstarker-silhouette/"
      },
      {
        "brand": "AL2",
        "title": "Mos-i-ko GLA-001 Esstisch",
        "caption": "Exklusiver Designertisch mit skulpturalem Mosaik-Charakter und grafischer Präzision",
        "image": "/images/marken/produkte/al2-d293181e38.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/mos-i-ko-gla-001-esstisch-exklusiver-designertisch-mit-skulpturalem-mosaik-charakter-und-grafischer-praezision/"
      },
      {
        "brand": "AL2",
        "title": "Prism Esstisch",
        "caption": "Architektonisches Luxus-Meisterwerk mit prismatischer Geometrie",
        "image": "/images/marken/produkte/al2-b6893b4fce.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/prism-esstisch-architektonisches-luxus-meisterwerk-mit-prismatischer-geometrie/"
      },
      {
        "brand": "Form exclusiv",
        "title": "Tisch Schachbrettmuster Madison",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/form-exclusiv-5aba45f981.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/form-exclusiv/tisch-schachbrettmuster-madison/"
      },
      {
        "brand": "AL2",
        "title": "Wood-oo A 001 Esstisch",
        "caption": "Die Magie edler Holz-Handwerkskunst und skulpturaler Design-Ästhetik",
        "image": "/images/marken/produkte/al2-c18150c7cd.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/wood-oo-a-001-esstisch-die-magie-edler-holz-handwerkskunst-und-skulpturaler-design-sthetik/"
      },
      {
        "brand": "AL2",
        "title": "Zephyr AR-001 Esstisch",
        "caption": "Luxuriöser Designertisch mit grazil-leichter Silhouette und architektonischer Eleganz",
        "image": "/images/marken/produkte/al2-0409b061cd.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/zephyr-ar-001-esstisch-luxurioeser-designertisch-mit-grazil-leichter-silhouette-und-architektonischer-eleganz/"
      }
    ]
  },
  {
    "id": "stauraum",
    "label": "Stauraum",
    "teaser": "Sideboards, Regale und Anrichten",
    "cover": "/images/marken/produkte/bonaldo-74caea5e65.jpg",
    "items": [
      {
        "brand": "Bonaldo",
        "title": "Arragan Sideboard (high & low)",
        "caption": "Skulpturale Luxus-Anrichten von Gabriele & Oscar Buratti mit architektonischer Eleganz",
        "image": "/images/marken/produkte/bonaldo-74caea5e65.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/bonaldo/arragan-sideboard-high-low-skulpturale-luxus-anrichten-von-gabriele-oscar-buratti-mit-architektonischer-eleganz/"
      },
      {
        "brand": "Papadatos",
        "title": "Barschrank Twist V",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/papadatos-7c8ae4aa0b.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/papadatos/barschrank-twist-v/"
      },
      {
        "brand": "Mogg",
        "title": "Cellula",
        "caption": "Modulares Luxus-Wandregal & geometrisches Design-Stauraumsystem aus Metall",
        "image": "/images/marken/produkte/mogg-62eebf5e66.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/mogg/cellula-modulares-luxus-wandregal-geometrisches-design-stauraumsystem-aus-metall/"
      },
      {
        "brand": "AL2",
        "title": "El It 003 Sideboard",
        "caption": "Minimalistisches Luxus-Sideboard mit architektonischer Eleganz",
        "image": "/images/marken/produkte/al2-a5b8ae5515.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/el-it-003-sideboard-minimalistisches-luxus-sideboard-mit-architektonischer-eleganz/"
      },
      {
        "brand": "AL2",
        "title": "Eterna A 003 Sideboard",
        "caption": "Luxuriöse Design-Anrichte mit meisterhafter Holz-Handwerkskunst",
        "image": "/images/marken/produkte/al2-64ee6305f8.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/eterna-a-003-sideboard-luxurioese-design-anrichte-mit-meisterhafter-holz-handwerkskunst/"
      },
      {
        "brand": "Mogg",
        "title": "Metrica Regal",
        "caption": "Minimalistisches Luxus-Metallregal mit rhythmischer Geometrie",
        "image": "/images/marken/produkte/mogg-132ffd4b3a.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/mogg/metrica-regal-minimalistisches-luxus-metallregal-mit-rhythmischer-geometrie/"
      },
      {
        "brand": "Mogg",
        "title": "Sideboard Ikebana",
        "caption": "Poetisches Luxus-Sideboard und minimalistisches Design-Stauraumsystem",
        "image": "/images/marken/produkte/mogg-80cbf94d7d.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/mogg/sideboard-ikebana-poetisches-luxus-sideboard-und-minimalistisches-design-stauraumsystem/"
      },
      {
        "brand": "AL2",
        "title": "Wandregal Muse 004",
        "caption": "Modulares Luxus-Regalsystem mit integrierter LED-Beleuchtung und architektonischer Präsenz",
        "image": "/images/marken/produkte/al2-05a8a5dd86.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/wandregal-muse-004-modulares-luxus-regalsystem-mit-integrierter-led-beleuchtung-und-architektonischer-praesenz/"
      }
    ]
  },
  {
    "id": "licht",
    "label": "Licht",
    "teaser": "Leuchten als Raumskulptur",
    "cover": "/images/marken/produkte/marchetti-5761ac33c9.jpg",
    "items": [
      {
        "brand": "Marchetti",
        "title": "Deckenlampe Maestri di Luce Rim",
        "caption": "Elegante Luxus-Ringbeleuchtung und minimalistische Design-Pendelleuchte",
        "image": "/images/marken/produkte/marchetti-5761ac33c9.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/marchetti/deckenlampe-maestri-di-luce-rim-elegante-luxus-ringbeleuchtung-und-minimalistische-design-pendelleuchte/"
      },
      {
        "brand": "Marchetti",
        "title": "Deckenlampe Marchetti Maestri di Luce Anime",
        "caption": "Exklusive Luxus-Designerleuchte und poetische Lichtskulptur",
        "image": "/images/marken/produkte/marchetti-a00c35c09d.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/marchetti/deckenlampe-marchetti-maestri-di-luce-anime-exklusive-luxus-designerleuchte-und-poetische-lichtskulptur/"
      },
      {
        "brand": "Marchetti",
        "title": "Deckenlampe Marchetti Maestri di Luce Pura",
        "caption": "Minimalistische Luxus-Designerleuchte für puristische Eleganz",
        "image": "/images/marken/produkte/marchetti-3c52374ddf.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/marchetti/deckenlampe-marchetti-maestri-di-luce-pura-minimalistische-luxus-designerleuchte-fuer-puristische-eleganz/"
      },
      {
        "brand": "Mogg",
        "title": "Stehlampe Costantina Opal",
        "caption": "Skulpturale Luxus-Leuchte mit opalem Glasdiffusor für stimmungsvolles Ambiente",
        "image": "/images/marken/produkte/mogg-6c88c78103.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/mogg/stehlampe-costantina-opal-skulpturale-luxus-leuchte-mit-opalem-glasdiffusor-fuer-stimmungsvolles-ambiente/"
      }
    ]
  },
  {
    "id": "schlafen",
    "label": "Schlafen",
    "teaser": "Betten und Schlafzimmer-Design",
    "cover": "/images/schlafzimmer-render-1.jpg",
    "items": [
      {
        "brand": "AL2",
        "title": "Koi Bett",
        "caption": "Luxuriöses Designer-Bett mit fließender Eleganz und meisterhafter Manufaktur-Qualität",
        "image": "/images/marken/produkte/al2-7bb22bb3e6.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/al2/koi-bett-luxurioeses-designer-bett-mit-flieender-eleganz-und-meisterhafter-manufaktur-qualitaet/"
      },
      {
        "brand": "Möller Design",
        "title": "Möller Design Fold Edition",
        "caption": "Luxuriöses Designer-Boxspringbett mit ikonischem Falt-Kopfteil",
        "image": "/images/marken/produkte/moeller-design-db50ee4d7a.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/moeller-design/moeller-design-fold-edition-luxurioeses-designer-boxspringbett-mit-ikonischem-falt-kopfteil/"
      },
      {
        "brand": "Möller Design",
        "title": "The Grid",
        "caption": "Architektonisches Luxus-Polsterbett mit geometrischer Raster-Ästhetik",
        "image": "/images/marken/produkte/moeller-design-456d713267.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/moeller-design/the-grid-architektonisches-luxus-polsterbett-mit-geometrischer-raster-sthetik/"
      }
    ]
  },
  {
    "id": "outdoor",
    "label": "Outdoor",
    "teaser": "Terrasse und Gartenmöbel",
    "cover": "/images/planung/terrasse-1.jpg",
    "items": [
      {
        "brand": "Varaschin",
        "title": "Outdoor Sofa Emma",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/varaschin-efe68078b6.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/varaschin/outdoor-sofa-emma/"
      },
      {
        "brand": "Varaschin",
        "title": "Outdoor Tisch System Star",
        "caption": "Exklusives Designstück aus dem Showroom Homburg.",
        "image": "/images/marken/produkte/varaschin-8a0d2b3d48.jpg",
        "stilpunkteUrl": "https://www.stilpunkte.de/produkt/varaschin/outdoor-tisch-system-star/"
      }
    ]
  }
]
