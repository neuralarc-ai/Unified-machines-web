"use client"

import { createContext, use, useState, type ReactNode } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInterval } from "@/hooks/use-interval"
import { desk } from "@/lib/content"
import { cn } from "@/lib/utils"

/*
 * Every story window plays one part of the same meeting, on one ~9s loop:
 *   call      Priya's question is captioned as she speaks   (phase 1)
 *   notes.md  it lands as an action item                     (phase 2)
 *   calendar  the follow-up books itself into Thursday       (phase 3)
 * Phase 0 is the idle frame before the desk is first seen.
 */
const { said } = desk.call
const STEP_MS = 38 // one caption character
const TYPE_FROM = 400
const NOTED_AT = TYPE_FROM + said.length * STEP_MS + 500
const BOOKED_AT = NOTED_AT + 1100
const CYCLE_MS = BOOKED_AT + 3600

type Story = { phase: 0 | 1 | 2 | 3; typed: number }

function storyAt(t: number | null): Story {
  if (t === null) return { phase: 0, typed: 0 }
  const typed = Math.min(said.length, Math.max(0, Math.floor((t - TYPE_FROM) / STEP_MS)))
  return { phase: t < NOTED_AT ? 1 : t < BOOKED_AT ? 2 : 3, typed }
}

const StoryContext = createContext<Story>(storyAt(null))

/**
 * Drives the loop while `active`; holds its frame when paused, and shows the
 * finished frame under reduced motion. Only the story windows re-render.
 */
export function MeetingStory({ active, reduced, children }: { active: boolean; reduced: boolean; children: ReactNode }) {
  const [t, setT] = useState<number | null>(null)
  useInterval(() => setT((prev) => (prev === null ? 0 : (prev + STEP_MS) % CYCLE_MS)), active && !reduced ? STEP_MS : null)
  return <StoryContext value={reduced ? { phase: 3, typed: said.length } : storyAt(t)}>{children}</StoryContext>
}

export function RecIndicator() {
  const { phase } = use(StoryContext)
  return (
    <span className="flex items-center gap-1.5">
      <i className={cn("size-2 rounded-full bg-[#ff4d3d]", phase > 0 && "animate-pulse")} />
      {desk.call.rec}
    </span>
  )
}

export function CallBody() {
  const { phase, typed } = use(StoryContext)
  return (
    <>
      <div className="grid grid-cols-3 gap-1.5 p-2.5">
        {desk.call.people.map((p, i) => (
          <div
            key={p.initials}
            className={cn(
              "relative grid aspect-[4/3] place-items-center overflow-hidden bg-muted outline-2 -outline-offset-2 outline-transparent transition-[outline-color] duration-300",
              phase === 1 && i === 0 && "outline-lime"
            )}
          >
            <Image src={p.avatar} alt="" fill sizes="(min-width: 1024px) 160px, 33vw" className="object-cover" />
            <span className="absolute bottom-1.5 left-1.5 bg-ink/65 px-1.5 font-mono text-xs text-white">{p.initials}</span>
          </div>
        ))}
      </div>
      <p className="min-h-16 border-t border-border px-3 py-2.5 font-mono text-[14.5px] leading-[1.45]">
        <span className="text-muted-foreground">{desk.call.who}: </span>
        {said.slice(0, typed)}
        {phase === 1 && <i aria-hidden className="ml-0.5 inline-block h-3.5 w-[7px] animate-blink bg-foreground align-[-2px]" />}
      </p>
    </>
  )
}

function Checkbox({ checked }: { checked?: boolean }) {
  return <span aria-hidden className={cn("size-3.5 shrink-0 border border-border", checked && "bg-lime")} />
}

export function NotesBody() {
  const { phase } = use(StoryContext)
  return (
    <div className="p-3">
      <p className="font-mono text-[14.5px] text-muted-foreground uppercase">{desk.notes.heading}</p>
      <ul className="mt-2 space-y-1.5 text-sm">
        {desk.notes.items.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Checkbox checked />
            {item}
          </li>
        ))}
        <motion.li
          className="flex items-center gap-2"
          initial={false}
          animate={
            phase >= 2
              ? { opacity: 1, y: 0, backgroundColor: "#eef8cf" }
              : { opacity: 0, y: 6, backgroundColor: "rgba(238,248,207,0)" }
          }
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Checkbox />
          {desk.notes.added}
        </motion.li>
      </ul>
    </div>
  )
}

const event = "block border border-border px-1.5 py-1 font-mono text-[14.5px] leading-tight font-medium whitespace-nowrap"

export function CalendarBody() {
  const { phase } = use(StoryContext)
  return (
    <div className="grid grid-cols-5 gap-px bg-border p-px">
      {desk.cal.days.map((day, i) => (
        <div key={day} className="bg-card px-2 pt-2 pb-3">
          <p className="font-mono text-[14.5px] text-muted-foreground">{day}</p>
          <div className="mt-2 h-14">
            {i === 1 && <span className={cn(event, "bg-card")}>{desk.cal.standup}</span>}
            {i === 3 && (
              <motion.span
                className={cn(event, "bg-lime")}
                initial={false}
                animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
              >
                {desk.cal.time}
                <br />
                {desk.cal.booked}
              </motion.span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
