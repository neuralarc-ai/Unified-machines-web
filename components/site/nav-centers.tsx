"use client"

import Link from "next/link"
import { useEffect } from "react"
import { motion, useMotionValue } from "framer-motion"
import { Glyph, MorseMark, FrLogo } from "@/components/brand/symbols"
import { navLinks } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * Four centre-nav designs for review (2026-09-29). Each is given the id of
 * the section in view (or null) and renders the same five links.
 */

type Props = { active: string | null }
const id = (href: string) => href.slice(1)
const n2 = (i: number) => String(i + 1).padStart(2, "0")

/** A · Segmented: one bordered bar with a hard shadow; a pink block slides behind the section you're in. */
export function NavSegmented({ active }: Props) {
  return (
    <nav
      aria-label="Main navigation"
      className="hidden items-stretch border-[1.5px] border-ink bg-chalk text-sm shadow-hard-sm lg:flex"
    >
      {navLinks.map((l, i) => {
        const on = active === id(l.href)
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "location" : undefined}
            className={cn(
              "relative flex h-10 items-center px-4 transition-colors not-last:border-r not-last:border-ink/15",
              !on && "hover:bg-paper-2"
            )}
          >
            {on && (
              <motion.span
                layoutId="nav-seg"
                aria-hidden
                className="absolute -inset-px border-[1.5px] border-ink bg-pink"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative flex items-baseline gap-2">
              <span className="font-mono text-[11px] opacity-50">{n2(i)}</span>
              {l.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

/** B · Taskbar: the links as UM.OS window tabs, echoing the desk; the open one is a dark tab with a pink light. */
export function NavTaskbar({ active }: Props) {
  return (
    <nav aria-label="Main navigation" className="hidden items-center gap-1.5 font-mono text-[13px] lg:flex">
      {navLinks.map((l) => {
        const on = active === id(l.href)
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={on ? "location" : undefined}
            className={cn(
              "flex h-8.5 items-center gap-2 border-[1.5px] border-ink px-3 transition-[translate,box-shadow,background-color] duration-150",
              on
                ? "bg-ink text-paper shadow-[2px_2px_0_var(--pink)]"
                : "bg-chalk shadow-hard-sm hover:-translate-px hover:shadow-hard"
            )}
          >
            <i aria-hidden className={cn("size-2 shrink-0 border", on ? "border-pink bg-pink" : "border-ink/40")} />
            {l.label.toLowerCase().replace(/ /g, "-")}
          </Link>
        )
      })}
    </nav>
  )
}

/** C · Chapters: numbered links, each with its own progress line that fills while you read that section. */
/** How far a reading line 35% down the viewport has travelled through a section, 0–1. */
function useSectionProgress(sectionId: string) {
  const p = useMotionValue(0)
  useEffect(() => {
    const update = () => {
      const r = document.getElementById(sectionId)?.getBoundingClientRect()
      if (!r) return
      const line = innerHeight * 0.35
      p.set(Math.min(1, Math.max(0, (line - r.top) / r.height)))
    }
    update()
    addEventListener("scroll", update, { passive: true })
    addEventListener("resize", update)
    return () => {
      removeEventListener("scroll", update)
      removeEventListener("resize", update)
    }
  }, [sectionId, p])
  return p
}

function Chapter({ href, label, i, on, dim }: { href: string; label: string; i: number; on: boolean; dim: boolean }) {
  const p = useSectionProgress(id(href))
  return (
    <Link
      href={href}
      aria-current={on ? "location" : undefined}
      className={cn("group relative flex flex-col gap-1.5 transition-opacity", dim && "opacity-45 hover:opacity-100")}
    >
      <span className="flex items-baseline gap-2 text-sm">
        <span className={cn("font-mono text-[11px]", on ? "text-pink-deep" : "text-ink/50")}>{n2(i)}</span>
        {label}
      </span>
      <span aria-hidden className="relative h-0.5 w-full bg-ink/10">
        <motion.span className="absolute inset-0 origin-left bg-ink" style={{ scaleX: p }} />
      </span>
    </Link>
  )
}

export function NavChapters({ active }: Props) {
  return (
    <nav aria-label="Main navigation" className="hidden items-end gap-6 lg:flex">
      {navLinks.map((l, i) => (
        <Chapter
          key={l.href}
          href={l.href}
          label={l.label}
          i={i}
          on={active === id(l.href)}
          dim={!!active && active !== id(l.href)}
        />
      ))}
    </nav>
  )
}

/** D · Signals: each link carries its own mark (the three symbols, Morse, Fahrenheit); the one in view lights pink. */
const MARKS: Record<string, React.ReactNode> = {
  thinking: <Glyph symbol="human" className="size-3.5" />,
  principles: <Glyph symbol="machine" className="size-3.5" />,
  consolidate: <MorseMark className="size-3.5" />,
  friday: <span className="grid size-3.5 place-items-center font-mono text-[11px] leading-none font-bold">F</span>,
  partner: <FrLogo className="h-2.5 w-auto" />,
}

export function NavSignals({ active }: Props) {
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
