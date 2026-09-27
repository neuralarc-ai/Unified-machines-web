import { useEffect, useEffectEvent } from "react"

/** setInterval that always calls the latest callback; pass `null` to stop. */
export function useInterval(callback: () => void, ms: number | null) {
  const tick = useEffectEvent(callback)
  useEffect(() => {
    if (ms === null) return
    const id = setInterval(() => tick(), ms)
    return () => clearInterval(id)
  }, [ms])
}
