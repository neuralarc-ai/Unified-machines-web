"use client"

import { Children, isValidElement, type ReactNode } from "react"
import { motion, type HTMLMotionProps, type Variants } from "framer-motion"

export const EASE = [0.2, 0.7, 0.2, 1] as const

const VIEWPORT = { once: true, amount: 0.2 } as const

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

/** Fades and lifts its content the first time it scrolls into view. */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={rise}
      transition={{ delay }}
      {...props}
    />
  )
}

type StaggerTag = "div" | "ul" | "ol"

/** Parent that cascades its <StaggerItem> children into view. */
export function Stagger({
  as = "div",
  gap = 0.09,
  delay = 0,
  ...props
}: HTMLMotionProps<"div"> & { as?: StaggerTag; gap?: number; delay?: number }) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      {...props}
    />
  )
}

export function StaggerItem({
  as = "div",
  variants = rise,
  ...props
}: HTMLMotionProps<"div"> & { as?: "div" | "li" | "article" | "span" | "p" }) {
  const Comp = motion[as] as typeof motion.div
  return <Comp variants={variants} {...props} />
}

/**
 * Splits text children into words that rise in one after another.
 * Element children (e.g. an accent <span>) animate as a single word.
 */
export function WordReveal({
  as = "h2",
  children,
  className,
  id,
}: {
  as?: "h1" | "h2"
  children: ReactNode
  className?: string
  id?: string
}) {
  const Comp = motion[as]
  const words = Children.toArray(children).flatMap<ReactNode>((child) =>
    typeof child === "string" ? child.split(/\s+/).filter(Boolean) : isValidElement(child) ? [child] : []
  )
  return (
    <Comp
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055 } } }}
    >
      {words.map((word, i) => (
        <span key={i}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: "0.35em" },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
            }}
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </Comp>
  )
}
