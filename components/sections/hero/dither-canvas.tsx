"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"
import { useMotionState } from "@/components/motion/motion-provider"
import { useInterval } from "@/hooks/use-interval"
import { fitCanvas, LIME, paintDither } from "@/lib/dither"
import { cn } from "@/lib/utils"

const PIXEL = 3
const FRAME_MS = 50

function createField() {
  return {
    t: 0,
    pointer: { x: -1, y: -1, heat: 0 },
    blobs: Array.from({ length: 5 }, (_, i) => ({
      x: 0.15 + ((i * 0.19) % 0.8),
      y: 0.25 + ((i * 0.37) % 0.6),
      r: 0.16 + (i % 3) * 0.05,
      vx: (i % 2 ? 0.011 : -0.009) * (1 + i * 0.1),
      vy: ((i % 3) - 1) * 0.006,
    })),
  }
}
type Field = ReturnType<typeof createField>

function step(f: Field, dt: number) {
  f.t += dt
  for (const b of f.blobs) {
    b.x += b.vx * dt
    b.y += b.vy * dt
    if (b.x < 0.08 || b.x > 0.92) b.vx *= -1
    if (b.y < 0.12 || b.y > 0.88) b.vy *= -1
  }
  f.pointer.heat = Math.max(0, f.pointer.heat - dt * 0.8)
}

function draw(canvas: HTMLCanvasElement, f: Field) {
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const { width: w, height: h } = canvas
  const { t, pointer: p } = f
  const ar = w / h
  // metaballs that breathe and wander
  const blobs = f.blobs.map((b) => ({
    x: b.x + Math.sin(t * 0.4 + b.r * 30) * 0.03,
    y: b.y + Math.cos(t * 0.3 + b.r * 20) * 0.02,
    r: b.r * (1 + 0.12 * Math.sin(t * 0.7 + b.x * 9)),
  }))
  paintDither(
    ctx,
    w,
    h,
    LIME,
    (x, y) => {
      const fx = x / w
      const fy = y / h
      let v = 0
      for (const b of blobs) {
        const dx = (fx - b.x) * ar
        const dy = fy - b.y
        v += ((b.r * b.r) / (dx * dx + dy * dy + 0.0005)) * 0.12
      }
      if (p.heat > 0) {
        const dx = (fx - p.x) * ar
        const dy = fy - p.y
        v += (p.heat * 0.015) / (dx * dx + dy * dy + 0.004)
      }
      return Math.min(1, v * 0.55)
    },
    { alpha: 235, floor: 0.18 }
  )
}

/** Lime metaball field behind the desktop; follows the pointer. */
export function DitherCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const field = useRef(createField())
  const inView = useInView(ref)
  const { stopped } = useMotionState()

  useEffect(() => {
    const canvas = ref.current
    const surface = canvas?.parentElement
    if (!canvas || !surface) return
    const f = field.current

    const resize = new ResizeObserver(() => {
      fitCanvas(canvas, PIXEL)
      draw(canvas, f)
    })
    resize.observe(canvas)

    const move = (e: PointerEvent) => {
      const r = surface.getBoundingClientRect()
      f.pointer.x = (e.clientX - r.left) / r.width
      f.pointer.y = (e.clientY - r.top) / r.height
      f.pointer.heat = 1
    }
    const leave = () => (f.pointer.heat = 0)
    surface.addEventListener("pointermove", move)
    surface.addEventListener("pointerleave", leave)

    return () => {
      resize.disconnect()
      surface.removeEventListener("pointermove", move)
      surface.removeEventListener("pointerleave", leave)
    }
  }, [])

  useInterval(
    () => {
      if (!ref.current) return
      step(field.current, FRAME_MS / 1000)
      draw(ref.current, field.current)
    },
    inView && !stopped ? FRAME_MS : null
  )

  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none size-full [image-rendering:pixelated]", className)} />
}
