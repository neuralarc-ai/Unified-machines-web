"use client"

import { useCallback, useRef, type RefObject } from "react"
import { glyphCells } from "@/components/brand/symbols"
import type { SymbolKey } from "@/lib/content"
import { cn } from "@/lib/utils"

export const COLORS = { ink: "#101010", lime: "#caeb6b", pink: "#ff6fb0", paper: "#fcfcfb" }
export const HUD_FONT = "500 13px ui-monospace, monospace"

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

/**
 * Focusable canvas host: space/enter/↑/tap to act. Without swipes, a tap acts
 * on press (instant, like a key); with swipes it waits for release to tell the two apart.
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
  const start = useRef<[number, number] | null>(null)

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
        start.current = [e.clientX, e.clientY]
        if (!onSwipe) onPress()
      }}
      onPointerUp={(e) => {
        const s = start.current
        start.current = null
        onRelease?.()
        if (!onSwipe) return
        if (s) {
          const dx = e.clientX - s[0]
          const dy = e.clientY - s[1]
          if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) {
            return onSwipe(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)])
          }
        }
        onPress()
      }}
      onPointerCancel={() => onRelease?.()}
    >
      <canvas ref={canvasRef} style={{ width: w }} className="block h-auto max-w-full [image-rendering:pixelated]" />
    </div>
  )
}
