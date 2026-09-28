"use client"

import { Fragment, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Glyph } from "@/components/brand/symbols"
import { Frame, WordReveal } from "@/components/motion/reveal"
import { bodyLg, display } from "@/components/site/section-head"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { equation, equationDefault } from "@/lib/content"
import { cn } from "@/lib/utils"

const OPERATORS = ["+", "="]

export function Equation() {
  const [value, setValue] = useState<string[]>([])
  const text = equation.find((e) => e.key === value[0])?.text ?? equationDefault

  return (
    // with principles' own pt-10, the frame's corners clear the next section by the page rhythm (72 / 120)
    <section aria-labelledby="eq-title" className="pb-8 md:pb-20">
      <Frame className="container-page pt-12 pb-16 text-center md:pt-20 md:pb-25">
        <WordReveal id="eq-title" className={display}>
          Human ambition <span className="font-normal text-pink-deep">×</span> machine intelligence.
        </WordReveal>

        <ToggleGroup
          value={value}
          onValueChange={setValue}
          aria-label="Pick a part of the equation"
          className="mx-auto mt-9 mb-7.5 w-auto flex-wrap justify-center gap-2 md:mt-14 md:gap-[clamp(10px,2vw,28px)]"
        >
          {equation.map((e, i) => (
            <Fragment key={e.key}>
              <ToggleGroupItem
                value={e.key}
                render={<motion.button whileTap={{ scale: 0.96 }} />}
                className="aspect-square h-auto w-22 flex-col gap-2.5 rounded-none border-[1.5px] border-ink bg-paper p-0 shadow-hard transition-[translate,box-shadow,background-color] hover:-translate-0.5 hover:bg-paper hover:shadow-hard-lg aria-pressed:translate-0.5 aria-pressed:bg-pink aria-pressed:shadow-[2px_2px_0_var(--ink)] md:w-[clamp(96px,12vw,150px)]"
              >
                <Glyph symbol={e.key} className="size-[44%]" />
                <Badge variant="tag">{e.label}</Badge>
              </ToggleGroupItem>
              {OPERATORS[i] && <span className="font-mono text-xl md:text-[31.5px]">{OPERATORS[i]}</span>}
            </Fragment>
          ))}
        </ToggleGroup>

        <p aria-live="polite" className={cn(bodyLg, "mx-auto min-h-15 max-w-140 leading-[1.45]")}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={text}
              className="block"
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.25 }}
            >
              {text}
            </motion.span>
          </AnimatePresence>
        </p>
      </Frame>
    </section>
  )
}
