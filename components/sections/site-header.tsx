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
import { MORSE_URL, navLinks } from "@/lib/content"
import { cn } from "@/lib/utils"

export const underlineLink =
  "relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-250 hover:after:scale-x-100"

const SECTION_IDS = navLinks.map((l) => l.href.slice(1))

export function SiteHeader() {
  const active = useActiveSection(SECTION_IDS)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32 })

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="sticky top-0 z-30 bg-paper/86 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 md:h-19 md:px-12">
        <Link
          href="#main"
          aria-label="Unified Machines home"
          className="group/brand flex items-center gap-3.5 text-[22px] font-medium tracking-[-0.5px] whitespace-nowrap"
        >
          <BrandMarks className="gap-1.5" glyphClassName="size-5.5 transition-transform duration-400 ease-[cubic-bezier(.2,.7,.2,1)] nth-2:group-hover/brand:rotate-90 nth-3:group-hover/brand:-translate-y-0.5" />
          <span>Unified Machines</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden gap-7 text-sm lg:flex">
          {navLinks.map((l) => {
            const current = active === l.href.slice(1)
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={current ? "location" : undefined}
                className={cn(underlineLink, "transition-colors", active && !current && "text-ink/60 hover:text-ink")}
              >
                {l.label}
                {/* the marker slides from link to link as the page scrolls */}
                {current && (
                  <motion.span
                    layoutId="nav-active"
                    aria-hidden
                    className="absolute inset-x-0 -bottom-1 h-0.5 bg-ink"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          <SplitButton href={MORSE_URL} external size="sm" className="hidden md:inline-flex">
            Visit Morse
          </SplitButton>

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="Open navigation" />}>
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
                    {active === l.href.slice(1) && <span aria-hidden className="size-2 bg-lime ring-1 ring-ink" />}
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
      <motion.div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-lime" style={{ scaleX: progress }} />
    </motion.header>
  )
}
