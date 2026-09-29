"use client"

import { useMotionState } from "@/components/motion/motion-provider"

/** The footer's "Pause motion" control: the only interactive part of the footer. */
export function MotionToggle({ className }: { className?: string }) {
  const { paused, setPaused, reduced } = useMotionState()
  return (
    <button
      type="button"
      aria-pressed={paused || reduced}
      disabled={reduced}
      onClick={() => setPaused(!paused)}
      className={`${className ?? ""} aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}
    </button>
  )
}
