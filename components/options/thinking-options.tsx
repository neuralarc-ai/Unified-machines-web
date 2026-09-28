import { Frame, Reveal, Stagger, StaggerItem, WordReveal } from "@/components/motion/reveal"
import { bodyLg, display, displaySm, MonoLabel } from "@/components/site/section-head"
import { WindowFrame } from "@/components/site/window-frame"
import { cn } from "@/lib/utils"

/**
 * "We build for the everyday" layouts for review (2026-09-28). Same words in
 * every option; only the arrangement changes. Current is today's section.
 */

const STATEMENT = "We build for the everyday, then build it to last."
const THINKING =
  "Most software is built for the next quarter. The tools companies depend on every day deserve better: products with intelligence in the foundation, designed to stay useful as models change, teams grow and the work moves on. That is the foundation of Unified Machines."
const NAME =
  "Unified is the point. Human ambition and machine intelligence, working toward one outcome: products people are glad to use for years. Less friction. More freedom. Something useful enough to become second nature."
const TAG = "Everyday problems. Uncommon possibilities."

const column = "border-l border-ink pl-5"

/** Current: centred statement in brackets, two ruled columns. */
export function ThinkingNow() {
  return (
    <section id="thinking" aria-labelledby="statement-title">
      <Frame className="container-page py-18 md:pt-30 md:pb-27.5">
        <WordReveal id="statement-title" className={display}>
          {STATEMENT}
        </WordReveal>
      </Frame>
      <Stagger className="container-page grid gap-8 pb-18 md:grid-cols-2 md:gap-12 md:pb-27.5">
        <StaggerItem className={column}>
          <MonoLabel className="mb-5.5">Our thinking</MonoLabel>
          <p className={bodyLg}>{THINKING}</p>
        </StaggerItem>
        <StaggerItem className={column}>
          <MonoLabel className="mb-5.5">The name</MonoLabel>
          <p className={cn(bodyLg, "mb-3.5")}>{NAME}</p>
          <p className={cn(bodyLg, "font-medium")}>{TAG}</p>
        </StaggerItem>
      </Stagger>
    </section>
  )
}

/** 1 · Editorial: left-aligned statement, then two numbered notes under one rule and the line that sums it up. */
export function Thinking1() {
  return (
    <section id="thinking" aria-labelledby="statement-title" className="container-page py-20 md:py-30">
      <Reveal>
        <MonoLabel className="mb-6 text-muted-foreground">Our thinking</MonoLabel>
        <h2 id="statement-title" className="max-w-[22ch] text-[clamp(42px,5.6vw,80px)] text-balance">
          {STATEMENT}
        </h2>
      </Reveal>
      <Stagger className="mt-14 grid gap-10 border-t-[1.5px] border-ink pt-8 md:mt-20 md:grid-cols-[120px_1fr_1fr] md:gap-12">
        <StaggerItem as="p" className="font-mono text-xs text-muted-foreground">
          Why we exist
        </StaggerItem>
        <StaggerItem>
          <p className="mb-3 font-mono text-xs">01 · The work</p>
          <p className={bodyLg}>{THINKING}</p>
        </StaggerItem>
        <StaggerItem>
          <p className="mb-3 font-mono text-xs">02 · The name</p>
          <p className={bodyLg}>{NAME}</p>
        </StaggerItem>
      </Stagger>
      <Reveal className="mt-12 md:mt-16 md:pl-[168px]">
        <p className="text-[clamp(26px,2.6vw,38px)] leading-[1.15] font-medium tracking-[-0.03em]">
          Everyday problems. <span className="bg-lime px-1.5">Uncommon possibilities.</span>
        </p>
      </Reveal>
    </section>
  )
}

/** 2 · Sticky split: the statement holds on the left while the two notes scroll past on the right. */
export function Thinking2() {
  return (
    <section id="thinking" aria-labelledby="statement-title" className="container-page py-20 md:py-30">
      <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal className="flex flex-col gap-5 lg:sticky lg:top-32">
          <MonoLabel>Our thinking</MonoLabel>
          <h2 id="statement-title" className={displaySm}>
            {STATEMENT}
          </h2>
        </Reveal>
        <Stagger as="ol" className="border-t-[1.5px] border-ink">
          {[
            ["01", "The work", THINKING],
            ["02", "The name", NAME],
          ].map(([n, label, body]) => (
            <StaggerItem key={n} as="li" className="grid grid-cols-[40px_1fr] gap-x-4 border-b border-line py-8">
              <span className="font-mono text-xs">{n}</span>
              <div>
                <p className="mb-3 font-mono text-xs text-muted-foreground">{label}</p>
                <p className={bodyLg}>{body}</p>
              </div>
            </StaggerItem>
          ))}
          <StaggerItem as="li" className="mt-8 border-[1.5px] border-ink bg-lime-tint px-5 py-4 shadow-hard-sm">
            <p className="text-[clamp(20px,1.8vw,26px)] leading-tight font-medium tracking-[-0.02em]">{TAG}</p>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}

/** 3 · Ink band: the statement on black, a change of pace right after the bright desk. */
export function Thinking3() {
  return (
    <section id="thinking" aria-labelledby="statement-title" className="mt-20 bg-ink py-20 text-paper md:mt-30 md:py-30">
      <Frame tone="paper" className="container-page">
        <WordReveal id="statement-title" className={display}>
          {STATEMENT}
        </WordReveal>
      </Frame>
      <Stagger className="container-page mt-12 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-16">
        <StaggerItem className="border-l border-paper/40 pl-5">
          <MonoLabel className="mb-5 text-lime">Our thinking</MonoLabel>
          <p className={cn(bodyLg, "text-paper/85")}>{THINKING}</p>
        </StaggerItem>
        <StaggerItem className="border-l border-paper/40 pl-5">
          <MonoLabel className="mb-5 text-lime">The name</MonoLabel>
          <p className={cn(bodyLg, "text-paper/85")}>{NAME}</p>
        </StaggerItem>
      </Stagger>
      <Reveal className="container-page mt-14 text-center md:mt-20">
        <p className="font-mono text-sm text-paper/70">{TAG}</p>
      </Reveal>
    </section>
  )
}

/** 4 · Two windows: the notes open as UM.OS files under the statement, carrying the desk's language down the page. */
export function Thinking4() {
  return (
    <section id="thinking" aria-labelledby="statement-title" className="container-page py-20 md:py-30">
      <WordReveal id="statement-title" className={display}>
        {STATEMENT}
      </WordReveal>
      <Stagger className="mx-auto mt-14 grid max-w-[1120px] gap-8 md:mt-20 md:grid-cols-2 md:gap-10">
        <StaggerItem>
          <WindowFrame title="our-thinking.txt" bodyClassName="p-6 md:p-7" className="h-full">
            <p className={bodyLg}>{THINKING}</p>
          </WindowFrame>
        </StaggerItem>
        <StaggerItem className="md:translate-y-10">
          <WindowFrame title="the-name.txt" bodyClassName="p-6 md:p-7" className="h-full">
            <p className={bodyLg}>{NAME}</p>
          </WindowFrame>
        </StaggerItem>
      </Stagger>
      <Reveal className="mt-16 flex justify-center md:mt-24">
        <p className="border-[1.5px] border-ink bg-lime px-4 py-2 font-mono text-sm shadow-hard-sm">{TAG}</p>
      </Reveal>
    </section>
  )
}
