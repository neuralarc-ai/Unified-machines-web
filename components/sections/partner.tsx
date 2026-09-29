import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { FrLogo } from "@/components/brand/symbols"
import { Reveal } from "@/components/motion/reveal"
import { SectionHead } from "@/components/site/section-head"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL } from "@/lib/content"

/**
 * Model partner, one card (2026-09-29): Fahrenheit Research with its mark at a
 * normal size, what the partnership is, and four facts as a short list. Every
 * fact was checked against f-r.co on 2026-09-24.
 */

const FACTS = [
  { name: "Homegrown", body: "models made in-house, not rented." },
  { name: "Tuned for the job", body: "small models fitted to each product." },
  { name: "Typed decisions", body: "Rankine v1 returns typed decisions." },
  { name: "On device", body: "Rankine v1 runs on your machine, open weights." },
]

export function Partner() {
  return (
    <section id="partner" aria-labelledby="partner-title" className="container-page pb-18 md:pb-30">
      <SectionHead id="partner-title" label="Model partner">
        Homegrown models,
        <br />
        tuned for the job.
      </SectionHead>

      <Reveal className="grid gap-8 border-[1.5px] border-ink bg-ink p-6 text-paper shadow-hard md:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <FrLogo className="w-12 shrink-0 text-paper" />
            <div>
              <p className="text-[clamp(26px,2.4vw,34px)] leading-[1.05] font-medium tracking-[-0.03em]">
                Fahrenheit Research
              </p>
              <p className="mt-1 font-mono text-xs text-lime">Exclusive partner</p>
            </div>
          </div>
          <p className="max-w-[44ch] leading-[1.55] text-paper/70">
            Unified Machines is the exclusive partner for Fahrenheit Research&rsquo;s homegrown, tuned AI models inside
            its products.
          </p>
          <SplitButton href={FR_URL} external className="self-start border-paper [--btn-shadow:var(--paper)]">
            f-r.co
          </SplitButton>
        </div>

        <ul className="grid content-center gap-3 border-paper/10 max-lg:border-t max-lg:pt-6 lg:border-l lg:pl-12">
          {FACTS.map((f) => (
            <li key={f.name} className="flex gap-3 leading-[1.45]">
              <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.25} className="mt-0.5 size-4 shrink-0 text-lime" />
              <span>
                <span className="font-medium">{f.name}:</span> <span className="text-paper/65">{f.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
