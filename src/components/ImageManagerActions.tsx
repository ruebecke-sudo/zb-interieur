import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

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
}

type Categories = {
  category1: string[]
  category2: string[]
  category3: string[]
  category4: string[]
}

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

function Modal({ children }: { children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">{children}</div>
}

export function ImageManagerActions({ item, categories, onChanged, primary = false }: { item?: ImageItem; categories: Categories; onChanged: () => Promise<void>; primary?: boolean }) {
  const [modal, setModal] = useState<'login' | 'upload' | 'edit' | null>(null)
  const [token, setToken] = useState(() => sessionStorage.getItem('image-manager-session') || '')
  const [password, setPassword] = useState('')
  const [editor, setEditor] = useState<EditorData>(item ? { name: item.name, text: item.text, category1: item.category1, category2: item.category2, category3: item.category3, category4: item.category4 } : emptyEditor)
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const open = (target: 'upload' | 'edit') => {
    if (!token) {
      setModal('login')
      return
    }
    setError('')
    if (target === 'upload') {
      setFiles([])
      setEditor(emptyEditor)
    } else if (item) {
      setEditor({ name: item.name, text: item.text, category1: item.category1, category2: item.category2, category3: item.category3, category4: item.category4 })
    }
    setModal(target)
  }

  const login = async (event: FormEvent) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const data = await response.json() as { token?: string; error?: string }
      if (!response.ok || !data.token) throw new Error(data.error || 'Anmeldung fehlgeschlagen.')
      sessionStorage.setItem('image-manager-session', data.token)
      setToken(data.token)
      setPassword('')
      setModal(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const upload = async (event: FormEvent) => {
    event.preventDefault()
    if (!files.length) return setError('Bitte mindestens ein Bild auswählen.')
    setBusy(true)
    setError('')
    try {
      for (const file of files) {
        const body = new FormData()
        body.append('file', file)
        body.append('name', editor.name || file.name.replace(/\.[^.]+$/, ''))
        body.append('text', editor.text)
        body.append('category1', editor.category1)
        body.append('category2', editor.category2)
        body.append('category3', editor.category3)
        body.append('category4', editor.category4)
        const response = await fetch('/api/images/upload', { method: 'POST', headers: { Authorization: 'Bearer ' + token }, body })
        const data = await response.json() as { error?: string }
        if (!response.ok) throw new Error(data.error || 'Upload fehlgeschlagen.')
      }
      setModal(null)
      await onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const update = async (event: FormEvent) => {
    event.preventDefault()
    if (!item) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/images/' + item.id, { method: 'PUT', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(editor) })
      const data = await response.json() as { error?: string }
      if (!response.ok) throw new Error(data.error || 'Speichern fehlgeschlagen.')
      setModal(null)
      await onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Speichern fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async () => {
    if (!item) return
    if (!window.confirm('Bild „' + item.name + '“ wirklich löschen?')) return
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/images/' + item.id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
      const data = await response.json() as { error?: string }
      if (!response.ok) throw new Error(data.error || 'Löschen fehlgeschlagen.')
      await onChanged()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Löschen fehlgeschlagen.')
    } finally {
      setBusy(false)
    }
  }

  const button = primary
    ? <button onClick={() => open('upload')} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#09564b]">+ Bild hochladen</button>
    : <div className="flex gap-2"><button onClick={() => open('edit')} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold hover:bg-slate-50">Bearbeiten</button><button onClick={() => token ? void remove() : setModal('login')} disabled={busy} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50">Löschen</button></div>

  return <>
    {button}
    {modal === 'login' && <Modal><form onSubmit={login} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold">Verwalter anmelden</h2><p className="mt-1 text-sm text-slate-500">Anmeldung erforderlich, um Bilder zu verändern.</p><div className="mt-5"><Field label="Passwort" value={password} onChange={setPassword} /></div>{error && <div className="mt-3 text-sm text-red-600">{error}</div>}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Abbrechen</button><button disabled={busy} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white">{busy ? 'Anmelden …' : 'Anmelden'}</button></div></form></Modal>}

    {modal === 'upload' && <Modal><form onSubmit={upload} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold">Bilder hochladen</h2><p className="mt-1 text-sm text-slate-500">Mehrere Bilder können mit denselben Metadaten hochgeladen werden.</p><div className="mt-5 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center"><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} className="hidden" /><button type="button" onClick={() => inputRef.current?.click()} className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-slate-200">Bilder auswählen</button><div className="mt-3 text-sm text-slate-500">{files.length ? files.map((file) => file.name).join(' · ') : 'JPG, PNG, WebP, GIF oder AVIF'}</div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Bildname" value={editor.name} onChange={(v) => setEditor({ ...editor, name: v })} /><Field label="Bildtext" value={editor.text} onChange={(v) => setEditor({ ...editor, text: v })} /><CategoryField label="Kat.1 · Marke" value={editor.category1} values={categories.category1} onChange={(v) => setEditor({ ...editor, category1: v })} /><CategoryField label="Kat.2 · Produktart" value={editor.category2} values={categories.category2} onChange={(v) => setEditor({ ...editor, category2: v })} /><CategoryField label="Kat.3 · Bereich" value={editor.category3} values={categories.category3} onChange={(v) => setEditor({ ...editor, category3: v })} /><CategoryField label="Kat.4 · Stil" value={editor.category4} values={categories.category4} onChange={(v) => setEditor({ ...editor, category4: v })} /></div>{error && <div className="mt-4 text-sm text-red-600">{error}</div>}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Abbrechen</button><button disabled={busy || !files.length} className="rounded-xl bg-[#0E675A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Upload läuft …' : 'Hochladen'}</button></div></form></Modal>}

    {modal === 'edit' && item && <Modal><form onSubmit={update} className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"><h2 className="text-xl font-bold">Bild bearbeiten</h2><div className="mt-5 flex gap-4 rounded-xl bg-slate-50 p-3"><img src={item.url} alt="" className="h-20 w-20 rounded-xl object-cover" /><div className="text-xs text-slate-500">{item.width} × {item.height}px<br />{item.format}</div></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Bildname" value={editor.name} onChange={(v) => setEditor({ ...editor, name: v })} /><Field label="Bildtext" value={editor.text} onChange={(v) => setEditor({ ...editor, text: v })} /><CategoryField label="Kat.1 · Marke" value={editor.category1} values={categories.category1} onChange={(v) => setEditor({ ...editor, category1: v })} /><CategoryField label="Kat.2 · Produktart" value={editor.category2} values={categories.category2} onChange={(v) => setEditor({ ...editor, category2: v })} /><CategoryField label="Kat.3 · Bereich" value={editor.category3} values={categories.category3} onChange={(v) => setEditor({ ...editor, category3: v })} /><CategoryField label="Kat.4 · Stil" value={editor.category4} values={categories.category4} onChange={(v) => setEditor({ ...editor, category4: v })} /></div>{error && <div className="mt-4 text-sm text-red-600">{error}</div>}<div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Abbrechen</button><button disabled={busy} className="rounded-xl bg-[#0E675A] px-5 py-2.5 text-sm font-semibold text-white">{busy ? 'Speichern …' : 'Änderungen speichern'}</button></div></form></Modal>}
  </>
}
