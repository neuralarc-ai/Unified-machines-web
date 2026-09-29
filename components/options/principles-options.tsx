"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Reveal } from "@/components/motion/reveal"
import { bodyLg, MonoLabel, SectionHead } from "@/components/site/section-head"
import { PrinciplesWindow } from "@/components/sections/principles"
import { principles } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * How we build, layout options for review (2026-09-29). The diagram window is
 * the live one, untouched; only the heading and the principles around it
 * change. A is today's section.
 */

export { Principles as PrinciplesA } from "@/components/sections/principles"

function Head() {
  return (
    <SectionHead id="principles-title" label="How we build">
      A few strong beliefs.
      <br />A different kind of company.
    </SectionHead>
  )
}

/** B · Tab strip: the four as one strip of tabs, the chosen one told in full beside the window. */
export function PrinciplesB() {
  const [i, setI] = useState(0)
  const p = principles[i]
  return (
    <section id="principles" aria-labelledby="principles-title" className="container-page pt-10 pb-18 md:pb-30">
      <Head />
      <div
        role="tablist"
        aria-label="Principles"
        className="mb-10 grid border-[1.5px] border-ink bg-chalk shadow-hard-sm sm:grid-cols-2 lg:grid-cols-4"
      >
        {principles.map((q, k) => (
          <button
            key={q.key}
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={cn(
              "flex items-baseline gap-3 border-ink px-5 py-4 text-left transition-colors not-last:border-b sm:nth-[odd]:border-r lg:not-last:border-r lg:border-b-0",
              k === i ? "bg-ink text-paper" : "hover:bg-lime-soft",
            )}
          >
            <span className={cn("font-mono text-xs", k === i ? "text-lime" : "text-muted-foreground")}>{q.n}</span>
            <span className="text-lg font-medium tracking-[-0.02em]">{q.title}</span>
          </button>
        ))}
      </div>
      <div className="grid items-center gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <PrinciplesWindow active={p.key} />
        <div role="tabpanel" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-mono text-xs text-muted-foreground">{p.n} / 04</p>
              <h3 className="mt-4 text-[clamp(38px,3.6vw,56px)]">{p.title}</h3>
              <p className={cn(bodyLg, "mt-6 max-w-[46ch] text-ink-soft")}>{p.body}</p>
            </motion.div>
          </AnimatePresence>
          <button
            onClick={() => setI((i + 1) % principles.length)}
            className="mt-10 inline-flex h-11 items-center gap-3 border-[1.5px] border-ink bg-chalk px-4 font-mono text-sm shadow-hard-sm transition-[translate,box-shadow] hover:-translate-px hover:shadow-hard"
          >
            Next: {principles[(i + 1) % principles.length].title} →
          </button>
        </div>
      </div>
    </section>
  )
}

/** C · Scroll story: the window holds while all four read in full; the one in view drives the diagram. */
export function PrinciplesC() {
  const [active, setActive] = useState(principles[0].key)
  const refs = useRef<(HTMLElement | null)[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.key!)),
      { rootMargin: "-45% 0px -45% 0px" },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <section id="principles" aria-labelledby="principles-title" className="container-page pt-10 pb-18 md:pb-30">
      <div className="grid items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div className="lg:sticky lg:top-28">
          <PrinciplesWindow active={active} />
        </div>
        <div>
          <Reveal className="mb-10 flex flex-col gap-4">
            <MonoLabel>How we build</MonoLabel>
            <h2 id="principles-title" className="text-[clamp(34px,4.05vw,54px)] leading-[1.06] tracking-[-0.035em]">
              A few strong beliefs. A different kind of company.
            </h2>
          </Reveal>
          <ol className="border-t-[1.5px] border-ink">
            {principles.map((p, k) => (
              <li
                key={p.key}
                data-key={p.key}
                ref={(el) => {
                  refs.current[k] = el
                }}
                className={cn(
                  "grid grid-cols-[48px_1fr] border-b border-line py-10 transition-opacity duration-500 lg:min-h-[44vh]",
                  active === p.key ? "opacity-100" : "opacity-35",
                )}
              >
                <span className="pt-2 font-mono text-xs">{p.n}</span>
                <div>
                  <h3 className="text-[clamp(28px,2.6vw,40px)]">{p.title}</h3>
                  <p className={cn(bodyLg, "mt-4 max-w-[46ch] text-ink-soft")}>{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/** D · Four cards: every principle visible at once in a 2×2; pick one and the window answers. */
export function PrinciplesD() {
  const [active, setActive] = useState(principles[0].key)
  return (
    <section id="principles" aria-labelledby="principles-title" className="container-page pt-10 pb-18 md:pb-30">
      <Head />
      <div className="grid items-start gap-12 lg:grid-cols-[5fr_7fr] lg:gap-10">
        <PrinciplesWindow active={active} />
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p) => {
            const on = active === p.key
            return (
              <button
                key={p.key}
                onClick={() => setActive(p.key)}
                aria-pressed={on}
                className={cn(
                  "flex flex-col gap-4 border-[1.5px] p-6 text-left transition-[background-color,box-shadow,translate,border-color] duration-200",
                  on
                    ? "border-ink bg-lime-tint shadow-hard"
                    : "border-line bg-chalk hover:-translate-px hover:border-ink hover:shadow-hard-sm",
                )}
              >
                <span className="font-mono text-xs text-muted-foreground">{p.n}</span>
                <span className="text-[24px] leading-[1.1] font-medium tracking-[-0.03em]">{p.title}</span>
                <span className="text-[15px] leading-[1.5] text-ink-soft">{p.body}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
