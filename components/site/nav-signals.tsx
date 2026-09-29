"use client"

import Link from "next/link"
import { Glyph } from "@/components/brand/symbols"
import { navLinks } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * The header's centre nav, "Signals" (chosen 2026-09-29): each link carries
 * its own brand symbol; the section in view turns dark with its mark lit pink.
 */

const id = (href: string) => href.slice(1)

const MARKS: Record<string, React.ReactNode> = {
  thinking: <Glyph symbol="human" className="size-3.5" />,
  principles: <Glyph symbol="machine" className="size-3.5" />,
}

export function NavSignals({ active }: { active: string | null }) {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-center gap-1 border border-ink/15 bg-chalk/70 p-1 text-sm backdrop-blur-sm lg:flex"
    >
      {navLinks.map((l) => {
        const on = active === id(l.href)
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "location" : undefined}
            className={cn(
              "flex h-9 items-center gap-2 px-3 transition-colors duration-200",
              on ? "bg-ink text-paper" : "hover:bg-paper-2"
            )}
          >
            <span aria-hidden className={cn("grid size-5 place-items-center", on ? "text-pink" : "text-ink/55")}>
              {MARKS[id(l.href)]}
            </span>
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
