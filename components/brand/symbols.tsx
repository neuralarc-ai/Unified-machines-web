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

/**
 * Morse's own mark (from the Morse app, components/logo.tsx, the 5px drawing
 * of 2026-09-22): dots and round-ended dashes set on the diagonal.
 */
export function MorseMark({ className, ...props }: SvgProps) {
  return (
    <svg
      viewBox="0.774 0.909 59.013 59.013"
      fill="currentColor"
      aria-hidden
      className={cn("size-4 shrink-0", className)}
      {...props}
    >
      <circle cx="22.5" cy="3.5" r="2.5" />
      <circle cx="5.5" cy="39.5" r="2.5" />
      <circle cx="38.5" cy="55.5" r="2.5" />
      <rect x="-0.261719" y="23.4199" width="21.8304" height="5" rx="2.5" transform="rotate(-45 -0.261719 23.4199)" />
      <rect x="7.31836" y="50.6211" width="21.4615" height="5" rx="2.5" transform="rotate(-45 7.31836 50.6211)" />
      <rect x="47.1699" y="44.1553" width="14.3077" height="5" rx="2.5" transform="rotate(-45 47.1699 44.1553)" />
      <rect x="26.3965" y="31.5439" width="33.3846" height="5" rx="2.5" transform="rotate(-45 26.3965 31.5439)" />
      <rect x="17.3867" y="57.332" width="56.3305" height="5" rx="2.5" transform="rotate(-45 17.3867 57.332)" />
      <rect x="9.70312" y="30.3516" width="42.9231" height="5" rx="2.5" transform="rotate(-45 9.70312 30.3516)" />
    </svg>
  )
}

export function FrLogo({ className, ...props }: SvgProps) {
  return (
    <svg
      viewBox="0 0 176 132"
      fill="currentColor"
      aria-hidden
      className={cn("aspect-[176/132] h-auto shrink-0", className)}
      {...props}
    >
      <path d="M0 0h129l47 20v20H43L0 21zM129 44l47 10v14L50 92 0 80V69zM122 84l54 27v20H47L0 112V99z" />
    </svg>
  )
}
