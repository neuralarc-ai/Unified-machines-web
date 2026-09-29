import { Reveal, WordReveal } from "@/components/motion/reveal"
import { bodyLg, display } from "@/components/site/section-head"
import { WindowFrame } from "@/components/site/window-frame"

/**
 * Our thinking (option 4, chosen 2026-09-28): the statement, then its note
 * opened as a UM.OS file, carrying the desk's language down the page. The
 * name has its own section right after, so it no longer gets a window here.
 */
export function Thinking() {
  return (
    <section id="thinking" aria-labelledby="statement-title" className="container-page pt-4 pb-20 md:pt-14 md:pb-30">
      <WordReveal id="statement-title" className={display}>
        We build for the everyday, then build it to last.
      </WordReveal>

      <Reveal className="mx-auto mt-14 max-w-[720px] md:mt-20">
        <WindowFrame title="our-thinking.txt" bodyClassName="p-6 md:p-8">
          <p className={bodyLg}>
            Most software is built for the next quarter. The tools companies depend on every day deserve better:
            products with intelligence in the foundation, designed to stay useful as models change, teams grow and the
            work moves on. That is the foundation of Unified Machines.
          </p>
        </WindowFrame>
      </Reveal>

      <Reveal className="mt-10 flex justify-center md:mt-12">
        <p className="border-[1.5px] border-ink bg-lime px-4 py-2 font-mono text-sm shadow-hard-sm">
          Everyday problems. Uncommon possibilities.
        </p>
      </Reveal>
    </section>
  )
}
