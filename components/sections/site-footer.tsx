import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUp02Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { FrLogo, MorseMark } from "@/components/brand/symbols"
import { Contours } from "@/components/brand/contours"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { Reveal } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL, FRIDAY_URL, MORSE_URL } from "@/lib/content"
import { MotionToggle } from "./motion-toggle"

/**
 * The footer from the um-landing redesign (2026-09-28), in this site's type:
 * a dark ruled band with stepped colour blocks in the lower corners, a
 * bracketed meta line, "Build what lasts." with the Morse action, and three
 * link cards (Morse, Friday, Fahrenheit Research). Back to top and pause
 * motion sit under the cards; the copyright sits centred between the colour blocks, which
 * are the redesign's own. Its pixel type and highlight boxes were left behind
 * on purpose.
 */

const META = ["Unified Machines", "AI products built to last", "Morse · Friday"]

function LinkCard({ href, name, role, children }: { href: string; name: string; role: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group -ml-px flex min-h-40 flex-col justify-between border border-paper/15 bg-[#161616] p-5 transition-colors first:ml-0 duration-200 hover:border-paper hover:bg-paper hover:text-ink focus-visible:border-paper"
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

export function SiteFooter() {
  return (
    <footer className="grid-ground-ink relative overflow-hidden bg-ink text-paper">
      <Contours variant="footer" />
      {/* the redesign's blocks, exactly, from desktop up; fixed and smaller below that so they stay clear of the text */}
      <PixelSteps
        corner="bl"
        className="h-20 w-[34%] md:h-32 md:w-[24%] lg:h-[34%] lg:w-[22%]"
        steps={[
          [100, 44],
          [60, 100],
        ]}
        from="#99ebfa"
        to="#b9b3ff"
      />
      <PixelSteps
        corner="br"
        className="h-24 w-[46%] md:h-40 md:w-[34%] lg:h-[38%] lg:w-[30%]"
        steps={[
          [100, 30],
          [80, 70],
          [60, 100],
        ]}
        from="#caeb6b"
        to="#ff6fb0"
      />

      <div className="container-page relative pt-20 pb-28 md:pb-44 lg:pb-16">
        <div className="flex items-center justify-between gap-6 font-mono text-xs tracking-[0.02em] text-paper/50 uppercase">
          {META.map((m, i) => (
            <span key={m} className={i ? "hidden whitespace-nowrap lg:inline" : "whitespace-nowrap"}>
              [ {m} ]
            </span>
          ))}
        </div>

        <Reveal className="mt-24 grid items-end gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
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
              [ Our products, and our model partner ]
            </p>
            <div className="grid grid-cols-3">
              <LinkCard href={MORSE_URL} name="Morse" role="onmorse.com">
                <MorseMark className="size-7" />
              </LinkCard>
              <LinkCard href={FRIDAY_URL} name="Friday" role="fridayapp.fun">
                <Image src="/friday-icon.png" alt="" width={28} height={28} className="size-7" />
              </LinkCard>
              <LinkCard href={FR_URL} name="Fahrenheit Research" role="f-r.co">
                <FrLogo className="h-5 w-auto" />
              </LinkCard>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <MotionToggle className={solidBtn} />
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
        </Reveal>

        {/* centred between the blocks, as in the redesign */}
        <p className="mt-32 text-center text-sm text-paper/50 lg:mt-80">
          © {new Date().getFullYear()} Unified Machines. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
