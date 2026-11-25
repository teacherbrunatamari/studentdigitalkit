// Banco de expressões. Formato: texto|nível|registro (F formal, N neutro, I informal)|exemplo
// Para adicionar: inclua uma linha na função desejada (ou crie "# Nova função").
const RAW = `# Showing interest
That sounds really interesting.|A2|N|That sounds really interesting. What happened next?
No way! Really?|A2|I|No way! Really? I had no idea.
How did that go?|B1|N|You had an interview yesterday. How did that go?
I'd love to hear more about it.|B1|N|You mentioned a new project. I'd love to hear more about it.
That must have been quite an experience.|B2|N|Living abroad for a year? That must have been quite an experience.
I'm intrigued. What led you to that decision?|C1|F|I'm intrigued. What led you to that decision?
# Agreeing
I agree with you.|A2|N|I agree with you. It's a good plan.
Exactly!|A2|I|Exactly! That's what I think too.
That's a good point.|B1|N|That's a good point. I hadn't thought of that.
I couldn't agree more.|B2|N|I couldn't agree more. We need more time.
I'm of the same opinion.|B2|F|I'm of the same opinion regarding the budget.
You've hit the nail on the head.|C1|N|You've hit the nail on the head. That's the real problem.
# Disagreeing politely
I'm not so sure about that.|B1|N|I'm not so sure about that. Can we check the data?
I see what you mean, but...|B1|N|I see what you mean, but I think it's too early.
That's one way to look at it, but...|B2|N|That's one way to look at it, but the numbers say otherwise.
I'd see it a bit differently.|B2|N|I'd see it a bit differently. For me, quality comes first.
I understand your point; however...|B2|F|I understand your point; however, we have a deadline.
With all due respect...|C1|F|With all due respect, I don't think that will work.
# Giving opinions
I think that...|A2|N|I think that online classes are very flexible.
In my opinion...|A2|N|In my opinion, the second option is better.
From my experience...|B1|N|From my experience, short daily practice works best.
It seems to me that...|B2|N|It seems to me that we should start earlier.
As far as I'm concerned...|B2|N|As far as I'm concerned, communication matters most.
I'm inclined to think that...|C1|F|I'm inclined to think that the risk is low.
# Asking for clarification
Sorry, could you repeat that?|A2|N|Sorry, could you repeat that? The line is bad.
What do you mean by...?|B1|N|What do you mean by "soon"?
Could you clarify that, please?|B1|N|Could you clarify that, please? I'm not sure I follow.
Do you mean that...?|B1|N|Do you mean that we should cancel it?
Just to make sure I understand...|B2|N|Just to make sure I understand, the deadline is Friday?
Could you elaborate on that?|C1|F|Could you elaborate on that last point?
# Buying time
Let me think for a second.|A2|N|Let me think for a second. I want to answer correctly.
Well, let me see...|A2|I|Well, let me see... I think it was Tuesday.
That's a good question.|B1|N|That's a good question. Let me think.
Give me a moment to think about it.|B1|N|Give me a moment to think about it.
How can I put this?|B2|N|How can I put this? It's complicated.
Let me get back to you on that.|B2|N|Let me get back to you on that tomorrow.
# Paraphrasing and describing
It's a kind of...|A2|N|It's a kind of bag you use for laptops.
What I mean is...|B1|N|What I mean is, I need more time.
Let me put it another way.|B1|N|Let me put it another way: I can't go.
It's something you use to...|B1|N|It's something you use to cut paper.
In other words...|B1|N|In other words, we need a new plan.
It's the opposite of...|B1|N|It's the opposite of expensive.
# Softening and being polite
Would you mind...?|B1|N|Would you mind closing the window?
Could you possibly...?|B1|F|Could you possibly send me the file?
I was wondering if...|B2|N|I was wondering if you could help me.
I'm afraid that...|B2|F|I'm afraid that there's a problem.
It might be better to...|B2|N|It might be better to wait until Monday.
Would it be possible to...?|B2|F|Would it be possible to reschedule?
# Declining politely
I'd love to, but I already have plans.|A2|N|I'd love to, but I already have plans.
Maybe another time?|A2|I|Thanks! Maybe another time?
Thanks for the invitation, but...|B1|N|Thanks for the invitation, but I can't make it.
I'm afraid I can't make it.|B1|N|I'm afraid I can't make it on Friday.
I'll have to pass on this one.|B2|I|I'll have to pass on this one, sorry.
Unfortunately, I won't be able to...|B2|F|Unfortunately, I won't be able to attend.
# Small talk
How's your day going?|A2|N|How's your day going so far?
What do you do?|A2|N|What do you do? I work in marketing.
Did you have a good weekend?|A2|N|Did you have a good weekend? I went to the beach.
It's been a while! How have you been?|B1|N|It's been a while! How have you been?
What have you been up to lately?|B1|I|What have you been up to lately?
How do you know the host?|B2|N|How do you know the host?
# Meetings
Shall we get started?|B1|N|Shall we get started? Everyone is here.
Let's move on to the next point.|B1|N|Let's move on to the next point.
I'd like to add something.|B1|N|I'd like to add something about the schedule.
Could we go back to...?|B2|N|Could we go back to the budget for a moment?
Let's wrap up.|B2|N|Let's wrap up. Thanks, everyone.
Let's take this offline.|C1|N|Let's take this offline and discuss it later.
# Emails
I'm writing to ask about...|B1|F|I'm writing to ask about your prices.
Please find attached...|B1|F|Please find attached the contract.
I look forward to hearing from you.|B1|F|I look forward to hearing from you.
Please let me know if you need anything else.|B1|F|Please let me know if you need anything else.
Just following up on...|B2|N|Just following up on my last email.
Thank you for your prompt reply.|B2|F|Thank you for your prompt reply.`
export type Expr = { id: string; fn: string; text: string; level: string; reg: string; ex: string }
export const REG: Record<string, string> = { F: 'Formal', N: 'Neutral', I: 'Informal' }
let cur = ''
export const EXPRS: Expr[] = RAW.split('\n').flatMap(l => {
  if (l.startsWith('# ')) { cur = l.slice(2); return [] }
  const [text, level, reg, ex] = l.split('|')
  return text ? [{ id: `${cur}:${text}`, fn: cur, text, level, reg, ex: ex ?? '' }] : []
})
export const FUNCTIONS = Array.from(new Set(EXPRS.map(e => e.fn)))
