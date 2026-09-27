"use client"

import { useRef, useState, type RefObject } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { Glyph } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useNow } from "@/hooks/use-now"
import { desk, type SymbolKey } from "@/lib/content"
import { DeskWindow } from "./desk-window"
import { GameIcon, GAMES } from "./games/registry"
import { CalendarBody, CallBody, MeetingStory, NotesBody, RecIndicator } from "./meeting-story"
import { PointerGlow } from "./pointer-glow"
import { Taskbar } from "./taskbar"
import { useWindowManager, type WindowManager } from "./use-window-manager"

const deskIcon =
  "group/icon h-auto w-21 flex-col gap-1.5 rounded-(--radius) px-0 py-1.5 hover:bg-transparent aria-pressed:bg-transparent"
const deskIconLabel =
  "rounded-[3px] px-1.25 py-px font-mono text-[14.5px] leading-[1.3] font-medium group-aria-pressed/icon:bg-secondary"
const iconHover = "size-10 transition-transform duration-300 group-hover/icon:-translate-y-0.5"

function DeskClock() {
  const now = useNow()
  return (
    <div className="px-3 py-2.5 font-mono">
      <p className="text-[14.5px] text-muted-foreground">
        {now?.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) ?? " "}
      </p>
      <p className="text-[29px] leading-none tabular-nums">{now?.toLocaleTimeString("en-GB") ?? "--:--:--"}</p>
    </div>
  )
}

/** A game window owns its score, so a running game only re-renders itself. */
function GameWindow({
  game,
  wm,
  floating,
  bounds,
}: {
  game: (typeof GAMES)[number]
  wm: WindowManager
  floating: boolean
  bounds: RefObject<HTMLDivElement | null>
}) {
  const [score, setScore] = useState("")
  // open in the middle of the desk, each a step down-right of the last
  const k = GAMES.indexOf(game) * 28
  return (
    <DeskWindow
      id={game.id}
      title={game.file}
      x={`calc(50% - ${game.width / 2}px + ${k - 28}px)`}
      y={`calc(42% - 150px + ${k}px)`}
      width={`${game.width}px`}
      wm={wm}
      floating={floating}
      bounds={bounds}
      onClose={() => wm.closeGame(game.id)}
      meta={<span className="text-paper/70 tabular-nums">{score}</span>}
    >
      <game.Game onScore={setScore} />
    </DeskWindow>
  )
}

/**
 * UM.OS: a desktop where every window plays part of one meeting, the job
 * Morse is being built for, plus the three symbols and three small games.
 */
export function Desk() {
  const box = useRef<HTMLDivElement>(null)
  const wm = useWindowManager()
  const [picked, setPicked] = useState<SymbolKey | null>(null)
  const inView = useInView(box, { amount: 0.3 })
  const { stopped, reduced } = useMotionState()
  const floating = useMediaQuery("(min-width: 1024px)")
  const reading = desk.icons.find((i) => i.key === picked)

  const pickSymbol = (key: SymbolKey) => {
    setPicked(key)
    wm.focus("readme")
  }

  return (
    <div
      ref={box}
      role="group"
      aria-label="UM.OS: a desktop showing a meeting and everything around it"
      className="relative isolate flex flex-col gap-3 overflow-hidden rounded-(--radius) border border-border bg-background bg-[radial-gradient(rgba(16,16,16,.22)_.7px,transparent_.8px)] bg-size-[12px_12px] px-3 pt-12 lg:block lg:h-[clamp(620px,54vw,820px)] lg:p-0"
    >
      <PointerGlow host={box} />
      <Badge variant="tag" className="absolute top-2.5 left-3 z-[2] px-[7px] py-0.5 text-[14.5px] font-medium">
        {desk.label}
      </Badge>

      <div className="z-[2] flex gap-4 lg:absolute lg:top-14 lg:left-5 lg:flex-col">
        {desk.icons.map((icon) => (
          <Toggle key={icon.key} pressed={picked === icon.key} onPressedChange={() => pickSymbol(icon.key)} className={deskIcon}>
            <Glyph symbol={icon.key} className={iconHover} />
            <span className={deskIconLabel}>{icon.label}</span>
          </Toggle>
        ))}
      </div>

      <div className="absolute top-14 right-5 z-[2] hidden flex-col gap-4 lg:flex">
        {GAMES.map((game) => (
          <Button key={game.id} variant="ghost" onClick={() => wm.openGame(game.id)} className={deskIcon}>
            <GameIcon cells={game.icon} className={iconHover} />
            <span className={deskIconLabel}>{game.file}</span>
          </Button>
        ))}
      </div>

      <MeetingStory active={inView && !stopped} reduced={reduced}>
        <DeskWindow id="call" title={desk.call.file} x="22%" y="8%" width="clamp(340px,38%,500px)" wm={wm} floating={floating} bounds={box} meta={<RecIndicator />}>
          <CallBody />
        </DeskWindow>
        <DeskWindow id="notes" title={desk.notes.file} x="62%" y="32%" width="clamp(280px,28%,380px)" wm={wm} floating={floating} bounds={box}>
          <NotesBody />
        </DeskWindow>
        <DeskWindow id="cal" title={desk.cal.file} x="38%" y="60%" width="clamp(440px,44%,620px)" wm={wm} floating={floating} bounds={box}>
          <CalendarBody />
        </DeskWindow>
      </MeetingStory>

      <DeskWindow id="clock" title={desk.clock} x="70%" y="6%" width="230px" wm={wm} floating={floating} bounds={box}>
        <DeskClock />
      </DeskWindow>

      <DeskWindow id="readme" title={desk.readme.file} x="7%" y="62%" width="clamp(300px,32%,420px)" wm={wm} floating={floating} bounds={box}>
        <div aria-live="polite" className="p-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={picked ?? "intro"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-lg font-medium tracking-[-0.02em]">{reading?.title ?? desk.readme.title}</p>
              <p className="mt-1.5 text-sm leading-normal text-muted-foreground">{reading?.text ?? desk.readme.text}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </DeskWindow>

      <AnimatePresence>
        {GAMES.filter((g) => wm.games.includes(g.id)).map((game) => (
          <GameWindow key={game.id} game={game} wm={wm} floating={floating} bounds={box} />
        ))}
      </AnimatePresence>

      <Taskbar wm={wm} onPickSymbol={pickSymbol} />
    </div>
  )
}
