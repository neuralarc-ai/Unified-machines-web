import { Frame, Reveal, WordReveal } from "@/components/motion/reveal"
import { PanelAccordionItem } from "@/components/site/panel-accordion"
import { display } from "@/components/site/section-head"
import { Accordion } from "@/components/ui/accordion"
import { faqs } from "@/lib/content"

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-ink pt-16 pb-20 text-paper md:pt-25 md:pb-35">
      <Frame tone="paper" className="container-page pt-0 md:pt-0">
        <WordReveal id="faq-title" className={display}>
          Questions, answered.
        </WordReveal>
      </Frame>

      <div className="container-page mt-10">
        <Reveal className="max-w-240">
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
