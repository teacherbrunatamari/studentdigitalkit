import { useState } from 'react'
import Worksheet, { Field } from './Worksheet'
const RES: [string, string, string, string, string][] = [
  ['Cambridge Dictionary', 'Dicionário', 'Significados, exemplos e pronúncia.', 'Procure a palavra e leia os exemplos antes de anotar.', 'https://dictionary.cambridge.org/'],
  ["Oxford Learner's Dictionaries", 'Dicionário', 'Definições simples para estudantes.', 'Use as listas de níveis e os exemplos de uso.', 'https://www.oxfordlearnersdictionaries.com/'],
  ['Merriam-Webster', 'Dicionário', 'Definições e inglês americano.', 'Confira significados e variações de uso.', 'https://www.merriam-webster.com/'],
  ['YouGlish', 'Pronúncia', 'Ouvir a palavra em vídeos reais.', 'Digite a palavra e ouça vários falantes.', 'https://youglish.com/'],
  ['BBC Learning English', 'Aulas e escuta', 'Lições, vídeos e áudios para estudantes.', 'Escolha um tema e faça um episódio curto.', 'https://www.bbc.co.uk/learningenglish'],
  ['TED', 'Escuta', 'Palestras sobre vários temas.', 'Ative legendas em inglês e anote expressões.', 'https://www.ted.com/'],
  ['LyricsTraining', 'Escuta com música', 'Completar letras ouvindo a música.', 'Escolha o nível e escute atento às lacunas.', 'https://lyricstraining.com/']]
const CAT = ['Listening', 'Reading', 'Watching', 'Speaking', 'Writing', 'Thinking in English']
const imm: Field[] = [{ key: 'activity', label: 'Atividade', required: true }, { key: 'category', label: 'Categoria', type: 'select', options: CAT, required: true }, { key: 'when', label: 'Quando / com que frequência' }]
const log: Field[] = [{ key: 'title', label: 'Content title', required: true }, { key: 'type', label: 'Tipo', type: 'select', options: ['Listening', 'Reading'], required: true }, { key: 'source', label: 'Source' }, { key: 'date', label: 'Data', type: 'date' }, { key: 'content', label: 'Tipo de conteúdo (podcast, artigo, vídeo…)' },
  { key: 'topic', label: 'Main topic' }, { key: 'idea', label: 'Main idea', type: 'area' }, { key: 'vocab', label: 'New vocabulary', type: 'area' }, { key: 'expr', label: 'Interesting expressions', type: 'area' }, { key: 'understood', label: 'O que eu entendi', type: 'area' }, { key: 'reflection', label: 'Minha reflexão', type: 'area' }]
export default function Everywhere() {
  const [t, setT] = useState(0)
  return <><h1>English Everywhere</h1><div className="tabs">{['Digital Learning Toolbox', 'My English Immersion', 'Listening & Reading Log'].map((n, i) => <button key={n} aria-pressed={t === i} onClick={() => setT(i)}>{n}</button>)}</div>
    {t === 0 && RES.map(r => <article key={r[0]} className="card item"><h3>{r[0]}<span className="tag">{r[1]}</span></h3><p><small>Para que serve</small>{r[2]}</p><p><small>Como usar</small>{r[3]}</p>
      <a className="btn ghost sm" href={r[4]} target="_blank" rel="noopener noreferrer">Abrir site</a></article>)}
    {t === 1 && <Worksheet key="imm" collection="immersion" title="Minha imersão" intro="Defina pequenas atividades para colocar o inglês na rotina. Ex.: ouvir um podcast de 10 min, gravar um áudio de 2 min." empty="Nenhuma atividade ainda. Comece com uma pequena." titleKey="activity" filterKey="category" fields={imm} />}
    {t === 2 && <Worksheet key="log" collection="log" title="Listening & Reading Log" intro="Registre o que você ouviu e leu." empty="Nenhum registro ainda." titleKey="title" filterKey="type" fields={log} defaults={{ date: new Date().toISOString().slice(0, 10) }} />}</>
}
