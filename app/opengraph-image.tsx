import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

// the preview card for shared links (Slack, LinkedIn, iMessage, X)
export const alt = "Unified Machines: AI products built to last. Intelligence at the core."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const INK = "#101010"
const PAPER = "#f1f0ee"
const LIME = "#caeb6b"

// the three brand symbols, drawn as the site draws them: 5×5 bit grids
const GLYPHS = [
  ["11111", "10101", "11111", "11111", "11111"], // human
  ["11011", "11111", "01110", "11111", "11011"], // machine
  ["11011", "11111", "11111", "01110", "00100"], // heart
]

function Glyph({ cells, px }: { cells: string[]; px: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {cells.map((row, y) => (
        <div key={y} style={{ display: "flex" }}>
          {[...row].map((c, x) => (
            <div key={x} style={{ width: px, height: px, background: c === "1" ? PAPER : "transparent" }} />
          ))}
        </div>
      ))}
    </div>
  )
}

/** A stepped colour block, as rectangles: [inset from its side, rise from the bottom, width, height]. */
function Steps({ steps, from, to, side }: { steps: number[][]; from: string; to: string; side: "left" | "right" }) {
  return (
    <>
      {steps.map(([x, y, w, h], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: side === "left" ? x : size.width - x - w,
            top: size.height - y - h,
            width: w,
            height: h,
            background: `linear-gradient(${side === "right" ? 315 : 45}deg, ${from}, ${to})`,
            backgroundSize: `${steps[0][2]}px ${steps.reduce((t, st) => Math.max(t, st[1] + st[3]), 0)}px`,
            backgroundPosition: `${side === "left" ? 0 : w - steps[0][2]}px ${h + y - steps.reduce((t, st) => Math.max(t, st[1] + st[3]), 0)}px`,
          }}
        />
      ))}
    </>
  )
}

export default async function OpengraphImage() {
  const geist = await readFile(join(process.cwd(), "assets/Geist-Medium.ttf"))
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: INK }}>
      {/* the footer's stepped colour blocks, in the bottom corners */}
      <Steps
        side="right"
        from={LIME}
        to="#ff6fb0"
        steps={[
          [0, 0, 330, 90],
          [0, 90, 250, 90],
          [0, 180, 160, 90],
        ]}
      />
      <Steps
        side="left"
        from="#99ebfa"
        to="#b9b3ff"
        steps={[
          [0, 0, 200, 70],
          [0, 70, 120, 70],
        ]}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px 210px", // the caption sits clear of the colour blocks
          color: PAPER,
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ display: "flex", gap: 10 }}>
            {GLYPHS.map((g, i) => (
              <Glyph key={i} cells={g} px={8} />
            ))}
          </div>
          <div style={{ fontSize: 34, letterSpacing: -0.8 }}>Unified Machines</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1.02, letterSpacing: -3.4 }}>
          <div>AI products built to last.</div>
          <div style={{ color: LIME, marginLeft: 90 }}>Intelligence at the core.</div>
        </div>

        <div style={{ display: "flex", fontSize: 26, letterSpacing: -0.3, color: "rgba(241,240,238,0.6)" }}>
          Morse, for meetings · Friday, for screen recordings
        </div>
      </div>
    </div>,
    { ...size, fonts: [{ name: "Geist", data: geist, weight: 500, style: "normal" }] }
  )
}
