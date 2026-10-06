import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { planLabel, SALES_CONTACT_EMAIL } from '../lib/planLabels'

type Usage = { plan:string; image_count:number; member_count:number; website_count:number; max_images:number; max_members:number; max_websites:number; subscription_id?: string | null; stripe_customer_id?: string | null }

// Remembers which plan was bought, so the return page knows when activation is done.
const PENDING_PLAN_KEY = 'image-manager-pending-plan'
function readPendingPlan() { try { return window.sessionStorage.getItem(PENDING_PLAN_KEY) } catch { return null } }
function writePendingPlan(plan: string | null) {
  try { if (plan) window.sessionStorage.setItem(PENDING_PLAN_KEY, plan); else window.sessionStorage.removeItem(PENDING_PLAN_KEY) } catch { /* storage unavailable */ }
}

export function ImageManagerPlans() {
  const [usage,setUsage]=useState<Usage|null>(null)
  const [message,setMessage]=useState('')
  const [activationPending,setActivationPending]=useState(false)
  const loadUsage = useCallback(async () => {
    if(!supabase)return null
    const {data:u}=await supabase.auth.getUser()
    if(!u.user)return null
    const {data:m}=await supabase.from('memberships').select('tenant_id').eq('user_id',u.user.id).limit(1).maybeSingle()
    if(!m?.tenant_id)return null
    const [{data,error},{data:tenant}] = await Promise.all([
      supabase.rpc('get_tenant_usage',{target_tenant:m.tenant_id}),
      supabase.from('tenants').select('subscription_id,stripe_customer_id').eq('id',m.tenant_id).single(),
    ])
    if(error) {
      setMessage(error.message)
      return null
    }
    const nextUsage = data?.[0] ? { ...data[0], ...tenant } : null
    if(nextUsage) setUsage(nextUsage)
    return nextUsage
  }, [])
  const manageAbrechnung = async () => {
    if (!supabase) return
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) return setMessage('Sitzung abgelaufen. Bitte neu anmelden.')
    const response = await fetch('/.netlify/functions/create-customer-portal', { method:'POST', headers:{ Authorization:'Bearer '+token } })
    const data = await response.json() as { url?: string; error?: string; missing?: string[] }
    if (!response.ok || !data.url) {
      const detail = data.missing?.length ? ` Fehlende Server-Konfiguration: ${data.missing.join(', ')}.` : ''
      return setMessage((data.error || 'Abrechnungsbereich konnte nicht geöffnet werden.') + detail)
    }
    window.location.href = data.url
  }

  const checkout = async (plan:string) => {
    setMessage('')
    if (!supabase) return
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token
      if (!token) throw new Error('Sitzung abgelaufen. Bitte neu anmelden.')
      const endpoint = plan === 'lifetime' ? '/.netlify/functions/create-lifetime-checkout' : '/.netlify/functions/create-subscription-checkout'
      const response = await fetch(endpoint, { method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer '+token}, body: JSON.stringify({ plan }) })
      const data = await response.json() as { url?: string; error?: string; missing?: string[] }
      if (!response.ok || !data.url) {
        const detail = data.missing?.length ? ` Fehlende Server-Konfiguration: ${data.missing.join(', ')}.` : ''
        throw new Error((data.error || 'Zahlungsvorgang konnte nicht gestartet werden.') + detail)
      }
      writePendingPlan(plan)
      window.location.href = data.url
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Zahlungsvorgang konnte nicht gestartet werden.')
    }
  }
  useEffect(()=>{void loadUsage()},[loadUsage])
  useEffect(()=>{
    if(new URLSearchParams(window.location.search).get('payment') !== 'success') return
    const pendingPlan = readPendingPlan()
    setActivationPending(true)
    let attempts = 0
    const poll = window.setInterval(() => {
      attempts += 1
      void loadUsage().then((nextUsage) => {
        // Without a remembered plan (e.g. other browser tab) one successful reload is enough.
        const activated = pendingPlan ? nextUsage?.plan === pendingPlan : Boolean(nextUsage)
        if(activated || attempts >= 15) {
          window.clearInterval(poll)
          setActivationPending(false)
          writePendingPlan(null)
        }
      })
    }, 2000)
    return () => window.clearInterval(poll)
  },[loadUsage])
  if(message)return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{message}</div>
  if(!usage)return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Tarifinformationen werden geladen …</div>
  const plans=[['starter','Starter','19 € / Monat'],['professional','Professional','39 € / Monat'],['business','Business','79 € / Monat'],['agency','Agentur','Individuell'],['lifetime','Dauerlizenz','499 € einmalig']]
  const percent=(n:number,max:number)=>Math.min(100,Math.round(n/max*100))
  return <section className="space-y-6">
    {activationPending && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Zahlung bestätigt. Der neue Tarif wird aktiviert …</div>}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Tarif & Nutzung</h2><p className="mt-1 text-sm text-slate-500">Aktueller Tarif und technische Nutzungsgrenzen des Arbeitsbereich.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ['Bilder',usage.image_count,usage.max_images],
          ['Benutzer',usage.member_count,usage.max_members],
          ['Websites',usage.website_count,usage.max_websites]
        ].map(([label,n,max])=><div key={label as string} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between text-sm font-semibold"><span>{label}</span><span>{n} / {max}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[#0E675A]" style={{width:percent(n as number,max as number)+'%'}}/></div></div>)}
      </div>
      <div className="mt-5 rounded-xl border border-slate-200 p-4"><div className="text-xs uppercase tracking-wider text-slate-400">Aktueller Tarif</div><div className="mt-1 text-lg font-bold">{planLabel(usage.plan)}</div>{usage.stripe_customer_id && usage.plan !== 'lifetime' && <button onClick={()=>void manageAbrechnung()} className="mt-4 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Abrechnung verwalten</button>}</div>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{plans.map(([id,name,price])=><div key={id} className={`rounded-2xl border p-5 ${usage.plan===id?'border-[#0E675A] ring-2 ring-[#0E675A]/10':'border-slate-200'} bg-white`}><div className="font-bold">{name}</div><div className="mt-1 text-sm text-slate-500">{price}</div><div className="mt-5 text-xs text-slate-500">Bilder, Benutzer und Websites gemäß Tariflimit.</div>{id==='lifetime' && <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">Einmalig zahlen · dauerhaft nutzen · keine monatliche Grundgebühr</div>}{id==='agency' && usage.plan!==id
        ? <a href={`mailto:${SALES_CONTACT_EMAIL}?subject=${encodeURIComponent('Image Manager Pro – Agentur-Tarif')}`} className="mt-4 block w-full rounded-xl border border-[#0E675A] px-3 py-2.5 text-center text-xs font-semibold text-[#0E675A] hover:bg-emerald-50">Kontakt aufnehmen</a>
        : <button onClick={()=>void checkout(id)} disabled={usage.plan===id || usage.plan==='lifetime'} className="mt-4 w-full rounded-xl bg-[#0E675A] px-3 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{usage.plan===id ? 'Aktueller Tarif' : usage.plan==='lifetime' ? 'In Dauerlizenz enthalten' : id==='lifetime' ? 'Dauerlizenz kaufen' : 'Tarif auswählen'}</button>}</div>)}</div>
  </section>
}
