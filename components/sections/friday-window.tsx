"use client"

import { useEffect, useState } from "react"
import { useMotionState } from "@/components/motion/motion-provider"
import { cn } from "@/lib/utils"

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

/** Friday's editor, small: the recording on a swatch-coloured frame, and its timeline. */
export function FridayWindow() {
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
