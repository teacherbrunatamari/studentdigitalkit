import { useState } from 'react'
import Worksheet, { Field } from './Worksheet'
const today = () => new Date().toISOString().slice(0, 10)
const T = (key: string, label: string, required = false): Field => ({ key, label, required })
const A = (key: string, label: string): Field => ({ key, label, type: 'area' })
const S = (key: string, label: string, options: string[], required = false): Field => ({ key, label, type: 'select', options, required })
const D: Field = { key: 'date', label: 'Data', type: 'date' }

const SHEETS = [
  { id: 'vocabulary', tab: 'Vocabulary Builder', title: 'Vocabulary Builder', intro: 'Seu caderno de palavras e expressões. Escreva sempre uma frase sua: é ela que fixa o vocabulário.',
    empty: 'Nenhuma palavra salva ainda. Comece com uma que você ouviu hoje.', titleKey: 'word', filterKey: 'topic', flagKey: 'review',
    fields: [T('word', 'Word or expression', true), T('meaning', 'Significado (português ou inglês)', true), S('pos', 'Part of speech', ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'phrasal verb', 'expression', 'other']),
      T('phonetic', 'Pronúncia (opcional)'), A('example', 'Example sentence'), A('mine', 'My own sentence'), T('topic', 'Contexto ou tópico'), D, { key: 'review', label: 'Marcar para revisão', type: 'bool' } as Field] },
  { id: 'context', tab: 'Vocabulary in Context', title: 'Vocabulary in Context', intro: 'Aprenda expressões inteiras, não só traduções: collocations, phrasal verbs, idioms e mais.',
    empty: 'Exemplo: "make a decision" → collocations: make a final decision, make a difficult decision.', titleKey: 'expression', filterKey: 'kind', flagKey: 'review',
    fields: [T('expression', 'Expression', true), S('kind', 'Tipo', ['Collocation', 'Phrasal verb', 'Word family', 'Idiomatic expression', 'Professional vocabulary', 'Formal / Informal']),
      T('meaning', 'Significado'), A('collocations', 'Common collocations / word family'), S('register', 'Registro', ['Formal', 'Neutral', 'Informal']), A('mine', 'My example'), D, { key: 'review', label: 'Marcar para revisão', type: 'bool' } as Field] },
  { id: 'grammar', tab: 'Grammar Notes', title: 'Grammar Notes', intro: 'Organize a gramática do seu jeito, com exemplos que fazem sentido para a sua vida.',
    empty: 'Nenhuma nota de gramática ainda. Que tópico você estudou por último?', titleKey: 'topic', filterKey: 'topic',
    fields: [T('topic', 'Grammar topic', true), T('structure', 'Structure / formula'), A('meaning', 'Meaning'), A('when', 'When to use it'), A('affirmative', 'Affirmative examples'), A('negative', 'Negative examples'),
      A('question', 'Question examples'), A('mine', 'My own examples'), A('mistakes', 'Common mistakes'), A('doubts', 'Questions I still have')] },
  { id: 'mistakes', tab: 'My Mistake Journal', title: 'My Mistake Journal', intro: 'Errar faz parte de aprender. Registrar o erro e entender o porquê é o que faz você avançar.',
    empty: 'Seu diário está vazio. Quando notar um erro (ou receber uma correção), registre aqui.', titleKey: 'said', filterKey: 'category',
    fields: [T('said', 'What I said or wrote', true), T('corrected', 'Corrected version', true), S('category', 'Categoria', ['Grammar', 'Vocabulary', 'Pronunciation', 'Word order', 'Prepositions', 'Communication', 'Other'], true),
      A('why', 'Why was it incorrect?'), A('explanation', 'Explanation'), A('example', 'New example'), D] },
]

export default function Toolkit() {
  const [id, setId] = useState(SHEETS[0].id)
  const s = SHEETS.find(x => x.id === id)!
  return <>
    <h1>My English Toolkit</h1>
    <div className="tabs" role="group" aria-label="Cadernos">{SHEETS.map(x => <button key={x.id} aria-pressed={x.id === id} onClick={() => setId(x.id)}>{x.tab}</button>)}</div>
    <Worksheet key={s.id} collection={s.id} title={s.title} intro={s.intro} empty={s.empty} fields={s.fields} titleKey={s.titleKey} filterKey={s.filterKey} flagKey={s.flagKey} defaults={{ date: today() }} />
  </>
}
