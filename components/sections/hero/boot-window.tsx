"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { WindowTitlebar } from "@/components/site/window-frame"

const ITEMS = ["Purpose, Principles, Products", "Symbols, Windows, Signals", "Human, Machine, Heart"]

/** Fake OS loader. Calls `onDone` once the bar reaches 100%. */
export function BootWindow({ instant, onDone }: { instant: boolean; onDone: () => void }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let p = 0
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      p = instant ? 100 : Math.min(100, p + 6 + Math.random() * 14)
      setPct(p)
      timer = p >= 100 ? setTimeout(onDone, instant ? 0 : 320) : setTimeout(tick, 90 + Math.random() * 160)
    }
    timer = setTimeout(tick, instant ? 0 : 300)
    return () => clearTimeout(timer)
  }, [instant, onDone])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, scale: 0.96, x: "-50%", y: "-50%" }}
      animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
      exit={{ opacity: 0, y: "-62%", transition: { duration: 0.4 } }}
      className="absolute top-1/2 left-1/2 z-20 w-55 border-[1.5px] border-ink bg-paper shadow-hard md:top-[44%] md:w-65"
    >
      <WindowTitlebar>Unified Machines 1.0</WindowTitlebar>
      <div className="flex flex-col gap-2 px-3.5 py-3 font-mono text-xs">
        <p>
          Loading ...
          <br />
          {ITEMS[Math.min(ITEMS.length - 1, Math.floor(pct / 34))]}
        </p>
        <div className="relative h-4 overflow-hidden border border-ink bg-chalk">
          <motion.span
            className="absolute inset-y-0 left-0 bg-ink"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.18 }}
          />
          <b className="absolute top-0 left-1 text-[11px] leading-4 font-normal text-paper mix-blend-difference">
            {Math.round(pct)}%
          </b>
        </div>
      </div>
    </motion.div>
  )
}
