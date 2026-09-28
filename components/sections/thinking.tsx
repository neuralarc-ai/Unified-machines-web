import { Frame, Stagger, StaggerItem, WordReveal } from "@/components/motion/reveal"
import { bodyLg, display, MonoLabel } from "@/components/site/section-head"
import { cn } from "@/lib/utils"

const column = "border-l border-ink pl-5"

export function Thinking() {
  return (
    <section id="thinking" aria-labelledby="statement-title">
      <Frame className="container-page py-18 md:pt-30 md:pb-27.5">
        <WordReveal id="statement-title" className={display}>
          We build for the everyday, then build it to last.
        </WordReveal>
      </Frame>

      <Stagger className="container-page grid gap-8 pb-18 md:grid-cols-2 md:gap-12 md:pb-27.5">
        <StaggerItem className={column}>
          <MonoLabel className="mb-5.5">Our thinking</MonoLabel>
          <p className={bodyLg}>
            Most software is built for the next quarter. The tools companies depend on every day deserve better:
            products with intelligence in the foundation, designed to stay useful as models change, teams grow and the
            work moves on. That is the foundation of Unified Machines.
          </p>
        </StaggerItem>
        <StaggerItem className={column}>
          <MonoLabel className="mb-5.5">The name</MonoLabel>
          <p className={cn(bodyLg, "mb-3.5")}>
            Unified is the point. Human ambition and machine intelligence, working toward one outcome: products people
            are glad to use for years. Less friction. More freedom. Something useful enough to become second nature.
          </p>
          <p className={cn(bodyLg, "font-medium")}>Everyday problems. Uncommon possibilities.</p>
        </StaggerItem>
      </Stagger>
    </section>
  )
}
