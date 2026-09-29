"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * The contour system (2026-09-29): bundles of 8 ultra-thin parallel lines,
 * 20px apart, that enter from off-canvas, run straight, take large smooth 90°
 * turns and leave again. Each bundle is one centre path with rounded corners;
 * every line is its exact parallel offset (arcs of radius R ± offset), so the
 * spacing never pinches in a curve.
 *
 * One geometry for the whole page: bundles leave one band where the next band
 * picks them up (Morse → Friday, FAQ → footer), so it reads as one system.
 * Opaque content (the column cards, the footer blocks) simply covers them.
 */

type Pt = [number, number]
type Bundle = Pt[]
type Variant = "morse" | "friday" | "faq" | "footer"

const LINES = 8
const GAP = 20
const RADIUS = 130 // centre-line corner radius: inner line 60, outer 200
const OUT = 120 // how far bundles run past the band's edges

/**
 * Centre paths per band, in px. `e` is the gutter outside the content
 * column; `k` scales the geometry down on narrow screens. Right-hand bundles
 * are written from the right edge and mirrored.
 */
function bundles(v: Variant, W: number, H: number, e: number, k: number): Bundle[] {
  const L = (x: number) => x // from the left edge
  const R = (x: number) => W - x // from the right edge
  const edge = 40 * k // where bundles hug the page edge
  const inL = e + 170 * k // left bundles, in from the edge
  const inR = e + 420 * k // right bundles, in from the edge
  switch (v) {
    // enters top, S-bends out to the edge, runs down behind the columns
    case "morse":
      return [
        [
          [L(inL), -OUT],
          [L(inL), 170 * k],
          [L(edge), 170 * k],
          [L(edge), H + OUT],
        ],
        [
          [R(inR), -OUT],
          [R(inR), 200 * k],
          [R(edge), 200 * k],
          [R(edge), H + OUT],
        ],
      ]
    // picks the Morse bundles up at the edge, S-bends back in, runs down behind the columns
    case "friday":
      return [
        [
          [L(edge), -OUT],
          [L(edge), 330 * k],
          [L(inL), 330 * k],
          [L(inL), H + OUT],
        ],
        [
          [R(edge), -OUT],
          [R(edge), 260 * k],
          [R(inR), 260 * k],
          [R(inR), H + OUT],
        ],
      ]
    // enter from the sides, turn down, and carry on into the footer
    case "faq":
      return [
        [
          [L(-OUT), H * 0.55],
          [L(inL), H * 0.55],
          [L(inL), H + OUT],
        ],
        [
          [R(-OUT), H * 0.22],
          [R(inR * 0.55), H * 0.22],
          [R(inR * 0.55), H + OUT],
        ],
      ]
    // continue from the FAQ, bend out to the edges, run down behind the colour blocks
    case "footer":
      return [
        [
          [L(inL), -OUT],
          [L(inL), 260 * k],
          [L(edge), 260 * k],
          [L(edge), H + OUT],
        ],
        [
          [R(inR * 0.55), -OUT],
          [R(inR * 0.55), 200 * k],
          [R(edge), 200 * k],
          [R(edge), H + OUT],
        ],
      ]
  }
}

const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]]
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]]
const mul = (a: Pt, s: number): Pt => [a[0] * s, a[1] * s]
const len = (a: Pt) => Math.hypot(a[0], a[1])
const unit = (a: Pt): Pt => mul(a, 1 / (len(a) || 1))
const normal = (d: Pt): Pt => [-d[1], d[0]]
const f = (n: number) => n.toFixed(1)

/** One line of a bundle: the centre path offset by `o`, corners as exact arcs. */
function offsetPath(pts: Bundle, radius: number, o: number) {
  const dirs = pts.slice(1).map((p, i) => unit(sub(p, pts[i])))
  const start = add(pts[0], mul(normal(dirs[0]), o))
  let d = `M ${f(start[0])} ${f(start[1])}`
  for (let i = 1; i < pts.length - 1; i++) {
    const din = dirs[i - 1]
    const dout = dirs[i]
    // corners are clamped so two neighbouring turns never overlap
    const lin = len(sub(pts[i], pts[i - 1]))
    const lout = len(sub(pts[i + 1], pts[i]))
    const r = Math.min(radius, lin / (i === 1 ? 1 : 2), lout / (i === pts.length - 2 ? 1 : 2))
    const a = sub(pts[i], mul(din, r))
    const b = add(pts[i], mul(dout, r))
    const center = add(a, mul(dout, r))
    const a2 = add(a, mul(normal(din), o))
    const b2 = add(b, mul(normal(dout), o))
    const rr = len(sub(center, a2))
    const sweep = din[0] * dout[1] - din[1] * dout[0] > 0 ? 1 : 0
    d += ` L ${f(a2[0])} ${f(a2[1])} A ${f(rr)} ${f(rr)} 0 0 ${sweep} ${f(b2[0])} ${f(b2[1])}`
  }
  const end = add(pts[pts.length - 1], mul(normal(dirs[dirs.length - 1]), o))
  return `${d} L ${f(end[0])} ${f(end[1])}`
}

export function Contours({ variant, className }: { variant: Variant; className?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  let paths: string[] = []
  if (box) {
    const { w: W, h: H } = box
    const k = Math.min(1, Math.max(0.5, W / 1440))
    const e = (W - Math.min(1440, W - (W >= 768 ? 96 : 40))) / 2
    paths = bundles(variant, W, H, e, k).flatMap((pts) =>
      Array.from({ length: LINES }, (_, i) => offsetPath(pts, RADIUS * k, (i - (LINES - 1) / 2) * GAP * k))
    )
  }

  return (
    <svg
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full text-paper/[0.1]", className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}
