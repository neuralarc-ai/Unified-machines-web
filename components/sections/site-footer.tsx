"use client"

import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { FrLogo, MorseMark } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Reveal } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL, MORSE_URL } from "@/lib/content"

/**
 * The footer from the um-landing redesign (2026-09-28), in this site's type:
 * a dark ruled band with stepped colour blocks in the lower corners, a
 * bracketed meta line, "Build what lasts." with the Morse action, and two
 * link cards (Morse, Fahrenheit Research). Back to top and pause motion sit in
 * the closing row with the copyright. Everything is laid on the page grid in
 * whole cells, so no border ever sits beside a ruled line. The redesign's
 * pixel type and highlight boxes were left behind on purpose.
 */

const META = ["Unified Machines", "AI products built to last", "Morse · being built"]

function LinkCard({ href, name, role, children }: { href: string; name: string; role: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group -ml-px flex h-[calc(var(--cell)*2)] min-h-36 flex-col justify-between border border-paper/15 bg-[#161616] p-5 transition-colors first:ml-0 duration-200 hover:border-paper hover:bg-paper hover:text-ink focus-visible:border-paper"
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

const solidBtn =
  "inline-flex h-9 items-center gap-2 border border-paper/25 bg-ink px-3 font-mono text-xs transition-colors hover:border-paper"

function MotionToggle() {
  const { paused, setPaused, reduced } = useMotionState()
  return (
    <button
      type="button"
      aria-pressed={paused || reduced}
      disabled={reduced}
      onClick={() => setPaused(!paused)}
      className={`${solidBtn} aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {reduced ? "Reduced motion" : paused ? "Resume motion" : "Pause motion"}
    </button>
  )
}

/*
 * The colour blocks, drawn in grid cells so every edge lands on a ruled line.
 * `--e` is the margin outside the content; each block reaches that far plus
 * a whole number of cells, and climbs in whole cells.
 */
const cellVars = { "--e": "calc((100cqw - var(--cols) * var(--cell)) / 2)" } as CSSProperties
const c = (n: number) => `calc(var(--cell) * ${n})`

function Steps() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 [--l:2] md:[--l:5]"
        style={{
          width: "calc(var(--e) + var(--cell) * var(--l))",
          height: c(3),
          clipPath: `polygon(0 100%, 100% 100%, 100% ${c(2)}, calc(100% - ${c(2)}) ${c(2)}, calc(100% - ${c(2)}) 0, 0 0)`,
          background: "linear-gradient(45deg, #99ebfa, #b9b3ff)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 [--r:3] md:[--r:7]"
        style={{
          width: "calc(var(--e) + var(--cell) * var(--r))",
          height: c(4),
          clipPath: `polygon(100% 100%, 0 100%, 0 ${c(3)}, ${c(2)} ${c(3)}, ${c(2)} ${c(2)}, ${c(4)} ${c(2)}, ${c(4)} 0, 100% 0)`,
          background: "linear-gradient(315deg, #caeb6b, #ff6fb0)",
        }}
      />
    </>
  )
}

export function SiteFooter() {
  return (
    <footer className="grid-ground-ink relative overflow-hidden bg-ink text-paper" style={cellVars}>
      <Steps />

      {/* rows are whole cells tall: meta 1, gap 1, main 6, gap 1, closing 1, then 4 for the blocks */}
      <div className="container-page relative pb-[calc(var(--cell)*4)]">
        <div className="flex h-(--cell) items-center justify-between gap-6 font-mono text-xs tracking-[0.02em] text-paper/50 uppercase">
          {META.map((m, i) => (
            <span key={m} className={i ? "hidden md:inline" : undefined}>
              [ {m} ]
            </span>
          ))}
        </div>

        <Reveal className="mt-(--cell) grid items-end gap-12 lg:h-[calc(var(--cell)*6)] lg:grid-cols-[minmax(0,1fr)_calc(var(--cell)*6)] lg:gap-0">
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
            <div className="grid grid-cols-2">
              <LinkCard href={MORSE_URL} name="Morse" role="onmorse.com">
                <MorseMark className="size-7" />
              </LinkCard>
              <LinkCard href={FR_URL} name="Fahrenheit Research" role="f-r.co">
                <FrLogo className="h-5 w-auto" />
              </LinkCard>
            </div>
          </div>
        </Reveal>

        <div className="mt-(--cell) flex flex-col-reverse gap-5 text-sm text-paper/55 md:h-(--cell) md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Unified Machines. All rights reserved.</p>
          <div className="flex items-center gap-2 text-paper">
            <MotionToggle />
            <Link href="#main" className={`group ${solidBtn}`}>
              Back to top
              <HugeiconsIcon
                icon={ArrowUp02Icon}
                strokeWidth={1.5}
                className="size-3.5 transition-transform group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
