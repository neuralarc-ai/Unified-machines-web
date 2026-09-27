import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { MorseMark } from "@/components/brand/symbols"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { bodyLg, displaySm, MonoLabel, SectionHead } from "@/components/site/section-head"
import { Signal } from "@/components/site/signal"
import { WindowFrame } from "@/components/site/window-frame"
import { Badge } from "@/components/ui/badge"
import { SplitButton } from "@/components/site/split-button"
import { MORSE_URL, morseFlow, roadmap } from "@/lib/content"
import { cn } from "@/lib/utils"

const external = { target: "_blank", rel: "noopener noreferrer" } as const

const tossIn = (i: number) => ({
  hidden: { opacity: 0, y: 24, rotate: -4 },
  show: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring" as const, stiffness: 260, damping: 18, delay: i * 0.12 } },
})

/** The three tools a meeting needs today, stacked like overlapping windows. */
const miniWindows = [
  {
    title: "Video call",
    body: Array.from({ length: 4 }, (_, i) => <span key={i} className="size-5.5 rounded-full bg-ink" />),
  },
  {
    title: "Scheduling link",
    body: Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={cn("h-5 w-6.5 border border-ink", i === 2 && "bg-lime")} />
    )),
  },
  {
    title: "Notetaker bot",
    body: ["w-full", "w-3/5", "w-full"].map((w, i) => <span key={i} className={cn("h-1.5 bg-ink", w)} />),
  },
]

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} {...external} className="inline-flex items-center gap-1.5 font-mono text-xs underline underline-offset-3">
      {children} <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={1.5} className="size-3.5" />
    </a>
  )
}

export function Products() {
  return (
    <section id="products" aria-labelledby="products-title" className="container-page pb-18 md:pb-30">
      <SectionHead id="products-title" label="Our products">
        A family of products.
        <br />
        Morse is the first.
      </SectionHead>

      <Reveal className="dot-grid relative rounded-[10px] border border-ink bg-lime-tint px-4 pt-14 pb-6 md:px-10 md:pt-16 md:pb-8">
        <Badge variant="tag" className="absolute top-2.5 left-3">
          01 / Meetings and the ecosystem around them
        </Badge>

        <div className="grid min-h-90 items-stretch gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Stagger aria-label="The way meetings work today" className="relative min-h-70 md:min-h-80">
            {miniWindows.map((w, i) => (
              <StaggerItem
                key={w.title}
                variants={tossIn(i)}
                className="absolute w-[64%] md:w-[56%]"
                style={{ left: `${i * 18}%`, top: `${i * 24}%` }}
              >
                <WindowFrame title={w.title} className="shadow-hard" bodyClassName="min-h-17.5 flex-row flex-wrap gap-1.5">
                  {w.body}
                </WindowFrame>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.35}>
            <WindowFrame
              aria-label="Morse brings meeting, scheduling and memory into one place"
              title={
                <>
                  <MorseMark className="size-3.5" />
                  Morse
                </>
              }
              className="bg-chalk"
              bodyClassName="p-5.5"
            >
              <Stagger gap={0.15} delay={0.5} className="grid gap-3 md:grid-cols-3 md:gap-4.5">
                {morseFlow.map((step, i) => (
                  <StaggerItem key={step.title} className="flex flex-col gap-1.5 border-t-[1.5px] border-ink pt-2.5">
                    <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                    <strong className="text-[22px] font-medium tracking-[-0.03em]">{step.title}</strong>
                    <span className="text-sm text-muted-foreground">{step.body}</span>
                  </StaggerItem>
                ))}
              </Stagger>
              <Signal bars={60} scale={1.7} className="mt-4.5 h-16 gap-[3px]" barClassName="w-1.5" />
            </WindowFrame>
          </Reveal>
        </div>

        <div className="mt-10 grid items-end gap-4.5 md:gap-8 lg:grid-cols-[1fr_1fr_auto]">
          <div>
            <MonoLabel className="mb-1.5">Today</MonoLabel>
            <span className="text-[15px]">Three tools. Three tabs. Three bills.</span>
          </div>
          <div>
            <MonoLabel className="mb-1.5">With Morse</MonoLabel>
            <span className="text-[15px]">The calendar, the call and the memory in one place.</span>
          </div>
          <ExternalLink href={MORSE_URL}>onmorse.com</ExternalLink>
        </div>
      </Reveal>

      <Stagger className="mt-16 grid gap-12 lg:grid-cols-2">
        <StaggerItem className="border-l border-ink pl-5">
          <MonoLabel className="mb-5.5">Morse</MonoLabel>
          <h3 className={displaySm}>
            A meeting is a moment.
            <br />
            Make more of it.
          </h3>
        </StaggerItem>
        <StaggerItem className="border-l border-ink pl-5">
          <p className={cn(bodyLg, "mb-3.5 max-w-130")}>
            Morse addresses the calendar and the whole ecosystem around meetings: scheduling, the conversation itself
            and what everyone needs to remember afterwards, in one connected experience. Less switching. More presence.
          </p>
          <p className={cn(bodyLg, "mb-3.5 max-w-130")}>Morse is being built now. Follow along at onmorse.com.</p>
          <SplitButton href={MORSE_URL} external className="mt-2.5">
            Explore Morse
          </SplitButton>
        </StaggerItem>
      </Stagger>

      <div className="mt-12 grid gap-12 border-t-[1.5px] border-ink pt-8 md:mt-20 lg:grid-cols-2">
        <Reveal>
          <MonoLabel className="mb-5.5">What comes next</MonoLabel>
          <p className={cn(bodyLg, "max-w-130")}>
            Morse is one product. The rest of the family is in research now, across the different areas and domains a
            business runs on. We announce each one when it is real, never before.
          </p>
        </Reveal>
        <Stagger as="ul" gap={0.08}>
          {roadmap.map((item, i) => (
            <StaggerItem
              key={i}
              as="li"
              className={cn(
                "grid grid-cols-[36px_1fr_auto] items-center gap-4 border-b border-line py-3.5 text-lg",
                !item.live && "text-muted-foreground"
              )}
            >
              <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
              <span>{item.name}</span>
              <Badge
                variant="outline"
                className={cn(
                  "h-auto rounded-none border-current px-2 py-px font-mono text-xs font-normal",
                  item.live && "border-lime bg-lime text-ink"
                )}
              >
                {item.status}
              </Badge>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
