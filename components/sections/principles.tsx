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

const PIXEL = 4

function diagramField(mode: DiagramMode, w: number, h: number, phase: number) {
  const ar = w / h
  return (x: number, y: number) => {
    const fx = (x / w - 0.5) * ar
    const fy = y / h - 0.5
    const r = Math.hypot(fx, fy)
    switch (mode) {
      case "rings":
        return 0.5 + 0.5 * Math.sin(r * 34 - phase * 2) * (1 - Math.min(1, r * 1.6))
      case "grid":
        return (Math.floor(fx * 9 + phase * 0.4) + Math.floor(fy * 9)) & 1 ? 0.62 : 0.18
      case "shield":
        return Math.max(0, 1 - Math.abs(fx) * 2.6 - Math.abs(fy) * 1.6 + Math.sin(phase) * 0.05) * 0.9
      case "block":
        return Math.abs(fx) < 0.28 + Math.sin(phase) * 0.02 && Math.abs(fy) < 0.28 ? 0.7 : 0.1 + 0.1 * Math.sin(r * 40)
    }
  }
}

function drawDiagram(c: HTMLCanvasElement | null, mode: DiagramMode, phase: number) {
  const ctx = c?.getContext("2d")
  if (!c || !ctx) return
  paintDither(ctx, c.width, c.height, INK, diagramField(mode, c.width, c.height, phase))
}

function DiagramCanvas({ mode }: { mode: DiagramMode }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const phase = useRef(0)
  const inView = useInView(ref)
  const { stopped } = useMotionState()

  // observing fires once immediately, so this also repaints on every mode change
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ro = new ResizeObserver(() => {
      fitCanvas(c, PIXEL)
      drawDiagram(c, mode, phase.current)
    })
    ro.observe(c)
    return () => ro.disconnect()
  }, [mode])

  useInterval(
    () => {
      phase.current += 0.12
      drawDiagram(ref.current, mode, phase.current)
    },
    inView && !stopped ? 120 : null
  )

  return <canvas ref={ref} aria-hidden className="block aspect-[1/0.8] w-full bg-paper [image-rendering:pixelated]" />
}

const glyphPose: Record<string, { scale?: number; y?: string; rotate?: number }> = {
  intelligence: {},
  useful: { scale: 1.08 },
  sovereign: { y: "-6%" },
  whole: { rotate: 90 },
}

export function Principles() {
  const [active, setActive] = useState(principles[0].key)
  const diagram = principles.find((p) => p.key === active)!.diagram

  return (
    <section id="principles" aria-labelledby="principles-title" className="container-page pt-10 pb-18 md:pb-30">
      <SectionHead id="principles-title" label="How we build">
        A few strong beliefs.
        <br />A different kind of company.
      </SectionHead>

      <div className="grid items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <WindowFrame title={diagram.file} bodyClassName="relative gap-0 p-0">
            <DiagramCanvas mode={diagram.mode} />
            <motion.div
              aria-hidden
              className="absolute top-[46%] left-1/2 size-[22%] -translate-1/2"
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
            <div className="flex justify-between border-t-[1.5px] border-ink bg-chalk px-3 py-2 font-mono text-xs">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {diagram.caption}
                </motion.span>
              </AnimatePresence>
              <span>{diagram.code}</span>
            </div>
          </WindowFrame>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion defaultValue={[principles[0].key]} onValueChange={(v) => v[0] && setActive(v[0] as string)}>
            {principles.map((p) => (
              <PanelAccordionItem key={p.key} value={p.key} title={p.title}>
                {p.body}
              </PanelAccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
