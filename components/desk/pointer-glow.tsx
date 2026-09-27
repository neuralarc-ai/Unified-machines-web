"use client"

import { useEffect, useEffectEvent, useRef, type RefObject } from "react"
import { useMotionState } from "@/components/motion/motion-provider"
import { fitCanvas, LIME, paintDither } from "@/lib/dither"

const CELL = 3
const FRAME_MS = 33

/**
 * A lime dither halo that follows the pointer over `host` and fades out when
 * it leaves. Draws only while lit, at most 30fps, on a 1/3-resolution canvas.
 */
export function PointerGlow({
  host,
  radius = 130,
  strength = 0.9,
}: {
  host: RefObject<HTMLElement | null>
  radius?: number
  strength?: number
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { stopped } = useMotionState()
  const isStopped = useEffectEvent(() => stopped)

  useEffect(() => {
    const canvas = ref.current
    const box = host.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !box || !ctx) return

    const pointer = { x: -999, y: -999 }
    let inside = false
    let amp = 0
    let raf = 0
    let last = 0

    const draw = () =>
      paintDither(
        ctx,
        canvas.width,
        canvas.height,
        LIME,
        (cx, cy) => {
          const d = Math.hypot(cx * CELL - pointer.x, cy * CELL - pointer.y)
          return d < radius ? (1 - d / radius) ** 1.5 * amp * strength : 0
        },
        { floor: 0.04 }
      )

    const tick = (now: number) => {
      raf = 0
      if (now - last >= FRAME_MS) {
        amp += ((inside ? 1 : 0) - amp) * (inside ? 0.18 : 0.12)
        draw()
        last = now
      }
      if (inside || amp > 0.01) raf = requestAnimationFrame(tick)
      else {
        amp = 0
        draw()
      }
    }
    const kick = () => {
      if (!raf && !isStopped()) raf = requestAnimationFrame(tick)
    }

    const move = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      inside = true
      kick()
    }
    const leave = () => {
      inside = false
      kick()
    }

    const ro = new ResizeObserver(() => fitCanvas(canvas, CELL))
    ro.observe(canvas)
    box.addEventListener("pointermove", move)
    box.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      box.removeEventListener("pointermove", move)
      box.removeEventListener("pointerleave", leave)
    }
  }, [host, radius, strength])

  return (
    <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full [image-rendering:pixelated]" />
  )
}
