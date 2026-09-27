"use client"

import { useEffect, useRef, useState } from "react"
import { animate, useInView } from "framer-motion"
import { BrandMarks } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { bodyLg, MonoLabel, SectionHead } from "@/components/site/section-head"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { tools } from "@/lib/content"
import { cn } from "@/lib/utils"

// a slightly messy desk: every 3rd/5th chip is knocked askew
const tilt = (n: number) => (n % 5 === 0 ? 2.5 : n % 3 === 0 ? -2 : n % 3 === 1 ? 1.5 : 0)

const sliderStyles = [
  "absolute inset-0 z-10 cursor-ew-resize max-md:hidden [&>div]:h-full",
  "**:data-[slot=slider-track]:bg-transparent **:data-[slot=slider-range]:bg-transparent",
  "**:data-[slot=slider-thumb]:flex **:data-[slot=slider-thumb]:size-10 **:data-[slot=slider-thumb]:items-center **:data-[slot=slider-thumb]:justify-center **:data-[slot=slider-thumb]:rounded-none **:data-[slot=slider-thumb]:border-[1.5px] **:data-[slot=slider-thumb]:border-ink **:data-[slot=slider-thumb]:bg-paper **:data-[slot=slider-thumb]:font-mono **:data-[slot=slider-thumb]:text-xs **:data-[slot=slider-thumb]:ring-lime **:data-[slot=slider-thumb]:before:content-['◂_▸']",
].join(" ")

const side = "flex flex-col justify-between gap-6 p-4 md:absolute md:inset-0 md:px-8 md:py-7"

export function Consolidate() {
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, { once: true, amount: 0.5 })
  const { reduced } = useMotionState()
  const [cut, setCut] = useState(100)

  // first view: sweep the divider from the right edge to the middle
  useEffect(() => {
    if (!inView) return
    const controls = animate(100, 50, {
      duration: reduced ? 0 : 1.4,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: setCut,
    })
    return () => controls.stop()
  }, [inView, reduced])

  return (
    <section id="consolidate" aria-labelledby="cons-title" className="container-page pb-18 md:pb-30">
      <SectionHead id="cons-title" label="Consolidation">
        Twelve tools. One app.
        <br />
        Drag to see the difference.
      </SectionHead>

      <div
        ref={box}
        className="relative overflow-hidden border-[1.5px] border-ink bg-paper-2 select-none md:h-[clamp(340px,40vw,460px)]"
      >
        <div aria-label="Today: twelve scattered tools" className={cn(side, "dot-grid bg-paper-2")}>
          <Badge variant="tag">Today</Badge>
          <Stagger as="ul" gap={0.04} aria-hidden className="flex max-w-160 flex-wrap gap-2.5 md:max-w-[46%]">
            {tools.map((tool, i) => (
              <StaggerItem
                key={tool}
                as="li"
                className="border border-ink bg-paper px-2.5 py-1.5 text-[14.5px] md:px-3.5 md:py-2 md:text-[17px]"
                variants={{
                  hidden: { opacity: 0, y: -18, rotate: 0 },
                  show: { opacity: 1, y: 0, rotate: tilt(i + 1), transition: { type: "spring", stiffness: 380, damping: 18 } },
                }}
              >
                {tool}
              </StaggerItem>
            ))}
          </Stagger>
          <p className="max-w-115 text-[clamp(18px,1.46vw,21.5px)] leading-[1.4] md:max-w-[46%]">
            Twelve logins. Twelve bills. Twelve places the answer might be.
          </p>
        </div>

        <div
          aria-label="With Unified Machines: one product"
          className={cn(side, "items-end bg-lime pt-6 text-right max-md:[clip-path:none]!")}
          style={{ clipPath: `inset(0 0 0 ${cut}%)` }}
        >
          <Badge variant="tag" className="self-start text-lime">
            With Unified Machines
          </Badge>
          <div aria-hidden className="flex flex-col items-end gap-3">
            <BrandMarks glyphClassName="size-7" />
            <span className="text-[clamp(38px,4.5vw,63px)] leading-none font-medium tracking-[-0.04em]">One product.</span>
            <span className="font-mono text-xs">Meet · Schedule · Remember · Decide · Find</span>
          </div>
          <p className="max-w-105 text-[clamp(18px,1.46vw,21.5px)] leading-[1.4]">
            One surface with intelligence inside, and the data in one place your organisation owns.
          </p>
        </div>

        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -ml-px hidden w-0.5 bg-ink md:block"
          style={{ left: `${cut}%` }}
        />
        <span id="cons-slider-label" className="sr-only">
          Reveal the consolidated view
        </span>
        <Slider
          aria-labelledby="cons-slider-label"
          value={[cut]}
          onValueChange={(v) => setCut(typeof v === "number" ? v : v[0])}
          thumbAlignment="center"
          className={sliderStyles}
        />
      </div>

      <Stagger className="mt-12 grid gap-12 lg:grid-cols-2">
        <StaggerItem className="border-l border-ink pl-5">
          <MonoLabel className="mb-5.5">What consolidation means here</MonoLabel>
          <p className={bodyLg}>
            A functional app covers a whole job. Meetings are one job, so Morse holds the call, the calendar and the
            memory. Each product we build takes a cluster of tools your teams juggle today and turns it into one
            surface with intelligence inside.
          </p>
        </StaggerItem>
        <StaggerItem className="border-l border-ink pl-5">
          <MonoLabel className="mb-5.5">What it does not mean</MonoLabel>
          <p className={bodyLg}>
            A portal that embeds the same twelve tools behind one login. Consolidation only counts when the steps
            disappear, the switching stops and the data lives in one place you own.
          </p>
        </StaggerItem>
      </Stagger>
    </section>
  )
}
