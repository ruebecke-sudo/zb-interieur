import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

export function ImageManagerAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = '/image-manager/app'
    })
  }, [])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!supabase) {
      setMessage('SaaS-Anmeldung ist noch nicht konfiguriert. VITE_SUPABASE_URL und VITE_SUPABASE_PUBLISHABLE_KEY müssen gesetzt werden.')
      return
    }
    setBusy(true)
    setMessage('')
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { company_name: companyName } } })
    if (result.error) setMessage(result.error.message)
    else if (mode === 'signup') setMessage('Konto erstellt. Bitte bestätige ggf. deine E-Mail-Adresse.')
    else window.location.href = '/image-manager/app'
    setBusy(false)
  }

  return <div className="min-h-screen bg-[#111318] px-5 py-10 text-white">
    <div className="mx-auto max-w-md">
      <div className="mb-8"><div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">Image Manager</div><div className="mt-1 text-3xl font-bold">PRO</div><p className="mt-3 text-sm text-slate-400">Zentrale Bildverwaltung für mehrere Websites und Kunden.</p></div>
      <form onSubmit={submit} className="rounded-2xl bg-white p-7 text-slate-900 shadow-2xl">
        <h1 className="text-xl font-bold">{mode === 'login' ? 'Anmelden' : 'Konto erstellen'}</h1>
        <div className="mt-5 space-y-4">
          <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">E-Mail</span><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-[#0E675A]" /></label>
          {mode === 'signup' && <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unternehmen</span><input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="z. B. Muster GmbH" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-[#0E675A]" /></label>}<label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Passwort</span><input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-[#0E675A]" /></label>
        </div>
        {!supabaseConfigured && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Anmeldung noch nicht konfiguriert.</div>}
        {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
        <button disabled={busy} className="mt-5 w-full rounded-xl bg-[#0E675A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Bitte warten …' : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}</button>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }} className="mt-4 w-full text-sm font-medium text-[#0E675A]">{mode === 'login' ? 'Noch kein Konto? Konto erstellen' : 'Bereits registriert? Anmelden'}</button>
      </form>
    </div>
  </div>
}
