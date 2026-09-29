"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * The contour system (2026-09-29): bundles of 8 ultra-thin parallel lines,
 * 26px apart, that come in from the side edge, run flat, take large smooth
 * 90° turns down the margin and slide under the content. Each bundle is one
 * centre path with rounded corners; every line is its exact parallel offset
 * (arcs of radius R ± offset), so the spacing never pinches in a curve. Every
 * line stays on screen.
 *
 * One geometry for the whole page: bundles leave one band where the next band
 * picks them up (Morse → Friday, FAQ → footer), so it reads as one system.
 * Opaque content (the column cards, the footer blocks) simply covers them.
 * Hidden on phones, where there is no margin for it to live in.
 */

type Pt = [number, number]
type Bundle = Pt[]
type Variant = "morse" | "friday" | "faq" | "footer"

/*
 * Lines fade in from the side edges they enter by, and at a band's top or
 * bottom where the system starts or stops; where a bundle carries on into the
 * next band (Morse → Friday, FAQ → footer) the edge stays solid, so the join
 * doesn't dip.
 */
// a soft fade: short, and from 35% rather than from nothing
const FADE = { side: "110px", end: "100px", from: "rgb(0 0 0 / 0.35)" }
const fadeEnds: Record<Variant, { top: boolean; bottom: boolean }> = {
  morse: { top: true, bottom: false },
  friday: { top: false, bottom: true },
  faq: { top: true, bottom: false },
  footer: { top: false, bottom: true },
}
function mask(v: Variant) {
  const { top, bottom } = fadeEnds[v]
  const { side, end, from } = FADE
  const sides = `linear-gradient(to right, ${from}, #000 ${side}, #000 calc(100% - ${side}), ${from})`
  const ends = `linear-gradient(to bottom, ${top ? `${from}, #000 ${end}` : "#000, #000"}, ${bottom ? `#000 calc(100% - ${end}), ${from}` : "#000, #000"})`
  return { maskImage: `${sides}, ${ends}`, maskComposite: "intersect", WebkitMaskComposite: "source-in" } as const
}

const LINES = 8
const GAP = 26
const RADIUS = 150 // centre-line corner radius: inner line 59, outer 241
const OUT = 160 // how far bundles start beyond the band's edges

/**
 * Centre paths per band, in px, written for the left side (the right side is
 * the same, mirrored). As in the reference: a bundle comes in from the side
 * edge running flat, turns down in the margin, then either turns in again to
 * slide under the column cards, or runs on down into the next band.
 * `x` is the vertical run's centre, `top` where the column cards start.
 */
function leftBundles(v: Variant, W: number, H: number, x: number, top: number, k: number): Bundle[] {
  const under = W * 0.4 // far enough in to be hidden by the cards
  const flat = (y: number): Pt => [-OUT, y]
  switch (v) {
    // in from the edge, down the margin, then in under the cards; a second bundle runs on into Friday
    case "morse":
      return [
        [flat(110 * k), [x, 110 * k], [x, top + 90 * k], [under, top + 90 * k]],
        [flat(top + (H - top) * 0.5), [x, top + (H - top) * 0.5], [x, H + OUT]],
      ]
    // picks that bundle up at the top and turns it in under the cards; another comes in lower down
    case "friday":
      return [
        [
          [x, -OUT],
          [x, top + 90 * k],
          [under, top + 90 * k],
        ],
        [flat(top + (H - top) * 0.55), [x, top + (H - top) * 0.55], [x, H + OUT]],
      ]
    // the closing loop, part 1: in from the edge beside the heading, then down into the footer
    case "faq":
      return [[flat(H * 0.3), [x, H * 0.3], [x, H + OUT]]]
    // part 2: on down from the FAQ, then back out to the same edge, clear of the colour blocks
    case "footer":
      return [[[x, -OUT], [x, H * 0.3], flat(H * 0.3)]]
  }
}

// the right side sits a little higher or lower than the left, so the page doesn't read as a mirror
const rightShift: Record<Variant, (H: number, k: number) => number> = {
  morse: (_, k) => 40 * k,
  friday: (_, k) => -60 * k,
  faq: (H) => 0.32 * H, // the right loop comes in lower beside the questions...
  footer: (H) => -0.12 * H, // ...and turns back out a little sooner
}

function bundles(v: Variant, W: number, H: number, e: number, k: number): Bundle[] {
  const half = ((LINES - 1) / 2) * GAP * k
  // in the gutter when it's wide enough, otherwise as near the edge as keeps every line on screen
  const x = Math.max(half + 16 * k, e - half - 24)
  const cell = Math.min(1440, W - (W >= 768 ? 96 : 40)) / (W >= 1024 ? 18 : W >= 768 ? 12 : 6)
  const top = cell * 7 // the label strip (1 cell) and headline (6 cells) above the cards
  const dy = rightShift[v](H, k)
  const left = leftBundles(v, W, H, x, top, k)
  const right = left.map((b) => b.map(([px, py]): Pt => [W - px, py < 0 || py > H ? py : py + dy]))
  return [...left, ...right]
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
      style={mask(variant)}
      className={cn("pointer-events-none absolute inset-0 size-full text-paper/[0.1] max-md:hidden", className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  )
}
