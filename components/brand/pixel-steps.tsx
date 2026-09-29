import { cn } from "@/lib/utils"

/**
 * Stepped colour blocks, ported from um-landing: a stair of rectangles cut
 * from one polygon, so a single gradient runs through every step and they read
 * as one shape. `steps` are [width%, height%] from the anchored corner.
 */
export function PixelSteps({
  corner = "bl",
  steps = [
    [100, 38],
    [62, 70],
    [34, 100],
  ],
  from = "#caeb6b",
  to = "#99ebfa",
  className,
}: {
  corner?: "bl" | "br" | "tl" | "tr"
  steps?: number[][]
  from?: string
  to?: string
  className?: string
}) {
  const v = corner[0] === "b" ? "bottom" : "top"
  const h = corner[1] === "l" ? "left" : "right"
  const X = (p: number) => (h === "left" ? p : 100 - p)
  const Y = (p: number) => (v === "bottom" ? 100 - p : p)

  const pts = [`${X(0)}% ${Y(0)}%`]
  steps.forEach(([w, hh], i) => {
    if (i === 0) pts.push(`${X(w)}% ${Y(0)}%`)
    pts.push(`${X(w)}% ${Y(hh)}%`)
    const next = steps[i + 1]
    pts.push(next ? `${X(next[0])}% ${Y(hh)}%` : `${X(0)}% ${Y(hh)}%`)
  })

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute", className)}
      style={{
        [v]: 0,
        [h]: 0,
        clipPath: `polygon(${pts.join(",")})`,
        background: `linear-gradient(${h === "left" ? 45 : 315}deg, ${from}, ${to})`,
      }}
    />
  )
}
