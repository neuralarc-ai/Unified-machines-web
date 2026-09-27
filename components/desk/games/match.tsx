"use client"

import { useEffect, useEffectEvent, useState } from "react"
import { motion } from "framer-motion"
import { Glyph } from "@/components/brand/symbols"
import { Button } from "@/components/ui/button"
import type { SymbolKey } from "@/lib/content"
import { cn } from "@/lib/utils"
import { best, type GameProps } from "./shared"

const FACES: { symbol: SymbolKey; pink: boolean }[] = (["human", "machine", "heart"] as const).flatMap((symbol) => [
  { symbol, pink: false },
  { symbol, pink: true },
])
const PAIRS = FACES.length

/** Twelve cards, Fisher–Yates shuffled. Games only mount on the client, so no hydration concern. */
function deal() {
  const cards = [...FACES, ...FACES].map((f, id) => ({ ...f, id, key: `${f.symbol}-${f.pink}` }))
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

const flipSpring = { type: "spring", stiffness: 260, damping: 22 } as const

/** Find the pairs among twelve cards. Fewest moves wins. */
export function Match({ onScore }: GameProps) {
  const [cards, setCards] = useState(deal)
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [moves, setMoves] = useState(0)
  const won = matched.length === PAIRS

  const report = useEffectEvent(onScore)
  useEffect(() => {
    report(won ? `done in ${moves} · best ${best.get("match") || moves}` : `${moves} ${moves === 1 ? "move" : "moves"}`)
  }, [moves, won])

  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || matched.includes(cards[i].key)) return
    const next = [...open, i]
    setOpen(next)
    if (next.length < 2) return

    const move = moves + 1
    const hit = cards[next[0]].key === cards[next[1]].key
    setMoves(move)
    if (hit && matched.length + 1 === PAIRS) {
      const prev = best.get("match")
      best.set("match", prev ? Math.min(prev, move) : move)
    }
    setTimeout(
      () => {
        if (hit) setMatched((m) => [...m, cards[next[0]].key])
        setOpen([])
      },
      hit ? 250 : 700
    )
  }

  const reset = () => {
    setCards(deal())
    setOpen([])
    setMatched([])
    setMoves(0)
  }

  return (
    <div className="p-3">
      <div role="group" aria-label="Match the pairs" className="grid min-w-75 grid-cols-6 gap-2">
        {cards.map((c, i) => {
          const done = matched.includes(c.key)
          const shown = open.includes(i) || done
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => flip(i)}
              aria-label={shown ? `${c.symbol}, ${c.pink ? "pink" : "black"}` : "Hidden card"}
              className="group relative aspect-square perspective-near"
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 border border-border bg-ink [background-image:radial-gradient(rgba(241,240,238,.25)_.8px,transparent_.9px)] backface-hidden [background-size:6px_6px] group-hover:not-data-shown:-translate-y-0.5"
                data-shown={shown || undefined}
                animate={{ rotateY: shown ? -180 : 0 }}
                transition={flipSpring}
              />
              <motion.span
                aria-hidden
                className={cn(
                  "absolute inset-0 grid place-items-center border border-border backface-hidden",
                  done ? "bg-lime" : "bg-chalk",
                  c.pink ? "text-pink" : "text-ink"
                )}
                initial={false}
                animate={{ rotateY: shown ? 0 : 180 }}
                transition={flipSpring}
              >
                <Glyph symbol={c.symbol} className="size-8" />
              </motion.span>
            </button>
          )
        })}
      </div>
      {won && (
        <Button variant="accent" className="mt-3 w-full rounded-none font-mono uppercase" onClick={reset}>
          Deal again
        </Button>
      )}
    </div>
  )
}
