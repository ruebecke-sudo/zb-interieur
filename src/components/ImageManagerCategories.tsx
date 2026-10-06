import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { toCategoryLabels, type CategoryLabels } from '../lib/categoryLabels'

export function ImageManagerCategories({ onLabelsChanged }: { onLabelsChanged?: (labels: CategoryLabels) => void }) {
  const [tenantId, setTenantId] = useState('')
  const [labels, setLabels] = useState<CategoryLabels | null>(null)
  const [values, setValues] = useState<Record<number, string[]>>({})
  const [value, setValue] = useState<Record<number, string>>({})
  const [message, setMessage] = useState('')

  const load = async () => {
    if (!supabase) return
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) return
    const { data: membership } = await supabase.from('memberships').select('tenant_id').eq('user_id', user.user.id).limit(1).maybeSingle()
    if (!membership?.tenant_id) return
    setTenantId(membership.tenant_id)
    const [{ data: tenant }, { data }] = await Promise.all([
      supabase.from('tenants').select('category_labels').eq('id', membership.tenant_id).maybeSingle(),
      supabase.from('categories').select('slot,name,sort_order').eq('tenant_id', membership.tenant_id).order('slot').order('sort_order').order('name'),
    ])
    setLabels(toCategoryLabels(tenant?.category_labels))
    const rows = data || []
    setValues(Object.fromEntries([1, 2, 3, 4].map((slot) => [slot, rows.filter((row) => row.slot === slot).map((row) => row.name)])))
  }

  useEffect(() => { void load() }, [])

  const saveLabel = async (slot: number, name: string) => {
    if (!supabase || !tenantId || !labels) return
    const trimmed = name.trim()
    if (!trimmed || trimmed === labels[slot - 1]) return
    const next = [...labels] as CategoryLabels
    next[slot - 1] = trimmed
    const { error } = await supabase.from('tenants').update({ category_labels: next }).eq('id', tenantId)
    if (error) return setMessage(error.message.includes('category_labels') ? 'Bitte zuerst das Datenbank-Update 009 in Supabase ausführen.' : error.message)
    setLabels(next)
    onLabelsChanged?.(next)
    setMessage(`Bezeichnung „${trimmed}“ gespeichert.`)
  }

  const addValue = async (slot: number) => {
    if (!supabase || !tenantId || !value[slot]?.trim()) return
    const text = value[slot].trim()
    const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + slot
    const { error } = await supabase.from('categories').insert({ tenant_id: tenantId, slot, name: text, slug, sort_order: 10 })
    setMessage(error ? error.message : `„${text}“ hinzugefügt.`)
    setValue({ ...value, [slot]: '' })
    await load()
  }

  const removeValue = async (slot: number, name: string) => {
    if (!supabase || !tenantId || !window.confirm(`„${name}“ aus der Auswahl entfernen? Bereits zugeordnete Bilder behalten den Wert.`)) return
    const { error } = await supabase.from('categories').delete().eq('tenant_id', tenantId).eq('slot', slot).eq('name', name)
    setMessage(error ? error.message : `„${name}“ entfernt.`)
    await load()
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-xl font-bold">Kategorien</h2>
    <p className="mt-1 text-sm text-slate-500">Vier Kategorien pro Bild. Bezeichnungen und Werte legen Sie selbst fest, zum Beispiel „Kunde, Anlass, Ort, Jahr“. Die Bezeichnungen erscheinen überall in der Bildverwaltung.</p>
    {message && <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">{message}</div>}
    {!labels && <div className="mt-6 text-sm text-slate-500">Kategorien werden geladen …</div>}
    {labels && <div className="mt-6 grid gap-4 md:grid-cols-2">
      {[1, 2, 3, 4].map((slot) => <div key={slot} className="rounded-2xl border border-slate-200 p-5">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bezeichnung Kategorie {slot}
          <input defaultValue={labels[slot - 1]} key={`${slot}-${labels[slot - 1]}`} onBlur={(e) => void saveLabel(slot, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }} maxLength={40} className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-base font-semibold normal-case tracking-normal text-slate-900" />
        </label>
        <div className="mt-4 flex gap-2"><input value={value[slot] || ''} onChange={(e) => setValue({ ...value, [slot]: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') void addValue(slot) }} placeholder={`Neuer Wert für ${labels[slot - 1]}`} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" /><button onClick={() => void addValue(slot)} className="rounded-xl bg-[#0E675A] px-4 py-2.5 text-sm font-semibold text-white">Hinzufügen</button></div>
        <div className="mt-4 flex flex-wrap gap-2">{values[slot]?.length
          ? values[slot].map((v) => <span key={v} className="inline-flex items-center gap-1 rounded-full bg-slate-100 py-1.5 pl-3 pr-1.5 text-xs">{v}<button type="button" onClick={() => void removeValue(slot, v)} aria-label={`${v} entfernen`} title="Entfernen" className="flex h-5 w-5 items-center justify-center rounded-full text-slate-500 hover:bg-slate-200 hover:text-red-600">×</button></span>)
          : <span className="text-xs text-slate-400">Noch keine Werte.</span>}</div>
      </div>)}
    </div>}
  </section>
}
