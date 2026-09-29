"use client"

import { useRef, useState } from "react"
import { motion, useAnimationFrame, useInView, useMotionValue, useTransform } from "framer-motion"
import { useMotionState } from "@/components/motion/motion-provider"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SectionHead } from "@/components/site/section-head"
import { SplitButton } from "@/components/site/split-button"
import { FRIDAY_URL } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * Friday, the second product (2026-09-29). Rather than describe it, the
 * section shows it working: a recording plays on a loop, the cursor clicks,
 * and the shot auto-zooms onto each click while a timeline tracks the zooms.
 * The Looks change the backdrop. Every claim here is from fridayapp.fun.
 */

// one six-second take: where the cursor goes, and when it clicks
const T = 6
const CLICKS = [
  { t: 1.2, x: 20, y: 32 }, // a sidebar item
  { t: 3.0, x: 64, y: 58 }, // the button
  { t: 4.6, x: 80, y: 24 }, // a card
]
const PATH = [
  { t: 0, x: 72, y: 84 },
  { t: 0.9, x: 20, y: 32 },
  { t: 2.4, x: 20, y: 32 },
  { t: 2.8, x: 64, y: 58 },
  { t: 4.1, x: 64, y: 58 },
  { t: 4.4, x: 80, y: 24 },
  { t: 5.6, x: 80, y: 24 },
  { t: 6, x: 72, y: 84 },
]
const ZOOM_IN = 0.35
const HOLD = 1.0
const ZOOM_OUT = 0.4

const ease = (v: number) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v))
const at = (t: number) => {
  const i = PATH.findIndex((p) => p.t > t)
  const a = PATH[Math.max(0, i - 1)]
  const b = PATH[i < 0 ? PATH.length - 1 : i]
  const k = b.t === a.t ? 0 : ease((t - a.t) / (b.t - a.t))
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }
}
const zoomAt = (t: number) => {
  for (const c of CLICKS) {
    const z = ease((t - c.t) / ZOOM_IN) * (1 - ease((t - c.t - HOLD) / ZOOM_OUT))
    if (z > 0) return { z, c }
  }
  return { z: 0, c: CLICKS[0] }
}

// Friday's one-click looks, drawn in this page's palette
const LOOKS = [
  { name: "Signature", bg: "linear-gradient(135deg, #caeb6b, #99ebfa)" },
  { name: "Vivid", bg: "linear-gradient(135deg, #ff6fb0, #f5c36b)" },
  { name: "Minimal", bg: "linear-gradient(135deg, #e9e7e3, #fcfcfb)" },
  { name: "Cinematic", bg: "linear-gradient(135deg, #101010, #3a3a37)" },
  { name: "Playful", bg: "linear-gradient(135deg, #b9b3ff, #ff6fb0)" },
  { name: "Deep Sea", bg: "linear-gradient(135deg, #0b3550, #45cdb8)" },
]

const FEATURES = [
  { n: "1", name: "Cinematic auto-zoom", body: "Every click becomes a smooth zoom, directed for you." },
  { n: "2", name: "AI Edit, on your Mac", body: "One click picks the look, music, zooms and intro. Locally." },
  { n: "3", name: "Auto-frame for Reels", body: "Any recording, recut as 9:16 that follows your cursor." },
  { n: "4", name: "Every format", body: "MP4, HEVC, ProRes or GIF, up to 4K at 60fps." },
]

/**
 * A made-up app on screen, laid out in % so the three clicks land on real
 * targets: the Roadmap item (20, 32), Publish (64, 58) and the third stat
 * card (80, 24). Type is sized in cqw so it scales with the zoom.
 */
const NAV = ["Overview", "Roadmap", "Assets", "Team", "Settings"]
const STATS = [
  { label: "Sign-ups", value: "1,284" },
  { label: "Trials", value: "312" },
  { label: "Launch", value: "Fri" },
]
const BARS = [38, 52, 44, 66, 58, 74, 62, 88, 80, 96]

function ScreenApp({ clicked }: { clicked: number }) {
  return (
    <div className="@container absolute inset-0 bg-chalk text-ink">
      <div className="absolute inset-x-0 top-0 flex h-[9%] items-center gap-[1%] border-b border-line bg-paper-2 px-[2%]">
        {["#ff6fb0", "#f5c36b", "#caeb6b"].map((c) => (
          <i key={c} className="size-[1.2cqw]" style={{ background: c }} />
        ))}
        <span className="ml-[2%] text-[1.7cqw] font-medium">Launch plan</span>
      </div>

      <div className="absolute top-[9%] bottom-0 left-0 w-[26%] border-r border-line bg-paper">
        {NAV.map((n, i) => (
          <span
            key={n}
            className={cn(
              "absolute right-[8%] left-[8%] flex h-[9%] -translate-y-1/2 items-center gap-[6%] px-[6%] text-[1.6cqw] transition-colors duration-300",
              i === 1 && clicked === 0 ? "bg-lime-soft font-medium" : i === 0 && clicked !== 0 ? "bg-paper-2" : ""
            )}
            style={{ top: `${((20 + i * 12 - 9) / 91) * 100}%` }}
          >
            <i className="size-[1.4cqw] shrink-0 border border-ink/50" />
            {n}
          </span>
        ))}
      </div>

      <span className="absolute top-[11%] left-[31%] text-[2.6cqw] font-medium tracking-[-0.03em]">Q4 launch</span>

      {STATS.map((st, i) => (
        <div
          key={st.label}
          className={cn(
            "absolute top-[18%] flex h-[13%] flex-col justify-center border border-line px-[1.5%] transition-colors duration-300",
            i === 2 && clicked === 2 ? "border-ink bg-lime-soft" : "bg-paper"
          )}
          style={{ left: `${[31, 50, 69][i]}%`, width: `${i === 2 ? 22 : 16}%` }}
        >
          <span className="text-[1.2cqw] text-muted-foreground">{st.label}</span>
          <span className="text-[2.2cqw] font-medium tracking-[-0.02em]">{st.value}</span>
        </div>
      ))}

      <div className="absolute top-[36%] left-[31%] flex h-[13%] w-[60%] items-end gap-[1.5%] border-b border-line">
        {BARS.map((h, i) => (
          <i key={i} className="flex-1 bg-ink/80" style={{ height: `${h}%` }} />
        ))}
      </div>

      <span className="absolute top-[55%] left-[31%] h-[2%] w-[20%] bg-ink/15" />
      <span className="absolute top-[60%] left-[31%] h-[2%] w-[14%] bg-ink/15" />
      <span
        className={cn(
          "absolute top-[53%] left-[56%] grid h-[10%] w-[16%] place-items-center border border-ink text-[1.5cqw] font-medium transition-colors duration-300",
          clicked === 1 ? "bg-ink text-paper" : "bg-lime"
        )}
      >
        {clicked === 1 ? "Published" : "Publish"}
      </span>
      <span className="absolute top-[53%] left-[74%] grid h-[10%] w-[14%] place-items-center border border-line bg-paper text-[1.5cqw]">
        Preview
      </span>

      {[70, 78, 86].map((y) => (
        <span
          key={y}
          className="absolute left-[31%] flex h-[5%] w-[60%] items-center gap-[3%] border-b border-line"
          style={{ top: `${y}%` }}
        >
          <i className="h-[30%] w-[22%] bg-ink/20" />
          <i className="h-[30%] w-[34%] bg-ink/10" />
        </span>
      ))}
    </div>
  )
}

function Stage({ look }: { look: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.3 })
  const { stopped } = useMotionState()
  const clock = useRef(0.5)
  const [clicked, setClicked] = useState(-1)

  const cx = useMotionValue(PATH[0].x)
  const cy = useMotionValue(PATH[0].y)
  const scale = useMotionValue(1)
  const ox = useMotionValue(CLICKS[0].x)
  const oy = useMotionValue(CLICKS[0].y)
  const head = useMotionValue(0)
  const ripple = useMotionValue(0)

  useAnimationFrame((_, delta) => {
    if (!inView || stopped) return
    const t = (clock.current = (clock.current + delta / 1000) % T)
    const p = at(t)
    cx.set(p.x)
    cy.set(p.y)
    const { z, c } = zoomAt(t)
    scale.set(1 + 0.75 * z)
    ox.set(c.x)
    oy.set(c.y)
    head.set((t / T) * 100)
    const last = [...CLICKS].reverse().find((k) => t >= k.t)
    ripple.set(last ? Math.min(1, (t - last.t) / 0.5) : 1)
    const idx = last ? CLICKS.indexOf(last) : -1
    if (idx !== clicked) setClicked(idx)
  })

  const origin = useTransform([ox, oy], ([x, y]) => `${x}% ${y}%`)
  const left = useTransform(cx, (v) => `${v}%`)
  const top = useTransform(cy, (v) => `${v}%`)
  const headLeft = useTransform(head, (v) => `${v}%`)
  const rippleScale = useTransform(ripple, [0, 1], [0.2, 2.4])
  const rippleOpacity = useTransform(ripple, [0, 0.15, 1], [0, 0.9, 0])
  const rippleLeft = useTransform(ripple, () => `${(CLICKS[Math.max(0, clicked)] ?? CLICKS[0]).x}%`)
  const rippleTop = useTransform(ripple, () => `${(CLICKS[Math.max(0, clicked)] ?? CLICKS[0]).y}%`)

  return (
    <div ref={ref} className="border-[1.5px] border-ink bg-chalk shadow-hard-lg">
      <div className="flex h-10 items-center justify-between gap-3 bg-ink px-3 font-mono text-xs text-paper">
        <span className="truncate">friday · Recording 12.27 PM</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="bg-lime px-2 py-0.5 text-ink">✦ AI Edit</span>
          <span className="border border-paper/40 px-2 py-0.5">Export</span>
        </span>
      </div>

      {/* the backdrop is the chosen look; the screen floats on it and the camera zooms in on each click */}
      <div
        className="relative overflow-hidden p-[7%] transition-[background] duration-500"
        style={{ background: look }}
      >
        <div className="relative aspect-[16/10] overflow-hidden shadow-[0_24px_50px_-18px_rgb(0_0_0/0.45)]">
          <motion.div className="absolute inset-0" style={{ scale, transformOrigin: origin }}>
            <ScreenApp clicked={clicked} />
            <motion.span
              aria-hidden
              className="absolute size-6 -translate-1/2 border-2 border-pink-deep"
              style={{ left: rippleLeft, top: rippleTop, scale: rippleScale, opacity: rippleOpacity }}
            />
            <motion.svg
              aria-hidden
              viewBox="0 0 16 20"
              className="absolute w-[3.2%] min-w-3 drop-shadow-[0_2px_2px_rgb(0_0_0/0.35)]"
              style={{ left, top }}
            >
              <path
                d="M1 1v15l4-4 3 7 3-1-3-7h6z"
                fill="#101010"
                stroke="#fcfcfb"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>
        </div>
      </div>

      {/* timeline: the clip, and a zoom lane with one block per click; the playhead runs with the take */}
      <div className="relative space-y-1.5 border-t-[1.5px] border-ink bg-paper px-3 py-3 font-mono text-[11px]">
        {[
          { lane: "Clip", blocks: [{ from: 0, to: T, tone: "bg-lime" }] },
          {
            lane: "Zoom",
            blocks: CLICKS.map((c) => ({
              from: c.t,
              to: Math.min(T, c.t + ZOOM_IN + HOLD + ZOOM_OUT),
              tone: "bg-pink",
            })),
          },
          { lane: "Text", blocks: [{ from: 0.2, to: 1.1, tone: "bg-[#99ebfa]" }] },
        ].map(({ lane, blocks }) => (
          <div key={lane} className="grid grid-cols-[44px_1fr] items-center gap-2">
            <span className="text-muted-foreground uppercase">{lane}</span>
            <div className="relative h-4 bg-paper-2">
              {blocks.map((b, i) => (
                <span
                  key={i}
                  className={cn("absolute inset-y-0 border border-ink/60", b.tone)}
                  style={{ left: `${(b.from / T) * 100}%`, width: `${((b.to - b.from) / T) * 100}%` }}
                />
              ))}
            </div>
          </div>
        ))}
        <div className="pointer-events-none absolute inset-y-2 right-3 left-[calc(44px+0.5rem+0.75rem)]">
          <motion.span aria-hidden className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: headLeft }} />
        </div>
      </div>
    </div>
  )
}

export function Friday() {
  const [look, setLook] = useState(0)
  return (
    <section id="friday" aria-labelledby="friday-title" className="container-page pb-18 md:pb-30">
      <SectionHead id="friday-title" label="Friday · for Mac">
        Make every recording
        <br />
        look like a launch video.
      </SectionHead>

      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <Reveal>
          <Stage look={LOOKS[look].bg} />
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            A take, played on a loop: every click becomes a zoom, by itself.
          </p>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-[clamp(19px,1.57vw,22.5px)] leading-[1.45] tracking-[-0.01em]">
              Friday records your Mac screen and polishes it by itself: cinematic auto-zooms, glass styling, music and
              animated intros, with a one-click AI editor. Recordings never leave your Mac.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-8">
            <p className="mb-3 font-mono text-xs text-muted-foreground">One-click looks · try one</p>
            <div role="radiogroup" aria-label="Look" className="grid grid-cols-3 gap-2">
              {LOOKS.map((l, i) => (
                <button
                  key={l.name}
                  role="radio"
                  aria-checked={look === i}
                  onClick={() => setLook(i)}
                  className={cn(
                    "flex items-center gap-2 border-[1.5px] bg-chalk px-2.5 py-2 text-left text-sm transition-[border-color,box-shadow,translate]",
                    look === i ? "border-ink shadow-hard-sm" : "border-line hover:-translate-px hover:border-ink"
                  )}
                >
                  <span aria-hidden className="size-4 shrink-0 border border-ink/30" style={{ background: l.bg }} />
                  {l.name}
                </button>
              ))}
            </div>
          </Reveal>

          <Stagger as="ol" gap={0.08} className="mt-10 border-t-[1.5px] border-ink">
            {FEATURES.map((f) => (
              <StaggerItem key={f.n} as="li" className="grid grid-cols-[32px_1fr] gap-x-3 border-b border-line py-4">
                <span className="pt-1 font-mono text-xs text-muted-foreground">{f.n}</span>
                <span>
                  <span className="block text-lg leading-tight font-medium tracking-[-0.02em]">{f.name}</span>
                  <span className="mt-1 block text-[15px] leading-[1.5] text-ink-soft">{f.body}</span>
                </span>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <SplitButton href={FRIDAY_URL} external>
              Visit Friday
            </SplitButton>
            <span className="font-mono text-xs text-muted-foreground">macOS 15 or later</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
