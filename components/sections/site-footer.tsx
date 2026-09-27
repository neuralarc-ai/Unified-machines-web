"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon } from "@hugeicons/core-free-icons"
import { useMotionState } from "@/components/motion/motion-provider"
import { Toggle } from "@/components/ui/toggle"
import { MORSE_URL, navLinks } from "@/lib/content"
import { underlineLink } from "./site-header"

const footerLinks = [
  ...navLinks.filter((l) => l.href !== "#partner").map((l) => ({ ...l, external: false })),
  { href: MORSE_URL, label: "onmorse.com", external: true },
]

function MotionToggle() {
  const { paused, setPaused, reduced } = useMotionState()
  return (
    <Toggle
      size="sm"
      pressed={paused || reduced}
      disabled={reduced}
      onPressedChange={setPaused}
      className="rounded-none border border-[#4a4a47] font-mono text-xs font-normal text-paper hover:bg-paper/10 hover:text-paper aria-pressed:bg-paper aria-pressed:text-ink"
    >
      {reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}
    </Toggle>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-[#2c2c2a] bg-ink py-5.5 text-sm text-paper">
      <div className="container-page flex flex-col gap-5.5">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:flex-wrap md:items-center">
          <span>Unified Machines © {new Date().getFullYear()}</span>
          <nav aria-label="Footer" className="flex flex-wrap gap-5.5">
            {footerLinks.map((l) =>
              l.external ? (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={underlineLink}>
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} href={l.href} className={underlineLink}>
                  {l.label}
                </Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-5">
            <MotionToggle />
            <Link href="#main" className="group inline-flex items-center gap-2">
              Back to top
              <HugeiconsIcon
                icon={ArrowUp02Icon}
                strokeWidth={1.5}
                className="size-4 transition-transform group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
