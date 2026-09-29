#!/usr/bin/env node
/**
 * Netlify Drop / static hosts often ignore SPA redirects.
 * Duplicate index.html into each app route so deep links resolve.
 */
import { copyFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const index = join(dist, 'index.html')

if (!existsSync(index)) {
  console.error('dist/index.html missing – run vite build first')
  process.exit(1)
}

const routes = [
  'beratung',
  'planung',
  'marken',
  'magazin',
  'blog',
  'outdoor',
  'service',
  'termin',
  'kontakt',
  'impressum',
  'datenschutz',
  'barrierefreiheit',
  'agb',
  'kuechenplanungen-2',
  'badeinrichtungen',
  'bueroeinrichtungen-2',
  'terrassenplanung',
  'objekt-hoteleinrichtungen-2',
  'sonderanfertigungen-2',
  'raumgestaltung',
  'galerien',
  'galerie',
]

for (const route of routes) {
  const dir = join(dist, route)
  mkdirSync(dir, { recursive: true })
  copyFileSync(index, join(dir, 'index.html'))
}

// Blog article deep links
const blogSlugs = [
  'einrichtungsplanung-homburg-worauf-es-ankommt',
  'kuechenplanung-saarland-modern-und-funktional',
  'designmoebel-marken-im-showroom-homburg',
  'outdoor-terrasse-planen-varaschin',
  'stilpunkte-award-einrichtungshaus-homburg',
]
for (const slug of blogSlugs) {
  const dir = join(dist, 'blog', slug)
  mkdirSync(dir, { recursive: true })
  copyFileSync(index, join(dir, 'index.html'))
}

console.log(`SPA route mirrors: ${routes.length + blogSlugs.length} paths`)
