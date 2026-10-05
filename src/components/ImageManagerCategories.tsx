import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const defaults = ['Marke', 'Produktart', 'Bereich', 'Stil']

export function ImageManagerCategories() {
  const [tenantId, setTenantId] = useState('')
  const [slots, setSlots] = useState<Array<{ slot: number; name: string; values: string[] }>>([])
  const [value, setValue] = useState<Record<number, string>>({})
  const [message, setMessage] = useState('')

  const load = async () => {
    if (!supabase) return
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    const { data: membership } = await supabase.from('memberships').select('tenant_id').eq('user_id', user.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    setTenantId(membership.tenant_id)
    const { data } = await supabase.from('categories').select('slot,name,slug,sort_order,active').eq('tenant_id', membership.tenant_id).order('slot').order('sort_order')
    const rows = data || []
    setSlots([1,2,3,4].map(slot => ({ slot, name: rows.find(r => r.slot === slot)?.name || defaults[slot - 1], values: rows.filter(r => r.slot === slot && r.name !== defaults[slot - 1]).map(r => r.name) })))
  }

  useEffect(() => { void load() }, [])

  const saveLabel = async (slot: number, name: string) => {
    if (!supabase || !tenantId || !name.trim()) return
    const existing = slots.find(s => s.slot === slot)
    const old = existing?.name
    if (old && old !== name.trim()) {
      await supabase.from('categories').update({ name: name.trim(), slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }).eq('tenant_id', tenantId).eq('slot', slot).eq('name', old)
    } else if (!existing?.name) {
      await supabase.from('categories').insert({ tenant_id: tenantId, slot, name: name.trim(), slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') })
    }
    setMessage('Kategorie gespeichert.')
    await load()
  }

  const addValue = async (slot: number) => {
    if (!supabase || !tenantId || !value[slot]?.trim()) return
    const text = value[slot].trim()
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + slot
    const { error } = await supabase.from('categories').insert({ tenant_id: tenantId, slot, name: text, slug, sort_order: 10 })
    setMessage(error ? error.message : 'Wert hinzugefügt.')
    setValue({ ...value, [slot]: '' })
    await load()
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold">Kategorien</h2>
    <p className="mt-1 text-sm text-slate-500">Jeder Arbeitsbereich kann Bezeichnungen und Kategorienwerte selbst verwalten.</p>
    {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {slots.map(slot => <div key={slot.slot} className="rounded-2xl border border-slate-200 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kategorie {slot.slot}</div>
        <input defaultValue={slot.name} key={slot.slot + '-' + slot.name} onBlur={e => void saveLabel(slot.slot, e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 font-semibold" />
        <div className="mt-4 flex gap-2"><input value={value[slot.slot] || ''} onChange={e => setValue({ ...value, [slot.slot]: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') void addValue(slot.slot) }} placeholder="Neuen Wert hinzufügen" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><button onClick={() => void addValue(slot.slot)} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white">Hinzufügen</button></div>
        <div className="mt-4 flex flex-wrap gap-2">{slot.values.length ? slot.values.map(v => <span key={v} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs">{v}</span>) : <span className="text-xs text-slate-400">Noch keine Werte.</span>}</div>
      </div>)}
    </div>
  </section>
}
