import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  clearMediaApiKey,
  defaultNameFromFile,
  deleteMedia,
  fetchCategories,
  formatBytes,
  getMediaApiKey,
  listMedia,
  type MediaCategories,
  type MediaImage,
  replaceMediaFile,
  saveCategories,
  setMediaApiKey,
  updateMediaMeta,
  uploadMedia,
} from '../lib/mediaApi'

type Draft = {
  localId: string
  file: File
  previewUrl: string
  name: string
  text: string
  category1: string
  category2: string
  category3: string
  category4: string
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif'

export function BildverwaltungPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const replaceRef = useRef<HTMLInputElement>(null)
  const [apiKey, setApiKeyState] = useState(() => getMediaApiKey())
  const [authed, setAuthed] = useState(Boolean(getMediaApiKey()))
  const [categories, setCategories] = useState<MediaCategories | null>(null)
  const [items, setItems] = useState<MediaImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [q, setQ] = useState('')
  const [f1, setF1] = useState<string[]>([])
  const [f2, setF2] = useState<string[]>([])
  const [f3, setF3] = useState<string[]>([])
  const [f4, setF4] = useState<string[]>([])
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [editing, setEditing] = useState<MediaImage | null>(null)
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null)
  const [newCat, setNewCat] = useState({ slot: 'category1' as keyof MediaCategories, value: '' })

  const load = useCallback(async () => {
    if (!getMediaApiKey()) return
    setLoading(true)
    setError('')
    try {
      const [cats, list] = await Promise.all([
        fetchCategories(),
        listMedia({ q, category1: f1, category2: f2, category3: f3, category4: f4 }),
      ])
      setCategories(cats)
      setItems(list.items)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Laden fehlgeschlagen.')
      if (String(err).includes('Nicht authentifiziert') || String(err).includes('401')) {
        setAuthed(false)
      }
    } finally {
      setLoading(false)
    }
  }, [q, f1, f2, f3, f4])

  useEffect(() => {
    if (authed) void load()
  }, [authed, load])

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    setMediaApiKey(apiKey.trim())
    setAuthed(true)
    setStatus('')
  }

  function handleLogout() {
    clearMediaApiKey()
    setAuthed(false)
    setItems([])
    setApiKeyState('')
  }

  function addFiles(list: FileList | File[]) {
    const next: Draft[] = []
    for (const file of Array.from(list)) {
      if (!file.type.startsWith('image/')) continue
      const name = defaultNameFromFile(file)
      next.push({
        localId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name,
        text: name,
        category1: '',
        category2: '',
        category3: '',
        category4: '',
      })
    }
    setDrafts((prev) => [...prev, ...next])
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((prev) => prev.map((d) => (d.localId === id ? { ...d, ...patch } : d)))
  }

  function removeDraft(id: string) {
    setDrafts((prev) => {
      const row = prev.find((d) => d.localId === id)
      if (row) URL.revokeObjectURL(row.previewUrl)
      return prev.filter((d) => d.localId !== id)
    })
  }

  async function saveDrafts() {
    if (drafts.length === 0) return
    setStatus('Upload läuft …')
    setError('')
    try {
      await uploadMedia(
        drafts.map((d) => d.file),
        drafts.map((d) => ({
          name: d.name,
          text: d.text,
          category1: d.category1,
          category2: d.category2,
          category3: d.category3,
          category4: d.category4,
        })),
      )
      for (const d of drafts) URL.revokeObjectURL(d.previewUrl)
      setDrafts([])
      setStatus(`${drafts.length} Bild${drafts.length === 1 ? '' : 'er'} gespeichert.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload fehlgeschlagen.')
      setStatus('')
    }
  }

  async function saveEdit() {
    if (!editing) return
    setError('')
    try {
      await updateMediaMeta(editing.id, {
        name: editing.name,
        text: editing.text,
        category1: editing.category1,
        category2: editing.category2,
        category3: editing.category3,
        category4: editing.category4,
      })
      setEditing(null)
      setStatus('Metadaten gespeichert.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen.')
    }
  }

  async function handleReplaceFile(file: File) {
    if (!replaceTargetId) return
    setError('')
    try {
      await replaceMediaFile(replaceTargetId, file)
      setReplaceTargetId(null)
      setStatus('Bilddatei ersetzt (Metadaten unverändert).')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ersetzen fehlgeschlagen.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bild wirklich löschen?')) return
    try {
      await deleteMedia(id)
      if (editing?.id === id) setEditing(null)
      setStatus('Bild gelöscht.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Löschen fehlgeschlagen.')
    }
  }

  async function addCategoryValue() {
    if (!categories || !newCat.value.trim()) return
    const next = {
      ...categories,
      [newCat.slot]: [...categories[newCat.slot], newCat.value.trim()],
    }
    try {
      const saved = await saveCategories(next)
      setCategories(saved)
      setNewCat((s) => ({ ...s, value: '' }))
      setStatus('Kategorie ergänzt.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategorie speichern fehlgeschlagen.')
    }
  }

  const filterChips = useMemo(() => {
    if (!categories) return null
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <FilterGroup label="Kategorie 1 · Marke" options={categories.category1} selected={f1} onChange={setF1} />
        <FilterGroup label="Kategorie 2 · Produktart" options={categories.category2} selected={f2} onChange={setF2} />
        <FilterGroup label="Kategorie 3 · Bereich" options={categories.category3} selected={f3} onChange={setF3} />
        <FilterGroup label="Kategorie 4 · Stil" options={categories.category4} selected={f4} onChange={setF4} />
      </div>
    )
  }, [categories, f1, f2, f3, f4])

  if (!authed) {
    return (
      <section className="bg-fog">
        <div className="mx-auto max-w-lg px-4 py-16">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">Verwaltung</p>
          <h1 className="mt-2 font-sans text-3xl font-extrabold tracking-tight">Bildverwaltung</h1>
          <p className="mt-3 text-sm text-muted">
            Anmeldung mit API-Schlüssel (Bearer). Lokal Standard:{' '}
            <code className="text-ink">zb-interieur-dev-key</code>
          </p>
          <form onSubmit={handleLogin} className="mt-8 space-y-4 border border-line bg-white p-6">
            <label className="block text-sm font-medium">
              API-Schlüssel
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
                className="mt-2 w-full border border-line px-3 py-2"
                autoComplete="current-password"
                required
              />
            </label>
            <button
              type="submit"
              className="inline-flex bg-brand px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase"
            >
              Anmelden
            </button>
          </form>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-fog">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-brand uppercase">Verwaltung</p>
            <h1 className="mt-2 font-sans text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold tracking-tight">
              Bildverwaltung
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
              Bilder hochladen, Metadaten pflegen und nach Marke, Produktart, Bereich und Stil filtern.
              Bestehende Produktseiten bleiben unverändert.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/verwaltung/produkte" className="border border-brand px-4 py-2 text-xs font-semibold tracking-wide text-brand uppercase">
              Produkt-Upload
            </Link>
            <button type="button" onClick={handleLogout} className="border border-line px-4 py-2 text-xs font-semibold uppercase text-muted">
              Abmelden
            </button>
          </div>
        </div>

        <div className="mt-8 border border-line bg-white p-6">
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files)
              e.target.value = ''
            }}
          />
          <input
            ref={replaceRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleReplaceFile(file)
              e.target.value = ''
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex bg-brand px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase hover:brightness-95"
          >
            Bilder auswählen
          </button>
          <p className="mt-3 text-sm text-muted">
            Einzel- und Mehrfach-Upload. Bildname und Auflösung werden automatisch erkannt; Kategorien
            können vor dem Speichern gesetzt werden.
          </p>
        </div>

        {drafts.length > 0 ? (
          <div className="mt-8 border border-line bg-white">
            <div className="border-b border-line px-4 py-3 text-sm font-semibold">
              Upload-Vorschau · {drafts.length} Datei{drafts.length === 1 ? '' : 'en'}
            </div>
            <ul className="divide-y divide-line">
              {drafts.map((d) => (
                <li key={d.localId} className="grid gap-4 p-4 md:grid-cols-[6rem_1fr]">
                  <img src={d.previewUrl} alt="" data-no-zoom className="h-24 w-24 object-cover bg-fog" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Bildname" value={d.name} onChange={(v) => updateDraft(d.localId, { name: v })} />
                    <Field label="Bildtext" value={d.text} onChange={(v) => updateDraft(d.localId, { text: v })} />
                    <SelectField label="Kategorie 1 · Marke" value={d.category1} options={categories?.category1 || []} onChange={(v) => updateDraft(d.localId, { category1: v })} />
                    <SelectField label="Kategorie 2 · Produktart" value={d.category2} options={categories?.category2 || []} onChange={(v) => updateDraft(d.localId, { category2: v })} />
                    <SelectField label="Kategorie 3 · Bereich" value={d.category3} options={categories?.category3 || []} onChange={(v) => updateDraft(d.localId, { category3: v })} />
                    <SelectField label="Kategorie 4 · Stil" value={d.category4} options={categories?.category4 || []} onChange={(v) => updateDraft(d.localId, { category4: v })} />
                    <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                      <span>{d.file.name} · {formatBytes(d.file.size)}</span>
                      <button type="button" className="underline" onClick={() => removeDraft(d.localId)}>Entfernen</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 border-t border-line px-4 py-4">
              <button
                type="button"
                onClick={() => void saveDrafts()}
                className="inline-flex bg-accent px-6 py-3 text-sm font-bold tracking-[0.08em] text-white uppercase"
              >
                {drafts.length} speichern
              </button>
              <button
                type="button"
                onClick={() => {
                  for (const d of drafts) URL.revokeObjectURL(d.previewUrl)
                  setDrafts([])
                }}
                className="border border-brand px-6 py-3 text-sm font-semibold tracking-wide text-brand uppercase"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : null}

        <div className="mt-10 space-y-6 border border-line bg-white p-6">
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-[16rem] flex-1 text-sm font-medium">
              Suche
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Name, Text, Dateiname …"
                className="mt-2 w-full border border-line px-3 py-2"
              />
            </label>
            <button
              type="button"
              onClick={() => void load()}
              className="bg-brand px-5 py-2.5 text-sm font-bold tracking-wide text-white uppercase"
            >
              Filtern
            </button>
            <button
              type="button"
              onClick={() => {
                setQ('')
                setF1([])
                setF2([])
                setF3([])
                setF4([])
              }}
              className="border border-line px-5 py-2.5 text-sm text-muted"
            >
              Zurücksetzen
            </button>
          </div>
          {filterChips}

          <div className="border-t border-line pt-6">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-brand uppercase">Kategorien erweitern</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={newCat.slot}
                onChange={(e) => setNewCat((s) => ({ ...s, slot: e.target.value as keyof MediaCategories }))}
                className="border border-line px-3 py-2 text-sm"
              >
                <option value="category1">Kategorie 1 · Marke</option>
                <option value="category2">Kategorie 2 · Produktart</option>
                <option value="category3">Kategorie 3 · Bereich</option>
                <option value="category4">Kategorie 4 · Stil</option>
              </select>
              <input
                value={newCat.value}
                onChange={(e) => setNewCat((s) => ({ ...s, value: e.target.value }))}
                placeholder="Neuer Wert"
                className="border border-line px-3 py-2 text-sm"
              />
              <button type="button" onClick={() => void addCategoryValue()} className="border border-brand px-4 py-2 text-sm font-semibold text-brand">
                Hinzufügen
              </button>
            </div>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-700" role="alert">{error}</p> : null}
        {status ? <p className="mt-4 text-sm text-brand" role="status">{status}</p> : null}
        {loading ? <p className="mt-6 text-sm text-muted">Laden …</p> : null}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="flex flex-col bg-white border border-line">
              <div className="relative bg-fog">
                <img src={item.url} alt={item.text || item.name} className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h2 className="font-sans text-lg font-bold leading-snug">{item.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">{item.text}</p>
                <dl className="mt-3 space-y-1 text-[11px] text-muted">
                  <div>{item.width}×{item.height}px · {item.format} · {item.colorSpace}</div>
                  <div>{formatBytes(item.fileSize)} · {new Date(item.uploadedAt).toLocaleString('de-DE')}</div>
                  <div className="pt-1">
                    {[item.category1, item.category2, item.category3, item.category4].filter(Boolean).join(' · ') || 'Ohne Kategorien'}
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => setEditing(item)} className="bg-brand px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white uppercase">
                    Metadaten
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReplaceTargetId(item.id)
                      replaceRef.current?.click()
                    }}
                    className="border border-brand px-3 py-1.5 text-[11px] font-semibold tracking-wide text-brand uppercase"
                  >
                    Datei ersetzen
                  </button>
                  <button type="button" onClick={() => void handleDelete(item.id)} className="px-3 py-1.5 text-[11px] text-red-700 underline">
                    Löschen
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!loading && items.length === 0 ? (
          <p className="mt-10 text-center text-muted">Keine Bilder für die aktuelle Filterung.</p>
        ) : null}

        {editing ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 sm:items-center">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white p-6 shadow-lg">
              <h2 className="font-sans text-xl font-extrabold">Metadaten bearbeiten</h2>
              <p className="mt-1 text-xs text-muted">Bilddatei bleibt unverändert — nur Textfelder.</p>
              <div className="mt-4 grid gap-3">
                <Field label="Bildname" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
                <Field label="Bildtext" value={editing.text} onChange={(v) => setEditing({ ...editing, text: v })} />
                <SelectField label="Kategorie 1 · Marke" value={editing.category1} options={categories?.category1 || []} onChange={(v) => setEditing({ ...editing, category1: v })} />
                <SelectField label="Kategorie 2 · Produktart" value={editing.category2} options={categories?.category2 || []} onChange={(v) => setEditing({ ...editing, category2: v })} />
                <SelectField label="Kategorie 3 · Bereich" value={editing.category3} options={categories?.category3 || []} onChange={(v) => setEditing({ ...editing, category3: v })} />
                <SelectField label="Kategorie 4 · Stil" value={editing.category4} options={categories?.category4 || []} onChange={(v) => setEditing({ ...editing, category4: v })} />
                <dl className="text-xs text-muted">
                  <div>Auflösung: {editing.width}×{editing.height}</div>
                  <div>Farbraum: {editing.colorSpace}</div>
                  <div>Format: {editing.format}</div>
                  <div>URL: {editing.url}</div>
                </dl>
              </div>
              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => void saveEdit()} className="bg-accent px-5 py-2.5 text-sm font-bold text-white uppercase">
                  Speichern
                </button>
                <button type="button" onClick={() => setEditing(null)} className="border border-line px-5 py-2.5 text-sm">
                  Schließen
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-line px-3 py-2 text-sm font-normal"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-line px-3 py-2 text-sm font-normal"
      >
        <option value="">— wählen —</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function FilterGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) {
  return (
    <fieldset>
      <legend className="text-[11px] font-semibold tracking-[0.12em] text-brand uppercase">{label}</legend>
      <div className="mt-2 flex max-h-28 flex-wrap gap-1 overflow-y-auto">
        {options.map((o) => {
          const active = selected.includes(o)
          return (
            <button
              key={o}
              type="button"
              onClick={() =>
                onChange(active ? selected.filter((x) => x !== o) : [...selected, o])
              }
              className={`px-2 py-1 text-[11px] font-semibold uppercase ${
                active ? 'bg-brand text-white' : 'bg-fog text-ink/70 hover:text-brand'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
