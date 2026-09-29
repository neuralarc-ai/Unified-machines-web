"use client"

import { useRef, useState, type RefObject } from "react"
import { AnimatePresence, motion, useInView } from "framer-motion"
import Image from "next/image"
import { Glyph, MorseMark } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useNow } from "@/hooks/use-now"
import { FRIDAY_URL, MORSE_URL, desk, type SymbolKey } from "@/lib/content"
import { FridayWindow } from "@/components/sections/friday-window"
import { SplitButton } from "@/components/site/split-button"
import { cn } from "@/lib/utils"
import { DeskWindow } from "./desk-window"
import { GameIcon, GAMES } from "./games/registry"
import { CalendarBody, CallBody, MeetingStory, NotesBody, RecIndicator } from "./meeting-story"
import { PointerGlow } from "./pointer-glow"
import { Taskbar } from "./taskbar"
import { useWindowManager, type AppId, type WindowId, type WindowManager } from "./use-window-manager"

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

/** readme.txt: a four-step guided tour; each step opens the windows it talks about. */
function Tour({
  step,
  setStep,
  picked,
  clearPick,
}: {
  step: number
  setStep: (n: number) => void
  picked: SymbolKey | null
  clearPick: () => void
}) {
  const reading = desk.icons.find((i) => i.key === picked)
  const s = desk.tour[step]
  const last = step === desk.tour.length - 1
  const btn =
    "inline-flex h-8 items-center gap-1.5 border-[1.5px] border-ink px-2.5 font-mono text-[13px] transition-[translate,box-shadow,background-color] disabled:opacity-35"
  return (
    <div aria-live="polite" className="flex flex-col gap-3 p-3">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={reading ? reading.key : step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-mono text-xs text-muted-foreground">
            {reading ? "symbol" : `tour · ${step + 1} / ${desk.tour.length}`}
          </p>
          <p className="mt-1 text-lg font-medium tracking-[-0.02em]">{reading?.title ?? s.title}</p>
          <p className="mt-1.5 text-sm leading-normal text-muted-foreground">{reading?.text ?? s.text}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between gap-3">
        {reading ? (
          <button onClick={clearPick} className={cn(btn, "bg-chalk hover:bg-paper-2")}>
            ← Back to the tour
          </button>
        ) : (
          <>
            <span aria-hidden className="flex gap-1">
              {desk.tour.map((_, i) => (
                <i
                  key={i}
                  className={cn(
                    "h-1.5 w-4 border border-ink",
                    i === step ? "bg-pink" : i < step ? "bg-ink" : "bg-transparent"
                  )}
                />
              ))}
            </span>
            <span className="flex gap-1.5">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
                className={cn(btn, "bg-chalk hover:bg-paper-2")}
              >
                Back
              </button>
              <button
                onClick={() => setStep(last ? 0 : step + 1)}
                className={cn(btn, "bg-pink shadow-hard-sm hover:-translate-px hover:shadow-hard")}
              >
                {last ? "Start again" : step === 0 ? "Start tour →" : "Next →"}
              </button>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

/** A product window, opened from its desktop icon: what it is, and the way in. */
function AppWindow({
  id,
  wm,
  floating,
  bounds,
  onSeeMeeting,
}: {
  id: AppId
  wm: WindowManager
  floating: boolean
  bounds: RefObject<HTMLDivElement | null>
  onSeeMeeting: () => void
}) {
  const morse = id === "morse-app"
  const app = morse ? desk.apps.morse : desk.apps.friday
  return (
    <DeskWindow
      id={id}
      title={app.file}
      x={morse ? "60%" : "44%"}
      y={morse ? "44%" : "6%"}
      width={morse ? "clamp(300px,30%,400px)" : "clamp(360px,38%,500px)"}
      wm={wm}
      floating={floating}
      bounds={bounds}
      onClose={() => wm.closeApp(id)}
    >
      {!morse && <FridayWindow />}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          {morse ? (
            <MorseMark className="size-9" />
          ) : (
            <Image src="/friday-icon.png" alt="" width={36} height={36} className="size-9" />
          )}
          <div>
            <p className="text-lg leading-tight font-medium tracking-[-0.02em]">{app.name}</p>
            <p className="font-mono text-xs text-muted-foreground">{app.role}</p>
          </div>
        </div>
        <p className="text-sm leading-normal text-ink-soft">{app.text}</p>
        <div className="flex flex-wrap items-center gap-2">
          <SplitButton href={morse ? MORSE_URL : FRIDAY_URL} external size="sm">
            {morse ? "Visit Morse" : "Visit Friday"}
          </SplitButton>
          {morse && (
            <button
              onClick={onSeeMeeting}
              className="inline-flex h-9 items-center border-[1.5px] border-ink bg-chalk px-3 font-mono text-[13px] hover:bg-paper-2"
            >
              See it in a meeting
            </button>
          )}
        </div>
      </div>
    </DeskWindow>
  )
}

const APP_ICONS: { id: AppId; file: string }[] = [
  { id: "morse-app", file: desk.apps.morse.file },
  { id: "friday-app", file: desk.apps.friday.file },
]

/**
 * UM.OS: a desktop that opens on a guided tour and one Morse meeting; the
 * product apps, the three symbols and three small games wait as icons.
 */
export function Desk() {
  const box = useRef<HTMLDivElement>(null)
  const wm = useWindowManager()
  const [step, setStepRaw] = useState(0)
  const [picked, setPicked] = useState<SymbolKey | null>(null)
  const inView = useInView(box, { amount: 0.3 })
  const { stopped, reduced } = useMotionState()
  const floating = useMediaQuery("(min-width: 1024px)")
  const pickSymbol = (key: SymbolKey) => {
    setPicked(key)
    wm.focus("readme")
  }

  const open = (id: WindowId) => (id === "morse-app" || id === "friday-app" ? wm.openApp(id) : wm.focus(id))
  const seeMeeting = () => ["call", "notes", "cal"].forEach((id) => wm.focus(id as WindowId))

  // each tour step opens its windows, then hands the front back to the tour
  const setStep = (n: number) => {
    setStepRaw(n)
    setPicked(null)
    desk.tour[n].opens.forEach((id) => open(id as WindowId))
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

      <div className="z-[2] flex flex-wrap gap-4 lg:absolute lg:top-14 lg:left-5 lg:flex-col">
        {APP_ICONS.map((app) => (
          <Button key={app.id} variant="ghost" onClick={() => wm.openApp(app.id)} className={deskIcon}>
            {app.id === "morse-app" ? (
              <MorseMark className={iconHover} />
            ) : (
              <Image src="/friday-icon.png" alt="" width={40} height={40} className={iconHover} />
            )}
            <span className={deskIconLabel}>{app.file}</span>
          </Button>
        ))}
        {desk.icons.map((icon) => (
          <Toggle
            key={icon.key}
            pressed={picked === icon.key}
            onPressedChange={() => pickSymbol(icon.key)}
            className={deskIcon}
          >
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
        <DeskWindow
          id="call"
          title={desk.call.file}
          x="22%"
          y="8%"
          width="clamp(340px,38%,500px)"
          wm={wm}
          floating={floating}
          bounds={box}
          meta={<RecIndicator />}
        >
          <CallBody />
        </DeskWindow>
        <DeskWindow
          id="notes"
          title={desk.notes.file}
          x="62%"
          y="32%"
          width="clamp(280px,28%,380px)"
          wm={wm}
          floating={floating}
          bounds={box}
        >
          <NotesBody />
        </DeskWindow>
        <DeskWindow
          id="cal"
          title={desk.cal.file}
          x="38%"
          y="60%"
          width="clamp(440px,44%,620px)"
          wm={wm}
          floating={floating}
          bounds={box}
        >
          <CalendarBody />
        </DeskWindow>
      </MeetingStory>

      <DeskWindow id="clock" title={desk.clock} x="70%" y="6%" width="230px" wm={wm} floating={floating} bounds={box}>
        <DeskClock />
      </DeskWindow>

      <DeskWindow
        id="readme"
        title={desk.readme.file}
        x="max(128px,10%)"
        y="56%"
        width="clamp(320px,34%,440px)"
        wm={wm}
        floating={floating}
        bounds={box}
      >
        <Tour step={step} setStep={setStep} picked={picked} clearPick={() => setPicked(null)} />
      </DeskWindow>

      <AnimatePresence>
        {APP_ICONS.filter((a) => wm.apps.includes(a.id)).map((a) => (
          <AppWindow key={a.id} id={a.id} wm={wm} floating={floating} bounds={box} onSeeMeeting={seeMeeting} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {GAMES.filter((g) => wm.games.includes(g.id)).map((game) => (
          <GameWindow key={game.id} game={game} wm={wm} floating={floating} bounds={box} />
        ))}
      </AnimatePresence>

      <Taskbar wm={wm} onPickSymbol={pickSymbol} />
    </div>
  )
}
