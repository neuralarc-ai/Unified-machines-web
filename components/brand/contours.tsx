"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Contour lines around a stepped shape anchored in a corner: the outline of a
 * stair (like PixelSteps) repeated outward at an even spacing, every turn
 * rounded so the lines run parallel, as a contour map draws them. Measured to
 * its box so the curves stay round at any width. Decorative: sits behind content.
 *
 * `steps` are [width, height] fractions of the box from the anchored corner,
 * widths shrinking and heights growing, as in PixelSteps; the last step's
 * height is ignored, since it runs to the bottom.
 */
type Corner = "tl" | "tr" | "bl" | "br"

function contour(steps: number[][], W: number, H: number, d: number, r: number, rc: number) {
  // drawn for a top-left anchor; other corners mirror it
  const pts = steps.map(([w, h]) => [w * W, h * H])
  const R = r + d // convex turns widen outward
  const C = Math.max(0, rc - d) // concave turns tighten outward, so the lines run parallel
  let p = `M ${pts[0][0] + d} 0`
  pts.forEach(([w, h], i) => {
    const next = pts[i + 1]
    // the last step runs straight off the bottom, so every line finishes travelling down
    if (!next) {
      p += ` V ${H + 200}`
      return
    }
    // down the step's side, round its outer corner, along its foot, then round the inner corner into the next
    p += ` V ${h - r} A ${R} ${R} 0 0 1 ${w - r} ${h + d}`
    p += ` H ${next[0] + d + C} A ${C} ${C} 0 0 0 ${next[0] + d} ${h + d + C}`
  })
  return p
}

export function Contours({
  corner,
  steps,
  lines = 10,
  gap = 14,
  radius = 44,
  className,
}: {
  corner: Corner
  steps: number[][]
  lines?: number
  gap?: number
  radius?: number
  className?: string
}) {
  const ref = useRef<SVGSVGElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const flipX = corner[1] === "r"
  const flipY = corner[0] === "b"
  const W = box?.w ?? 0
  const H = box?.h ?? 0

  return (
    <svg ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)}>
      {box && (
        <g
          transform={`translate(${flipX ? W : 0} ${flipY ? H : 0}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        >
          {Array.from({ length: lines }, (_, i) => (
            <path key={i} d={contour(steps, W, H, i * gap, radius, lines * gap + 16)} />
          ))}
        </g>
      )}
    </svg>
  )
}
