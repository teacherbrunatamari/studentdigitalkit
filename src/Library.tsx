import { useCallback, useEffect, useState } from 'react'
import * as db from './db'
import { EXPRS, FUNCTIONS, REG } from './expressions'

export default function Library() {
  const [q, setQ] = useState(''); const [fn, setFn] = useState(''); const [lv, setLv] = useState(''); const [rg, setRg] = useState(''); const [favOnly, setFavOnly] = useState(false)
  const [favs, setFavs] = useState<string[]>([]); const [saved, setSaved] = useState<string[]>([]); const [msg, setMsg] = useState('')
  const load = useCallback(async () => {
    setFavs((await db.list('expfav')).map(r => r.id))
    setSaved((await db.list('vocabulary')).map(r => `${r.topic}:${r.word}`))
  }, [])
  useEffect(() => { load() }, [load])
  const shown = EXPRS.filter(e => (!q || (e.text + ' ' + e.ex).toLowerCase().includes(q.toLowerCase())) && (!fn || e.fn === fn) && (!lv || e.level === lv) && (!rg || e.reg === rg) && (!favOnly || favs.includes(e.id)))
  const fav = async (id: string) => { if (favs.includes(id)) await db.remove(id); else await db.save('expfav', {}, id); load() }
  const toVocab = async (e: typeof EXPRS[number]) => {
    await db.save('vocabulary', { word: e.text, meaning: '', pos: 'expression', example: e.ex, topic: e.fn, date: new Date().toISOString().slice(0, 10), review: true })
    setMsg(`"${e.text}" foi salva no Vocabulary Builder. Abra lá para adicionar o significado e a sua própria frase.`); load()
  }
  return <>
    <p className="muted">{EXPRS.length} expressões organizadas pelo que você quer fazer na conversa. Os níveis são sugestões de uso, não uma avaliação oficial.</p>
    <div className="bar">
      <input type="search" aria-label="Buscar expressões" placeholder="Buscar…" value={q} onChange={e => setQ(e.target.value)} />
      <select aria-label="Função" value={fn} onChange={e => setFn(e.target.value)}><option value="">Todas as funções</option>{FUNCTIONS.map(f => <option key={f}>{f}</option>)}</select>
      <select aria-label="Nível" value={lv} onChange={e => setLv(e.target.value)}><option value="">Todos os níveis</option>{['A2', 'B1', 'B2', 'C1'].map(l => <option key={l}>{l}</option>)}</select>
      <select aria-label="Registro" value={rg} onChange={e => setRg(e.target.value)}><option value="">Todos os registros</option>{Object.entries(REG).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <label className="chk" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" checked={favOnly} onChange={e => setFavOnly(e.target.checked)} />Só favoritas</label>
    </div>
    <p className="muted" role="status">{msg || `${shown.length} resultado(s)`}</p>
    {favOnly && shown.length === 0 && <div className="notice">Você ainda não tem favoritas. Toque em "Favoritar" nas expressões que quiser guardar.</div>}
    {shown.map(e => <article key={e.id} className="card item">
      <h3><span>{e.text}</span><span className="tag">{e.level} · {REG[e.reg]}</span></h3>
      <p><small>{e.fn}</small>{e.ex}</p>
      <div className="row"><button className="btn ghost sm" aria-pressed={favs.includes(e.id)} onClick={() => fav(e.id)}>{favs.includes(e.id) ? '★ Favorita' : '☆ Favoritar'}</button>
        <button className="btn ghost sm" disabled={saved.includes(`${e.fn}:${e.text}`)} onClick={() => toVocab(e)}>{saved.includes(`${e.fn}:${e.text}`) ? 'Já está no Vocabulary Builder' : 'Salvar no Vocabulary Builder'}</button></div>
    </article>)}
  </>
}
