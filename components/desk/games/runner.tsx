"use client"

import { useEffect, useEffectEvent, useRef, useState } from "react"
import { useMotionState } from "@/components/motion/motion-provider"
import { best, COLORS, drawGlyph, GameCanvas, HUD_FONT, useGameCanvas, type GameProps } from "./shared"
import {
  createWorld,
  FLOOR,
  H,
  HERO,
  HERO_X,
  isLive,
  LOCKOUT,
  pause,
  press,
  release,
  step,
  STEP_MS,
  W,
  type Status,
  type World,
} from "./runner-sim"

const TITLE_FONT = "600 18px ui-monospace, monospace"
const PARTICLE: Record<string, string> = { ink: COLORS.ink, pink: COLORS.pink, lime: COLORS.lime }
const pad = (n: number) => String(n).padStart(5, "0")

const HUD_ROW = 34 // the HI/score row occupies the canvas above this line

/** Centered lines of text on a soft paper card, below the HUD row, so they read over the scene. */
function banner(ctx: CanvasRenderingContext2D, lines: [text: string, font: string][]) {
  const h = lines.length * 22 + 14
  ctx.fillStyle = "rgba(252,252,251,.88)"
  ctx.fillRect(W / 2 - 170, HUD_ROW, 340, h)
  ctx.fillStyle = COLORS.ink
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  lines.forEach(([text, font], i) => {
    ctx.font = font
    ctx.fillText(text, W / 2, HUD_ROW + 18 + i * 22)
  })
}

/** Best and score, top right, blinking for a moment at every hundred. Drawn last so nothing covers it. */
function hud(ctx: CanvasRenderingContext2D, w: World) {
  ctx.font = HUD_FONT
  ctx.textAlign = "right"
  ctx.textBaseline = "alphabetic"
  ctx.fillStyle = "rgba(16,16,16,.45)"
  ctx.fillText(`HI ${pad(Math.max(w.best, w.score))}`, W - 76, 22)
  if (!((w.flash >> 2) & 1)) {
    ctx.fillStyle = COLORS.ink
    ctx.fillText(pad(w.score), W - 16, 22)
  }
}

function render(ctx: CanvasRenderingContext2D, w: World) {
  ctx.save()
  if (w.shake > 0) ctx.translate((Math.random() - 0.5) * w.shake * 0.7, (Math.random() - 0.5) * w.shake * 0.5)
  ctx.fillStyle = COLORS.paper
  ctx.fillRect(-10, -10, W + 20, H + 20)

  // far hills, stepped to the 4px grid, drifting at a fifth of the speed
  ctx.fillStyle = "rgba(16,16,16,.06)"
  for (let x = 0; x < W; x += 4) {
    const wx = x + w.dist * 0.2
    const h = Math.round((16 + 10 * Math.sin(wx * 0.011) + 6 * Math.sin(wx * 0.027 + 1.3)) / 4) * 4
    ctx.fillRect(x, FLOOR - h, 4, h)
  }

  // ground: a line, dashes and pebbles that scroll with the world
  ctx.fillStyle = COLORS.ink
  ctx.fillRect(0, FLOOR, W, 1)
  for (let x = -(w.dist % 12); x < W; x += 12) ctx.fillRect(x, FLOOR + 6, 6, 2)
  for (let x = -(w.dist % 40); x < W; x += 40) ctx.fillRect(x + 13, FLOOR + 14, 2, 2)

  for (const o of w.obstacles) {
    if (o.kind === "machine") drawGlyph(ctx, "machine", o.x, o.y, 4, COLORS.ink)
    else drawGlyph(ctx, "heart", o.x, o.y + Math.round(Math.sin(w.t * 0.12 + o.x * 0.05) * 2), 3, COLORS.pink)
  }

  // hero: a shadow that shrinks with height, a 1px running bob, squash and stretch
  const shadow = Math.round(18 * (1 - Math.min(1, w.y / 90)))
  ctx.fillStyle = "rgba(16,16,16,.18)"
  ctx.fillRect(HERO_X + (HERO - shadow) / 2, FLOOR + 2, shadow, 2)
  const bob = w.status === "run" && w.grounded ? (w.t >> 3) & 1 : 0
  ctx.save()
  ctx.translate(HERO_X + HERO / 2, FLOOR - w.y - bob)
  ctx.scale(1 - 0.14 * w.squash, 1 + 0.2 * w.squash)
  drawGlyph(ctx, "human", -HERO / 2, -HERO, 4, w.status === "over" ? "#e0387f" : COLORS.ink)
  ctx.restore()

  for (const p of w.particles) {
    ctx.globalAlpha = p.life / p.max
    ctx.fillStyle = PARTICLE[p.color]
    ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size)
  }
  ctx.font = HUD_FONT
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  for (const p of w.popups) {
    ctx.globalAlpha = Math.min(1, p.life / 20)
    ctx.fillStyle = "#e0387f"
    ctx.fillText(p.text, p.x, p.y)
  }
  ctx.globalAlpha = 1
  ctx.restore()

  if (w.status === "ready")
    banner(ctx, [
      ["RUNNER", TITLE_FONT],
      ["SPACE / TAP TO JUMP · HOLD FOR HIGHER", HUD_FONT],
    ])
  if (w.status === "paused")
    banner(ctx, [
      ["PAUSED", TITLE_FONT],
      ["SPACE / TAP TO RESUME", HUD_FONT],
    ])
  if (w.status === "over")
    banner(ctx, [
      ["GAME OVER", TITLE_FONT],
      [w.newBest ? `${w.score} · NEW BEST` : `${w.score}`, HUD_FONT],
      ...(w.deadFor > LOCKOUT ? ([["SPACE / TAP TO RETRY", HUD_FONT]] as [string, string][]) : []),
    ])
  hud(ctx, w)
}

/** human.sym jumps the machines and collects hearts. */
export function Runner({ onScore }: GameProps) {
  const [canvasRef, setup] = useGameCanvas(W, H)
  const [status, setStatus] = useState<Status>("ready")
  // The world lives in a ref: it changes every frame and must never restart the loop.
  const world = useRef<World | null>(null)
  const kick = useRef(() => {})
  const { reduced } = useMotionState()
  const report = useEffectEvent(onScore)
  const isCalm = useEffectEvent(() => reduced)

  useEffect(() => {
    const ctx = setup()
    const w = (world.current ??= createWorld(best.get("runner")))
    let raf = 0
    let last = 0
    let acc = 0
    let shownScore = -1
    let visible = true

    // fixed 60/s simulation, drawn once per display frame, so speed is the same on every screen
    const frame = (now: number) => {
      raf = 0
      acc += last ? Math.min(100, now - last) : STEP_MS
      last = now
      for (; acc >= STEP_MS; acc -= STEP_MS) {
        if (step(w, Math.random, isCalm()).over) {
          best.set("runner", w.best)
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

    // scrolled away mid-run: pause rather than crash unseen
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (!visible && pause(w)) setStatus("paused")
      kick.current()
    })
    io.observe(canvasRef.current!)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [setup, canvasRef])

  const act = <T,>(fn: (w: World) => T) => {
    const w = world.current
    if (!w) return
    const result = fn(w)
    setStatus(w.status)
    kick.current()
    return result
  }

  return (
    <GameCanvas
      canvasRef={canvasRef}
      w={W}
      label="Runner. Press space or tap to jump over the machines; hold for a higher jump to reach the hearts."
      status={status}
      onPress={() => act(press)}
      onRelease={() => act(release)}
      onBlur={() => act(pause)}
    />
  )
}
