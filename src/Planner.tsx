import { useCallback, useEffect, useState } from 'react'
import * as db from './db'
import Worksheet, { Field } from './Worksheet'
const META = 'planner-meta'
const SKILLS = ['Vocabulary', 'Grammar', 'Speaking', 'Listening', 'Reading', 'Writing', 'Revision']
const fields: Field[] = [
  { key: 'activity', label: 'Atividade', required: true }, { key: 'date', label: 'Data', type: 'date' },
  { key: 'skill', label: 'Habilidade', type: 'select', options: SKILLS }, { key: 'notes', label: 'Notas', type: 'area' }]
const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)

export default function Planner() {
  const [meta, setMeta] = useState({ goals: '', minimum: '' }); const [week, setWeek] = useState({ done: 0, total: 0 }); const [saved, setSaved] = useState('')
  const refresh = useCallback(async () => {
    const m = (await db.list(META))[0]; if (m) setMeta({ goals: String(m.goals ?? ''), minimum: String(m.minimum ?? '') })
    const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - ((now.getDay() + 6) % 7))
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
    const wk = (await db.list('planner')).filter(a => typeof a.date === 'string' && a.date >= iso(mon) && a.date <= iso(sun))
    setWeek({ done: wk.filter(a => a.done).length, total: wk.length })
  }, [])
  useEffect(() => { refresh() }, [refresh])
  const upd = (k: 'goals' | 'minimum', v: string) => {
    const n = { ...meta, [k]: v }; setMeta(n); db.save(META, n, META).then(() => setSaved('Salvo automaticamente'))
  }
  return <>
    <h1>My Planner</h1><p className="muted">Planeje do seu jeito. Você não precisa estudar todos os dias.</p>
    <div className="grid">
      <div className="card stat"><b>{week.done}/{week.total}</b>atividades concluídas nesta semana</div>
      <div className="card form"><label>Metas da semana<textarea value={meta.goals} onChange={e => upd('goals', e.target.value)} /></label></div>
      <div className="card form"><label>My minimum commitment<textarea placeholder="Algo pequeno que você faz até nos dias corridos" value={meta.minimum} onChange={e => upd('minimum', e.target.value)} /></label></div>
    </div><p className="muted" role="status">{saved}</p>
    <Worksheet collection="planner" title="Atividades de estudo" intro="Adicione atividades, escolha a data e marque como concluídas." empty="Nenhuma atividade planejada. Que tal começar com uma pequena?"
      fields={fields} titleKey="activity" filterKey="skill" doneKey="done" defaults={{ date: iso(new Date()) }} onChange={refresh} />
  </>
}
