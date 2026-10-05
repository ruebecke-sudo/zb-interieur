import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Usage = { plan:string; image_count:number; member_count:number; website_count:number; max_images:number; max_members:number; max_websites:number; subscription_id?: string | null; stripe_customer_id?: string | null }

export function ImageManagerPlans() {
  const [usage,setUsage]=useState<Usage|null>(null)
  const [message,setMessage]=useState('')
  const manageAbrechnung = async () => {
    if (!supabase) return
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData.session?.access_token
    if (!token) return setMessage('Sitzung abgelaufen. Bitte neu anmelden.')
    const response = await fetch('/.netlify/functions/create-customer-portal', { method:'POST', headers:{ Authorization:'Bearer '+token } })
    const data = await response.json() as { url?: string; error?: string }
    if (!response.ok || !data.url) return setMessage(data.error || 'Abrechnungsbereich konnte nicht geöffnet werden.')
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
      const data = await response.json() as { url?: string; error?: string }
      if (!response.ok || !data.url) throw new Error(data.error || 'Zahlungsvorgang konnte nicht gestartet werden.')
      window.location.href = data.url
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Zahlungsvorgang konnte nicht gestartet werden.')
    }
  }
  useEffect(()=>{void (async()=>{
    if(!supabase)return
    const {data:u}=await supabase.auth.getUser()
    if(!u.user)return
    const {data:m}=await supabase.from('memberships').select('tenant_id').eq('user_id',u.user.id).limit(1).maybeSingle()
    if(!m?.tenant_id)return
    const [{data,error},{data:tenant}] = await Promise.all([
      supabase.rpc('get_tenant_usage',{target_tenant:m.tenant_id}),
      supabase.from('tenants').select('subscription_id,stripe_customer_id').eq('id',m.tenant_id).single(),
    ])
    if(error)setMessage(error.message); else if(data?.[0])setUsage({ ...data[0], ...tenant })
  })()},[])
  if(message)return <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{message}</div>
  if(!usage)return <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Tarifinformationen werden geladen …</div>
  const plans=[['starter','Starter','19 € / Monat'],['professional','Professional','39 € / Monat'],['business','Business','79 € / Monat'],['agency','Agentur','Individuell'],['lifetime','Dauerlizenz','499 € einmalig']]
  const percent=(n:number,max:number)=>Math.min(100,Math.round(n/max*100))
  return <section className="space-y-6">
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Tarif & Nutzung</h2><p className="mt-1 text-sm text-slate-500">Aktueller Tarif und technische Nutzungsgrenzen des Arbeitsbereich.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          ['Bilder',usage.image_count,usage.max_images],
          ['Benutzer',usage.member_count,usage.max_members],
          ['Websites',usage.website_count,usage.max_websites]
        ].map(([label,n,max])=><div key={label as string} className="rounded-2xl bg-slate-50 p-4"><div className="flex justify-between text-sm font-semibold"><span>{label}</span><span>{n} / {max}</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-[#0E675A]" style={{width:percent(n as number,max as number)+'%'}}/></div></div>)}
      </div>
      <div className="mt-5 rounded-xl border border-slate-200 p-4"><div className="text-xs uppercase tracking-wider text-slate-400">Aktueller Tarif</div><div className="mt-1 text-lg font-bold capitalize">{usage.plan}</div>{usage.stripe_customer_id && usage.plan !== 'lifetime' && <button onClick={()=>void manageAbrechnung()} className="mt-4 mr-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold">Abrechnung verwalten</button>}{usage.plan!=='lifetime' && <button onClick={()=>checkout('lifetime')} className="mt-4 rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white">Dauerlizenz-Lizenz kaufen</button>}</div>
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{plans.map(([id,name,price])=><div key={id} className={`rounded-2xl border p-5 ${usage.plan===id?'border-[#0E675A] ring-2 ring-[#0E675A]/10':'border-slate-200'} bg-white`}><div className="font-bold">{name}</div><div className="mt-1 text-sm text-slate-500">{price}</div><div className="mt-5 text-xs text-slate-500">Bilder, Benutzer und Websites gemäß Tariflimit.</div>{id==='lifetime' ? <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">Einmalig zahlen · dauerhaft nutzen · keine monatliche Grundgebühr</div> : <button onClick={()=>void checkout(id)} disabled={usage.plan===id} className="mt-4 w-full rounded-xl bg-[#0E675A] px-3 py-2.5 text-xs font-semibold text-white disabled:opacity-50">{usage.plan===id ? 'Aktueller Tarif' : 'Tarif auswählen'}</button>}</div>)}</div>
  </section>
}