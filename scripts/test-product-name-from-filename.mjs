/** Regression checks: filename → product name (no AI rewrite). */
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const runner = `
import assert from 'node:assert/strict'
import { filenameToProductName, parseProductFilename } from './src/lib/productNameFromFilename.ts'

const brands = [
  { name: 'Fine', slug: 'fine' },
  { name: 'Varaschin', slug: 'varaschin' },
]

const cases = [
  ['FINE_Aria_Sofa_3-Sitzer.jpg', 'FINE Aria Sofa 3-Sitzer'],
  ['FINE_Luna_Sessel.jpg', 'FINE Luna Sessel'],
  ['FINE_Modena_Essecke.jpg', 'FINE Modena Essecke'],
  ['FINE_Corso_Sofa_2-Sitzer.webp', 'FINE Corso Sofa 2-Sitzer'],
  ['FINE_Aria_3-Sitzer.jpg', 'FINE Aria 3-Sitzer'],
  ['FINE_Modena_Ecke_Links.jpg', 'FINE Modena Ecke Links'],
  ['FINE_Sofa_180x90_cm.jpg', 'FINE Sofa 180x90 cm'],
  ['FINE_Sessel_Ø80cm.jpg', 'FINE Sessel Ø80cm'],
  ['FINE_Tisch_120x80cm.jpg', 'FINE Tisch 120x80cm'],
  ['FINE__Double___Space.png', 'FINE Double Space'],
  ['path/to/FINE_Aria_Sofa.jpg', 'FINE Aria Sofa'],
]

for (const [input, expected] of cases) {
  assert.equal(filenameToProductName(input), expected, input)
}

const parsed = parseProductFilename('FINE_Aria_Sofa_3-Sitzer.jpg', brands)
assert.equal(parsed.productName, 'FINE Aria Sofa 3-Sitzer')
assert.equal(parsed.brandSlug, 'fine')
assert.equal(parsed.brandName, 'Fine')
assert.equal(parsed.brandToken, 'FINE')

const noBrand = parseProductFilename('Unknown_Chair.jpg', brands)
assert.equal(noBrand.productName, 'Unknown Chair')
assert.equal(noBrand.brandSlug, null)

assert.equal(filenameToProductName('.jpg'), '')

console.log('OK: ' + (cases.length + 3) + ' product-name-from-filename checks passed')
`

const result = spawnSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e', runner], {
  cwd: root,
  encoding: 'utf8',
})
if (result.status !== 0) {
  console.error(result.stderr || result.stdout)
  process.exit(result.status ?? 1)
}
console.log(result.stdout.trim())
