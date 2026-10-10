import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase'

// Supabase reports failed email links (e.g. expired or already used) in the URL hash.
function readLinkError() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  if (!hash.get('error')) return ''
  return hash.get('error_code') === 'otp_expired'
    ? 'Der Bestätigungslink ist abgelaufen oder wurde bereits verwendet. Versuche dich anzumelden – oder fordere unten eine neue Bestätigungsmail an.'
    : 'Der Link aus der E-Mail konnte nicht verwendet werden. Bitte versuche es erneut.'
}

export function ImageManagerAuthPage() {
  const [linkError] = useState(readLinkError)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  // Partner programme: a link like …/login?partner=MUELLER pre-fills the code and opens sign-up.
  const [partnerCode, setPartnerCode] = useState(() => new URLSearchParams(window.location.search).get('partner')?.toUpperCase() || '')
  const [mode, setMode] = useState<'login' | 'signup'>(() => (new URLSearchParams(window.location.search).get('partner') ? 'signup' : 'login'))
  const [message, setMessage] = useState(linkError)
  const [busy, setBusy] = useState(false)

  const [showResend, setShowResend] = useState(Boolean(linkError))

  useEffect(() => {
    if (linkError) window.history.replaceState(null, '', window.location.pathname)
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = '/image-manager/app'
    })
  }, [linkError])

  const emailRedirectTo = `${window.location.origin}/image-manager/login`

  const resendConfirmation = async () => {
    if (!supabase) return
    if (!email) return setMessage('Bitte oben deine E-Mail-Adresse eintragen, dann erneut auf „Bestätigungsmail erneut senden“ klicken.')
    setBusy(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo } })
    setMessage(error ? error.message : 'Neue Bestätigungsmail ist unterwegs. Bitte klicke den Link nur einmal.')
    setBusy(false)
  }

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
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo, data: { company_name: companyName, ...(partnerCode.trim() ? { partner_code: partnerCode.trim().toUpperCase() } : {}) } } })
    if (result.error) setMessage(result.error.message)
    else if (mode === 'signup') { setMessage('Konto erstellt. Bitte bestätige deine E-Mail-Adresse über den Link in der E-Mail.'); setShowResend(true) }
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
          {mode === 'signup' && <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Unternehmen</span><input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="z. B. Muster GmbH" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-[#0E675A]" /></label>}{mode === 'signup' && <label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Partnercode (optional)</span><input value={partnerCode} onChange={(e) => setPartnerCode(e.target.value.toUpperCase())} placeholder="falls Sie uns empfohlen wurden" className="w-full rounded-xl border border-slate-300 px-3 py-2.5 uppercase outline-none focus:border-[#0E675A]" /></label>}<label className="block"><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Passwort</span><input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-[#0E675A]" /></label>
        </div>
        {!supabaseConfigured && <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Anmeldung noch nicht konfiguriert.</div>}
        {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
        {showResend && <button type="button" onClick={() => void resendConfirmation()} disabled={busy} className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Bestätigungsmail erneut senden</button>}
        <button disabled={busy} className="mt-5 w-full rounded-xl bg-[#0E675A] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? 'Bitte warten …' : mode === 'login' ? 'Anmelden' : 'Konto erstellen'}</button>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }} className="mt-4 w-full text-sm font-medium text-[#0E675A]">{mode === 'login' ? 'Noch kein Konto? Konto erstellen' : 'Bereits registriert? Anmelden'}</button>
      </form>
    </div>
  </div>
}
