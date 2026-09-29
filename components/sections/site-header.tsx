"use client"

import Link from "next/link"
import { motion, useScroll, useSpring } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu02Icon } from "@hugeicons/core-free-icons"
import { BrandMarks } from "@/components/brand/symbols"
import { SplitButton } from "@/components/site/split-button"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { EASE } from "@/components/motion/reveal"
import { useActiveSection } from "@/hooks/use-active-section"
import { NavSignals } from "@/components/site/nav-signals"
import { MORSE_URL, navLinks } from "@/lib/content"

export const underlineLink =
  "relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-250 hover:after:scale-x-100"

const SECTION_IDS = navLinks.map((l) => l.href.slice(1))

export function SiteHeader() {
  const active = useActiveSection(SECTION_IDS)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32 })

  return (
    // visible on first paint; a CSS slide in, no hidden state waiting on JS
    <header className="grid-ground overscroll-cap sticky top-0 z-30 border-b border-ink/8 motion-safe:animate-[enter-drop_0.6s_var(--ease-enter)_both]">
      {/* three columns, the outer two equal, so the nav sits on the page's true centre */}
      <div className="container-page grid h-16 grid-cols-[1fr_auto] items-center gap-6 md:h-19 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="#main"
          aria-label="Unified Machines home"
          className="group/brand flex items-center justify-self-start gap-3.5 text-[22px] font-medium tracking-[-0.5px] whitespace-nowrap"
        >
          <BrandMarks
            className="gap-1.5"
            glyphClassName="size-5.5 transition-transform duration-400 ease-[cubic-bezier(.2,.7,.2,1)] nth-2:group-hover/brand:rotate-90 nth-3:group-hover/brand:-translate-y-0.5"
          />
          <span>Unified Machines</span>
        </Link>

        <NavSignals active={active} />

        <div className="flex items-center justify-end gap-3">
          <SplitButton href={MORSE_URL} external size="sm" className="hidden md:inline-flex">
            Visit Morse
          </SplitButton>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open navigation" />}
            >
              <HugeiconsIcon icon={Menu02Icon} strokeWidth={1.5} className="size-6" />
            </SheetTrigger>
            <SheetContent side="top" className="gap-0 border-ink bg-paper px-5 pt-16 pb-6">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <nav aria-label="Mobile navigation" className="flex flex-col">
                {navLinks.map((l, i) => (
                  <SheetClose
                    key={l.href}
                    nativeButton={false}
                    render={
                      <motion.a
                        href={l.href}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i, ease: EASE }}
                      />
                    }
                    aria-current={active === l.href.slice(1) ? "location" : undefined}
                    className="flex items-center justify-between border-b border-line py-3 text-lg aria-[current]:font-medium"
                  >
                    {l.label}
                    {active === l.href.slice(1) && <span aria-hidden className="size-2 bg-pink ring-1 ring-ink" />}
                  </SheetClose>
                ))}
              </nav>
              <SplitButton href={MORSE_URL} external className="mt-6 self-start">
                Visit Morse
              </SplitButton>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-pink"
        style={{ scaleX: progress }}
      />
    </header>
  )
}
