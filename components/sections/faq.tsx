import { Glyph } from "@/components/brand/symbols"
import { Frame, Reveal, WordReveal } from "@/components/motion/reveal"
import { PanelAccordionItem } from "@/components/site/panel-accordion"
import { display, MonoLabel } from "@/components/site/section-head"
import { Accordion } from "@/components/ui/accordion"
import { faqs } from "@/lib/content"

const B64 = Buffer.from(
  "Unified Machines. Human ambition and machine intelligence, working as one. Build what matters."
)
  .toString("base64")
  .replace(/(.{22})/g, "$1\n")

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-ink pt-16 pb-20 text-paper md:pt-25 md:pb-35">
      <Frame tone="paper" className="container-page pt-0 md:pt-0">
        <WordReveal id="faq-title" className={display}>
          We give a FAQ.
        </WordReveal>
      </Frame>

      <div className="container-page mt-10 grid gap-16 lg:grid-cols-[1fr_240px]">
        <Reveal>
          <Accordion defaultValue={["faq-0"]}>
            {faqs.map((f, i) => (
              <PanelAccordionItem key={f.q} value={`faq-${i}`} title={f.q} tone="paper">
                {f.a}
              </PanelAccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <Reveal delay={0.2} aria-hidden className="hidden flex-col gap-5 self-end text-[#a8a8a4] lg:flex">
          <MonoLabel className="text-paper">[B.64]</MonoLabel>
          <pre className="font-mono text-[11px] leading-[1.35] break-all whitespace-pre-wrap">{B64}</pre>
          <Frame tone="paper" className="flex justify-center p-8 md:p-8">
            <Glyph symbol="heart" className="size-12 text-paper" />
          </Frame>
        </Reveal>
      </div>
    </section>
  )
}
