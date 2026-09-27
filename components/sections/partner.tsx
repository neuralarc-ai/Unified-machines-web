import { FrLogo } from "@/components/brand/symbols"
import { Frame, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { MonoLabel } from "@/components/site/section-head"
import { SplitButton } from "@/components/site/split-button"
import { FR_URL, numbers } from "@/lib/content"

export function Partner() {
  return (
    <>
      <section id="partner" aria-labelledby="partner-title" className="bg-ink py-10 text-paper md:py-12">
        <Reveal className="container-page grid grid-cols-[auto_1fr] items-center gap-x-10 gap-y-6 lg:grid-cols-[auto_1fr_auto]">
          <a
            href={FR_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Fahrenheit Research website"
            className="block w-14 text-paper transition-colors duration-300 hover:text-lime md:w-22"
          >
            <FrLogo className="w-full" />
          </a>
          <div>
            <MonoLabel className="mb-2.5 text-lime">Exclusive partner</MonoLabel>
            <h2 id="partner-title" className="mb-2.5 text-[clamp(22px,2.2vw,30px)] tracking-[-0.03em]">
              Homegrown models, tuned for the job.
            </h2>
            <p className="max-w-170 leading-normal text-[#c9c9c5]">
              Unified Machines is the exclusive partner for Fahrenheit Research&rsquo;s homegrown, tuned AI models
              inside its products. Small models, fitted to each job, ours to keep running for years.
            </p>
          </div>
          <SplitButton href={FR_URL} external tone="ink" className="col-start-2 justify-self-start lg:col-start-3">
            Fahrenheit Research
          </SplitButton>
        </Reveal>
      </section>

      <section aria-label="Unified Machines in three numbers" className="container-page mb-18 md:mb-30">
        <Frame className="py-14 md:py-14">
          <Stagger gap={0.12} className="grid gap-6 md:grid-cols-3 md:gap-8">
            {numbers.map((n) => (
              <StaggerItem key={n.label} className="flex flex-col gap-1 border-l border-ink pl-5">
                <span className="text-[clamp(56px,7vw,104px)] leading-none font-medium tracking-[-0.05em]">{n.value}</span>
                <span className="font-mono text-xs">{n.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </Frame>
      </section>
    </>
  )
}
