import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { MorseMark } from "@/components/brand/symbols"
import { Contours } from "@/components/brand/contours"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { MORSE_URL, tools } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * Consolidation, rebuilt on the um-landing redesign's structure (2026-09-28):
 * a dark ruled band, a statement headline, then three bordered columns: the
 * idea on a stepped colour block, the count with Morse docked beneath it, and
 * what consolidation means, with the twelve tools ticked off. The redesign's
 * highlight boxes and pixel type were left behind; the Morse window is drawn
 * in the current Morse app palette.
 */

// Morse app, dark theme (morse-app-design, fluid.css)
const M = {
  bg: "#141413",
  surface: "#1d1d1c",
  raised: "#2c2b2a",
  ink: "#efefea",
  muted: "#9f9e9c",
  rule: "#363534",
  coral: "#fe886a",
  coralSoft: "#3f231c",
  lime: "#e5f700",
  limeInk: "#08191c",
}

const PEOPLE = [
  { name: "Priya", src: "/avatars/ember.webp" },
  { name: "Jamie", src: "/avatars/fjord.webp" },
  { name: "Dan", src: "/avatars/lagoon.webp" },
]

// the idea, in two tones: the words that carry it read bright
const IDEA = [
  { t: "One surface", on: true },
  { t: "with intelligence inside, and the data in", on: false },
  { t: "one place", on: true },
  { t: "your organisation owns.", on: false },
]

const col = "relative flex flex-col bg-[#151515] p-6 md:p-8 lg:min-h-[620px]"
const tag = "font-mono text-xs tracking-[0.02em] text-paper/55"

/** One meeting in Morse: the call, its notes and the follow-up, in one window. */
function MorseWindow() {
  return (
    <div
      className="overflow-hidden rounded-tl-[14px] border-t border-l text-[12px] shadow-[0_-24px_60px_-20px_rgb(0_0_0/0.7)]"
      style={{ background: M.bg, color: M.ink, borderColor: M.rule }}
    >
      <div
        className="flex h-10 items-center justify-between border-b px-3.5"
        style={{ background: M.surface, borderColor: M.rule }}
      >
        <span className="flex items-center gap-2 font-medium">
          <MorseMark className="size-4" />
          Weekly sync
        </span>
        <span className="flex items-center gap-1.5" style={{ color: M.coral }}>
          <i
            className="size-1.5 animate-pulse rounded-full motion-reduce:animate-none"
            style={{ background: M.coral }}
          />
          Recording
        </span>
      </div>

      <div className="flex flex-col gap-2.5 p-3">
        <div className="grid grid-cols-3 gap-2">
          {PEOPLE.map((p) => (
            <div key={p.name} className="relative aspect-[4/3] overflow-hidden rounded-[10px]">
              {/* abstract gradient tiles stand in for cameras; no photos of people */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="size-full object-cover" />
              <span className="absolute bottom-1.5 left-1.5 rounded-[5px] bg-black/55 px-1.5 py-0.5 text-[10.5px] leading-none">
                {p.name}
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[10px] p-2.5" style={{ background: M.surface }}>
            <p className="text-[10px] tracking-[0.08em] uppercase" style={{ color: M.muted }}>
              Notes
            </p>
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 whitespace-nowrap">
              <span
                className="grid size-3.5 shrink-0 place-items-center rounded-[4px]"
                style={{ background: M.lime, color: M.limeInk }}
              >
                <HugeiconsIcon icon={Tick02Icon} strokeWidth={3} className="size-2.5" />
              </span>
              Launch brief · Fri
            </p>
          </div>
          <div className="rounded-[10px] p-2.5" style={{ background: M.surface }}>
            <p className="text-[10px] tracking-[0.08em] uppercase" style={{ color: M.muted }}>
              Follow-up
            </p>
            <p className="mt-1.5 flex items-center justify-between gap-2">
              Thu 14:00
              <span
                className="rounded-full px-2 py-0.5 text-[10.5px]"
                style={{ background: M.coralSoft, color: M.coral }}
              >
                Booked
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Consolidate() {
  return (
    <section
      id="consolidate"
      aria-labelledby="cons-title"
      className="grid-ground-ink bg-ink text-paper relative overflow-hidden"
    >
      {/* contour lines around stepped shapes in the top corners, behind everything */}
      <Contours
        corner="tl"
        steps={[
          [0.12, 0.22],
          [0.06, 0.62],
        ]}
        className="text-paper/[0.09] max-md:hidden"
      />
      <Contours
        corner="tr"
        steps={[
          [0.2, 0.16],
          [0.11, 0.46],
          [0.05, 0.86],
        ]}
        className="text-paper/[0.09] max-md:hidden"
      />
      {/*
        One grid runs under the whole band. The strip and headline are whole cells tall, so the grid's own lines
        frame them; no borders are drawn on top, which would double those lines.
      */}
      <div>
        <div className="container-page relative">
          <div className="flex h-(--cell) items-center justify-between gap-6 px-4 md:px-8">
            <p className={cn(tag, "uppercase")}>[ Consolidation ] · One job, one app</p>
            <p className={cn(tag, "hidden md:block")}>Meet · Schedule · Remember · Decide · Find</p>
          </div>

          <Reveal className="grid h-[calc(var(--cell)*6)] content-end items-end gap-6 px-4 pb-10 md:px-8 md:pb-16 lg:grid-cols-[1fr_auto] lg:gap-8">
            <h2 id="cons-title" className="text-[clamp(52px,8.4vw,124px)] leading-[0.92] tracking-[-0.05em]">
              Twelve tools.
              <br />
              <span className="pl-[1.1em] text-lime">One app.</span>
            </h2>
            <p className="max-w-[30ch] text-lg leading-[1.45] text-paper/60 lg:mb-3">
              Twelve logins. Twelve bills. Twelve places the answer might be.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container-page relative">
        {/* dividers in the grid lines' own colour (8% paper on ink), opaque so nothing stacks under them */}
        <Stagger gap={0.12} className="grid gap-px bg-[#222222] lg:grid-cols-3">
          {/* 1 · the idea */}
          <StaggerItem className={cn(col, "justify-between gap-40 overflow-hidden")}>
            <p className={tag}>1 · The idea</p>
            <PixelSteps
              corner="tr"
              className="h-[34%] w-[56%] max-lg:h-40"
              steps={[
                [100, 58],
                [52, 100],
              ]}
              from="#ff6fb0"
              to="#caeb6b"
            />
            <div className="relative">
              <p className="text-[clamp(28px,2.35vw,36px)] leading-[1.14] tracking-[-0.035em]">
                {IDEA.map((w, i) => (
                  <span key={i} className={w.on ? "text-paper" : "text-paper/40"}>
                    {w.t}
                    {i < IDEA.length - 1 && " "}
                  </span>
                ))}
              </p>
              <SplitButton href={MORSE_URL} external className="mt-9 border-paper [--btn-shadow:var(--paper)]">
                Visit Morse
              </SplitButton>
            </div>
          </StaggerItem>

          {/* 2 · Morse: the count, with the app docked below it */}
          <StaggerItem className={cn(col, "overflow-hidden pb-0 md:pb-0")}>
            <p className={tag}>2 · Morse</p>
            <div className="mt-12 md:mt-16">
              <p className="flex items-baseline gap-[0.12em] text-[clamp(96px,9.6vw,150px)] leading-[0.82] font-medium tracking-[-0.06em]">
                12
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  strokeWidth={1.25}
                  className="size-[0.62em] self-center text-lime"
                />
                1
              </p>
              <p className="mt-5 text-xl leading-[1.35] tracking-[-0.02em] text-paper/75">
                Tools down to one app.
                <br />
                <span className="text-paper">Morse, for meetings, is the first.</span>
              </p>
            </div>
            <div className="mt-12 -mr-6 ml-6 md:-mr-8 lg:absolute lg:right-0 lg:bottom-0 lg:m-0 lg:w-[88%]">
              <MorseWindow />
            </div>
          </StaggerItem>

          {/* 3 · what it means, the twelve ticked off */}
          <StaggerItem className={col}>
            <p className={tag}>3 · What it means</p>
            <p className="mt-12 text-[17px] leading-[1.55] text-paper/85 md:mt-16">
              A functional app covers a whole job. Meetings are one job, so Morse holds the call, the calendar and the
              memory. Each product we build takes a cluster of tools your teams juggle today and turns it into one
              surface with intelligence inside.
            </p>
            <Stagger as="ul" gap={0.05} delay={0.3} className="mt-8 mb-10 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {tools.map((t) => (
                <StaggerItem
                  key={t}
                  as="li"
                  className="flex items-center gap-2.5 text-[15px]"
                  variants={{
                    hidden: { opacity: 0, x: -6 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.25} className="size-4 shrink-0 text-lime" />
                  <span className="text-paper/45 line-through decoration-paper/35">{t}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <div className="mt-auto border-t border-paper/10 pt-6 max-lg:mt-10">
              <p className={tag}>What it does not mean</p>
              <p className="mt-2.5 text-[15px] leading-[1.5] text-paper/60">
                A portal that puts the same twelve tools behind one login. It only counts when the steps disappear and
                the data lives in one place you own.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
