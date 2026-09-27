"use client"

import { useCallback, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { BrandMarks, Glyph } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Signal } from "@/components/site/signal"
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"
import { useMediaQuery } from "@/hooks/use-media-query"
import { MORSE_URL, symbolWindows, type SymbolKey } from "@/lib/content"
import { cn } from "@/lib/utils"
import { BootWindow } from "./boot-window"
import { Clock } from "./clock"
import { DeskWindow } from "./desk-window"
import { DitherCanvas } from "./dither-canvas"
import { LifeCanvas } from "./life-canvas"

const swap = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2 },
}

/** UM.OS: a draggable retro desktop explaining the three symbols. */
export function Desktop() {
  const bounds = useRef<HTMLDivElement>(null)
  const [z, setZ] = useState<Record<string, number>>({})
  const [booted, setBooted] = useState(false)
  const [selected, setSelected] = useState<SymbolKey | null>(null)
  const { reduced } = useMotionState()
  const draggable = !useMediaQuery("(max-width: 767px)")

  // bring a window to the front: one above the current topmost
  const raise = (id: string) => setZ((prev) => ({ ...prev, [id]: Math.max(10, ...Object.values(prev)) + 1 }))
  const onBooted = useCallback(() => setBooted(true), [])
  const reading = symbolWindows.find((s) => s.key === selected)

  // shared props for every window
  const win = (id: string, index: number) => ({
    index,
    booted,
    draggable,
    z: z[id],
    onRaise: () => raise(id),
  })

  return (
    <div
      ref={bounds}
      role="group"
      aria-label="An interactive desktop showing the ideas behind Unified Machines"
      className="dot-grid relative isolate mt-3 grid grid-cols-2 gap-3 overflow-hidden rounded-[10px] border border-ink bg-paper px-3 pt-11 pb-10 md:block md:h-[clamp(520px,64vw,720px)] md:p-0"
    >
      <DitherCanvas className="absolute inset-0 -z-10 opacity-50 md:opacity-95" />
      <Badge variant="tag" className="absolute top-2 left-2.5 z-[2]">
        UM.OS / DESKTOP
      </Badge>
      <p className="absolute right-3 bottom-2.5 z-[2] hidden border border-ink bg-lime px-1.5 font-mono text-xs md:block">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={selected ? "read" : "hint"} className="block" {...swap}>
            {selected ? "readme.txt updated." : "Drag the windows. Press any symbol."}
          </motion.span>
        </AnimatePresence>
      </p>

      <AnimatePresence>{!booted && <BootWindow instant={reduced} onDone={onBooted} />}</AnimatePresence>

      {symbolWindows.map((s, i) => (
        <DeskWindow
          key={s.key}
          title={s.file}
          x={s.x}
          y={s.y}
          bounds={bounds} {...win(s.key, i)}
          className={cn("transition-colors", selected === s.key && "bg-pink")}
          bodyClassName="p-0 md:p-0"
        >
          <Toggle
            pressed={selected === s.key}
            onPressedChange={() => {
              setSelected(s.key)
              raise("reader")
            }}
            className="group/sym h-auto flex-col items-start gap-3 rounded-none p-2.5 hover:bg-transparent aria-pressed:bg-transparent md:p-3.5"
          >
            <motion.span whileTap={{ scale: 0.9, rotate: -4 }} className="block">
              <Glyph
                symbol={s.key}
                className="size-12 transition-transform duration-300 group-hover/sym:-translate-y-0.75 md:size-16"
              />
            </motion.span>
            <Badge variant="tag">{s.caption}</Badge>
          </Toggle>
        </DeskWindow>
      ))}

      <DeskWindow title="Clock 1.0" x="74%" y="3%" bounds={bounds} {...win("clock", 3)} bodyClassName="gap-0.5 font-mono md:min-w-50">
        <Clock />
      </DeskWindow>

      <DeskWindow title="Life 1.0" x="80%" y="62%" bounds={bounds} {...win("life", 4)} bodyClassName="items-center">
        <LifeCanvas />
        <span className="font-mono text-xs">Game of Life</span>
      </DeskWindow>

      <DeskWindow title="readme.txt" x="24%" y="48%" bounds={bounds} {...win("reader", 5)} className="col-span-2 md:w-[min(360px,48%)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={selected ?? "intro"} className="flex flex-col gap-2" {...swap}>
            <p className="text-xl leading-[1.15] font-medium tracking-[-0.03em]">
              {reading?.title ?? "Three symbols. One belief."}
            </p>
            <p className="min-h-9 font-mono text-xs text-ink-soft">
              {reading?.text ?? "Press a symbol window to read what it stands for."}
            </p>
          </motion.div>
        </AnimatePresence>
      </DeskWindow>

      <DeskWindow title="Morse" x="4%" y="64%" bounds={bounds} {...win("morse", 6)} className="col-span-2 md:col-auto" bodyClassName="md:min-w-50">
        <Signal />
        <a
          href={MORSE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs underline underline-offset-3"
        >
          onmorse.com <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={1.5} className="size-3.5" />
        </a>
      </DeskWindow>

      <DeskWindow
        x="3%"
        y="88%"
        bounds={bounds} {...win("about", 7)}
        className="col-span-2 md:col-auto md:shadow-hard-sm"
        bodyClassName="flex-row items-center gap-3 px-3 py-2 font-mono text-xs md:px-3 md:py-2"
      >
        <BrandMarks glyphClassName="size-3.5" />
        <span>
          Unified Machines
          <br />
          Version 1.0. Build what lasts.
        </span>
      </DeskWindow>
    </div>
  )
}
