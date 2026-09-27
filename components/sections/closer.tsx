"use client"

import { motion } from "framer-motion"
import { BrandMarks } from "@/components/brand/symbols"
import { EASE, Frame } from "@/components/motion/reveal"

const WORD = "Unified Machines"

export function Closer() {
  return (
    <section aria-label="Unified Machines" className="border-t border-[#2c2c2a] bg-ink pb-15 text-paper">
      <Frame tone="paper" className="container-page flex flex-col items-center gap-7 pt-20 pb-16 md:pt-30 md:pb-25">
        <BrandMarks className="gap-2.5" glyphClassName="size-7" />

        {/* letters rise in on scroll; hovering washes them lime left to right */}
        <motion.p
          aria-label={WORD}
          className="text-center text-[clamp(44px,9.6vw,140px)] leading-[0.95] font-medium tracking-[-0.05em] md:whitespace-nowrap"
          initial="hidden"
          whileInView="show"
          whileHover="hover"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ show: { transition: { staggerChildren: 0.03 } } }}
        >
          {[...WORD].map((ch, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: "0.4em" },
                show: { opacity: 1, y: 0, color: "#f1f0ee", transition: { duration: 0.6, ease: EASE } },
                hover: { color: "#caeb6b", y: -4, transition: { delay: i * 0.018, duration: 0.3 } },
              }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </motion.p>

        <p className="font-mono text-xs text-lime">Build what lasts.</p>
      </Frame>
    </section>
  )
}
