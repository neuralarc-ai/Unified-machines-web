import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { bodyLg, displaySm, MonoLabel, SectionHead } from "@/components/site/section-head"
import { Badge } from "@/components/ui/badge"
import { SplitButton } from "@/components/site/split-button"
import { MorseDemo } from "./morse-demo"
import { MORSE_URL, roadmap } from "@/lib/content"
import { cn } from "@/lib/utils"

export function Products() {
  return (
    <section id="products" aria-labelledby="products-title" className="container-page pb-18 md:pb-30">
      <SectionHead id="products-title" label="Our products">
        A family of products.
        <br />
        Morse is the first.
      </SectionHead>

      <Reveal className="dot-grid relative overflow-hidden rounded-[10px] border border-ink bg-lime-tint">
        <Badge variant="tag" className="absolute top-2.5 left-3 max-w-[calc(100%-1.5rem)] whitespace-normal">
          01 / Meetings and the ecosystem around them
        </Badge>

        <div className="grid items-center gap-10 px-4 pt-16 pb-10 md:px-10 md:pt-20 md:pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* the words sit on a chalk card, so the dot grid never runs through them */}
          <div className="border border-ink bg-chalk p-6 shadow-hard-sm md:p-8">
            <MonoLabel className="mb-5">Morse</MonoLabel>
            <h3 className={displaySm}>
              A meeting is a moment.
              <br />
              Make more of it.
            </h3>
            <p className={cn(bodyLg, "mt-6 mb-3.5")}>
              Morse addresses the calendar and the whole ecosystem around meetings: scheduling, the conversation itself
              and what everyone needs to remember afterwards, in one connected experience. Less switching. More
              presence.
            </p>
            <p className={cn(bodyLg, "text-ink-soft")}>Morse is being built now. Follow along at onmorse.com.</p>
            <SplitButton href={MORSE_URL} external className="mt-7">
              Explore Morse
            </SplitButton>
          </div>
          <MorseDemo />
        </div>
      </Reveal>

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
                !item.live && "text-muted-foreground",
              )}
            >
              <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
              <span>{item.name}</span>
              <Badge
                variant="outline"
                className={cn(
                  "h-auto rounded-none border-current px-2 py-px font-mono text-xs font-normal",
                  item.live && "border-lime bg-lime text-ink",
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
