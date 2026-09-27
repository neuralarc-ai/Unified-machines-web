"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { MorseMark } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Signal } from "@/components/site/signal"
import { WindowTitlebar } from "@/components/site/window-frame"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNow } from "@/hooks/use-now"
import { morse } from "@/lib/content"
import { cn } from "@/lib/utils"

const SCENE_S = 5
type Scene = (typeof morse.scenes)[number]

const pop = { type: "spring", stiffness: 320, damping: 24 } as const

/** A pretend control inside the demo: it looks like the app's button, but it's artwork, not a button. */
function Pill({ children, primary }: { children: string; primary?: boolean }) {
  return (
    <span className={cn("border border-ink px-2.5 py-1 font-mono text-xs", primary ? "bg-lime shadow-hard-sm" : "bg-card")}>
      {children}
    </span>
  )
}

/** One moment of the meeting: what was said, then what Morse did with it. */
function SceneView({ scene }: { scene: Scene }) {
  const { result } = scene
  return (
    <div className="flex flex-col gap-4">
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-[14.5px] leading-[1.45]"
      >
        <span className="text-muted-foreground">{scene.speaker}: </span>
        {scene.said}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...pop, delay: 0.9 }}
        className="border border-ink bg-card p-3.5 shadow-hard-sm"
      >
        <p className="font-mono text-xs text-muted-foreground">{result.lead}</p>
        <p className="mt-1 flex items-center gap-2 text-[17px] leading-snug font-medium tracking-[-0.01em]">
          {scene.id === "notes" && <span aria-hidden className="size-3.5 shrink-0 border border-ink bg-lime" />}
          {result.text}
        </p>
        {"done" in result && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Pill primary>Book</Pill>
            <Pill>Don&rsquo;t book</Pill>
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...pop, delay: 2.3 }}
              className="font-mono text-xs"
            >
              ✓ {result.done}
            </motion.span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

/**
 * Morse as a small live window: one meeting played through its Notes,
 * Teleprompter and Follow-up. Tours the three on its own while on screen,
 * until the visitor picks one.
 */
export function MorseDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.4 })
  const { stopped } = useMotionState()
  const [scene, setScene] = useState<string>(morse.scenes[0].id)
  const [touring, setTouring] = useState(true)
  // when the window was first seen: the recording clock counts up from there
  const [seenAt, setSeenAt] = useState<number | null>(null)
  const now = useNow()

  const index = morse.scenes.findIndex((s) => s.id === scene)
  const advance = () => setScene(morse.scenes[(index + 1) % morse.scenes.length].id)
  const showProgress = touring && inView && !stopped

  // the recording clock reads 12:04 on arrival and ticks on
  const secs = morse.startSeconds + (now && seenAt ? Math.max(0, Math.floor((now.getTime() - seenAt) / 1000)) : 0)
  const clock = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`

  return (
    <motion.div
      ref={ref}
      onViewportEnter={() => setSeenAt((t) => t ?? Date.now())}
      role="group"
      aria-label="Morse, showing one meeting through its notes, teleprompter and follow-up"
      className="border-[1.5px] border-ink bg-chalk shadow-hard-lg"
    >
      <WindowTitlebar>
        <MorseMark className="size-3.5" />
        Morse · {morse.meeting}
      </WindowTitlebar>

      <Tabs
        value={scene}
        onValueChange={(v) => {
          setTouring(false)
          setScene(v as string)
        }}
        className="gap-0"
      >
        <div className="flex flex-wrap items-end justify-between gap-x-4 border-b border-line px-4 pt-3">
          <TabsList variant="line" className="h-auto flex-wrap justify-start gap-x-5 p-0">
            {morse.scenes.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="h-auto flex-none rounded-none px-0 pb-2.5 font-mono text-xs font-medium after:bottom-[-1px]! focus-visible:ring-0"
              >
                {s.label}
                {showProgress && s.id === scene && (
                  <motion.span
                    key={scene}
                    aria-hidden
                    className="absolute inset-x-0 -bottom-px z-10 h-0.5 origin-left bg-lime-deep"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SCENE_S, ease: "linear" }}
                    onAnimationComplete={advance}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <span className="flex items-center gap-1.5 pb-2.5 font-mono text-xs tabular-nums">
            <i aria-hidden className="size-2 animate-pulse rounded-full bg-[#ff4d3d] motion-reduce:animate-none" />
            REC {clock}
          </span>
        </div>

        {morse.scenes.map((s) => (
          <TabsContent key={s.id} value={s.id} className="min-h-56 px-4 py-5">
            <SceneView scene={s} />
          </TabsContent>
        ))}
      </Tabs>

      <div className="border-t border-line px-4 py-3">
        <Signal bars={48} className="h-7" />
      </div>
    </motion.div>
  )
}
