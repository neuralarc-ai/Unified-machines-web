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
 * The id of the last section (from `ids`, in page order) whose top has crossed
 * a line `offset` of the way down the viewport; null above the first one.
 */
export function useActiveSection(ids: readonly string[], offset = 0.35) {
  return useSyncExternalStore(
    subscribe,
    () => {
      let active: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= innerHeight * offset) active = id
      }
      return active
    },
    () => null
  )
}
