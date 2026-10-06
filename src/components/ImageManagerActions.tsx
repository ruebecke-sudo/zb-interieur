import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../lib/supabase'
import { DEFAULT_CATEGORY_LABELS, type CategoryLabels } from '../lib/categoryLabels'
import type { FormEvent, ReactNode } from 'react'

type ImageItem = {
  id: string
  name: string
  text: string
  category1: string
  category2: string
  category3: string
  category4: string
  format: string
  fileSize: number
  url: string
  width: number
  height: number
  originalFilename?: string
  storagePath?: string
}

type Categories = {
  category1: string[]
  category2: string[]
  category3: string[]
  category4: string[]
}

type UploadedPreview = { url: string; name: string; syncStatus: 'synced' | 'error'; syncError?: string }

type EditorData = {
  name: string
  text: string
  category1: string
  category2: string
  category3: string
  category4: string
}

const emptyEditor: EditorData = { name: '', text: '', category1: '', category2: '', category3: '', category4: '' }

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E675A]" /></label>
}

function CategoryField({ label, value, values, onChange }: { label: string; value: string; values: string[]; onChange: (value: string) => void }) {
  const id = 'cat-' + label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()
  return <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span><input list={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E675A]" /><datalist id={id}>{values.map((item) => <option key={item} value={item} />)}</datalist></label>
}

function Modal({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-950/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[calc(100dvh-2rem)] w-full items-start justify-center overflow-y-auto">
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function ImageManagerActions({ item, categories, labels = DEFAULT_CATEGORY_LABELS, onChanged, primary = false }: { item?: ImageItem; categories: Categories; labels?: CategoryLabels; onChanged: () => Promise<void>; primary?: boolean }) {
  const [modal, setModal] = useState<'upload' | 'edit' | null>(null)
  const [editor, setEditor] = useState<EditorData>(item ? { name: item.name, text: item.text, category1: item.category1, category2: item.category2, category3: item.category3, category4: item.category4 } : emptyEditor)
  const [files, setFiles] = useState<File[]>([])
  const [websites, setWebsites] = useState<Array<{ id: string; name: string; base_url: string }>>([])
  const [websiteId, setWebsiteId] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [uploadedPreviews, setUploadedPreviews] = useState<UploadedPreview[]>([])
  const [selectedPreviews, setSelectedPreviews] = useState<Array<{ file: File; url: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const clearSelectedPreviews = () => {
    setSelectedPreviews((current) => {
      current.forEach((preview) => URL.revokeObjectURL(preview.url))
      return []
    })
  }

  const open = (target: 'upload' | 'edit') => {
    setError('')
    if (target === 'upload') {
      setFiles([])
      setUploadedPreviews([])
      clearSelectedPreviews()
      setEditor(emptyEditor)
      if (supabase) {
        void supabase.from('websites').select('id,name,base_url').order('name').then(({ data }) => {
          const rows = data || []
          setWebsites(rows)
          if (rows[0]) setWebsiteId(rows[0].id)
        })
      }
    } else if (item) {
      setEditor({ name: item.name, text: item.text, category1: item.category1, category2: item.category2, category3: item.category3, category4: item.category4 })
    }
    setModal(target)
  }


  const upload = async (event: FormEvent) => {
    event.preventDefault()
    if (!files.length) return setError('Bitte mindestens ein Bild auswählen.')
    setBusy(true)
    setError('')
    try {
      if (!supabase) throw new Error('SaaS-Modus ist nicht konfiguriert.')
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) throw new Error('Bitte zuerst anmelden.')
      const { data: membership } = await supabase.from('memberships').select('tenant_id,role').eq('user_id', userData.user.id).limit(1).maybeSingle()
      if (!membership?.tenant_id) throw new Error('Kein Arbeitsbereich gefunden.')
      if (!['owner','admin','member'].includes(membership.role)) throw new Error('Keine Berechtigung zum Hochladen.')
      if (!websiteId) throw new Error('Bitte eine Website auswählen.')

      const previews: UploadedPreview[] = []
      for (const file of files) {
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
        const path = `${membership.tenant_id}/${crypto.randomUUID()}-${safeName}`
        const { error: storageError } = await supabase.storage.from('image-manager-media').upload(path, file, { contentType: file.type, upsert: false })
        if (storageError) throw new Error(storageError.message)
        const { data: publicUrl } = supabase.storage.from('image-manager-media').getPublicUrl(path)
        previews.push({ url: publicUrl.publicUrl, name: file.name, syncStatus: 'error' })
        setUploadedPreviews([...previews])
        const image = new Image()
        const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
          image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
          image.onerror = () => resolve({ width: 0, height: 0 })
          image.src = URL.createObjectURL(file)
        })
        URL.revokeObjectURL(image.src)
        const { data: inserted, error: insertError } = await supabase.from('images').insert({
          tenant_id: membership.tenant_id,
          website_id: websiteId,
          filename: file.name,
          name: editor.name || file.name.replace(/\.[^.]+$/, ''),
          text: editor.text,
          category1: editor.category1,
          category2: editor.category2,
          category3: editor.category3,
          category4: editor.category4,
          width: dimensions.width,
          height: dimensions.height,
          color_space: 'sRGB',
          format: file.type.split('/')[1]?.toUpperCase() || file.name.split('.').pop()?.toUpperCase() || '',
          file_size: file.size,
          url: publicUrl.publicUrl,
          status: 'active',
          sync_status: 'pending',
          storage_path: path,
        }).select('id').single()
        if (insertError) throw new Error(insertError.message)
        const { data: sessionData } = await supabase.auth.getSession()
        const accessToken = sessionData.session?.access_token
        if (accessToken && inserted?.id) {
          const syncResponse = await fetch('/.netlify/functions/push-image-to-website', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + accessToken },
            body: JSON.stringify({ image_id: inserted.id }),
          })
          const syncResult = await syncResponse.json().catch(() => ({})) as { error?: string; missing?: string[] }
          const previewIndex = previews.length - 1
          if (syncResponse.ok) {
            previews[previewIndex] = { ...previews[previewIndex], syncStatus: 'synced' }
          } else {
            previews[previewIndex] = {
              ...previews[previewIndex],
              syncStatus: 'error',
              syncError: syncResult.missing?.length
                ? `Fehlende Server-Konfiguration: ${syncResult.missing.join(', ')}`
                : (syncResult.error || 'Übertragung zur Website fehlgeschlagen.'),
            }
          }
          setUploadedPreviews([...previews])
        }
      }
      setUploadedPreviews([...previews])
      clearSelectedPreviews()
      await onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const update = async (event: FormEvent) => {
    event.preventDefault()
    if (!item || !supabase) return
    setBusy(true)
    setError('')
    try {
      const { error: updateError } = await supabase.from('images').update({
        name: editor.name, text: editor.text, category1: editor.category1,
        category2: editor.category2, category3: editor.category3, category4: editor.category4,
        sync_status: 'pending', sync_error: null,
      }).eq('id', item.id)
      if (updateError) throw new Error(updateError.message)
      setModal(null)
      await onChanged()
      const { data: sessionData } = await supabase.auth.getSession()
      const accessToken = sessionData.session?.access_token
      if (accessToken) {
        await fetch('/.netlify/functions/push-image-to-website', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + accessToken },
          body: JSON.stringify({ image_id: item.id }),
        })
        await onChanged()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen.')
    } finally { setBusy(false) }
  }

  const remove = async () => {
    if (!item || !supabase) return
    if (!window.confirm('Bild „' + item.name + '“ wirklich löschen?')) return
    setBusy(true)
    setError('')
    try {
      const { error: deleteError } = await supabase.from('images').delete().eq('id', item.id)
      if (deleteError) throw new Error(deleteError.message)
      if (item.storagePath) await supabase.storage.from('image-manager-media').remove([item.storagePath])
      await onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Löschen fehlgeschlagen.')
    } finally { setBusy(false) }
  }

  const button = primary
    ? <button onClick={() => open('upload')} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#09564b]">+ Bild hochladen</button>
    : <div className="flex gap-2"><button onClick={() => open('edit')} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50">Bearbeiten</button><button onClick={() => void remove()} disabled={busy} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">Löschen</button></div>

  return <>
    {button}

    {modal === 'upload' && <Modal>{uploadedPreviews.length > 0 ? <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
        <h2 className="mt-3 text-xl font-bold">Hochladen erfolgreich</h2>
        <p className="mt-1 text-sm text-slate-500">{uploadedPreviews.length === 1 ? 'Das hochgeladene Bild:' : `${uploadedPreviews.length} Bilder wurden erfolgreich hochgeladen:`}</p>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {uploadedPreviews.map((preview) => <div key={preview.url} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <img src={preview.url} alt={preview.name} className="h-56 w-full bg-white object-contain" />
          <div className="border-t border-slate-200 px-3 py-2">
            <div className="truncate text-xs font-medium text-slate-600" title={preview.name}>{preview.name}</div>
            <div className={`mt-1 text-xs font-semibold ${preview.syncStatus === 'synced' ? 'text-emerald-600' : 'text-amber-600'}`}>
              {preview.syncStatus === 'synced' ? '✓ An die Website übertragen' : '⚠ Gespeichert – Übertragung zur Website ausstehend'}
            </div>
            {preview.syncError && <div className="mt-1 text-xs text-red-600">{preview.syncError}</div>}
          </div>
        </div>)}
      </div>
      <div className="mt-6 flex justify-end">
        <button type="button" onClick={() => { setModal(null); setUploadedPreviews([]); clearSelectedPreviews() }} className="rounded-xl bg-[#0E675A] px-5 py-2.5 text-sm font-semibold text-white">Schließen</button>
      </div>
    </div> : <form onSubmit={upload} className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"><h2 className="text-xl font-bold">Bilder hochladen</h2><p className="mt-1 text-sm text-slate-500">Mehrere Bilder können mit denselben Metadaten hochgeladen werden.</p><div className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
  <input
    ref={inputRef}
    type="file"
    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
    multiple
    onChange={(e) => {
      const nextFiles = Array.from(e.target.files || [])
      if (!nextFiles.length) return
      setFiles((current) => [...current, ...nextFiles])
      setSelectedPreviews((current) => [
        ...current,
        ...nextFiles.map((file) => ({ file, url: URL.createObjectURL(file) })),
      ])
      e.currentTarget.value = ''
    }}
    className="hidden"
  />
  <div className="text-center">
    <button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-slate-200">
      {files.length ? 'Weitere Bilder auswählen' : 'Bilder auswählen'}
    </button>
    <div className="mt-2 text-sm text-slate-500">
      {files.length ? `${files.length} ${files.length === 1 ? 'Bild' : 'Bilder'} ausgewählt` : 'JPG, PNG, WebP, GIF oder AVIF'}
    </div>
  </div>
  {selectedPreviews.length > 0 && (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {selectedPreviews.map((preview, index) => (
        <div key={`${preview.file.name}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex h-44 items-center justify-center bg-slate-50">
            <img src={preview.url} alt={preview.file.name} className="h-full w-full object-contain" />
          </div>
          <div className="flex items-center gap-2 border-t border-slate-200 px-3 py-2">
            <div className="min-w-0 flex-1 truncate text-xs font-medium text-slate-600" title={preview.file.name}>
              {preview.file.name}
            </div>
            <button
              type="button"
              onClick={() => {
                URL.revokeObjectURL(preview.url)
                setSelectedPreviews((current) => current.filter((_, i) => i !== index))
                setFiles((current) => current.filter((_, i) => i !== index))
              }}
              className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
              aria-label={`${preview.file.name} entfernen`}
            >
              Entfernen
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div><div className="mt-4 grid gap-3 md:grid-cols-2"><label className="block md:col-span-2"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Website</span><select value={websiteId} onChange={(e) => setWebsiteId(e.target.value)} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E675A]"><option value="">Website auswählen …</option>{websites.map((site) => <option key={site.id} value={site.id}>{site.name} · {site.base_url}</option>)}</select></label><Field label="Bildname" value={editor.name} onChange={(v) => setEditor({ ...editor, name: v })} /><Field label="Bildtext" value={editor.text} onChange={(v) => setEditor({ ...editor, text: v })} /><CategoryField label={`Kat.1 · ${labels[0]}`} value={editor.category1} values={categories.category1} onChange={(v) => setEditor({ ...editor, category1: v })} /><CategoryField label={`Kat.2 · ${labels[1]}`} value={editor.category2} values={categories.category2} onChange={(v) => setEditor({ ...editor, category2: v })} /><CategoryField label={`Kat.3 · ${labels[2]}`} value={editor.category3} values={categories.category3} onChange={(v) => setEditor({ ...editor, category3: v })} /><CategoryField label={`Kat.4 · ${labels[3]}`} value={editor.category4} values={categories.category4} onChange={(v) => setEditor({ ...editor, category4: v })} /></div>{error && <div className="mt-4 text-sm text-red-600">{error}</div>}<div className="mt-4 flex justify-end gap-2"><button type="button" onClick={() => { setModal(null); clearSelectedPreviews() }} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Abbrechen</button><button disabled={busy || !files.length} className="rounded-xl bg-[#0E675A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Hochladen läuft …' : 'Hochladen'}</button></div></form>}</Modal>}

    {modal === 'edit' && item && <Modal><form onSubmit={update} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold">Bild bearbeiten</h2><div className="mt-5 flex gap-4 rounded-xl bg-slate-50 p-3"><img src={item.url} alt="" className="h-20 w-20 rounded-xl object-cover" /><div className="text-xs text-slate-500">{item.width} × {item.height}px<br />{item.format}</div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Bildname" value={editor.name} onChange={(v) => setEditor({ ...editor, name: v })} /><Field label="Bildtext" value={editor.text} onChange={(v) => setEditor({ ...editor, text: v })} /><CategoryField label={`Kat.1 · ${labels[0]}`} value={editor.category1} values={categories.category1} onChange={(v) => setEditor({ ...editor, category1: v })} /><CategoryField label={`Kat.2 · ${labels[1]}`} value={editor.category2} values={categories.category2} onChange={(v) => setEditor({ ...editor, category2: v })} /><CategoryField label={`Kat.3 · ${labels[2]}`} value={editor.category3} values={categories.category3} onChange={(v) => setEditor({ ...editor, category3: v })} /><CategoryField label={`Kat.4 · ${labels[3]}`} value={editor.category4} values={categories.category4} onChange={(v) => setEditor({ ...editor, category4: v })} /></div>{error && <div className="mt-4 text-sm text-red-600">{error}</div>}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Abbrechen</button><button disabled={busy} className="rounded-xl bg-[#0E675A] px-5 py-2.5 text-sm font-semibold text-white">{busy ? 'Speichern …' : 'Änderungen speichern'}</button></div></form></Modal>}
  </>
}
