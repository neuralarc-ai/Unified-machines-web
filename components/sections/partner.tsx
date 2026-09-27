import { FrLogo } from "@/components/brand/symbols"
import { Reveal } from "@/components/motion/reveal"
import { MonoLabel } from "@/components/site/section-head"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL } from "@/lib/content"

export function Partner() {
  return (
    <section id="partner" aria-labelledby="partner-title" className="bg-ink py-10 text-paper md:py-12">
      <Reveal className="container-page grid grid-cols-1 items-center gap-x-10 gap-y-6 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto]">
        <a
          href={FR_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fahrenheit Research website"
          className="block w-14 text-lime transition-colors duration-300 hover:text-paper md:w-22"
        >
          <FrLogo className="w-full" />
        </a>
        <div>
          <MonoLabel className="mb-2.5 text-lime">Exclusive partner</MonoLabel>
          <h2 id="partner-title" className="mb-2.5 text-[clamp(25px,2.7vw,36px)] leading-[1.12] tracking-[-0.03em] text-balance">
            Homegrown models, tuned for the job.
          </h2>
          <p className="max-w-[64ch] leading-[1.55] text-[#c9c9c5]">
            Unified Machines is the exclusive partner for Fahrenheit Research&rsquo;s homegrown, tuned AI models
            inside its products. Small models, fitted to each job, ours to keep running for years.
          </p>
        </div>
        <SplitButton href={FR_URL} external className="border-paper [--btn-shadow:var(--paper)] justify-self-start sm:col-span-2 lg:col-span-1 lg:col-start-3">
          Fahrenheit Research
        </SplitButton>
      </Reveal>
    </section>
  )
}
