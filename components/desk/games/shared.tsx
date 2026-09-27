"use client"

import { useCallback, useRef, type RefObject } from "react"
import { glyphCells } from "@/components/brand/symbols"
import type { SymbolKey } from "@/lib/content"
import { cn } from "@/lib/utils"

export const COLORS = { ink: "#101010", lime: "#caeb6b", pink: "#ff6fb0", paper: "#fcfcfb" }
export const HUD_FONT = "500 13px ui-monospace, monospace"
export const TITLE_FONT = "600 18px ui-monospace, monospace"
export const PARTICLE: Record<"ink" | "pink" | "lime", string> = { ink: COLORS.ink, pink: COLORS.pink, lime: COLORS.lime }

const HUD_ROW = 34 // the HI/score row occupies the canvas above this line
const pad = (n: number) => String(n).padStart(5, "0")

/** Centered lines of text on a soft paper card, below the HUD row, so they read over the scene. */
export function banner(ctx: CanvasRenderingContext2D, width: number, lines: [text: string, font: string][]) {
  const h = lines.length * 22 + 14
  ctx.fillStyle = "rgba(252,252,251,.88)"
  ctx.fillRect(width / 2 - 170, HUD_ROW, 340, h)
  ctx.fillStyle = COLORS.ink
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  lines.forEach(([text, font], i) => {
    ctx.font = font
    ctx.fillText(text, width / 2, HUD_ROW + 18 + i * 22)
  })
}

/** Best and score, top right, blinking while `flash` runs. Draw it last so nothing covers it. */
export function hud(ctx: CanvasRenderingContext2D, width: number, score: number, best: number, flash: number) {
  ctx.font = HUD_FONT
  ctx.textAlign = "right"
  ctx.textBaseline = "alphabetic"
  ctx.fillStyle = "rgba(16,16,16,.45)"
  ctx.fillText(`HI ${pad(Math.max(best, score))}`, width - 76, 22)
  if (!((flash >> 2) & 1)) {
    ctx.fillStyle = COLORS.ink
    ctx.fillText(pad(score), width - 16, 22)
  }
}

export type GameStatus = "ready" | "run" | "paused" | "over"
export type GameProps = { onScore: (label: string) => void }

/** Best score per game, kept on this device. Storage can throw in private mode. */
export const best = {
  get(game: string) {
    try {
      return Number(localStorage.getItem(`um-best-${game}`)) || 0
    } catch {
      return 0
    }
  },
  set(game: string, value: number) {
    try {
      localStorage.setItem(`um-best-${game}`, String(value))
    } catch {
      // storage unavailable: the best score just isn't remembered
    }
  },
}

/** Paints a brand symbol's 5×5 cells at (x, y), `size` px per cell. */
export function drawGlyph(
  ctx: CanvasRenderingContext2D,
  symbol: SymbolKey,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color
  glyphCells[symbol].forEach((row, r) =>
    [...row].forEach((cell, c) => {
      if (cell === "1") ctx.fillRect(Math.round(x + c * size), Math.round(y + r * size), Math.ceil(size), Math.ceil(size))
    })
  )
}

/** A crisp, DPR-aware canvas of fixed CSS size. `setup()` returns its 2D context. */
export function useGameCanvas(w: number, h: number) {
  const ref = useRef<HTMLCanvasElement>(null)
  const setup = useCallback(() => {
    const canvas = ref.current!
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext("2d")!
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.imageSmoothingEnabled = false
    return ctx
  }, [w, h])
  return [ref, setup] as const
}

type Direction = [number, number]

const ACTION_KEYS = [" ", "Enter", "ArrowUp"]

const SWIPE_PX = 24

/**
 * Focusable canvas host: space/enter/↑/tap to act. Without swipes, a tap acts
 * on press (instant, like a key). With swipes, a drag turns as soon as it
 * travels 24px and keeps steering without lifting; a tap acts on release.
 */
export function GameCanvas({
  canvasRef,
  w,
  label,
  status,
  onPress,
  onRelease,
  onBlur,
  onKey,
  onSwipe,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>
  w: number
  label: string
  status: GameStatus
  onPress: () => void
  onRelease?: () => void
  onBlur?: () => void
  /** Return true if the key was handled. */
  onKey?: (key: string) => boolean
  onSwipe?: (dir: Direction) => void
}) {
  // where the current drag was last measured from, and whether it has steered yet
  const drag = useRef<{ x: number; y: number; swiped: boolean } | null>(null)

  return (
    <div
      tabIndex={0}
      role="application"
      aria-label={label}
      data-status={status}
      className={cn(
        "outline-none select-none focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-pink-deep",
        onSwipe ? "touch-none" : "touch-manipulation"
      )}
      onKeyDown={(e) => {
        if (onKey?.(e.key)) return e.preventDefault()
        if (ACTION_KEYS.includes(e.key)) {
          e.preventDefault()
          if (!e.repeat) onPress()
        }
      }}
      onKeyUp={(e) => ACTION_KEYS.includes(e.key) && onRelease?.()}
      onBlur={onBlur}
      onPointerDown={(e) => {
        e.currentTarget.focus({ preventScroll: true })
        if (!onSwipe) return onPress()
        e.currentTarget.setPointerCapture(e.pointerId)
        drag.current = { x: e.clientX, y: e.clientY, swiped: false }
      }}
      onPointerMove={(e) => {
        const d = drag.current
        if (!d || !onSwipe) return
        const dx = e.clientX - d.x
        const dy = e.clientY - d.y
        if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) return
        onSwipe(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)])
        drag.current = { x: e.clientX, y: e.clientY, swiped: true }
      }}
      onPointerUp={() => {
        const d = drag.current
        drag.current = null
        onRelease?.()
        if (d && !d.swiped) onPress()
      }}
      onPointerCancel={() => {
        drag.current = null
        onRelease?.()
      }}
    >
      <canvas ref={canvasRef} style={{ width: w }} className="block h-auto max-w-full [image-rendering:pixelated]" />
    </div>
  )
}
