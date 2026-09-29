import { Reveal } from "@/components/motion/reveal"
import { PanelAccordionItem } from "@/components/site/panel-accordion"
import { displaySm, MonoLabel } from "@/components/site/section-head"
import { Accordion } from "@/components/ui/accordion"
import { faqs } from "@/lib/content"

/**
 * FAQ in two columns (2026-09-29): the heading holds on the left while the
 * questions run down the right, so the section reads on one alignment instead
 * of a centred title over a left-set list.
 */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="grid-ground-ink py-20 text-paper md:py-30">
      <div className="container-page grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <Reveal className="flex flex-col gap-5 lg:sticky lg:top-32">
          <MonoLabel className="text-lime">FAQ</MonoLabel>
          <h2 id="faq-title" className={displaySm}>
            Questions, answered.
          </h2>
          <p className="max-w-[34ch] text-lg leading-[1.45] text-paper/60">
            What we build, what &ldquo;built to last&rdquo; means, and where Morse is today.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion defaultValue={["faq-0"]}>
            {faqs.map((f, i) => (
              <PanelAccordionItem key={f.q} value={`faq-${i}`} title={f.q} tone="paper">
                {f.a}
              </PanelAccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}
