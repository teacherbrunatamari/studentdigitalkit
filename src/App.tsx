import { useEffect, useState, useCallback } from 'react'
import * as db from './db'

const SECTIONS = [
  ['home', 'Home', 'Início'], ['journey', 'My Learning Journey', 'Meu perfil e metas'],
  ['strategies', 'Study Strategies', 'Como estudar melhor'], ['toolkit', 'My English Toolkit', 'Cadernos de estudo'],
  ['lab', 'Communication Lab', 'Comunicação na prática'], ['everywhere', 'English Everywhere', 'Inglês no dia a dia'],
  ['planner', 'My Planner', 'Planejamento semanal'], ['progress', 'My Progress', 'Meu progresso'], ['settings', 'Settings', 'Configurações'],
] as const
type Id = typeof SECTIONS[number][0]
const BOTTOM: Id[] = ['home', 'toolkit', 'planner', 'progress']
const READY: Id[] = ['home', 'settings']

function useCounts() {
  const [c, setC] = useState<Record<string, number>>({})
  const load = useCallback(async () => {
    const r: Record<string, number> = {}
    for (const k of db.COLLECTIONS) r[k] = (await db.list(k)).length
    setC(r)
  }, [])
  useEffect(() => { load() }, [load])
  return [c, load] as const
}

function Home({ go, counts }: { go: (s: Id) => void; counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const stats: [string, string][] = [['vocabulary', 'Palavras salvas'], ['grammar', 'Notas de gramática'], ['mistakes', 'Erros registrados'], ['log', 'Registros de escuta/leitura']]
  return <>
    <section className="hero"><h1>Welcome back! Ready to make progress?</h1><p>Small steps. Meaningful practice. Better communication.</p></section>
    <h2>Meu panorama</h2>
    <div className="grid">{stats.map(([k, l]) => <div className="card stat" key={k}><b>{counts[k] ?? 0}</b>{l}</div>)}</div>
    {total === 0 && <div className="notice">Você ainda não tem registros. Os números acima refletem apenas o que você salvar aqui, no seu aparelho.</div>}
    <h2 style={{ marginTop: 28 }}>Acesso rápido</h2>
    <div className="grid">{SECTIONS.slice(1, 8).map(([id, n, d]) => <button key={id} className="card" style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => go(id)}><h3>{n}</h3><span className="muted">{d}</span></button>)}</div>
  </>
}

function Settings({ refresh }: { refresh: () => void }) {
  const [msg, setMsg] = useState('')
  const exportJson = async () => {
    const blob = new Blob([await db.exportAll()], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = `student-digital-kit-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(a.href)
    setMsg('Backup exportado.')
  }
  const importJson = async (f?: File) => {
    if (!f) return
    try { const n = await db.importAll(await f.text()); setMsg(`${n} registros importados.`); refresh() }
    catch { setMsg('Não foi possível importar: arquivo inválido.') }
  }
  const erase = async () => {
    if (confirm('Apagar TODOS os seus dados deste aparelho? Esta ação não pode ser desfeita.')) { await db.clearAll(); setMsg('Todos os dados foram apagados.'); refresh() }
  }
  return <>
    <h1>Settings</h1>
    <div className="notice">Seus dados ficam salvos <b>apenas neste aparelho e navegador</b>. Eles não são enviados a nenhum servidor e não sincronizam sozinhos entre dispositivos. Limpar os dados do navegador ou desinstalar o app pode apagá-los, então faça backups com frequência.</div>
    <div className="card"><h3>Backup dos meus dados</h3>
      <div className="row"><button className="btn" onClick={exportJson}>Exportar (JSON)</button>
        <label className="btn ghost">Importar backup<input type="file" accept="application/json" hidden onChange={e => { importJson(e.target.files?.[0]); e.target.value = '' }} /></label></div>
      <p className="muted" role="status">{msg}</p></div>
    <div className="card" style={{ marginTop: 16 }}><h3>Zona sensível</h3><p className="muted">Remove todos os registros salvos neste aparelho.</p>
      <button className="btn danger" onClick={erase}>Apagar todos os meus dados</button></div>
  </>
}

export default function App() {
  const [sec, setSec] = useState<Id>(() => (location.hash.slice(1) as Id) || 'home')
  const [more, setMore] = useState(false)
  const [counts, refresh] = useCounts()
  const go = (s: Id) => { setSec(s); setMore(false); location.hash = s; refresh(); scrollTo(0, 0) }
  const item = SECTIONS.find(s => s[0] === sec) ?? SECTIONS[0]
  const NavBtns = ({ ids }: { ids?: readonly Id[] }) => <>{SECTIONS.filter(s => !ids || ids.includes(s[0])).map(([id, n]) =>
    <button key={id} aria-current={sec === id ? 'page' : undefined} onClick={() => go(id)}>{n}</button>)}</>
  return <div className="app">
    <aside className="side"><img src="/brand/logo-vertical.png" alt="Bruna Tamari — More than fluency. Communication." />
      <nav className="nav" aria-label="Principal"><NavBtns /></nav></aside>
    <main className="main">
      {sec === 'home' && <Home go={go} counts={counts} />}
      {sec === 'settings' && <Settings refresh={refresh} />}
      {!READY.includes(sec) && <><h1>{item[1]}</h1><p className="muted">{item[2]}</p>
        <div className="notice">Esta seção chega nas próximas fases do projeto. A base de dados e a navegação já estão prontas para recebê-la.</div></>}
    </main>
    {more && <div className="sheet" role="dialog" aria-label="Mais seções"><nav className="nav"><NavBtns ids={SECTIONS.map(s => s[0]).filter(i => !BOTTOM.includes(i))} /></nav></div>}
    <nav className="bottom" aria-label="Navegação">
      {BOTTOM.map(id => <button key={id} aria-current={sec === id ? 'page' : undefined} onClick={() => go(id)}>{SECTIONS.find(s => s[0] === id)![1].replace('My ', '').replace('English ', '')}</button>)}
      <button aria-expanded={more} onClick={() => setMore(!more)}>Mais</button></nav>
  </div>
}
