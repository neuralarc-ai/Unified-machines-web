import { useSyncExternalStore } from "react"

const subscribe = (onChange: () => void) => {
  addEventListener("scroll", onChange, { passive: true })
  addEventListener("resize", onChange)
  return () => {
    removeEventListener("scroll", onChange)
    removeEventListener("resize", onChange)
  }
}

/**
 * The id of the section (from `ids`) spanning a line `offset` of the way down
 * the viewport; null when that line is in a section outside the nav, so a link
 * never stays lit over the sections that follow it.
 */
export function useActiveSection(ids: readonly string[], offset = 0.35) {
  return useSyncExternalStore(
    subscribe,
    () => {
      const line = innerHeight * offset
      for (const id of ids) {
        const r = document.getElementById(id)?.getBoundingClientRect()
        if (r && r.top <= line && r.bottom > line) return id
      }
      return null
    },
    () => null
  )
}
