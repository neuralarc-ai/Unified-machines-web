import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { Contours } from "@/components/brand/contours"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { FRIDAY_URL } from "@/lib/content"
import { cn } from "@/lib/utils"
import { FridayWindow } from "./friday-window"

/**
 * Friday, the second product (2026-09-29), in the same band as Morse's
 * (Consolidation): a label strip, a statement headline, then three columns:
 * the idea on stepped colour, the figure with Friday's editor docked below it,
 * and what it does. The editor is drawn in Friday's own UI colours (from its
 * site's HeroMockup); its canvas cycles through Friday's background swatches
 * as the real one does. Every claim is from fridayapp.fun.
 */

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

export function Friday() {
  return (
    <section
      id="friday"
      aria-labelledby="friday-title"
      className="grid-ground-ink mb-18 bg-ink text-paper md:mb-30 relative overflow-hidden"
    >
      <Contours variant="friday" />
      <div className="container-page relative">
        <div className="flex h-(--cell) items-center justify-between gap-6 px-4 md:px-8">
          <p className={cn(tag, "uppercase")}>[ Friday ] · Screen recordings for Mac</p>
          <p className={cn(tag, "hidden shrink-0 lg:block")}>Record · Polish · Ship</p>
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
