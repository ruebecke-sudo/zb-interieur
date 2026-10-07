import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { supabase } from '../lib/supabase'

type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  image_url: string | null
  image_alt: string
  body: string
  status: 'draft' | 'published'
  published_at: string | null
  updated_at: string
}

type Draft = Omit<Post, 'id' | 'slug' | 'updated_at'> & { id?: string; slug?: string; date: string }

type LibraryImage = { id: string; url: string; name: string }

const IMAGE_TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }
const today = () => new Date().toISOString().slice(0, 10)
const emptyDraft = (): Draft => ({ title: '', excerpt: '', category: '', image_url: null, image_alt: '', body: '', status: 'draft', published_at: null, date: today() })

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'beitrag'
}

const formatDate = (value: string | null) => value ? new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value)) : ''

/** Write and publish blog posts; the website shows published ones (public-blog function). */
export function ImageManagerBlog({ libraryImages }: { libraryImages: LibraryImage[] }) {
  const [tenantId, setTenantId] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState<Draft | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [unavailable, setUnavailable] = useState(false)
  const [pickImage, setPickImage] = useState(false)

  const load = async () => {
    if (!supabase) return
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    const { data: membership } = await supabase.from('memberships').select('tenant_id').eq('user_id', user.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    setTenantId(membership.tenant_id)
    const [{ data, error }, { data: sites }] = await Promise.all([
      supabase.from('blog_posts').select('*').eq('tenant_id', membership.tenant_id).order('updated_at', { ascending: false }),
      supabase.from('websites').select('base_url').eq('tenant_id', membership.tenant_id).order('created_at').limit(1),
    ])
    if (error) { setUnavailable(true); return }
    setPosts((data || []) as Post[])
    setSiteUrl((sites?.[0]?.base_url || '').replace(/\/$/, ''))
  }

  useEffect(() => { void load() }, [])

  const edit = (post: Post) => {
    setMessage('')
    setPickImage(false)
    setEditing({ ...post, date: (post.published_at || post.updated_at).slice(0, 10) })
  }

  const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !supabase || !tenantId || !editing) return
    const ext = IMAGE_TYPES[file.type]
    if (!ext) return setMessage('Bitte ein Foto als JPG, PNG oder WebP auswählen.')
    setBusy(true)
    const path = `${tenantId}/blog/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('image-manager-media').upload(path, file, { contentType: file.type, upsert: false })
    setBusy(false)
    if (error) return setMessage(error.message)
    const { data } = supabase.storage.from('image-manager-media').getPublicUrl(path)
    setEditing({ ...editing, image_url: data.publicUrl })
    setMessage('Titelbild hochgeladen.')
  }

  const save = async (publish: boolean | null) => {
    if (!supabase || !tenantId || !editing) return
    if (!editing.title.trim()) return setMessage('Bitte einen Titel eingeben.')
    if (publish && !editing.body.trim()) return setMessage('Bitte zuerst einen Text schreiben.')
    setBusy(true)
    setMessage('')
    const status = publish === null ? editing.status : publish ? 'published' : 'draft'
    const publishedAt = status === 'published' ? new Date(`${editing.date || today()}T12:00:00`).toISOString() : editing.published_at
    const fields = {
      title: editing.title.trim(),
      excerpt: editing.excerpt.trim(),
      category: editing.category.trim(),
      image_url: editing.image_url,
      image_alt: editing.image_alt.trim() || editing.title.trim(),
      body: editing.body.trim(),
      status,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    }
    let error: { message: string; code?: string } | null = null
    let savedSlug = editing.slug
    if (editing.id) {
      ({ error } = await supabase.from('blog_posts').update(fields).eq('id', editing.id))
    } else {
      // The web address is built from the title once and then stays stable.
      const base = slugify(editing.title)
      for (let attempt = 1; attempt <= 5; attempt++) {
        savedSlug = attempt === 1 ? base : `${base}-${attempt}`
        const result = await supabase.from('blog_posts').insert({ ...fields, tenant_id: tenantId, slug: savedSlug }).select('id').single()
        error = result.error
        if (!error && result.data) { setEditing({ ...editing, id: result.data.id, slug: savedSlug, status }); break }
        // 23505 = web address already taken: try the next number.
        if (!error || error.code !== '23505') break
      }
    }
    setBusy(false)
    if (error) return setMessage(error.message)
    setEditing((current) => current ? { ...current, status, published_at: publishedAt, slug: savedSlug } : current)
    setMessage(status === 'published' ? '✓ Veröffentlicht. Der Beitrag erscheint in etwa einer Minute auf der Website.' : '✓ Als Entwurf gespeichert. Auf der Website ist er noch nicht zu sehen.')
    await load()
  }

  const remove = async () => {
    if (!supabase || !editing?.id || !window.confirm(`Beitrag „${editing.title}“ wirklich löschen?`)) return
    setBusy(true)
    const { error } = await supabase.from('blog_posts').delete().eq('id', editing.id)
    setBusy(false)
    if (error) return setMessage(error.message)
    setEditing(null)
    setMessage('Beitrag gelöscht.')
    await load()
  }

  const categories = [...new Set(['Einrichtungsplanung', 'Küchenplanung', 'Designmöbel', 'Outdoor', 'Neuigkeiten', ...posts.map((post) => post.category).filter(Boolean)])]
  const postUrl = (slug?: string) => siteUrl && slug ? `${siteUrl}/blog/${slug}` : ''

  if (unavailable) return <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">Der Blog ist noch nicht aktiv. Bitte das Datenbank-Update 011 in Supabase ausführen.</section>

  if (editing) return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
    <button type="button" onClick={() => { setEditing(null); setMessage('') }} className="text-sm font-semibold text-slate-600">← Zurück zur Übersicht</button>
    <h2 className="mt-3 text-xl font-bold">{editing.id ? 'Beitrag bearbeiten' : 'Neuer Beitrag'}</h2>
    {editing.status === 'published' && <p className="mt-1 text-sm text-emerald-700">🟢 Veröffentlicht{postUrl(editing.slug) && <> · <a href={postUrl(editing.slug)} target="_blank" rel="noopener noreferrer" className="underline">auf der Website ansehen</a></>}</p>}

    <div className="mt-5 space-y-4">
      <label className="block text-sm font-semibold">Titel
        <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} placeholder="z. B. Neue Outdoor-Kollektion im Showroom" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-normal" />
      </label>

      <div className="text-sm font-semibold">Titelbild
        <div className="mt-1.5 flex flex-col gap-3 rounded-xl border border-slate-300 p-3 sm:flex-row sm:items-center">
          {editing.image_url
            ? <img src={editing.image_url} alt="" className="aspect-[16/9] w-full rounded-lg object-cover sm:w-56" />
            : <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg bg-slate-100 text-3xl sm:w-56">📷</div>}
          <div className="flex flex-wrap gap-2">
            <label className={`cursor-pointer rounded-xl bg-[#0E675A] px-4 py-3 text-sm font-semibold text-white ${busy ? 'pointer-events-none opacity-50' : ''}`}>📷 Foto hochladen
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => void uploadImage(e)} className="sr-only" />
            </label>
            {libraryImages.length > 0 && <button type="button" onClick={() => setPickImage(!pickImage)} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">🖼️ Aus Bildbibliothek</button>}
            {editing.image_url && <button type="button" onClick={() => setEditing({ ...editing, image_url: null })} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">Entfernen</button>}
          </div>
        </div>
        {pickImage && <div className="mt-2 grid max-h-72 grid-cols-3 gap-2 overflow-y-auto rounded-xl bg-slate-50 p-2 sm:grid-cols-6">
          {libraryImages.slice(0, 60).map((image) => <button key={image.id} type="button" title={image.name} onClick={() => { setEditing({ ...editing, image_url: image.url, image_alt: editing.image_alt || image.name }); setPickImage(false) }}>
            <img src={image.url} alt={image.name} loading="lazy" className="aspect-square w-full rounded-lg object-cover" />
          </button>)}
        </div>}
      </div>

      <label className="block text-sm font-semibold">Text
        <textarea value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} rows={12} placeholder={'Schreiben Sie hier Ihren Beitrag.\n\nJeder Absatz kommt in eine neue Zeile.'} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-normal leading-relaxed" />
        <span className="mt-1 block text-xs font-normal text-slate-500">Tipp: Jeder Absatz in eine neue Zeile. Auf dem Handy können Sie auch die Diktierfunktion der Tastatur 🎤 nutzen.</span>
      </label>

      <details className="rounded-xl border border-slate-200 p-3" open={Boolean(editing.excerpt || editing.category)}>
        <summary className="cursor-pointer text-sm font-semibold text-slate-700">Weitere Angaben (freiwillig)</summary>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold">Kategorie
            <input list="blog-categories" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="z. B. Einrichtungsplanung" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-normal" />
            <datalist id="blog-categories">{categories.map((category) => <option key={category} value={category} />)}</datalist>
          </label>
          <label className="block text-sm font-semibold">Datum
            <input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-normal" />
          </label>
          <label className="block text-sm font-semibold md:col-span-2">Kurzer Vorspann
            <textarea value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} placeholder="Ein bis zwei Sätze für die Blog-Übersicht und Google. Leer lassen: Der erste Absatz wird verwendet." className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-normal" />
          </label>
          <label className="block text-sm font-semibold md:col-span-2">Bildbeschreibung
            <input value={editing.image_alt} onChange={(e) => setEditing({ ...editing, image_alt: e.target.value })} placeholder="Was ist auf dem Titelbild zu sehen? (wichtig für Google)" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-3 text-base font-normal" />
          </label>
        </div>
      </details>
    </div>

    {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}

    <div className="mt-5 grid gap-2 sm:flex sm:flex-wrap">
      <button type="button" disabled={busy} onClick={() => void save(true)} className="rounded-xl bg-[#0E675A] px-5 py-3 text-base font-semibold text-white disabled:opacity-50">{editing.status === 'published' ? '✓ Änderungen veröffentlichen' : '🚀 Veröffentlichen'}</button>
      {editing.status !== 'published' && <button type="button" disabled={busy} onClick={() => void save(false)} className="rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 disabled:opacity-50">💾 Als Entwurf speichern</button>}
      {editing.status === 'published' && <button type="button" disabled={busy} onClick={() => void save(false)} className="rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 disabled:opacity-50">Von der Website nehmen</button>}
      {editing.id && <button type="button" disabled={busy} onClick={() => void remove()} className="rounded-xl border border-red-200 px-5 py-3 text-base font-semibold text-red-600 disabled:opacity-50">Löschen</button>}
    </div>
  </section>

  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div><h2 className="text-xl font-bold">📝 Blog</h2><p className="mt-1 text-sm text-slate-500">Beiträge schreiben und veröffentlichen, auch unterwegs vom Handy. Veröffentlichte Beiträge erscheinen automatisch im Blog Ihrer Website.</p></div>
      <button type="button" onClick={() => { setEditing(emptyDraft()); setMessage('') }} className="rounded-xl bg-[#0E675A] px-5 py-3 text-base font-semibold text-white">+ Neuer Beitrag</button>
    </div>
    {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
    {posts.length === 0
      ? <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">Noch keine Beiträge. Tippen Sie auf „+ Neuer Beitrag“.</div>
      : <ul className="mt-5 divide-y divide-slate-100">
        {posts.map((post) => <li key={post.id}>
          <button type="button" onClick={() => edit(post)} className="flex w-full items-center gap-3 py-3 text-left">
            {post.image_url ? <img src={post.image_url} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" /> : <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100">📝</div>}
            <div className="min-w-0 flex-1">
              <div className="truncate font-semibold">{post.title}</div>
              <div className="text-xs text-slate-500">{post.status === 'published' ? `🟢 Veröffentlicht am ${formatDate(post.published_at)}` : '⚪ Entwurf'}{post.category ? ` · ${post.category}` : ''}</div>
            </div>
            <span className="text-slate-400">›</span>
          </button>
        </li>)}
      </ul>}
  </section>
}
