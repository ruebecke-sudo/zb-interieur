import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { marken } from '../data/marken'
import { parseProductFilename } from '../lib/productNameFromFilename'
import { saveUploadedProducts } from '../lib/uploadedProductsStore'

type DraftRow = {
  id: string
  file: File
  previewUrl: string
  /** Auto name from filename; never overwritten once the user edits productName. */
  autoProductName: string
  productName: string
  altText: string
  brandSlug: string
  brandName: string
  nameTouched: boolean
  altTouched: boolean
  error?: string
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif'

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function ProduktUploadPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<DraftRow[]>([])
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const brandLookup = useMemo(
    () => marken.map((m) => ({ name: m.name, slug: m.slug })),
    [],
  )

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList)
    const next: DraftRow[] = []

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        next.push({
          id: makeId(),
          file,
          previewUrl: '',
          autoProductName: '',
          productName: '',
          altText: '',
          brandSlug: '',
          brandName: '',
          nameTouched: false,
          altTouched: false,
          error: `Datei „${file.name}“ ist kein Bild und wird übersprungen.`,
        })
        continue
      }

      const parsed = parseProductFilename(file.name, brandLookup)
      const productName = parsed.productName
      if (!productName) {
        next.push({
          id: makeId(),
          file,
          previewUrl: URL.createObjectURL(file),
          autoProductName: '',
          productName: '',
          altText: '',
          brandSlug: '',
          brandName: '',
          nameTouched: false,
          altTouched: false,
          error: `Dateiname „${file.name}“ ist ungültig.`,
        })
        continue
      }

      next.push({
        id: makeId(),
        file,
        previewUrl: URL.createObjectURL(file),
        autoProductName: productName,
        productName,
        altText: productName,
        brandSlug: parsed.brandSlug ?? '',
        brandName: parsed.brandName ?? parsed.brandToken ?? '',
        nameTouched: false,
        altTouched: false,
      })
    }

    setRows((prev) => [...prev, ...next])
    setStatus('idle')
    setStatusMessage('')
  }

  function updateRow(id: string, patch: Partial<DraftRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  function removeRow(id: string) {
    setRows((prev) => {
      const row = prev.find((r) => r.id === id)
      if (row?.previewUrl) URL.revokeObjectURL(row.previewUrl)
      return prev.filter((r) => r.id !== id)
    })
  }

  async function handleSave() {
    const valid = rows.filter((r) => !r.error && r.productName.trim())
    if (valid.length === 0) {
      setStatus('error')
      setStatusMessage('Keine gültigen Produkte zum Speichern.')
      return
    }

    const missingBrand = valid.filter((r) => !r.brandSlug)
    if (missingBrand.length > 0) {
      setStatus('error')
      setStatusMessage(
        `Marke fehlt oder unbekannt bei: ${missingBrand.map((r) => r.file.name).join(', ')}. Dateiname sollte mit einer bekannten Marke beginnen (z. B. FINE_…).`,
      )
      return
    }

    setStatus('saving')
    setStatusMessage('Produkte werden gespeichert …')
    try {
      await saveUploadedProducts(
        valid.map((r) => ({
          id: r.id,
          productName: r.productName.trim(),
          altText: (r.altText || r.productName).trim(),
          brandSlug: r.brandSlug,
          brandName: r.brandName || r.brandSlug,
          file: r.file,
        })),
      )
      for (const r of rows) {
        if (r.previewUrl) URL.revokeObjectURL(r.previewUrl)
      }
      setRows([])
      setStatus('saved')
      setStatusMessage(
        `${valid.length} Produkt${valid.length === 1 ? '' : 'e'} gespeichert. Anzeige unter Marken → Produktauswahl.`,
      )
    } catch (err) {
      setStatus('error')
      setStatusMessage(err instanceof Error ? err.message : 'Speichern fehlgeschlagen.')
    }
  }

  const readyCount = rows.filter((r) => !r.error && r.productName.trim()).length

  return (
    <section className="bg-fog">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">
          Verwaltung
        </p>
        <h1 className="mt-2 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight">
          Produktbilder hochladen
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          Produktname und Marke werden aus dem Dateinamen übernommen – ohne KI-Umformulierung.
          Vor dem Speichern können Name und Alt-Text angepasst werden. Bestehende Katalogprodukte
          bleiben unverändert.
        </p>

        <div className="mt-8 rounded-sm border border-line bg-white p-6">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex bg-brand px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
          >
            Bilder auswählen
          </button>
          <p className="mt-3 text-sm text-muted">
            Einzel- oder Mehrfach-Upload. Beispiel: <code>FINE_Aria_Sofa_3-Sitzer.jpg</code> →
            „FINE Aria Sofa 3-Sitzer“.
          </p>
        </div>

        {rows.length > 0 ? (
          <div className="mt-10 overflow-x-auto border border-line bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-fog text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">
                <tr>
                  <th className="px-4 py-3">Bild</th>
                  <th className="px-4 py-3">Erkannter Produktname</th>
                  <th className="px-4 py-3">Marke</th>
                  <th className="px-4 py-3">Alt-Text</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} className="border-t border-line align-top">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {row.previewUrl ? (
                          <img
                            src={row.previewUrl}
                            alt=""
                            data-no-zoom
                            className="h-16 w-16 object-cover bg-fog"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center bg-fog text-xs text-muted">
                            —
                          </div>
                        )}
                        <div>
                          <p className="font-medium">Bild {index + 1}</p>
                          <p className="max-w-[10rem] truncate text-xs text-muted" title={row.file.name}>
                            {row.file.name}
                          </p>
                          {row.error ? <p className="mt-1 text-xs text-red-700">{row.error}</p> : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <label className="sr-only" htmlFor={`name-${row.id}`}>
                        Produktname Bild {index + 1}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id={`name-${row.id}`}
                          type="text"
                          value={row.productName}
                          disabled={Boolean(row.error)}
                          onChange={(e) => {
                            const value = e.target.value
                            // Manual name has priority; do not reset from filename afterwards.
                            updateRow(row.id, {
                              productName: value,
                              nameTouched: true,
                              altText: row.altTouched ? row.altText : value,
                            })
                          }}
                          className="min-w-[14rem] flex-1 border border-line px-3 py-2"
                        />
                        <span aria-hidden className="text-muted">
                          ✎
                        </span>
                      </div>
                      {!row.nameTouched && row.autoProductName ? (
                        <p className="mt-1 text-[11px] text-muted">aus Dateiname</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4">
                      <label className="sr-only" htmlFor={`brand-${row.id}`}>
                        Marke Bild {index + 1}
                      </label>
                      <select
                        id={`brand-${row.id}`}
                        value={row.brandSlug}
                        disabled={Boolean(row.error)}
                        onChange={(e) => {
                          const slug = e.target.value
                          const brand = marken.find((m) => m.slug === slug)
                          updateRow(row.id, {
                            brandSlug: slug,
                            brandName: brand?.name ?? '',
                          })
                        }}
                        className="min-w-[9rem] border border-line px-3 py-2"
                      >
                        <option value="">— wählen —</option>
                        {marken.map((m) => (
                          <option key={m.slug} value={m.slug}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <label className="sr-only" htmlFor={`alt-${row.id}`}>
                        Alt-Text Bild {index + 1}
                      </label>
                      <input
                        id={`alt-${row.id}`}
                        type="text"
                        value={row.altText}
                        disabled={Boolean(row.error)}
                        onChange={(e) =>
                          updateRow(row.id, { altText: e.target.value, altTouched: true })
                        }
                        className="min-w-[12rem] border border-line px-3 py-2"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        className="text-sm text-muted underline hover:text-brand"
                      >
                        Entfernen
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-4">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={status === 'saving' || readyCount === 0}
                className="inline-flex bg-accent px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95 disabled:opacity-50"
              >
                {status === 'saving' ? 'Speichern …' : `${readyCount} speichern`}
              </button>
              <button
                type="button"
                onClick={() => {
                  for (const r of rows) {
                    if (r.previewUrl) URL.revokeObjectURL(r.previewUrl)
                  }
                  setRows([])
                }}
                className="inline-flex border border-brand px-6 py-3 text-sm font-semibold tracking-[0.1em] text-brand uppercase"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : null}

        {statusMessage ? (
          <p
            className={`mt-6 text-sm ${status === 'error' ? 'text-red-700' : 'text-brand'}`}
            role="status"
          >
            {statusMessage}{' '}
            {status === 'saved' ? (
              <Link to="/marken" className="underline">
                Zur Markenwelt
              </Link>
            ) : null}
          </p>
        ) : null}
      </div>
    </section>
  )
}
