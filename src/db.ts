export type Rec = { id: string; collection: string; createdAt: string; updatedAt: string; [k: string]: unknown }
const DB = 'student-digital-kit', STORE = 'records'
let dbp: Promise<IDBDatabase> | null = null
const open = () => (dbp ??= new Promise((res, rej) => {
  const r = indexedDB.open(DB, 1)
  r.onupgradeneeded = () => { const s = r.result.createObjectStore(STORE, { keyPath: 'id' }); s.createIndex('collection', 'collection') }
  r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error)
}))
const tx = async <T,>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>) => {
  const db = await open()
  return new Promise<T>((res, rej) => { const q = fn(db.transaction(STORE, mode).objectStore(STORE)); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error) })
}
export const list = (c: string) => tx<Rec[]>('readonly', s => s.index('collection').getAll(c) as IDBRequest<Rec[]>)
export const save = (c: string, data: Record<string, unknown>, id?: string) => {
  const now = new Date().toISOString()
  const rec = { createdAt: now, ...data, id: id ?? crypto.randomUUID(), collection: c, updatedAt: now } as Rec
  return tx('readwrite', s => s.put(rec)).then(() => rec)
}
export const remove = (id: string) => tx('readwrite', s => s.delete(id))
export const clearAll = () => tx('readwrite', s => s.clear())
export const exportAll = async () => JSON.stringify({ app: 'student-digital-kit', version: 1, exportedAt: new Date().toISOString(), records: await tx<Rec[]>('readonly', s => s.getAll()) }, null, 2)
export const importAll = async (text: string) => {
  const d = JSON.parse(text)
  if (d?.app !== 'student-digital-kit' || !Array.isArray(d.records)) throw new Error('Arquivo inválido')
  const ok = (d.records as Rec[]).filter(r => r && typeof r.id === 'string' && typeof r.collection === 'string')
  for (const r of ok) await tx('readwrite', s => s.put(r))
  return ok.length
}
export const COLLECTIONS = ['vocabulary','grammar','mistakes','log','planner','profile','reflections'] as const
