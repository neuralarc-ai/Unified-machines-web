"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon } from "@hugeicons/core-free-icons"
import { FrLogo, MorseMark } from "@/components/brand/symbols"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { useMotionState } from "@/components/motion/motion-provider"
import { Reveal } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL, MORSE_URL } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * The footer from the um-landing redesign (2026-09-28), in this site's type:
 * a dark ruled band with stepped colour blocks in the lower corners, a
 * bracketed meta line, "Build what lasts." with the Morse action, and four
 * tiles (Morse, Fahrenheit Research, back to top, pause motion). Its pixel
 * type and highlight boxes were left behind on purpose.
 */

const META = ["Unified Machines", "AI products built to last", "Morse · being built"]

const tile =
  "grid size-16 place-items-center border border-paper/15 bg-[#161616] text-paper transition-colors duration-200 hover:border-paper hover:bg-paper hover:text-ink focus-visible:border-paper aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink"

function Tile({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const external = href.startsWith("http")
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} className={tile}>
      {children}
    </a>
  ) : (
    <Link href={href} aria-label={label} className={tile}>
      {children}
    </Link>
  )
}

function MotionTile() {
  const { paused, setPaused, reduced } = useMotionState()
  const off = paused || reduced
  return (
    <button
      type="button"
      aria-label={reduced ? "Motion reduced by your system" : paused ? "Resume motion" : "Pause motion"}
      aria-pressed={off}
      disabled={reduced}
      onClick={() => setPaused(!paused)}
      className={cn(tile, "font-mono text-xs disabled:cursor-not-allowed disabled:opacity-60")}
    >
      {off ? "▶" : "❙❙"}
    </button>
  )
}

export function SiteFooter() {
  return (
    <footer className="grid-ground-ink relative overflow-hidden bg-ink text-paper">
      <PixelSteps
        corner="bl"
        className="h-[22%] w-[20%] max-md:h-20 max-md:w-[34%]"
        steps={[
          [100, 44],
          [60, 100],
        ]}
        from="#99ebfa"
        to="#b9b3ff"
      />
      <PixelSteps
        corner="br"
        className="h-[34%] w-[30%] max-md:h-24 max-md:w-[46%]"
        steps={[
          [100, 30],
          [80, 70],
          [60, 100],
        ]}
        from="#caeb6b"
        to="#ff6fb0"
      />

      <div className="container-page relative pt-16 pb-32 md:pt-20 md:pb-16">
        <div className="flex items-center justify-between gap-6 font-mono text-xs tracking-[0.02em] text-paper/50 uppercase">
          {META.map((m, i) => (
            <span key={m} className={i ? "hidden md:inline" : undefined}>
              [ {m} ]
            </span>
          ))}
        </div>

        <Reveal className="mt-16 grid items-center gap-14 md:mt-24 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
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
            <p className="text-lg leading-[1.45] text-paper/70">
              See the first product at
              <br />
              <a
                href={MORSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-paper underline decoration-paper/40 underline-offset-4 transition-colors hover:decoration-lime"
              >
                onmorse.com
              </a>
            </p>
            <div className="mt-8 grid w-fit grid-cols-2 gap-2">
              <Tile href={MORSE_URL} label="Morse">
                <MorseMark className="size-5" />
              </Tile>
              <Tile href={FR_URL} label="Fahrenheit Research">
                <FrLogo className="h-3.5 w-auto" />
              </Tile>
              <Tile href="#main" label="Back to top">
                <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={1.75} className="size-4" />
              </Tile>
              <MotionTile />
            </div>
          </div>
        </Reveal>

        <p className="mt-24 text-center text-sm text-paper/50 md:mt-32">
          © {new Date().getFullYear()} Unified Machines. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
