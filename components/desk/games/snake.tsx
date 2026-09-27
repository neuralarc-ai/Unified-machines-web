"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import { useMotionState } from "@/components/motion/motion-provider"
import { banner, best, COLORS, drawGlyph, GameCanvas, hud, HUD_FONT, PARTICLE, TITLE_FONT, useGameCanvas, type GameProps } from "./shared"
import {
  CELL,
  COLS,
  createWorld,
  H,
  isLive,
  LOCKOUT,
  pause,
  progress,
  ROWS,
  step,
  STEP_MS,
  turn,
  W,
  type Point,
  type Status,
  type World,
} from "./snake-sim"

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

/** Where segment `i` sits right now: between its last cell and its current one. Wrapping snaps. */
function segmentAt(w: World, i: number, t: number): Point {
  const to = w.body[i]
  const from = w.prev[i] ?? to
  if (Math.abs(to[0] - from[0]) > 1 || Math.abs(to[1] - from[1]) > 1) return to
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]
}

function render(ctx: CanvasRenderingContext2D, w: World) {
  ctx.save()
  if (w.shake > 0) ctx.translate((Math.random() - 0.5) * w.shake * 0.7, (Math.random() - 0.5) * w.shake * 0.5)
  ctx.fillStyle = COLORS.paper
  ctx.fillRect(-10, -10, W + 20, H + 20)

  // the board's dot grid
  ctx.fillStyle = "rgba(16,16,16,.18)"
  for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS; y++) ctx.fillRect(x * CELL + CELL / 2, y * CELL + CELL / 2, 1, 1)

  // food breathes; the bonus blinks for its last 1.5s
  const beat = 1 + Math.sin(w.t * 0.15) * 0.08
  const heart = 2.8 * beat
  drawGlyph(ctx, "heart", w.food[0] * CELL + CELL / 2 - heart * 2.5, w.food[1] * CELL + CELL / 2 - heart * 2.5, heart, COLORS.pink)
  if (w.bonus && (w.bonus.life > 90 || (w.bonus.life >> 3) & 1)) {
    const [bx, by] = w.bonus.at
    ctx.fillStyle = COLORS.lime
    ctx.fillRect(bx * CELL, by * CELL, CELL, CELL)
    drawGlyph(ctx, "human", bx * CELL + 2, by * CELL + 2, 2.8, COLORS.ink)
  }

  // body: tail first so the head draws on top; the tail tapers, food bulges on its way down
  const t = progress(w)
  const n = w.body.length
  for (let i = n - 1; i >= 0; i--) {
    const [x, y] = segmentAt(w, i, t)
    const taper = Math.max(0, 4 - (n - 1 - i)) * 0.75 // last few segments shrink
    const inset = w.bulges.includes(i) ? 0 : 1 + taper
    const dead = w.status === "over" && i < w.deadFor * 1.5 // pink ripples from head to tail
    ctx.fillStyle = dead ? (i === 0 ? "#e0387f" : COLORS.pink) : i === 0 ? COLORS.ink : w.bulges.includes(i) ? "#3a3a3a" : "#2a2a2a"
    ctx.fillRect(Math.round(x * CELL + inset), Math.round(y * CELL + inset), CELL - inset * 2, CELL - inset * 2)
  }

  // eyes look where it's going
  const [hx, hy] = segmentAt(w, 0, t)
  const cx = hx * CELL + CELL / 2
  const cy = hy * CELL + CELL / 2
  const [dx, dy] = w.dir
  ctx.fillStyle = w.status === "over" ? COLORS.ink : COLORS.lime
  for (const side of [-1, 1]) {
    ctx.fillRect(Math.round(cx + dx * 3 - dy * side * 3.5 - 1.5), Math.round(cy + dy * 3 + dx * side * 3.5 - 1.5), 3, 3)
  }

  for (const p of w.particles) {
    ctx.globalAlpha = p.life / p.max
    ctx.fillStyle = PARTICLE[p.color]
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
  }
  ctx.font = HUD_FONT
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  for (const p of w.popups) {
    ctx.globalAlpha = Math.min(1, p.life / 18)
    ctx.fillStyle = "#e0387f"
    ctx.fillText(p.text, p.x, p.y)
  }
  ctx.globalAlpha = 1
  ctx.restore()

  if (w.status === "ready")
    banner(ctx, W, [
      ["SNAKE", TITLE_FONT],
      ["ARROWS / WASD / SWIPE TO START", HUD_FONT],
    ])
  if (w.status === "paused")
    banner(ctx, W, [
      ["PAUSED", TITLE_FONT],
      ["ANY ARROW TO RESUME", HUD_FONT],
    ])
  if (w.status === "over")
    banner(ctx, W, [
      ["GAME OVER", TITLE_FONT],
      [w.newBest ? `${w.score} · NEW BEST` : `${w.score}`, HUD_FONT],
      ...(w.deadFor > LOCKOUT ? ([["ANY ARROW TO RETRY", HUD_FONT]] as [string, string][]) : []),
    ])
  hud(ctx, W, w.score, w.best, w.flash)
}

/** Grow by eating hearts; the board wraps at the edges. */
export function Snake({ onScore }: GameProps) {
  const [canvasRef, setup] = useGameCanvas(W, H)
  const [status, setStatus] = useState<Status>("ready")
  const world = useRef<World | null>(null)
  const kick = useRef(() => {})
  const { reduced } = useMotionState()
  const report = useEffectEvent(onScore)
  const isCalm = useEffectEvent(() => reduced)

  useEffect(() => {
    const ctx = setup()
    const w = (world.current ??= createWorld(best.get("snake")))
    let raf = 0
    let last = 0
    let acc = 0
    let shownScore = -1
    let visible = true

    // fixed 60/s simulation, drawn once per display frame
    const frame = (now: number) => {
      raf = 0
      acc += last ? Math.min(100, now - last) : STEP_MS
      last = now
      for (; acc >= STEP_MS; acc -= STEP_MS) {
        if (step(w, Math.random, isCalm()).over) {
          best.set("snake", w.best)
          setStatus("over")
        }
      }
      if (w.score !== shownScore) {
        shownScore = w.score
        report(`${w.score} · best ${Math.max(w.best, w.score)}`)
      }
      render(ctx, w)
      if (visible && isLive(w)) raf = requestAnimationFrame(frame)
      else last = 0
    }
    kick.current = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    kick.current()

    // scrolled away mid-game: pause rather than crash unseen
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (!visible && pause(w)) setStatus("paused")
      kick.current()
    })
    io.observe(canvasRef.current!)
    // a maximised or resized window: re-fit the pixels and draw a fresh frame
    const ro = new ResizeObserver(() => {
      setup()
      kick.current()
    })
    ro.observe(canvasRef.current!)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [setup, canvasRef])

  const act = (fn: (w: World) => unknown) => {
    const w = world.current
    if (!w) return
    fn(w)
    setStatus(w.status)
    kick.current()
  }
  const steer = (d: Point) => act((w) => turn(w, d))

  return (
    <GameCanvas
      canvasRef={canvasRef}
      ratio={W / H}
      label="Snake. Use the arrow keys, WASD or swipe to steer toward the hearts."
      status={status}
      onKey={(key) => {
        const d = KEYS[key.length === 1 ? key.toLowerCase() : key]
        if (!d) return false
        steer(d)
        return true
      }}
      onSwipe={steer}
      // a tap starts or resumes heading the current way
      onPress={() => world.current && world.current.status !== "run" && steer(world.current.dir)}
      onBlur={() => act(pause)}
    />
  )
}
