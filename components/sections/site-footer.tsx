"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { FrLogo, MorseMark } from "@/components/brand/symbols"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { useMotionState } from "@/components/motion/motion-provider"
import { Reveal } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL, MORSE_URL } from "@/lib/content"

/**
 * The footer from the um-landing redesign (2026-09-28), in this site's type:
 * a dark ruled band with stepped colour blocks in the lower corners, a
 * bracketed meta line, "Build what lasts." with the Morse action, and two
 * link cards (Morse, Fahrenheit Research). Back to top and pause motion sit in
 * the closing row with the copyright. The redesign's pixel type and highlight
 * boxes were left behind on purpose.
 */

const META = ["Unified Machines", "AI products built to last", "Morse · being built"]

function LinkCard({ href, name, role, children }: { href: string; name: string; role: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-40 flex-col justify-between border border-paper/15 bg-[#161616] p-5 transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink focus-visible:border-paper"
    >
      <span className="flex items-start justify-between">
        {children}
        <HugeiconsIcon
          icon={ArrowUpRight01Icon}
          strokeWidth={1.75}
          className="size-4.5 text-paper/50 transition-[translate,color] duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
        />
      </span>
      <span>
        <span className="block text-lg leading-tight font-medium tracking-[-0.02em]">{name}</span>
        <span className="mt-1 block font-mono text-xs text-paper/55 transition-colors group-hover:text-ink/65">
          {role}
        </span>
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

function MotionToggle() {
  const { paused, setPaused, reduced } = useMotionState()
  return (
    <button
      type="button"
      aria-pressed={paused || reduced}
      disabled={reduced}
      onClick={() => setPaused(!paused)}
      className="border border-paper/25 px-2.5 py-1 font-mono text-xs transition-colors hover:border-paper aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      {reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}
    </button>
  )
}

export function SiteFooter() {
  return (
    <footer className="grid-ground-ink relative overflow-hidden bg-ink text-paper">
      <PixelSteps
        corner="bl"
        className="h-20 w-[34%] md:h-36 md:w-[20%]"
        steps={[
          [100, 44],
          [60, 100],
        ]}
        from="#99ebfa"
        to="#b9b3ff"
      />
      <PixelSteps
        corner="br"
        className="h-24 w-[46%] md:h-48 md:w-[30%]"
        steps={[
          [100, 30],
          [80, 70],
          [60, 100],
        ]}
        from="#caeb6b"
        to="#ff6fb0"
      />

      <div className="container-page relative pt-16 pb-32 md:pt-20 md:pb-60">
        <div className="flex items-center justify-between gap-6 font-mono text-xs tracking-[0.02em] text-paper/50 uppercase">
          {META.map((m, i) => (
            <span key={m} className={i ? "hidden md:inline" : undefined}>
              [ {m} ]
            </span>
          ))}
        </div>

        <Reveal className="mt-16 grid items-end gap-14 md:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-20">
          <div>
            <p className="font-mono text-sm tracking-[0.02em] text-lime">#UNIFIEDMACHINES</p>
            <p className="mt-4 text-[clamp(56px,8vw,124px)] leading-[0.95] font-medium tracking-[-0.05em]">
              Build
              <br />
              <span className="pl-[0.6em]">what lasts.</span>
            </p>
            <SplitButton href={MORSE_URL} external className="mt-10 border-paper [--btn-shadow:var(--paper)]">
              Visit Morse
            </SplitButton>
          </div>

          <div>
            <p className="mb-4 font-mono text-xs tracking-[0.02em] text-paper/50 uppercase">
              [ The first product, and our model partner ]
            </p>
            <div className="grid grid-cols-2 gap-2">
              <LinkCard href={MORSE_URL} name="Morse" role="onmorse.com">
                <MorseMark className="size-7" />
              </LinkCard>
              <LinkCard href={FR_URL} name="Fahrenheit Research" role="f-r.co">
                <FrLogo className="h-5 w-auto" />
              </LinkCard>
            </div>
          </div>
        </Reveal>

        <div className="mt-20 flex flex-col-reverse gap-5 border-t border-paper/10 pt-6 text-sm text-paper/55 md:mt-28 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Unified Machines. All rights reserved.</p>
          <div className="flex items-center gap-5 text-paper">
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
