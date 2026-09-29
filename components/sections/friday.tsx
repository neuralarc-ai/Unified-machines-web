"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { Contours } from "@/components/brand/contours"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { useMotionState } from "@/components/motion/motion-provider"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { FRIDAY_URL } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * Friday, the second product (2026-09-29), in the same band as Morse's
 * (Consolidation): a label strip, a statement headline, then three columns:
 * the idea on stepped colour, the figure with Friday's editor docked below it,
 * and what it does. The editor is drawn in Friday's own UI colours (from its
 * site's HeroMockup); its canvas cycles through Friday's background swatches
 * as the real one does. Every claim is from fridayapp.fun.
 */

// Friday's editor, dark UI (friday-main, HeroMockup.module.css)
const F = {
  app: "#12151a",
  head: "#171a20",
  line: "rgb(255 255 255 / 0.06)",
  ink: "#e5e9ee",
  muted: "#7d8590",
  timeline: "#0c0e12",
  clip: "#5ad99e",
  zoom: "rgb(155 45 80 / 0.85)",
}
// three of Friday's background swatches, as its own demo clicks through them
const SWATCHES = [
  { name: "Current", bg: "linear-gradient(135deg,#f5a35c,#e8546f)" },
  { name: "Bloom", bg: "linear-gradient(135deg,#e84f8a,#b3245c)" },
  { name: "Aurora", bg: "linear-gradient(135deg,#4fc3d9,#3f7fd9)" },
]

const IDEA = [
  { t: "Every click", on: true },
  { t: "becomes a smooth zoom, and every recording", on: false },
  { t: "a launch video.", on: true },
]

const FEATURES = [
  "Record anything",
  "Smooth cursor",
  "Camera bubble",
  "Auto-frame for Reels",
  "AI Edit",
  "Auto-zoom",
  "Intro animations",
  "Liquid-glass looks",
]

const col = "relative flex flex-col bg-[#151515] p-6 md:p-8 lg:min-h-[660px]"
const tag = "font-mono text-xs tracking-[0.02em] text-paper/55"

/** Friday's editor, small: the recording on a swatch-coloured frame, and its timeline. */
function FridayWindow() {
  const { stopped } = useMotionState()
  const [swatch, setSwatch] = useState(0)
  useEffect(() => {
    if (stopped) return
    const t = setInterval(() => setSwatch((s) => (s + 1) % SWATCHES.length), 2200)
    return () => clearInterval(t)
  }, [stopped])

  const glass = "border px-2 py-0.5 text-[10.5px]"
  return (
    <div
      className="overflow-hidden border-t border-l text-[11px] shadow-[0_-24px_60px_-20px_rgb(0_0_0/0.7)]"
      style={{ background: F.app, color: F.ink, borderColor: "rgb(255 255 255 / 0.07)" }}
    >
      <div
        className="flex h-10 items-center justify-between gap-2 border-b px-3"
        style={{ background: F.head, borderColor: F.line }}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex shrink-0 gap-1">
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <i key={c} className="size-2" style={{ background: c }} />
            ))}
          </span>
          <span className="shrink-0" style={{ color: F.muted }}>
            ‹ Library
          </span>
          <span className="truncate">Recording Jul 15</span>
        </span>
        <span className="flex shrink-0 gap-1.5">
          <span
            className={glass}
            style={{ borderColor: "rgb(255 255 255 / 0.14)", background: "rgb(255 255 255 / 0.08)" }}
          >
            ✦ AI Edit
          </span>
          <span
            className={glass}
            style={{ borderColor: "rgb(255 255 255 / 0.14)", background: "rgb(255 255 255 / 0.08)" }}
          >
            Export
          </span>
        </span>
      </div>

      {/* the canvas: the recording floats on the chosen background swatch */}
      <div className="p-2.5">
        <div
          className="relative aspect-[2.1/1] p-[5%] transition-[background] duration-700"
          style={{ background: SWATCHES[swatch].bg }}
        >
          <div className="relative grid size-full grid-cols-[26%_1fr] bg-[#1b1e24] shadow-[0_12px_28px_-8px_rgb(0_0_0/0.6)]">
            <div className="flex flex-col gap-[9%] border-r border-white/5 p-[8%]">
              {[70, 55, 62, 48].map((w, i) => (
                <i key={i} className="h-[6%] bg-white/15" style={{ width: `${w}%` }} />
              ))}
            </div>
            <div className="grid grid-cols-4 content-start gap-[8%] p-[9%]">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <i key={i} className={cn("aspect-[5/4]", i === 4 ? "bg-[#4fc3d9]" : "bg-[#3f7fd9]/70")} />
              ))}
            </div>
            {/* Friday's cursor, mid-click on the highlighted folder */}
            <span
              aria-hidden
              className="absolute top-[64%] left-[54%] size-[12%] -translate-1/2 border-2 border-[#e8546f]/80 motion-safe:animate-ping"
            />
            <svg aria-hidden viewBox="0 0 16 20" className="absolute top-[64%] left-[54%] w-[5%]">
              <path
                d="M1 1v15l4-4 3 7 3-1-3-7h6z"
                fill="#fff"
                stroke="#12151a"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="absolute right-2 bottom-1.5 text-[10px] text-white/80">{SWATCHES[swatch].name}</span>
        </div>
      </div>

      {/* the timeline, in Friday's track colours */}
      <div className="relative space-y-1.5 px-3 py-2.5" style={{ background: F.timeline }}>
        {[
          { label: "Clip", parts: [[0, 100]], color: F.clip },
          {
            label: "Zoom",
            parts: [
              [14, 34],
              [48, 66],
              [76, 92],
            ],
            color: F.zoom,
          },
        ].map((t) => (
          <div key={t.label} className="grid grid-cols-[34px_1fr] items-center gap-2">
            <span className="text-[9.5px] tracking-[0.08em] uppercase" style={{ color: F.muted }}>
              {t.label}
            </span>
            <span className="relative h-3 bg-white/5">
              {t.parts.map(([a, b]) => (
                <i
                  key={a}
                  className="absolute inset-y-0"
                  style={{
                    left: `${a}%`,
                    width: `${b - a}%`,
                    background: t.color,
                    opacity: t.label === "Clip" ? 0.35 : 1,
                  }}
                />
              ))}
            </span>
          </div>
        ))}
        <i className="absolute inset-y-1.5 left-[calc(34px+0.5rem+0.75rem+9%)] w-0.5 bg-white/70" />
      </div>
    </div>
  )
}

export function Friday() {
  return (
    <section
      id="friday"
      aria-labelledby="friday-title"
      className="grid-ground-ink mb-18 bg-ink text-paper md:mb-30 relative overflow-hidden"
    >
      {/* contour lines around stepped shapes in the top corners, behind everything */}
      <Contours
        corner="tl"
        steps={[
          [0.2, 0.14],
          [0.1, 0.44],
        ]}
        className="text-paper/[0.09] max-md:hidden"
      />
      <Contours
        corner="tr"
        steps={[
          [0.1, 0.3],
          [0.05, 0.72],
        ]}
        className="text-paper/[0.09] max-md:hidden"
      />
      <div className="container-page relative">
        <div className="flex h-(--cell) items-center justify-between gap-6 px-4 md:px-8">
          <p className={cn(tag, "uppercase")}>[ Friday ] · Screen recordings for Mac</p>
          <p className={cn(tag, "hidden md:block")}>Record · Polish · Ship</p>
        </div>

        <Reveal className="grid h-[calc(var(--cell)*6)] content-end items-end gap-6 px-4 pb-10 md:px-8 md:pb-16 lg:grid-cols-[1fr_auto] lg:gap-8">
          <h2 id="friday-title" className="text-[clamp(52px,8.4vw,124px)] leading-[0.92] tracking-[-0.05em]">
            Press record.
            <br />
            <span className="text-lime sm:pl-[1.1em]">It&rsquo;s polished.</span>
          </h2>
          <p className="max-w-[30ch] text-lg leading-[1.45] text-paper/60 lg:mb-3">
            Zooms, glass styling, music and intros, done the moment you stop recording.
          </p>
        </Reveal>
      </div>

      <div className="container-page relative">
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
              from="#e84f8a"
              to="#4fc3d9"
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
              <SplitButton href={FRIDAY_URL} external className="mt-9 border-paper [--btn-shadow:var(--paper)]">
                Visit Friday
              </SplitButton>
            </div>
          </StaggerItem>

          {/* 2 · Friday: the figure, with the editor docked below it */}
          <StaggerItem className={cn(col, "overflow-hidden pb-0 md:pb-0")}>
            <p className={tag}>2 · Friday</p>
            <div className="mt-10 md:mt-12">
              <p className="text-[clamp(96px,9.6vw,150px)] leading-[0.82] font-medium tracking-[-0.06em]">
                90<span className="text-lime">%</span>
              </p>
              <p className="mt-5 text-xl leading-[1.35] tracking-[-0.02em] text-paper/75">
                of the polish happens by itself.
                <br />
                <span className="text-paper">The rest is a real editor.</span>
              </p>
            </div>
            <div className="mt-12 -mr-6 ml-6 md:-mr-8 lg:absolute lg:right-0 lg:bottom-0 lg:m-0 lg:w-[84%]">
              <FridayWindow />
            </div>
          </StaggerItem>

          {/* 3 · what it does */}
          <StaggerItem className={col}>
            <p className={tag}>3 · What it does</p>
            <p className="mt-12 text-[17px] leading-[1.55] text-paper/85 md:mt-16">
              Friday records your Mac screen and polishes it by itself. Every click becomes a zoom, the cursor glides,
              and one click of AI Edit picks the look, music and intro. Then export MP4, ProRes or GIF, up to 4K at
              60fps.
            </p>
            <Stagger as="ul" gap={0.05} delay={0.3} className="mt-8 mb-10 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {FEATURES.map((t) => (
                <StaggerItem
                  key={t}
                  as="li"
                  className="flex items-center gap-2.5 text-[15px] text-paper/85"
                  variants={{
                    hidden: { opacity: 0, x: -6 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                  }}
                >
                  <HugeiconsIcon icon={Tick02Icon} strokeWidth={2.25} className="size-4 shrink-0 text-lime" />
                  {t}
                </StaggerItem>
              ))}
            </Stagger>
            <div className="mt-auto border-t border-paper/10 pt-6 max-lg:mt-10">
              <p className={tag}>Private by design</p>
              <p className="mt-2.5 text-[15px] leading-[1.5] text-paper/60">
                Runs fully on your Mac, and recordings never leave it. macOS 15 or later.
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
