import Link from "next/link"
import type { CSSProperties } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** A pixel arrow on the symbols' grid, drawn in 2px steps. */
function PixelArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" shapeRendering="crispEdges" aria-hidden className={className}>
      <path d="M0 5h8v2H0zM6 2h2v2H6zM8 4h2v4H8zM6 8h2v2H6z" />
    </svg>
  )
}

const ease = "ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none"
const lit = "group-hover/split:translate-x-0 group-focus-visible/split:translate-x-0"

/**
 * UM's primary action, ported from um-landing: a lime square with a pixel
 * arrow beside an uppercase label, on the brutalist Button. On hover or
 * keyboard focus the arrow slides out as a second slides in, the label fills
 * lime, and its letters roll up one after another (15ms apart).
 */
export function SplitButton({
  href,
  children,
  external = false,
  size = "md",
  className,
}: {
  href: string
  children: string
  external?: boolean
  size?: "sm" | "md"
  className?: string
}) {
  const sm = size === "sm"
  // full literals: Tailwind only generates classes it can see written out
  const slideOut = sm
    ? "group-hover/split:translate-x-9 group-focus-visible/split:translate-x-9"
    : "group-hover/split:translate-x-11 group-focus-visible/split:translate-x-11"

  return (
    <Button
      variant="outline"
      nativeButton={false}
      render={external ? <a href={href} target="_blank" rel="noopener noreferrer" /> : <Link href={href} />}
      className={cn(
        "group/split gap-0 overflow-hidden bg-card p-0 font-mono tracking-[-0.02em] uppercase hover:bg-card",
        sm ? "h-9 text-[14.5px]" : "h-11 text-sm",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative grid h-full shrink-0 place-items-center overflow-hidden border-r border-ink bg-lime text-ink",
          sm ? "w-9" : "w-11"
        )}
      >
        <PixelArrow className={cn("absolute size-3.5 transition-transform duration-450", ease, slideOut)} />
        <PixelArrow className={cn("absolute size-3.5 transition-transform duration-450", ease, sm ? "-translate-x-9" : "-translate-x-11", lit)} />
      </span>

      <span
        className={cn(
          "flex h-full items-center transition-colors duration-300 group-hover/split:bg-lime group-focus-visible/split:bg-lime",
          sm ? "px-3" : "px-4",
          ease
        )}
      >
        <span className="sr-only">{children}</span>
        {/* each letter is two stacked copies; hovering rolls them up one after another */}
        <span aria-hidden className="flex">
          {[...children].map((ch, i) => (
            <span
              key={i}
              style={{ "--i": i } as CSSProperties}
              className="inline-flex h-[1.3em] flex-col overflow-hidden leading-[1.3em]"
            >
              {[0, 1].map((copy) => (
                <span
                  key={copy}
                  className={cn(
                    "whitespace-pre transition-transform duration-420 [transition-delay:calc(var(--i)*15ms)] group-hover/split:-translate-y-full group-focus-visible/split:-translate-y-full",
                    ease
                  )}
                >
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </span>
      </span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </Button>
  )
}
