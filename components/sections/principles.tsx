"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { Glyph } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Reveal } from "@/components/motion/reveal"
import { PanelAccordionItem } from "@/components/site/panel-accordion"
import { SectionHead } from "@/components/site/section-head"
import { WindowFrame } from "@/components/site/window-frame"
import { Accordion } from "@/components/ui/accordion"
import { useInterval } from "@/hooks/use-interval"
import { fitCanvas, INK, paintDither } from "@/lib/dither"
import { principles, type DiagramMode } from "@/lib/content"

const PIXEL = 6
const DISSOLVE_MS = 450
const ADVANCE_S = 6

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

export function Principles() {
  const section = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<string[]>([principles[0].key])
  const [active, setActive] = useState(principles[0].key)
  // tours the principles on its own until the visitor picks one
  const [touring, setTouring] = useState(true)
  const inView = useInView(section, { amount: 0.4 })
  const { stopped } = useMotionState()
  const showProgress = touring && inView && !stopped

  const advance = () => {
    const next = principles[(principles.findIndex((p) => p.key === active) + 1) % principles.length].key
    setOpen([next])
    setActive(next)
  }

  return (
    <section
      ref={section}
      id="principles"
      aria-labelledby="principles-title"
      className="container-page pt-10 pb-18 md:pb-30"
    >
      <SectionHead id="principles-title" label="How we build">
        A few strong beliefs.
        <br />A different kind of company.
      </SectionHead>

      <div className="grid items-start gap-12 lg:grid-cols-[5fr_7fr]">
        <Reveal>
          <PrinciplesWindow active={active} />
        </Reveal>

        <Reveal delay={0.1} className="lg:pt-1">
          <Accordion
            value={open}
            onValueChange={(v) => {
              // any choice by the visitor ends the tour for good
              setTouring(false)
              setOpen(v as string[])
              if (v[0]) setActive(v[0] as string)
            }}
          >
            {principles.map((p) => (
              <PanelAccordionItem
                key={p.key}
                value={p.key}
                number={p.n}
                title={p.title}
                indicator={
                  showProgress &&
                  p.key === active && (
                    <motion.span
                      key={active}
                      aria-hidden
                      className="absolute inset-y-0 -left-px w-0.5 origin-top bg-lime-deep"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: ADVANCE_S, ease: "linear" }}
                      onAnimationComplete={advance}
                    />
                  )
                }
              >
                {p.body}
              </PanelAccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
