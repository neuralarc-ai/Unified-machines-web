"use client"

import { useEffect, useEffectEvent, useReducer, useRef, useState, type KeyboardEvent } from "react"
import { motion, stagger, useAnimate } from "framer-motion"
import { Glyph } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNow } from "@/hooks/use-now"
import { cn } from "@/lib/utils"
import { deal, initState, isWon, MISS_MS, PAIRS, reducer, type Card } from "./match-state"
import { best, type GameProps } from "./shared"

const COLS = 6
const flipSpring = { type: "spring", stiffness: 260, damping: 22 } as const
const describe = (c: Card) => `${c.symbol}, ${c.pink ? "pink" : "black"}`
const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

// Confetti directions, spread evenly with a deterministic wobble (no randomness during render).
const CONFETTI = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2 + Math.sin(i * 12.9898) * 0.3
  const dist = 90 + ((Math.sin(i * 78.233) + 1) / 2) * 90
  return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist * 0.6 - 30, rotate: (i % 2 ? 1 : -1) * (90 + i * 13), color: ["bg-lime", "bg-pink", "bg-ink"][i % 3] }
})

function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          className={cn("absolute size-2", c.color)}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: c.x, y: [0, c.y, c.y + 70], opacity: [1, 1, 0], rotate: c.rotate }}
          transition={{ duration: 1.3, ease: "easeOut" }}
        />
      ))}
    </div>
  )
}

/** Find the pairs among twelve cards. Fewest moves wins. */
export function Match({ onScore }: GameProps) {
  const [s, dispatch] = useReducer(reducer, null, () => initState(deal(), best.get("match")))
  const [focus, setFocus] = useState(0)
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const { reduced } = useMotionState()
  const now = useNow()
  const won = isWon(s)

  const elapsed = s.startedAt === null ? 0 : (s.finishedAt ?? now?.getTime() ?? s.startedAt) - s.startedAt
  const moves = `${s.moves} ${s.moves === 1 ? "move" : "moves"}`
  const label = won
    ? `done in ${moves} · ${clock(elapsed)}${s.newBest ? " · new best" : ` · best ${s.best}`}`
    : `${moves} · ${clock(elapsed)}`

  const report = useEffectEvent(onScore)
  useEffect(() => report(label), [label])

  // a wrong pair flips back on its own; the effect owns the timer, so reset or close cancels it
  useEffect(() => {
    if (s.open.length !== 2) return
    const t = setTimeout(() => dispatch({ type: "hide" }), MISS_MS)
    return () => clearTimeout(t)
  }, [s.open])

  useEffect(() => {
    if (s.best) best.set("match", s.best)
  }, [s.best])

  // feedback on each pair: a wrong pair shakes, a right one pops; winning sends a wave through the grid
  useEffect(() => {
    if (!s.last || reduced) return
    const targets = s.last.cards.map((i) => `[data-fx="${i}"]`).join(",")
    if (s.last.result === "miss") animate(targets, { x: [0, -6, 6, -4, 4, 0] }, { duration: 0.4, delay: 0.3 })
    else animate(targets, { scale: [1, 1.14, 1] }, { duration: 0.35, delay: 0.2 })
    if (won) animate("[data-fx]", { y: [0, -8, 0] }, { duration: 0.4, delay: stagger(0.05, { startDelay: 0.45 }) })
  }, [s.last, won, reduced, animate])

  const redeal = () => {
    dispatch({ type: "deal", cards: deal() })
    setFocus(0)
  }

  // arrow keys move across the 6×2 grid (roving tabindex); space/enter flip, as buttons do
  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const next = {
      ArrowLeft: i - 1,
      ArrowRight: i + 1,
      ArrowUp: i - COLS,
      ArrowDown: i + COLS,
      Home: 0,
      End: s.cards.length - 1,
    }[e.key]
    if (next === undefined || next < 0 || next >= s.cards.length) return
    e.preventDefault()
    setFocus(next)
    cardRefs.current[next]?.focus()
  }

  const announcement = won
    ? `Solved in ${moves}${s.newBest ? ", a new best" : ""}.`
    : s.last
      ? s.last.result === "match"
        ? `Match: ${describe(s.cards[s.last.cards[0]])}.`
        : "No match."
      : ""

  return (
    <div className="p-3">
      <div ref={scope} className="relative">
        <div role="group" aria-label="Match the pairs" className="grid min-w-75 grid-cols-6 gap-2">
          {s.cards.map((c, i) => {
            const done = s.matched.includes(c.key)
            const shown = done || s.open.includes(i)
            return (
              <motion.button
                key={`${s.round}-${c.id}`}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                type="button"
                tabIndex={i === focus ? 0 : -1}
                aria-label={`Card ${i + 1}: ${shown ? describe(c) : "hidden"}`}
                aria-disabled={done || undefined}
                onClick={() => dispatch({ type: "flip", index: i, now: Date.now() })}
                onFocus={() => setFocus(i)}
                onKeyDown={(e) => onKeyDown(e, i)}
                initial={{ opacity: 0, y: -14, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 26, delay: i * 0.035 }}
                className="group relative aspect-square perspective-near focus-visible:z-10"
              >
                <span data-fx={i} className="absolute inset-0 block">
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ rotateY: shown ? -180 : 0 }}
                    transition={flipSpring}
                    className="absolute inset-0 border border-border bg-ink [background-image:radial-gradient(rgba(241,240,238,.25)_.8px,transparent_.9px)] [background-size:6px_6px] transition-[translate] backface-hidden group-hover:not-aria-disabled:-translate-y-0.5"
                  />
                  <motion.span
                    aria-hidden
                    initial={false}
                    animate={{ rotateY: shown ? 0 : 180 }}
                    transition={flipSpring}
                    className={cn(
                      "absolute inset-0 grid place-items-center border border-border backface-hidden transition-colors duration-300",
                      done ? "bg-lime" : "bg-chalk",
                      c.pink ? "text-pink" : "text-ink"
                    )}
                  >
                    <Glyph symbol={c.symbol} className="size-8" />
                  </motion.span>
                </span>
              </motion.button>
            )
          })}
        </div>
        {won && !reduced && <Confetti key={s.round} />}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[14.5px]">
        <span className="flex items-center gap-2">
          {won ? `Solved · ${moves}` : `${s.matched.length}/${PAIRS} pairs`}
          {won && s.newBest && (
            <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", delay: 0.5 }}>
              <Badge variant="tag" className="bg-lime text-ink">
                new best
              </Badge>
            </motion.span>
          )}
        </span>
        <Button
          variant={won ? "accent" : "outline"}
          size="sm"
          onClick={redeal}
          className="rounded-none font-mono text-[14.5px] font-medium uppercase"
        >
          Deal again
        </Button>
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}
