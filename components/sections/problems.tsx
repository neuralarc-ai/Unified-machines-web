import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { SectionHead } from "@/components/site/section-head"
import { problems } from "@/lib/content"

const lit = "group-hover:translate-x-0 group-hover:text-ink group-focus-visible:translate-x-0 group-focus-visible:text-ink"

export function Problems() {
  return (
    <section id="problems" aria-labelledby="problems-title" className="container-page pb-18 md:pb-30">
      <SectionHead id="problems-title" label="Day-to-day problems">
        Small frictions, all day, every day.
        <br />
        That is where we look first.
      </SectionHead>

      <Stagger as="ul" gap={0.07} className="border-t-[1.5px] border-ink">
        {problems.map((p, i) => (
          <StaggerItem
            key={p.problem}
            as="li"
            tabIndex={0}
            className="group grid grid-cols-[40px_1fr] items-baseline gap-x-3.5 gap-y-2 border-b border-line py-5.5 transition-[padding] duration-300 outline-none hover:bg-[linear-gradient(90deg,var(--lime-soft),transparent_60%)] hover:pl-2 focus-visible:bg-[linear-gradient(90deg,var(--lime-soft),transparent_60%)] focus-visible:pl-2 lg:grid-cols-[48px_1fr_1fr] lg:gap-6"
          >
            <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-[clamp(20px,1.8vw,27px)] leading-[1.3] font-[450] tracking-[-0.02em] transition-colors duration-300 group-hover:text-pink-deep group-focus-visible:text-pink-deep">
              {p.problem}
            </span>
            <span
              className={`col-start-2 leading-[1.45] text-muted-foreground transition-[translate,color] duration-350 lg:col-start-3 lg:translate-x-2 ${lit}`}
            >
              {p.outcome}
            </span>
          </StaggerItem>
        ))}
      </Stagger>
      <p className="mt-3.5 font-mono text-xs text-muted-foreground">Hover or focus a line to see what we build toward.</p>
    </section>
  )
}
