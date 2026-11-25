import { useRecord } from './useRecord'
const SK = ['Speaking', 'Listening', 'Reading', 'Writing', 'Grammar', 'Vocabulary', 'Pronunciation']
const TX: [string, string][] = [['name', 'My name'], ['why', 'Why am I learning English?'], ['goals', 'Meus objetivos profissionais ou pessoais'], ['situations', 'Situações em que quero me comunicar com confiança'], ['challenges', 'Meus maiores desafios'], ['preferred', 'Atividades de estudo que eu prefiro'], ['short', 'Where I want to be: curto prazo'], ['long', 'Where I want to be: longo prazo']]
export default function Journey() {
  const [d, set] = useRecord('profile', 'me'); const sk: string[] = d.skills ?? []
  return <><h1>My Learning Journey</h1><p className="muted">Este é o seu espaço. Tudo é salvo automaticamente neste aparelho.</p>
    <div className="card form">
      <label>Meu nível atual de inglês (opcional)<select value={d.level ?? ''} onChange={e => set('level', e.target.value)}><option value="">Prefiro não informar</option>{['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => <option key={l}>{l}</option>)}</select></label>
      {TX.map(([k, l]) => k === 'name' ? <label key={k}>{l}<input value={d[k] ?? ''} onChange={e => set(k, e.target.value)} /></label> : <label key={k}>{l}<textarea value={d[k] ?? ''} onChange={e => set(k, e.target.value)} /></label>)}
      <fieldset style={{ border: 0, padding: 0 }}><legend><b>Habilidades que quero desenvolver</b></legend>
        {SK.map(s => <label key={s} className="chk"><input type="checkbox" checked={sk.includes(s)} onChange={e => set('skills', e.target.checked ? [...sk, s] : sk.filter(x => x !== s))} />{s}</label>)}</fieldset>
    </div></>
}
