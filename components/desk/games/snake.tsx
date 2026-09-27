"use client"

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react"
import { best, COLORS, drawGlyph, GameCanvas, HUD_FONT, useGameCanvas, type GameProps, type GameStatus } from "./shared"

const CELL = 18
const COLS = 30
const ROWS = 12
const W = CELL * COLS
const H = CELL * ROWS
const TICK_MS = 115

type Point = [number, number]

const KEYS: Record<string, Point> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
}

const freshGame = () => ({
  body: [[6, 5], [5, 5], [4, 5]] as Point[],
  dir: [1, 0] as Point,
  next: [1, 0] as Point,
  food: [18, 5] as Point,
  score: 0,
  status: "ready" as GameStatus,
})

const same = (a: Point, b: Point) => a[0] === b[0] && a[1] === b[1]

/** Grow by eating hearts; the board wraps at the edges. */
export function Snake({ onScore }: GameProps) {
  const [canvasRef, setup] = useGameCanvas(W, H)
  const [status, setStatus] = useState<GameStatus>("ready")
  const sim = useRef(freshGame())
  const report = useEffectEvent(onScore)

  /** Steer; any direction starts a new game when not running. */
  const turn = useCallback((d: Point) => {
    const s = sim.current
    if (s.status !== "run") {
      sim.current = { ...freshGame(), status: "run" }
      setStatus("run")
    } else if (d[0] !== -s.dir[0] || d[1] !== -s.dir[1]) {
      s.next = d
    }
  }, [])

  useEffect(() => {
    const ctx = setup()
    let visible = true

    const draw = () => {
      const s = sim.current
      ctx.fillStyle = COLORS.paper
      ctx.fillRect(0, 0, W, H)
      ctx.fillStyle = "rgba(16,16,16,.18)"
      for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) ctx.fillRect(x * CELL + CELL / 2, y * CELL + CELL / 2, 1, 1)
      drawGlyph(ctx, "heart", s.food[0] * CELL + 2, s.food[1] * CELL + 2, 2.8, COLORS.pink)
      s.body.forEach(([x, y], i) => {
        ctx.fillStyle = i === 0 ? COLORS.ink : "#2a2a2a"
        ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
        if (i === 0) {
          // lime eyes on the head
          ctx.fillStyle = COLORS.lime
          ctx.fillRect(x * CELL + 5, y * CELL + 5, 3, 3)
          ctx.fillRect(x * CELL + 10, y * CELL + 5, 3, 3)
        }
      })
      ctx.font = HUD_FONT
      ctx.fillStyle = COLORS.ink
      ctx.textAlign = "center"
      if (s.status === "ready") ctx.fillText("ARROWS / SWIPE TO START", W / 2, H - 16)
      if (s.status === "over") ctx.fillText(`GAME OVER · ${s.score} · ANY ARROW`, W / 2, H - 16)
    }

    const tick = () => {
      const s = sim.current
      if (!visible || s.status !== "run") return draw()
      s.dir = s.next
      const head: Point = [(s.body[0][0] + s.dir[0] + COLS) % COLS, (s.body[0][1] + s.dir[1] + ROWS) % ROWS]
      if (s.body.some((p) => same(p, head))) {
        s.status = "over"
        setStatus("over")
        best.set("snake", Math.max(best.get("snake"), s.score))
        return draw()
      }
      s.body.unshift(head)
      if (same(head, s.food)) {
        s.score++
        do s.food = [Math.floor(Math.random() * COLS), Math.floor(Math.random() * ROWS)]
        while (s.body.some((p) => same(p, s.food)))
      } else {
        s.body.pop()
      }
      report(`${s.score} · best ${Math.max(best.get("snake"), s.score)}`)
      draw()
    }

    const timer = setInterval(tick, TICK_MS)
    draw()
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(canvasRef.current!)
    return () => {
      clearInterval(timer)
      io.disconnect()
    }
  }, [setup, canvasRef])

  return (
    <GameCanvas
      canvasRef={canvasRef}
      w={W}
      label="Snake. Use the arrow keys or swipe to steer toward the hearts."
      status={status}
      onKey={(key) => {
        if (!KEYS[key]) return false
        turn(KEYS[key])
        return true
      }}
      onSwipe={turn}
      onPress={() => sim.current.status !== "run" && turn([1, 0])}
    />
  )
}
