/**
 * E2E: Einzel- und Mehrfach-Upload auf /verwaltung/produkte
 * Prüft Dateiname → Produktname / Marke / Alt-Text und Speichern.
 */
import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'

const BASE = process.env.APP_URL || 'http://127.0.0.1:43127'
const FIXTURES = '/tmp/zb-upload-test'
const OUT = '/opt/cursor/artifacts/screenshots'
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-gpu'],
})
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function clearUploads() {
  await page.evaluate(async () => {
    localStorage.removeItem('zb-interieur.uploaded-products.v1')
    await new Promise((resolve, reject) => {
      const req = indexedDB.deleteDatabase('zb-interieur-uploads')
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
      req.onblocked = () => resolve()
    })
  })
}

// --- Einzel-Upload ---
await page.goto(`${BASE}/verwaltung/produkte`, { waitUntil: 'networkidle' })
await clearUploads()
await page.reload({ waitUntil: 'networkidle' })

const single = path.join(FIXTURES, 'FINE_Aria_Sofa_3-Sitzer.jpg')
await page.locator('input[type="file"]').setInputFiles(single)
await page.waitForSelector('text=FINE_Aria_Sofa_3-Sitzer.jpg')
const nameInput = page.locator('table tbody tr').first().locator('input[type="text"]').first()
const nameVal = await nameInput.inputValue()
assert(nameVal === 'FINE Aria Sofa 3-Sitzer', `Einzel: expected product name, got "${nameVal}"`)

const brandSelect = page.locator('table tbody tr').first().locator('select')
const brandVal = await brandSelect.inputValue()
assert(brandVal === 'fine', `Einzel: expected brand fine, got "${brandVal}"`)

const altInput = page.locator('table tbody tr').first().locator('input[type="text"]').nth(1)
const altVal = await altInput.inputValue()
assert(altVal === 'FINE Aria Sofa 3-Sitzer', `Einzel: expected alt, got "${altVal}"`)

// Manual edit priority
await nameInput.fill('FINE Aria Sofa Custom')
assert((await nameInput.inputValue()) === 'FINE Aria Sofa Custom', 'Einzel: manual edit failed')
assert((await altInput.inputValue()) === 'FINE Aria Sofa Custom', 'Einzel: alt should follow until touched')

await page.screenshot({ path: path.join(OUT, 'upload-single-review.png'), fullPage: true })

await page.getByRole('button', { name: /speichern/i }).click()
await page.waitForSelector('text=Produkt gespeichert')
await page.screenshot({ path: path.join(OUT, 'upload-single-saved.png'), fullPage: true })
console.log('OK single upload')

// Verify on Marken page
await page.goto(`${BASE}/marken`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
const hasCustom = await page.getByText('FINE Aria Sofa Custom').count()
assert(hasCustom > 0, 'Einzel: product not visible on /marken')
await page.screenshot({ path: path.join(OUT, 'upload-single-on-marken.png'), fullPage: false })
console.log('OK single visible on Marken')

// Catalog product still present (existing Fine product headlines)
const catalogStillThere = await page.locator('#produkte').count()
assert(catalogStillThere === 1, 'Marken products section missing')

// --- Mehrfach-Upload ---
await page.goto(`${BASE}/verwaltung/produkte`, { waitUntil: 'networkidle' })
await clearUploads()
await page.reload({ waitUntil: 'networkidle' })

const multi = [
  path.join(FIXTURES, 'FINE_Aria_Sofa_3-Sitzer.jpg'),
  path.join(FIXTURES, 'FINE_Luna_Sessel.jpg'),
  path.join(FIXTURES, 'FINE_Modena_Essecke.jpg'),
  path.join(FIXTURES, 'FINE_Corso_Sofa_2-Sitzer.webp'),
]
await page.locator('input[type="file"]').setInputFiles(multi)
await page.waitForSelector('text=FINE_Corso_Sofa_2-Sitzer.webp')

const rows = page.locator('table tbody tr')
const rowCount = await rows.count()
assert(rowCount === 4, `Mehrfach: expected 4 rows, got ${rowCount}`)

const expected = [
  'FINE Aria Sofa 3-Sitzer',
  'FINE Luna Sessel',
  'FINE Modena Essecke',
  'FINE Corso Sofa 2-Sitzer',
]
for (let i = 0; i < 4; i++) {
  const n = await rows.nth(i).locator('input[type="text"]').first().inputValue()
  assert(n === expected[i], `Mehrfach row ${i}: got "${n}", want "${expected[i]}"`)
  const b = await rows.nth(i).locator('select').inputValue()
  assert(b === 'fine', `Mehrfach row ${i}: brand should be fine`)
  const a = await rows.nth(i).locator('input[type="text"]').nth(1).inputValue()
  assert(a === expected[i], `Mehrfach row ${i}: alt mismatch`)
}

await page.screenshot({ path: path.join(OUT, 'upload-multi-review.png'), fullPage: true })

await page.getByRole('button', { name: /4 speichern/i }).click()
await page.waitForSelector('text=4 Produkte gespeichert')
await page.screenshot({ path: path.join(OUT, 'upload-multi-saved.png'), fullPage: true })
console.log('OK multi upload')

await page.goto(`${BASE}/marken`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
for (const title of expected) {
  const c = await page.getByText(title, { exact: true }).count()
  assert(c > 0, `Mehrfach: "${title}" not on /marken`)
}
// Filter Fine
await page.getByRole('button', { name: /^Fine$/i }).first().click()
await page.waitForTimeout(400)
await page.screenshot({ path: path.join(OUT, 'upload-multi-on-marken-fine.png'), fullPage: false })
console.log('OK multi visible on Marken (Fine filter)')

await browser.close()
console.log('ALL UPLOAD E2E CHECKS PASSED')
