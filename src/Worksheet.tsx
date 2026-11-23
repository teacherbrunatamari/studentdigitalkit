import { useCallback, useEffect, useState } from 'react'
import * as db from './db'
import './worksheet.css'

export type Field = { key: string; label: string; type?: 'text' | 'area' | 'select' | 'date' | 'bool'; options?: string[]; required?: boolean }
type Props = {
  collection: string; title: string; intro: string; empty: string; fields: Field[]; titleKey: string
  filterKey?: string; flagKey?: string; doneKey?: string; defaults?: Record<string, unknown>; onChange?: () => void
}
type Draft = Record<string, unknown>

export default function Worksheet(p: Props) {
  const [items, setItems] = useState<db.Rec[]>([])
  const [q, setQ] = useState(''); const [f, setF] = useState(''); const [flagOnly, setFlagOnly] = useState(false)
  const [draft, setDraft] = useState<Draft | null>(null); const [err, setErr] = useState('')
  const load = useCallback(async () => {
    const r = await db.list(p.collection)
    setItems(r.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
  }, [p.collection])
  useEffect(() => { load(); setDraft(null); setQ(''); setF(''); setFlagOnly(false); setErr('') }, [load])

  const filterField = p.fields.find(x => x.key === p.filterKey)
  const filterOpts = filterField?.options ?? Array.from(new Set(items.map(i => String(i[p.filterKey ?? ''] ?? '')).filter(Boolean)))
  const shown = items.filter(i =>
    (!q || Object.values(i).some(v => typeof v === 'string' && v.toLowerCase().includes(q.toLowerCase()))) &&
    (!f || i[p.filterKey ?? ''] === f) && (!flagOnly || !!i[p.flagKey ?? '']))

  const set = (k: string, v: unknown) => setDraft(d => ({ ...(d ?? {}), [k]: v }))
  const save = async () => {
    if (!draft) return
    const miss = p.fields.find(x => x.required && !String(draft[x.key] ?? '').trim())
    if (miss) { setErr(`Preencha o campo "${miss.label}".`); return }
    await db.save(p.collection, draft, draft.id as string | undefined)
    setDraft(null); setErr(''); await load(); p.onChange?.()
  }
  const del = async (r: db.Rec) => {
    if (confirm(`Excluir "${String(r[p.titleKey] ?? 'este registro')}"? Esta ação não pode ser desfeita.`)) { await db.remove(r.id); await load(); p.onChange?.() }
  }
  const toggleDone = async (r: db.Rec) => { await db.save(p.collection, { ...r, [p.doneKey!]: !r[p.doneKey!] }, r.id); await load(); p.onChange?.() }

  return <section>
    <h2>{p.title}</h2><p className="muted">{p.intro}</p>
    {!draft && <button className="btn" onClick={() => setDraft({ ...p.defaults })}>+ Adicionar</button>}
    {draft && <div className="card form" style={{ marginTop: 14 }}>
      <h3>{draft.id ? 'Editar registro' : 'Novo registro'}</h3>
      {p.fields.map(x => x.type === 'bool'
        ? <label key={x.key} className="chk"><input type="checkbox" checked={!!draft[x.key]} onChange={e => set(x.key, e.target.checked)} />{x.label}</label>
        : <label key={x.key}>{x.label}{x.required ? ' *' : ''}
          {x.type === 'area' ? <textarea value={String(draft[x.key] ?? '')} onChange={e => set(x.key, e.target.value)} />
            : x.type === 'select' ? <select value={String(draft[x.key] ?? '')} onChange={e => set(x.key, e.target.value)}><option value="">Selecione…</option>{x.options!.map(o => <option key={o}>{o}</option>)}</select>
              : <input type={x.type === 'date' ? 'date' : 'text'} value={String(draft[x.key] ?? '')} onChange={e => set(x.key, e.target.value)} />}</label>)}
      {err && <div className="err" role="alert">{err}</div>}
      <div className="row"><button className="btn" onClick={save}>Salvar</button><button className="btn ghost" onClick={() => { setDraft(null); setErr('') }}>Cancelar</button></div>
    </div>}
    {items.length > 0 && <div className="bar">
      <input type="search" placeholder="Buscar…" aria-label="Buscar" value={q} onChange={e => setQ(e.target.value)} />
      {filterField && <select aria-label={`Filtrar por ${filterField.label}`} value={f} onChange={e => setF(e.target.value)}><option value="">Todos: {filterField.label}</option>{filterOpts.map(o => <option key={o}>{o}</option>)}</select>}
      {p.flagKey && <label className="chk" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" checked={flagOnly} onChange={e => setFlagOnly(e.target.checked)} />Só para revisar</label>}
    </div>}
    {items.length === 0 && !draft && <div className="notice">{p.empty}</div>}
    {items.length > 0 && shown.length === 0 && <p className="muted">Nada encontrado com esses filtros.</p>}
    {shown.map(r => <article key={r.id} className={'card item' + (p.doneKey && r[p.doneKey] ? ' done' : '')}>
      <h3><span>{String(r[p.titleKey] ?? '')}</span>{p.flagKey && r[p.flagKey] ? <span className="tag">Revisar</span> : null}</h3>
      {p.fields.filter(x => x.key !== p.titleKey && x.type !== 'bool' && r[x.key]).map(x => <p key={x.key}><small>{x.label}</small>{String(r[x.key])}</p>)}
      <div className="row">
        {p.doneKey && <button className="btn ghost sm" onClick={() => toggleDone(r)}>{r[p.doneKey] ? 'Reabrir' : 'Concluir'}</button>}
        <button className="btn ghost sm" onClick={() => setDraft({ ...r })}>Editar</button>
        <button className="btn ghost sm" onClick={() => del(r)}>Excluir</button></div>
    </article>)}
  </section>
}
