"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { Glyph } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Reveal } from "@/components/motion/reveal"
import { bodyLg, SectionHead } from "@/components/site/section-head"
import { WindowFrame } from "@/components/site/window-frame"
import { useInterval } from "@/hooks/use-interval"
import { fitCanvas, INK, paintDither } from "@/lib/dither"
import { principles, type DiagramMode } from "@/lib/content"
import { cn } from "@/lib/utils"

const PIXEL = 6
const DISSOLVE_MS = 450

type Field = (fx: number, fy: number, r: number) => number

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function field(mode: DiagramMode, phase: number): Field {
  switch (mode) {
    case "rings":
      return (_, __, r) => 0.5 + 0.5 * Math.sin(r * 34 - phase * 2) * (1 - Math.min(1, r * 1.6))
    case "grid":
      return (fx, fy) => ((Math.floor(fx * 9 + phase * 0.4) + Math.floor(fy * 9)) & 1 ? 0.62 : 0.18)
    case "line":
      return heldLine(phase)
    case "squares":
      return squaredRings(phase)
  }
}

const LINE_Y = 0.3 // just below the glyph's clear disc

/**
 * Sovereign, "held line": pressure rolls down toward a solid line and bunches
 * up as it presses against it (the wavelength shrinks near the line). The
 * line doesn't move; below it stays calm.
 */
function heldLine(phase: number): Field {
  return (_, fy) => {
    const above = LINE_Y - fy
    if (above <= 0 && above > -0.035) return 1 // the line
    if (above <= 0) return 0.36 // the calm side: a sparse, still texture that never moves
    if (above < 0.025) return 0 // a hairline of paper, so the line reads apart from the waves on it
    const pressure = 1 - Math.min(1, above * 1.3) // strongest against the line
    return 0.5 + 0.5 * Math.sin(Math.sqrt(above) * 38 - phase * 3) * (0.35 + 0.65 * pressure)
  }
}

/**
 * Built to last, "squared rings": the intelligence rings redrawn as
 * concentric squares, spreading slowly outward like layers laid down.
 */
function squaredRings(phase: number): Field {
  return (fx, fy) => {
    const m = Math.max(Math.abs(fx), Math.abs(fy)) // square distance
    return 0.5 + 0.5 * Math.sin(m * 30 - phase * 1.2) * (1 - Math.min(1, m * 1.4))
  }
}

/** Stable per-pixel noise, used as the order pixels switch in during a dissolve. */
const noise = (x: number, y: number) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return n - Math.floor(n)
}

type Diagram = { mode: DiagramMode; from: DiagramMode; t: number; phase: number }

function drawDiagram(c: HTMLCanvasElement | null, d: Diagram) {
  const ctx = c?.getContext("2d")
  if (!c || !ctx) return
  const { width: w, height: h } = c
  const ar = w / h
  const next = field(d.mode, d.phase)
  const prev = field(d.from, d.phase)
  paintDither(ctx, w, h, INK, (x, y) => {
    const fx = (x / w - 0.5) * ar
    const fy = y / h - 0.5
    const r = Math.hypot(fx, fy)
    const v = (d.t >= 1 || noise(x, y) < d.t ? next : prev)(fx, fy, r)
    // more contrast (fewer grey checkers), and a clear disc so the glyph reads
    return clamp01((v - 0.5) * 1.7 + 0.5) * clamp01((r - 0.21) / 0.07)
  })
}

function DiagramCanvas({ mode }: { mode: DiagramMode }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const diagram = useRef<Diagram>({ mode, from: mode, t: 1, phase: 0 })
  const inView = useInView(ref)
  const { stopped } = useMotionState()

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ro = new ResizeObserver(() => {
      fitCanvas(c, PIXEL)
      drawDiagram(c, diagram.current)
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [])

  // a new mode dissolves in pixel by pixel; with motion off it cuts
  useEffect(() => {
    const d = diagram.current
    if (d.mode === mode) return
    Object.assign(d, { from: d.mode, mode, t: stopped ? 1 : 0 })
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      d.t = Math.min(1, d.t + (now - last) / DISSOLVE_MS)
      last = now
      drawDiagram(ref.current, d)
      if (d.t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mode, stopped])

  useInterval(
    () => {
      diagram.current.phase += 0.12
      drawDiagram(ref.current, diagram.current)
    },
    inView && !stopped ? 120 : null
  )

  return <canvas ref={ref} aria-hidden className="block aspect-[5/4] w-full bg-paper [image-rendering:pixelated]" />
}

const glyphPose: Record<string, { scale?: number; y?: string; rotate?: number }> = {
  intelligence: {},
  useful: { scale: 1.08 },
  sovereign: { y: "-6%" },
  whole: { rotate: 90 },
}

/** The diagram window: a live dither field for the active principle, its glyph and caption. */
export function PrinciplesWindow({ active }: { active: string }) {
  const diagram = principles.find((p) => p.key === active)!.diagram
  return (
    <WindowFrame title={diagram.file} bodyClassName="gap-0 p-0">
      <div className="relative">
        <DiagramCanvas mode={diagram.mode} />
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[22%] -translate-1/2"
          animate={{ scale: 1, y: 0, rotate: 0, ...glyphPose[active] }}
          transition={{ type: "spring", stiffness: 180, damping: 16 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={diagram.symbol}
              className="size-full"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              <Glyph symbol={diagram.symbol} className="size-full" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="flex justify-between gap-3 border-t-[1.5px] border-ink bg-chalk px-3 py-2 font-mono text-xs">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {diagram.caption}
          </motion.span>
        </AnimatePresence>
        <span className="shrink-0 whitespace-nowrap">{diagram.code}</span>
      </div>
    </WindowFrame>
  )
}

/**
 * How we build (option B, chosen 2026-09-29): the four principles as one
 * strip of tabs; the chosen one is told in full beside the diagram window.
 */
export function Principles() {
  const [i, setI] = useState(0)
  const p = principles[i]
  const next = principles[(i + 1) % principles.length]
  return (
    <section id="principles" aria-labelledby="principles-title" className="container-page pt-10 pb-18 md:pb-30">
      <SectionHead id="principles-title" label="How we build">
        A few strong beliefs.
        <br />A different kind of company.
      </SectionHead>

      <Reveal
        role="tablist"
        aria-label="Principles"
        className="mb-10 grid border-[1.5px] border-ink bg-chalk shadow-hard-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        {principles.map((q, k) => (
          <button
            key={q.key}
            id={`principle-tab-${q.key}`}
            role="tab"
            aria-selected={k === i}
            aria-controls="principle-panel"
            onClick={() => setI(k)}
            className={cn(
              "flex items-baseline gap-3 border-ink px-5 py-4 text-left transition-colors not-last:border-b sm:nth-[odd]:border-r lg:border-b-0 lg:not-last:border-r",
              k === i ? "bg-ink text-paper" : "hover:bg-lime-soft"
            )}
          >
            <span className={cn("font-mono text-xs", k === i ? "text-lime" : "text-muted-foreground")}>{q.n}</span>
            <span className="text-lg font-medium tracking-[-0.02em]">{q.title}</span>
          </button>
        ))}
      </Reveal>

      <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <Reveal>
          <PrinciplesWindow active={p.key} />
        </Reveal>
        <div id="principle-panel" role="tabpanel" aria-labelledby={`principle-tab-${p.key}`} aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-mono text-xs text-muted-foreground">{p.n} / 04</p>
              <h3 className="mt-4 text-[clamp(38px,3.6vw,56px)]">{p.title}</h3>
              <p className={cn(bodyLg, "mt-6 max-w-[46ch] text-ink-soft")}>{p.body}</p>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={() => setI((i + 1) % principles.length)}
            className="mt-10 inline-flex h-11 items-center gap-3 border-[1.5px] border-ink bg-chalk px-4 font-mono text-sm shadow-hard-sm transition-[translate,box-shadow] hover:-translate-px hover:shadow-hard"
          >
            Next: {next.title} →
          </button>
        </div>
      </div>
    </section>
  )
}
