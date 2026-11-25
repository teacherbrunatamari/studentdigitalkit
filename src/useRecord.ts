import { useEffect, useRef, useState } from 'react'
import * as db from './db'
export function useRecord(col: string, id: string): [Record<string, any>, (k: string, v: unknown) => void] {
  const [d, setD] = useState<Record<string, any>>({}); const ref = useRef<Record<string, any>>({})
  useEffect(() => { db.list(col).then(r => { const x = r.find(i => i.id === id); if (x) { ref.current = x; setD(x) } }) }, [col, id])
  const set = (k: string, v: unknown) => { const n = { ...ref.current, [k]: v }; ref.current = n; setD(n); db.save(col, n, id) }
  return [d, set]
}
