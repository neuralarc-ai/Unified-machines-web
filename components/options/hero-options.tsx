import Link from "next/link"
import { Desk } from "@/components/desk/desk"
import { Frame, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Hero layouts for review (2026-09-28). A is today's hero; B–D drop the
 * doubled "UM.OS 1.0 · Unified Machines" line, rework the layout and share one
 * shorter sub-copy. All keep the headline, the two buttons and the desk.
 */

const SUB = "AI products for companies, designed to stay useful for years, not quarters. Morse, for meetings, is the first."

function Actions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      <SplitButton href="#products">See our products</SplitButton>
      <Button size="cta" variant="outline" nativeButton={false} render={<Link href="#thinking" />}>
        How we think
      </Button>
    </div>
  )
}

function Title({ className }: { className?: string }) {
  return (
    <h1 id="hero-title" className={className}>
      <StaggerItem as="span" className="block">
        AI products built to last.
      </StaggerItem>
      <StaggerItem as="span" className="block">
        Intelligence at the core.
      </StaggerItem>
    </h1>
  )
}

/** A · Today's hero, unchanged, for comparison. */
export { Hero as HeroA } from "@/components/sections/hero/hero"

/** B · Centred: no brackets, everything on one axis, the desk given room below. */
export function HeroB() {
  return (
    <section aria-labelledby="hero-title" className="pt-16 md:pt-24">
      <Stagger gap={0.12} className="container-page flex flex-col items-center text-center">
        <Title className="text-[clamp(46px,6.6vw,92px)] text-balance" />
        <StaggerItem as="p" className="mt-6 max-w-[48ch] text-[clamp(18px,1.45vw,20px)] leading-[1.5] text-ink-soft">
          {SUB}
        </StaggerItem>
        <StaggerItem>
          <Actions className="mt-8 justify-center" />
        </StaggerItem>
      </Stagger>
      <Reveal className="container-page mt-16 md:mt-20" delay={0.3}>
        <Desk />
      </Reveal>
    </section>
  )
}

/** C · Editorial split: headline left, copy and buttons in a narrow column on its baseline, one rule instead of brackets. */
export function HeroC() {
  return (
    <section aria-labelledby="hero-title" className="pt-16 md:pt-24">
      <Stagger
        gap={0.12}
        className="container-page grid items-end gap-8 border-b border-ink pb-10 md:pb-14 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-12"
      >
        <Title className="text-[clamp(44px,5vw,70px)] lg:[&>span]:whitespace-nowrap" />
        <div>
          <StaggerItem as="p" className="text-[clamp(17px,1.3vw,19px)] leading-[1.5] text-ink-soft">
            {SUB}
          </StaggerItem>
          <StaggerItem>
            <Actions className="mt-6" />
          </StaggerItem>
        </div>
      </Stagger>
      <Reveal className="container-page mt-10 md:mt-14" delay={0.3}>
        <Desk />
      </Reveal>
    </section>
  )
}

/** D · Stage: open type on top, copy and buttons on one row, the brackets move out to frame the desk with room to breathe. */
export function HeroD() {
  return (
    <section aria-labelledby="hero-title" className="pt-16 md:pt-24">
      <Stagger gap={0.12} className="container-page">
        <Title className="text-[clamp(46px,6.9vw,96px)]" />
        <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
          <StaggerItem as="p" className="max-w-[40ch] text-[clamp(18px,1.45vw,20px)] leading-[1.5] text-ink-soft">
            {SUB}
          </StaggerItem>
          <StaggerItem>
            <Actions />
          </StaggerItem>
        </div>
      </Stagger>
      <Reveal className="container-page mt-12 md:mt-16" delay={0.3}>
        <Frame className="p-3 md:p-5">
          <Desk />
        </Frame>
      </Reveal>
    </section>
  )
}
