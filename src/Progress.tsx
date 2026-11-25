import { useEffect, useState } from 'react'
import * as db from './db'
import Worksheet, { Field } from './Worksheet'
import { useRecord } from './useRecord'
const SK = ['Speaking', 'Listening', 'Reading', 'Writing', 'Grammar', 'Vocabulary', 'Pronunciation']
const Q: [string, string][] = [['can', 'O que consigo fazer em inglês agora que antes não conseguia?'], ['win', 'Minha maior conquista'], ['hard', 'Desafios que enfrentei'], ['worked', 'Estratégias que funcionaram melhor'], ['improve', 'O que preciso melhorar'], ['next', 'Minha próxima prioridade']]
const fields: Field[] = [{ key: 'month', label: 'Mês', required: true }, ...Q.map(([key, label]) => ({ key, label, type: 'area' as const }))]
export default function Progress() {
  const [d, set] = useRecord('selfassess', 'current'); const [c, setC] = useState<[string, number][]>([])
  const load = async () => { const n = async (k: string) => (await db.list(k)).length
    setC([['Vocabulary entries', await n('vocabulary')], ['Grammar notes', await n('grammar')], ['Mistake journal entries', await n('mistakes')], ['Completed study activities', (await db.list('planner')).filter(a => a.done).length], ['Listening & reading records', await n('log')], ['Monthly reflections', await n('reflections')]]) }
  useEffect(() => { load() }, [])
  return <><h1>My Progress</h1>
    <h2>Progress Overview</h2><div className="grid">{c.map(([l, v]) => <div key={l} className="card stat"><b>{v}</b>{l}</div>)}</div>
    <h2 style={{ marginTop: 24 }}>Skills Self-Assessment</h2>
    <div className="notice">Esta é a sua percepção pessoal de progresso (1 a 5), não uma avaliação oficial de proficiência.</div>
    <div className="card form">{SK.map(s => <div key={s}><b>{s}</b><div className="row">{[1, 2, 3, 4, 5].map(n => <button key={n} className={'btn sm' + (d[s] === n ? '' : ' ghost')} aria-pressed={d[s] === n} onClick={() => set(s, n)}>{n}</button>)}</div></div>)}</div>
    <Worksheet collection="reflections" title="Monthly Learning Review" intro="Uma reflexão por mês ajuda a enxergar o que mudou." empty="Nenhuma reflexão ainda." titleKey="month" fields={fields} onChange={load} /></>
}
