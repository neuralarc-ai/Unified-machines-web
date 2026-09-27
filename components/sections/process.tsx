import { EASE, Stagger, StaggerItem } from "@/components/motion/reveal"
import { MonoLabel, SectionHead } from "@/components/site/section-head"
import { phases } from "@/lib/content"

const DOTS = [0, 0.5, 1]

export function Process() {
  return (
    <section id="process" aria-labelledby="process-title" className="container-page pb-18 md:pb-30">
      <SectionHead id="process-title" label="How we work with enterprises">
        Research. Simplify. Build.
        <br />
        In that order, every time.
      </SectionHead>

      {/* a line draws across, then a lime stop pops at each phase */}
      <Stagger aria-hidden className="relative mt-2 mb-7 h-3">
        <StaggerItem
          as="span"
          className="absolute inset-x-0 top-[5px] h-[1.5px] origin-left bg-ink"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, ease: EASE } } }}
        />
        {DOTS.map((p) => (
          <StaggerItem
            key={p}
            as="span"
            className="absolute top-0 size-3 bg-lime"
            style={{ left: `${p * 100}%`, translate: `${-p * 100}% 0` }}
            variants={{
              hidden: { scale: 0 },
              show: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 14, delay: 0.3 + p * 1.1 } },
            }}
          />
        ))}
      </Stagger>

      <Stagger gap={0.25} className="grid gap-7 lg:grid-cols-3 lg:gap-10">
        {phases.map((phase, i) => (
          <StaggerItem key={phase.label} as="article" className="flex flex-col">
            <span className="mb-4.5 text-[clamp(56px,6vw,88px)] leading-none font-medium tracking-[-0.05em]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <MonoLabel className="mb-3.5 text-pink-deep">{phase.label}</MonoLabel>
            <h3 className="mb-3 text-[clamp(25px,2.25vw,31.5px)] tracking-[-0.03em]">{phase.title}</h3>
            <p className="leading-normal text-ink-soft">{phase.body}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
