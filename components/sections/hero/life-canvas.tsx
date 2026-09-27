"use client"

import { useEffect, useRef } from "react"
import { useInView } from "framer-motion"
import { useMotionState } from "@/components/motion/motion-provider"
import { useInterval } from "@/hooks/use-interval"

const N = 16
const SEED = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2], [9, 8], [10, 8], [11, 8], [5, 12], [6, 12], [5, 13], [6, 13]]

function seeded() {
  const cells = new Uint8Array(N * N)
  for (const [x, y] of SEED) cells[y * N + x] = 1
  return cells
}

/** One Conway generation on a wrapping N×N board. */
export function lifeStep(cells: Uint8Array) {
  const next = new Uint8Array(N * N)
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      let n = 0
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) if (dx || dy) n += cells[((y + dy + N) % N) * N + ((x + dx + N) % N)]
      const alive = cells[y * N + x]
      next[y * N + x] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0
    }
  }
  return next
}

function paint(canvas: HTMLCanvasElement | null, cells: Uint8Array) {
  const ctx = canvas?.getContext("2d")
  if (!ctx) return
  ctx.clearRect(0, 0, N, N)
  ctx.fillStyle = "#101010"
  cells.forEach((alive, i) => alive && ctx.fillRect(i % N, Math.floor(i / N), 1, 1))
}

/** Game of Life in a 16px grid. Double-click to reseed. */
export function LifeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)
  const board = useRef({ cells: seeded(), gen: 0 })
  const inView = useInView(ref)
  const { stopped } = useMotionState()

  useEffect(() => paint(ref.current, board.current.cells), [])

  useInterval(
    () => {
      const b = board.current
      b.cells = ++b.gen % 140 === 0 ? seeded() : lifeStep(b.cells)
      paint(ref.current, b.cells)
    },
    inView && !stopped ? 260 : null
  )

  return (
    <canvas
      ref={ref}
      width={N}
      height={N}
      aria-hidden
      onDoubleClick={() => {
        board.current.cells = seeded()
        paint(ref.current, board.current.cells)
      }}
      className="size-24 border border-ink bg-chalk [image-rendering:pixelated]"
    />
  )
}
