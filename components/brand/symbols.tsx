import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import type { SymbolKey } from "@/lib/content"

type SvgProps = ComponentProps<"svg">

// Brand marks carried over unchanged from the reference site.
const glyphPaths: Record<SymbolKey, { d: string; fillRule?: "evenodd" }> = {
  human: { d: "M0 0h50v50H0zM10 10v10h10V10zm20 0v10h10V10z", fillRule: "evenodd" },
  machine: { d: "M0 0h20v10h10V0h20v20H40v10h10v20H30V40H20v10H0V30h10V20H0z" },
  heart: { d: "M0 0h20v10h10V0h20v30H40v10H30v10H20V40H10V30H0z" },
}

/** The same marks as filled cells on their 5×5 grid, for pixel drawing ("1" = ink). */
export const glyphCells: Record<SymbolKey, string[]> = {
  human: ["11111", "10101", "11111", "11111", "11111"],
  machine: ["11011", "11111", "01110", "11111", "11011"],
  heart: ["11011", "11111", "11111", "01110", "00100"],
}

export function Glyph({ symbol, className, ...props }: SvgProps & { symbol: SymbolKey }) {
  const { d, fillRule } = glyphPaths[symbol]
  return (
    <svg viewBox="0 0 50 50" fill="currentColor" aria-hidden className={cn("size-6 shrink-0", className)} {...props}>
      <path d={d} fillRule={fillRule} />
    </svg>
  )
}

export function BrandMarks({ className, glyphClassName }: { className?: string; glyphClassName?: string }) {
  return (
    <span aria-hidden className={cn("inline-flex gap-1", className)}>
      {(["human", "machine", "heart"] as const).map((s) => (
        <Glyph key={s} symbol={s} className={cn("size-4", glyphClassName)} />
      ))}
    </span>
  )
}

export function MorseMark({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-4 shrink-0", className)} {...props}>
      <path
        d="m5 16 9-9m-9 20L25 7M9 34 33 10m-14 24 16-16m-6 16 6-6M5 7h.1M35 7h.1M5 35h.1"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function FrLogo({ className, ...props }: SvgProps) {
  return (
    <svg viewBox="0 0 176 132" fill="currentColor" aria-hidden className={cn("aspect-[176/132] h-auto shrink-0", className)} {...props}>
      <path d="M0 0h129l47 20v20H43L0 21zM129 44l47 10v14L50 92 0 80V69zM122 84l54 27v20H47L0 112V99z" />
    </svg>
  )
}
