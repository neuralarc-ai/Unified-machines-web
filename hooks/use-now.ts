import { useSyncExternalStore } from "react"

/**
 * Current time, refreshed every `ms`. `null` during SSR and hydration so
 * server and client markup always match.
 */
export function useNow(ms = 1000) {
  const stamp = useSyncExternalStore(
    (onTick) => {
      const id = setInterval(onTick, ms)
      return () => clearInterval(id)
    },
    () => Math.floor(Date.now() / ms),
    () => null
  )
  return stamp === null ? null : new Date(stamp * ms)
}
