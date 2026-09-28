import { Reveal, Stagger, StaggerItem, WordReveal } from "@/components/motion/reveal"
import { bodyLg, display } from "@/components/site/section-head"
import { WindowFrame } from "@/components/site/window-frame"

/**
 * Our thinking (option 4, chosen 2026-09-28): the statement, then its two
 * notes opened as UM.OS files, carrying the desk's language down the page.
 */
export function Thinking() {
  return (
    <section id="thinking" aria-labelledby="statement-title" className="container-page pt-4 pb-20 md:pt-14 md:pb-30">
      <WordReveal id="statement-title" className={display}>
        We build for the everyday, then build it to last.
      </WordReveal>

      <Stagger className="mx-auto mt-14 grid max-w-[1120px] gap-8 md:mt-20 md:grid-cols-2 md:gap-10">
        <StaggerItem>
          <WindowFrame title="our-thinking.txt" bodyClassName="p-6 md:p-7" className="h-full">
            <p className={bodyLg}>
              Most software is built for the next quarter. The tools companies depend on every day deserve better:
              products with intelligence in the foundation, designed to stay useful as models change, teams grow and
              the work moves on. That is the foundation of Unified Machines.
            </p>
          </WindowFrame>
        </StaggerItem>
        {/* set a step lower, like a second window opened after the first */}
        <StaggerItem className="md:translate-y-10">
          <WindowFrame title="the-name.txt" bodyClassName="p-6 md:p-7" className="h-full">
            <p className={bodyLg}>
              Unified is the point. Human ambition and machine intelligence, working toward one outcome: products
              people are glad to use for years. Less friction. More freedom. Something useful enough to become second
              nature.
            </p>
          </WindowFrame>
        </StaggerItem>
      </Stagger>

      <Reveal className="mt-16 flex justify-center md:mt-24">
        <p className="border-[1.5px] border-ink bg-lime px-4 py-2 font-mono text-sm shadow-hard-sm">
          Everyday problems. Uncommon possibilities.
        </p>
      </Reveal>
    </section>
  )
}
