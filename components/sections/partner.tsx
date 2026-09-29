import { FrLogo } from "@/components/brand/symbols"
import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { SectionHead } from "@/components/site/section-head"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL } from "@/lib/content"

/**
 * Model partner, on the um-landing redesign's grid (2026-09-29): Fahrenheit
 * Research as the lead card with its mark, and four facts beside it. Set on
 * paper so the page alternates light and dark; the lead card keeps the
 * redesign's black. Every fact was checked against f-r.co on 2026-09-24.
 */

const FACTS = [
  { n: "2", name: "Homegrown", body: "Models made in-house, not rented from someone else." },
  { n: "3", name: "Tuned for the job", body: "Small models fitted to each job our products do." },
  { n: "4", name: "Typed decisions", body: "Their first model, Rankine v1, returns typed decisions." },
  { n: "5", name: "On device", body: "Rankine v1 runs on your own machine, with open weights." },
]

export function Partner() {
  return (
    <section id="partner" aria-labelledby="partner-title" className="container-page pb-18 md:pb-30">
      <SectionHead id="partner-title" label="Model partner">
        Homegrown models,
        <br />
        tuned for the job.
      </SectionHead>

      <Stagger
        gap={0.08}
        className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:grid-rows-2"
      >
        <StaggerItem className="group grid border-[1.5px] border-ink bg-ink text-paper shadow-hard lg:row-span-2 lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-12 p-6 md:p-8">
            <div>
              <p className="font-mono text-xs text-lime">1 · Exclusive partner</p>
              <p className="mt-4 text-[clamp(34px,3.2vw,48px)] leading-[1.02] font-medium tracking-[-0.04em]">
                Fahrenheit Research
              </p>
            </div>
            <div>
              <p className="max-w-[36ch] leading-[1.5] text-paper/70">
                Unified Machines is the exclusive partner for Fahrenheit Research&rsquo;s homegrown, tuned AI models
                inside its products.
              </p>
              <SplitButton href={FR_URL} external className="mt-7 border-paper [--btn-shadow:var(--paper)]">
                f-r.co
              </SplitButton>
            </div>
          </div>
          <div className="grid min-h-60 place-items-center border-paper/10 bg-[#171717] max-lg:border-t lg:border-l">
            <FrLogo className="w-[42%] text-paper transition-colors duration-500 group-hover:text-lime" />
          </div>
        </StaggerItem>

        {FACTS.map((f) => (
          <StaggerItem
            key={f.n}
            className="flex min-h-52 flex-col justify-between gap-8 border-[1.5px] border-ink bg-chalk p-6 shadow-hard-sm"
          >
            <div>
              <p className="font-mono text-xs text-muted-foreground">{f.n}</p>
              <p className="mt-3 text-[26px] leading-[1.1] font-medium tracking-[-0.03em]">{f.name}</p>
            </div>
            <p className="text-[15px] leading-[1.5] text-ink-soft">{f.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
