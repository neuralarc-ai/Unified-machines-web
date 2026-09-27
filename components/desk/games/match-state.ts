/**
 * Match's rules as a pure reducer: flip two cards, keep pairs, fewest moves
 * wins. Shuffling happens outside (`deal()`), so the reducer stays deterministic.
 */

export type Face = { symbol: "human" | "machine" | "heart"; pink: boolean }
export type Card = Face & { id: number; key: string }

const FACES: Face[] = (["human", "machine", "heart"] as const).flatMap((symbol) => [
  { symbol, pink: false },
  { symbol, pink: true },
])
export const PAIRS = FACES.length
export const MISS_MS = 800 // how long a wrong pair stays up, unless the next click clears it

/** Twelve cards, Fisher–Yates shuffled. */
export function deal(rand: () => number = Math.random): Card[] {
  const cards = [...FACES, ...FACES].map((f, id) => ({ ...f, id, key: `${f.symbol}-${f.pink}` }))
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

export type State = {
  cards: Card[]
  /** Face-up cards not yet matched: 0, 1, or a wrong pair of 2 waiting to flip back. */
  open: number[]
  matched: string[]
  moves: number
  startedAt: number | null
  finishedAt: number | null
  /** Fewest moves on this device (0 = none yet), and whether this game beat it. */
  best: number
  newBest: boolean
  /** Outcome of the latest pair, for feedback and announcements. */
  last: { result: "match" | "miss"; cards: [number, number]; move: number } | null
  /** Increments on every deal, so cards can re-animate in. */
  round: number
}

export type Action =
  | { type: "flip"; index: number; now: number }
  | { type: "hide" }
  | { type: "deal"; cards: Card[] }

export const initState = (cards: Card[], best: number): State => ({
  cards,
  open: [],
  matched: [],
  moves: 0,
  startedAt: null,
  finishedAt: null,
  best,
  newBest: false,
  last: null,
  round: 0,
})

export const isWon = (s: State) => s.matched.length === PAIRS

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "deal":
      return { ...initState(a.cards, s.best), round: s.round + 1 }

    case "hide":
      return s.open.length === 2 ? { ...s, open: [] } : s

    case "flip": {
      const card = s.cards[a.index]
      if (!card || isWon(s) || s.matched.includes(card.key)) return s
      // a third click clears a waiting wrong pair at once instead of being ignored
      const open = s.open.length === 2 ? [] : s.open
      if (open.includes(a.index)) return s
      const startedAt = s.startedAt ?? a.now
      if (open.length === 0) return { ...s, open: [a.index], startedAt }

      const first = open[0]
      const moves = s.moves + 1
      const pair: [number, number] = [first, a.index]
      if (s.cards[first].key !== card.key) {
        return { ...s, open: pair, moves, startedAt, last: { result: "miss", cards: pair, move: moves } }
      }
      const matched = [...s.matched, card.key]
      const won = matched.length === PAIRS
      const newBest = won && (s.best === 0 || moves < s.best)
      return {
        ...s,
        open: [],
        matched,
        moves,
        startedAt,
        finishedAt: won ? a.now : null,
        best: newBest ? moves : s.best,
        newBest,
        last: { result: "match", cards: pair, move: moves },
      }
    }
  }
}
