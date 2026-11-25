import { useRecord } from './useRecord'
const C: [string, string[]][] = [
  ['Keep the Conversation Going', ['Mostrar interesse, fazer perguntas, dar opinião, ampliar respostas curtas e mudar de assunto com naturalidade.', "That's interesting. How did that happen?", 'What makes you say that?', 'From my experience...', "That's a good point.", 'Could you tell me more about it?']],
  ['Communication Toolkit', ['Quando faltar uma palavra: parafrasear, descrever, dar exemplos, pedir esclarecimento, checar compreensão, reformular e ganhar tempo.', 'Let me put it another way.', 'What I mean is...', "It's something you use to...", 'Could you clarify that?', 'Let me think for a second.'])]
const R: [string, string, string, string, string][] = [
  ['Professional meetings', 'Participar e opinar com clareza.', 'I\'d like to add something. / Could we go back to...?', 'agenda, deadline, follow-up', 'Dê sua opinião sobre um prazo em 3 frases.'],
  ['Job interviews', 'Falar das suas experiências e pontos fortes.', 'One of my strengths is... / In my previous role...', 'achievement, skill, responsibility', 'Responda: "Tell me about yourself" em 1 minuto.'],
  ['Presentations', 'Abrir, organizar e fechar uma apresentação.', "Today I'll talk about... / Let's move on to...", 'overview, key point, takeaway', 'Grave uma abertura de 30 segundos.'],
  ['Business conversations', 'Criar conexão e negociar.', 'How is business going? / I see your point, but...', 'proposal, budget, partnership', 'Simule apresentar uma ideia a um cliente.'],
  ['Academic discussions', 'Argumentar e discordar com educação.', 'I tend to agree because... / On the other hand...', 'argument, evidence, hypothesis', 'Defenda uma opinião em 4 frases.'],
  ['Travel situations', 'Resolver imprevistos em viagem.', 'Could you help me with...? / Is this the right way to...?', 'delay, reservation, luggage', 'Peça informação a um atendente imaginário.'],
  ['Everyday conversations', 'Bater papo e manter a conversa.', "How's your day going? / That sounds great!", 'weekend, plans, routine', 'Conte seu fim de semana em 5 frases.'],
  ['Email and professional communication', 'Escrever e-mails claros e educados.', "I'm writing to... / Please let me know if... / Best regards,", 'attachment, follow up, regarding', 'Escreva um e-mail de 4 linhas pedindo uma informação.']]
function Note({ id }: { id: string }) {
  const [d, set] = useRecord('labnotes', id)
  return <label className="form">Minhas notas<textarea value={d.text ?? ''} onChange={e => set('text', e.target.value)} /></label>
}
export default function Lab() {
  return <><h1>Communication Lab</h1><p className="muted">Comunicação na prática: o foco é se fazer entender, não ser perfeito. Adapte as frases ao seu nível.</p>
    {C.map(([t, [d, ...ex]]) => <article key={t} className="card item"><h3>{t}</h3><p>{d}</p>{ex.map(e => <p key={e}>• {e}</p>)}</article>)}
    <h2>Real-Life English</h2>
    {R.map(([t, o, e, v, c]) => <details key={t} className="card item"><summary><b>{t}</b></summary>
      <p><small>Objetivo</small>{o}</p><p><small>Useful expressions</small>{e}</p><p><small>Vocabulary</small>{v}</p><p><small>Desafio</small>{c}</p><Note id={t} /></details>)}</>
}
