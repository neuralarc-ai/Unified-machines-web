import { FrLogo } from "@/components/brand/symbols"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { MonoLabel } from "@/components/site/section-head"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL, numbers } from "@/lib/content"

export function Partner() {
  return (
    <>
      <section id="partner" aria-labelledby="partner-title" className="border-y border-ink bg-lime py-10 text-ink md:py-12">
        <Reveal className="container-page grid grid-cols-1 items-center gap-x-10 gap-y-6 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto]">
          <a
            href={FR_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fahrenheit Research website"
            className="block w-14 text-ink transition-colors duration-300 hover:text-pink-deep md:w-22"
          >
            <FrLogo className="w-full" />
          </a>
          <div>
            <MonoLabel className="mb-2.5">Exclusive partner</MonoLabel>
            <h2 id="partner-title" className="mb-2.5 text-[clamp(25px,2.7vw,36px)] leading-[1.12] tracking-[-0.03em] text-balance">
              Homegrown models, tuned for the job.
            </h2>
            <p className="max-w-[64ch] leading-[1.55] text-ink-soft">
              Unified Machines is the exclusive partner for Fahrenheit Research&rsquo;s homegrown, tuned AI models
              inside its products. Small models, fitted to each job, ours to keep running for years.
            </p>
          </div>
          <SplitButton href={FR_URL} external className="justify-self-start sm:col-span-2 lg:col-span-1 lg:col-start-3">
            Fahrenheit Research
          </SplitButton>
        </Reveal>
      </section>

      <section aria-label="Unified Machines in three numbers" className="container-page mb-18 md:mb-30">
        {/* outlined, so the lime band above stays the loudest thing here */}
        <Stagger gap={0.12} className="grid gap-6 py-12 md:grid-cols-3">
          {numbers.map((n) => (
            <StaggerItem key={n.label} className="flex flex-col gap-2.5">
              <span className="text-[clamp(56px,7vw,104px)] leading-[0.9] font-medium tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--ink)]">
                {n.value}
              </span>
              <span className="border-t border-ink pt-2.5 font-mono text-xs">{n.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  )
}
