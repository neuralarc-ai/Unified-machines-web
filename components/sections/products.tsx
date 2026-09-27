import { HugeiconsIcon } from "@hugeicons/react"
import {
  AiChat02Icon,
  ArrowUpRight01Icon,
  CalendarAdd01Icon,
  NoteEditIcon,
  RecordIcon,
  SubtitleIcon,
  Video01Icon,
  WhiteboardIcon,
} from "@hugeicons/core-free-icons"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { bodyLg, displaySm, MonoLabel, SectionHead } from "@/components/site/section-head"
import { Badge } from "@/components/ui/badge"
import { SplitButton } from "@/components/site/split-button"
import { MorseDemo } from "./morse-demo"
import { MORSE_URL, morse, roadmap } from "@/lib/content"
import { cn } from "@/lib/utils"

const external = { target: "_blank", rel: "noopener noreferrer" } as const

/** An icon that shows each tool Morse replaces, by its name in `morse.jobs`. */
const JOB_ICONS: Record<string, typeof Video01Icon> = {
  "Video call": Video01Icon,
  Notetaker: NoteEditIcon,
  Recordings: RecordIcon,
  Transcripts: SubtitleIcon,
  "In-call assistant": AiChat02Icon,
  Whiteboard: WhiteboardIcon,
  "Booking link": CalendarAdd01Icon,
}

const popIn = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 380, damping: 20 } },
}

/** Panel side labels sit on a paper chip, so the dot grid never runs through the words. */
function SideLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-block border border-ink bg-paper px-1.5 py-px font-mono text-xs leading-normal">
      {children}
    </span>
  )
}

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

      <Reveal className="dot-grid relative overflow-hidden rounded-[10px] border border-ink bg-lime-tint">
        <Badge variant="tag" className="absolute top-2.5 left-3 max-w-[calc(100%-1.5rem)] whitespace-normal">
          01 / Meetings and the ecosystem around them
        </Badge>

        <div className="grid grid-cols-1 items-center gap-10 px-4 pt-14 pb-10 md:px-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.3fr)] lg:gap-8">
          <div>
            <SideLabel>Today</SideLabel>
            {/* the number says how many, the dock says which */}
            <div className="grid grid-cols-1 items-center gap-x-7 gap-y-5 sm:grid-cols-[auto_minmax(0,1fr)]">
              <Reveal
                aria-hidden
                className="text-[clamp(120px,14vw,180px)] leading-[0.82] font-medium tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_var(--ink)]"
              >
                {morse.jobs.length}
              </Reveal>
              <Stagger as="ul" gap={0.06} delay={0.2} className="grid grid-cols-3 gap-x-2.5 gap-y-4.5 sm:grid-cols-4">
                {morse.jobs.map((job) => (
                  <StaggerItem key={job} as="li" variants={popIn} className="group flex flex-col items-center gap-2 text-center">
                    <span className="grid size-16 place-items-center border-[1.5px] border-ink bg-chalk shadow-hard-sm transition-[translate,box-shadow,background-color] duration-150 group-hover:-translate-px group-hover:bg-lime group-hover:shadow-hard motion-reduce:transition-none">
                      <HugeiconsIcon icon={JOB_ICONS[job]} strokeWidth={1.5} className="size-7.5" />
                    </span>
                    <span className="font-mono text-[12.5px] leading-tight">{job}</span>
                  </StaggerItem>
                ))}
              </Stagger>
              <p className="border-t border-ink pt-2.5 text-[17px] text-ink-soft sm:col-span-2">
                <span className="sr-only">{morse.jobs.length} </span>
                tools, logins and bills for one meeting.
              </p>
            </div>
          </div>

          <Reveal delay={0.6} className="flex justify-center">
            <Badge variant="tag" className="px-2 py-1 text-[14.5px]">
              {morse.jobs.length} &rarr; 1
            </Badge>
          </Reveal>

          <div>
            <SideLabel>With Morse · one app</SideLabel>
            <Reveal delay={0.35}>
              <MorseDemo />
            </Reveal>
          </div>
        </div>

        <div className="grid items-end gap-4.5 border-t border-ink bg-chalk px-4 py-5 md:gap-8 md:px-10 lg:grid-cols-[1fr_1fr_auto]">
          <div>
            <MonoLabel className="mb-1.5">Today</MonoLabel>
            <span className="text-[17px]">Seven tools. Seven logins. Seven bills.</span>
          </div>
          <div>
            <MonoLabel className="mb-1.5">With Morse</MonoLabel>
            <span className="text-[17px]">The call, the notes and the follow-up in one place.</span>
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
