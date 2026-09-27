"use client"

import { createContext, use, useEffect, useState, type ReactNode } from "react"
import { MotionConfig, useReducedMotion } from "framer-motion"

type MotionState = {
  /** User pressed "Pause motion". */
  paused: boolean
  setPaused: (paused: boolean) => void
  /** OS-level prefers-reduced-motion. */
  reduced: boolean
  /** Either of the above: ambient loops (canvases, signals) must stop. */
  stopped: boolean
}

const MotionContext = createContext<MotionState | null>(null)

export function MotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const reduced = useReducedMotion() ?? false
  const stopped = paused || reduced

  useEffect(() => {
    document.documentElement.dataset.motion = stopped ? "paused" : "running"
  }, [stopped])

  return (
    <MotionContext value={{ paused, setPaused, reduced, stopped }}>
      <MotionConfig reducedMotion={paused ? "always" : "user"}>{children}</MotionConfig>
    </MotionContext>
  )
}

export function useMotionState() {
  const ctx = use(MotionContext)
  if (!ctx) throw new Error("useMotionState must be used inside <MotionProvider>")
  return ctx
}
