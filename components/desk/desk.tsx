"use client"

import { useRef, useState, type ReactNode, type RefObject } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft01Icon, Delete02Icon, Folder01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { Glyph, MorseMark } from "@/components/brand/symbols"
import { useMotionState } from "@/components/motion/motion-provider"
import { FridayWindow } from "@/components/sections/friday-window"
import { SplitButton } from "@/components/site/split-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { useNow } from "@/hooks/use-now"
import { FRIDAY_URL, MORSE_URL, desk, tools, type SymbolKey } from "@/lib/content"
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
const smallBtn =
  "inline-flex h-8 items-center gap-1.5 border-[1.5px] border-ink px-2.5 font-mono text-[13px] transition-[translate,box-shadow,background-color] disabled:opacity-35"

/** Every window's name, for the menu bar and the phone's title bars. */
const WINDOW_TITLES: Record<string, string> = {
  call: desk.call.task,
  notes: desk.notes.file,
  cal: desk.cal.file,
  clock: desk.clock,
  readme: desk.readme.file,
  "morse-app": desk.apps.morse.file,
  "friday-app": desk.apps.friday.file,
  files: "files/",
  trash: desk.trash.file,
  ...Object.fromEntries(GAMES.map((g) => [g.id, g.file])),
}

/*
 * Desktop layout: where each window rests, planned so the windows a tour step
 * opens never overlap each other or the tour. The tour holds the lower left;
 * the meeting takes the upper left, its notes the upper right, the calendar
 * the lower right; apps open in the right half. Percentages are of the area
 * between the menu bar and the taskbar.
 */
const L = "max(120px,9%)" // clear of the left icon column
const RIGHT = `max(45%, calc(${L} + clamp(320px,33%,440px) + 24px))` // clear of the tour
const LAYOUT: Record<string, { x: string; y: string; width: string }> = {
  readme: { x: L, y: "52%", width: "clamp(320px,33%,440px)" },
  // before the tour starts, the card sits centred near the top; it glides to the lower left once it does
  welcome: { x: "calc(50% - clamp(360px,36%,480px) / 2)", y: "10%", width: "clamp(360px,36%,480px)" },
  call: { x: L, y: "4%", width: "clamp(340px,38%,500px)" },
  notes: { x: "52%", y: "4%", width: "clamp(280px,28%,380px)" },
  cal: { x: RIGHT, y: "42%", width: "clamp(360px,40%,560px)" },
  clock: { x: RIGHT, y: "4%", width: "clamp(260px,26%,300px)" },
  "friday-app": { x: RIGHT, y: "3%", width: "clamp(340px,38%,500px)" },
  "morse-app": { x: RIGHT, y: "8%", width: "clamp(320px,32%,420px)" },
  files: { x: RIGHT, y: "8%", width: "clamp(300px,30%,380px)" },
  // beside its own icon, lower right
  trash: { x: "calc(100% - 128px - clamp(280px,26%,340px))", y: "48%", width: "clamp(280px,26%,340px)" },
}

/* ------------------------------------------------------------------ clock */

function MonthView() {
  const now = useNow(60_000)
  if (!now) return null
  const y = now.getFullYear()
  const m = now.getMonth()
  const lead = (new Date(y, m, 1).getDay() + 6) % 7 // Monday first
  const days = new Date(y, m + 1, 0).getDate()
  const today = now.getDate()
  // the meeting's follow-up: the next Thursday, as the story books it
  const thu = today + ((4 - now.getDay() + 7) % 7 || 7)
  return (
    <div className="border-t border-border px-3 py-2.5">
      <p className="font-mono text-xs text-muted-foreground">
        {now.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
      </p>
      <div className="mt-2 grid grid-cols-7 gap-px text-center font-mono text-[11px]">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="text-muted-foreground">
            {d}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
          <span
            key={d}
            className={cn(
              "py-0.5 tabular-nums",
              d === today && "outline-1 -outline-offset-1 outline-ink",
              d === thu && "bg-lime font-medium"
            )}
          >
            {d}
          </span>
        ))}
      </div>
      {thu <= days && <p className="mt-2 font-mono text-[11px]">Thu {thu} · 14:00 follow-up, booked by Morse</p>}
    </div>
  )
}

function DeskClock() {
  const now = useNow()
  const [month, setMonth] = useState(false)
  return (
    <div className="font-mono">
      <div className="flex items-end justify-between gap-3 px-3 py-2.5">
        <div>
          <p className="text-[14.5px] text-muted-foreground">
            {now?.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }) ?? " "}
          </p>
          <p className="text-[29px] leading-none tabular-nums">{now?.toLocaleTimeString(undefined) ?? "--:--:--"}</p>
        </div>
        <button
          onClick={() => setMonth((v) => !v)}
          aria-expanded={month}
          className={cn(smallBtn, "h-7 bg-chalk hover:bg-paper-2")}
        >
          {month ? "Hide" : "Month"}
        </button>
      </div>
      {month && <MonthView />}
    </div>
  )
}

/* ------------------------------------------------------------------- tour */

type Opener = { id: string; label: string; onClick: () => void }

/** readme.txt: a four-step guided tour. On the desktop each step lays out its windows; on phones it offers them. */
function Tour({
  step,
  setStep,
  picked,
  clearPick,
  openers,
}: {
  step: number
  setStep: (n: number) => void
  picked: SymbolKey | null
  clearPick: () => void
  openers?: Opener[]
}) {
  const reading = desk.icons.find((i) => i.key === picked)
  const s = desk.tour[step]
  const last = step === desk.tour.length - 1
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
          {!reading && openers && openers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {openers.map((o) => (
                <button key={o.id} onClick={o.onClick} className={cn(smallBtn, "h-7 bg-chalk hover:bg-paper-2")}>
                  Open {o.label} →
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between gap-3">
        {reading ? (
          <button onClick={clearPick} className={cn(smallBtn, "bg-chalk hover:bg-paper-2")}>
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
                className={cn(smallBtn, "bg-chalk hover:bg-paper-2")}
              >
                Back
              </button>
              <button
                onClick={() => setStep(last ? 0 : step + 1)}
                className={cn(smallBtn, "bg-pink shadow-hard-sm hover:-translate-px hover:shadow-hard")}
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

/* ------------------------------------------------------------ app bodies */

function ProductBody({ app, onSeeMeeting }: { app: "morse" | "friday"; onSeeMeeting?: () => void }) {
  const morse = app === "morse"
  const a = desk.apps[app]
  return (
    <>
      {!morse && <FridayWindow />}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          {morse ? (
            <MorseMark className="size-9" />
          ) : (
            <Image src="/friday-icon.png" alt="" width={36} height={36} className="size-9" />
          )}
          <div>
            <p className="text-lg leading-tight font-medium tracking-[-0.02em]">{a.name}</p>
            <p className="font-mono text-xs text-muted-foreground">{a.role}</p>
          </div>
        </div>
        <p className="text-sm leading-normal text-ink-soft">{a.text}</p>
        <div className="flex flex-wrap items-center gap-2">
          <SplitButton href={morse ? MORSE_URL : FRIDAY_URL} external size="sm">
            {morse ? "Visit Morse" : "Visit Friday"}
          </SplitButton>
          {morse && onSeeMeeting && (
            <button onClick={onSeeMeeting} className={cn(smallBtn, "h-9 bg-chalk hover:bg-paper-2")}>
              See it in a meeting
            </button>
          )}
        </div>
      </div>
    </>
  )
}

/** files/: the page's sections as folders; opening one scrolls the page there. */
function FilesBody({ onGo }: { onGo?: () => void }) {
  return (
    <ul className="py-1">
      {desk.files.map((f) => (
        <li key={f.href}>
          <a
            href={f.href}
            onClick={onGo}
            className="flex items-center gap-3 px-3 py-2 hover:bg-lime-soft focus-visible:bg-lime-soft"
          >
            <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.5} className="size-5 shrink-0" />
            <span className="font-mono text-[14.5px]">{f.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{f.note}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** trash: the seven tools Morse replaces, and a button to empty them for good. */
function TrashBody() {
  const [emptied, setEmptied] = useState(false)
  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="font-mono text-xs text-muted-foreground uppercase">{emptied ? "0 items" : desk.trash.heading}</p>
      {emptied ? (
        <p className="flex items-center gap-2 text-sm">
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} className="size-4 text-pink-deep" />
          {desk.trash.empty}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          {tools.map((t) => (
            <li key={t} className="text-muted-foreground line-through decoration-ink/40">
              {t}
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => setEmptied((v) => !v)} className={cn(smallBtn, "self-start bg-chalk hover:bg-paper-2")}>
        {emptied ? "Restore" : "Empty trash"}
      </button>
    </div>
  )
}

function AppIconArt({ id, className }: { id: AppId; className?: string }) {
  if (id === "morse-app") return <MorseMark className={className} />
  if (id === "friday-app") return <Image src="/friday-icon.png" alt="" width={40} height={40} className={className} />
  return <HugeiconsIcon icon={id === "files" ? Folder01Icon : Delete02Icon} strokeWidth={1.4} className={className} />
}

/* ---------------------------------------------------------------- windows */

/** A game window owns its score, so a running game only re-renders itself. */
function GameWindow({
  game,
  wm,
  bounds,
}: {
  game: (typeof GAMES)[number]
  wm: WindowManager
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
      floating
      bounds={bounds}
      onClose={() => wm.closeGame(game.id)}
      meta={<span className="text-paper/70 tabular-nums">{score}</span>}
    >
      <game.Game onScore={setScore} />
    </DeskWindow>
  )
}

function AppWindow({
  id,
  wm,
  bounds,
  onSeeMeeting,
}: {
  id: AppId
  wm: WindowManager
  bounds: RefObject<HTMLDivElement | null>
  onSeeMeeting: () => void
}) {
  return (
    <DeskWindow
      id={id}
      title={WINDOW_TITLES[id]}
      {...LAYOUT[id]}
      wm={wm}
      floating
      bounds={bounds}
      onClose={() => wm.closeApp(id)}
    >
      {id === "morse-app" && <ProductBody app="morse" onSeeMeeting={onSeeMeeting} />}
      {id === "friday-app" && <ProductBody app="friday" />}
      {id === "files" && <FilesBody />}
      {id === "trash" && <TrashBody />}
    </DeskWindow>
  )
}

const LEFT_APPS: AppId[] = ["morse-app", "friday-app"]
const LOWER_RIGHT_APPS: AppId[] = ["files", "trash"]

/* ---------------------------------------------------------------- desktop */

/**
 * UM.OS on desktop screens: opens on the guided tour alone; each tour step
 * lays out exactly the windows it talks about, and "Start again" clears the
 * desk back down. Apps, symbols, files, trash and three games wait as icons.
 */
function DesktopDesk() {
  const box = useRef<HTMLDivElement>(null)
  const wm = useWindowManager()
  const [step, setStepRaw] = useState(0)
  const [picked, setPicked] = useState<SymbolKey | null>(null)
  const inView = useInView(box, { amount: 0.3 })
  const { stopped, reduced } = useMotionState()

  const pickSymbol = (key: SymbolKey) => {
    setPicked(key)
    wm.focus("readme")
  }

  const setStep = (n: number) => {
    setStepRaw(n)
    setPicked(null)
    if (n === 0) wm.reset()
    else wm.arrange(desk.tour[n].opens as WindowId[])
  }

  const seeMeeting = () => ["call", "notes", "cal"].forEach((id) => wm.focus(id as WindowId))
  const iconButton = (id: AppId) => (
    <Button key={id} variant="ghost" onClick={() => wm.openApp(id)} className={deskIcon}>
      <AppIconArt id={id} className={iconHover} />
      <span className={deskIconLabel}>{WINDOW_TITLES[id]}</span>
    </Button>
  )

  return (
    <div
      ref={box}
      role="group"
      aria-label="UM.OS: a desktop with a guided tour of Unified Machines"
      className="relative isolate h-[clamp(620px,54vw,820px)] overflow-hidden rounded-(--radius) border border-border bg-background bg-[radial-gradient(rgba(16,16,16,.22)_.7px,transparent_.8px)] bg-size-[12px_12px]"
    >
      <PointerGlow host={box} />

      {/* the menu bar: which window is in front, and the way back into the tour */}
      <div className="absolute inset-x-0 top-0 z-40 flex h-9 items-center gap-4 border-b border-border bg-card/90 px-3 font-mono text-[13px] backdrop-blur-sm">
        <Badge variant="tag" className="px-[7px] py-0.5 text-[13px] font-medium">
          {desk.label}
        </Badge>
        <span className="font-medium">{wm.front ? WINDOW_TITLES[wm.front] : "Desktop"}</span>
        <span className="ml-auto flex items-center gap-4 text-muted-foreground">
          <span>Double-click a title bar to fill the desk</span>
          <button
            onClick={() => setStep(0)}
            className="text-ink underline decoration-ink/30 underline-offset-3 hover:decoration-pink"
          >
            Take the tour
          </button>
        </span>
      </div>

      <div className="absolute top-13 left-5 z-[2] flex flex-col gap-2">
        {LEFT_APPS.map(iconButton)}
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

      <div className="absolute top-13 right-5 z-[2] flex flex-col gap-2">
        {GAMES.map((game) => (
          <Button key={game.id} variant="ghost" onClick={() => wm.openGame(game.id)} className={deskIcon}>
            <GameIcon cells={game.icon} className={iconHover} />
            <span className={deskIconLabel}>{game.file}</span>
          </Button>
        ))}
      </div>
      <div className="absolute right-5 bottom-14 z-[2] flex flex-col gap-2">{LOWER_RIGHT_APPS.map(iconButton)}</div>

      {/* windows live between the menu bar and the taskbar */}
      <div className="absolute inset-x-0 top-9 bottom-11">
        <MeetingStory active={inView && !stopped} reduced={reduced}>
          <DeskWindow
            id="call"
            title={desk.call.file}
            {...LAYOUT.call}
            wm={wm}
            floating
            bounds={box}
            meta={<RecIndicator />}
          >
            <CallBody />
          </DeskWindow>
          <DeskWindow id="notes" title={desk.notes.file} {...LAYOUT.notes} wm={wm} floating bounds={box}>
            <NotesBody />
          </DeskWindow>
          <DeskWindow id="cal" title={desk.cal.file} {...LAYOUT.cal} wm={wm} floating bounds={box}>
            <CalendarBody />
          </DeskWindow>
        </MeetingStory>

        <DeskWindow id="clock" title={desk.clock} {...LAYOUT.clock} wm={wm} floating bounds={box}>
          <DeskClock />
        </DeskWindow>

        <DeskWindow
          id="readme"
          title={desk.readme.file}
          {...(step === 0 && !picked ? LAYOUT.welcome : LAYOUT.readme)}
          wm={wm}
          floating
          bounds={box}
        >
          <Tour step={step} setStep={setStep} picked={picked} clearPick={() => setPicked(null)} />
        </DeskWindow>

        <AnimatePresence>
          {wm.apps.map((id) => (
            <AppWindow key={id} id={id} wm={wm} bounds={box} onSeeMeeting={seeMeeting} />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {GAMES.filter((g) => wm.games.includes(g.id)).map((game) => (
            <GameWindow key={game.id} game={game} wm={wm} bounds={box} />
          ))}
        </AnimatePresence>
      </div>

      <Taskbar wm={wm} onPickSymbol={pickSymbol} />
    </div>
  )
}

/* ------------------------------------------------------------------ phone */

type PhoneView = WindowId
const tile = "grid size-14 place-items-center border-[1.5px] border-ink bg-chalk shadow-hard-sm"
const PHONE_APPS: { id: WindowId; label: string; art: ReactNode }[] = [
  { id: "morse-app", label: "Morse", art: <MorseMark className="size-8" /> },
  {
    id: "friday-app",
    label: "Friday",
    art: <Image src="/friday-icon.png" alt="" width={32} height={32} className="size-8" />,
  },
  { id: "call", label: "Meeting", art: <span className="font-mono text-[11px] font-bold">REC</span> },
  { id: "notes", label: "Notes", art: <span className="font-mono text-lg">✓</span> },
  { id: "cal", label: "Calendar", art: <span className="font-mono text-sm font-bold">Thu</span> },
  { id: "clock", label: "Clock", art: <span className="font-mono text-[13px] font-bold">12:00</span> },
  { id: "files", label: "Files", art: <HugeiconsIcon icon={Folder01Icon} strokeWidth={1.4} className="size-7" /> },
  { id: "trash", label: "Trash", art: <HugeiconsIcon icon={Delete02Icon} strokeWidth={1.4} className="size-7" /> },
]

/**
 * UM.OS on phones and tablets: a home screen with the tour on top and the
 * apps in a grid; tapping one opens it full width, with a way back home.
 */
function PhoneDesk() {
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, { amount: 0.2 })
  const { stopped, reduced } = useMotionState()
  const [view, setView] = useState<PhoneView | null>(null)
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<SymbolKey | null>(null)
  const now = useNow(10_000)

  const open = (id: PhoneView) => {
    setView(id)
    box.current?.scrollIntoView({ block: "start", behavior: "smooth" })
  }
  const openers = (desk.tour[step].opens as WindowId[]).map((id) => ({
    id,
    label: WINDOW_TITLES[id],
    onClick: () => open(id),
  }))

  const body = (v: PhoneView) => {
    switch (v) {
      case "call":
        return <CallBody />
      case "notes":
        return <NotesBody />
      case "cal":
        return <CalendarBody />
      case "clock":
        return <DeskClock />
      case "morse-app":
        return <ProductBody app="morse" onSeeMeeting={() => setView("call")} />
      case "friday-app":
        return <ProductBody app="friday" />
      case "files":
        return <FilesBody onGo={() => setView(null)} />
      case "trash":
        return <TrashBody />
      default:
        return null
    }
  }

  return (
    <div
      ref={box}
      role="group"
      aria-label="UM.OS: a home screen with a guided tour of Unified Machines"
      className="relative scroll-mt-20 overflow-hidden border border-border bg-background bg-[radial-gradient(rgba(16,16,16,.22)_.7px,transparent_.8px)] bg-size-[12px_12px]"
    >
      <div className="flex h-9 items-center justify-between border-b border-border bg-card/90 px-3 font-mono text-[13px]">
        <Badge variant="tag" className="px-[7px] py-0.5 text-[13px] font-medium">
          {desk.label}
        </Badge>
        <span className="tabular-nums">
          {now?.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) ?? "--:--"}
        </span>
      </div>

      <MeetingStory active={inView && !stopped} reduced={reduced}>
        <AnimatePresence mode="wait" initial={false}>
          {view ? (
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22 }}
              className="p-3"
            >
              <section aria-label={WINDOW_TITLES[view]} className="border border-border bg-card shadow-hard-sm">
                <div className="flex h-10 items-center gap-2 bg-ink pr-3 pl-1 font-mono text-[14.5px] text-paper">
                  <button
                    onClick={() => setView(null)}
                    className="flex h-8 items-center gap-1 px-2 hover:text-pink"
                    aria-label="Back to the home screen"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4" />
                    Home
                  </button>
                  <span className="truncate">{WINDOW_TITLES[view]}</span>
                  {view === "call" && (
                    <span className="ml-auto">
                      <RecIndicator />
                    </span>
                  )}
                </div>
                {body(view)}
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-5 p-3"
            >
              <section aria-label={desk.readme.file} className="border border-border bg-card shadow-hard-sm">
                <p className="bg-ink px-2.5 py-1.5 font-mono text-[14.5px] text-paper">{desk.readme.file}</p>
                <Tour
                  step={step}
                  setStep={(n) => {
                    setStep(n)
                    setPicked(null)
                  }}
                  picked={picked}
                  clearPick={() => setPicked(null)}
                  openers={openers}
                />
              </section>
              <ul className="grid grid-cols-4 gap-x-2 gap-y-4 pb-2">
                {PHONE_APPS.map((a) => (
                  <li key={a.id}>
                    <button onClick={() => open(a.id)} className="flex w-full flex-col items-center gap-1.5">
                      <span className={tile}>{a.art}</span>
                      <span className="font-mono text-[12px]">{a.label}</span>
                    </button>
                  </li>
                ))}
                {desk.icons.map((icon) => (
                  <li key={icon.key}>
                    <button
                      onClick={() => setPicked(icon.key)}
                      aria-pressed={picked === icon.key}
                      className="flex w-full flex-col items-center gap-1.5"
                    >
                      <span className={cn(tile, picked === icon.key && "bg-pink")}>
                        <Glyph symbol={icon.key} className="size-7" />
                      </span>
                      <span className="font-mono text-[12px]">{icon.key}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </MeetingStory>
    </div>
  )
}

/** UM.OS: the desktop from 1024px up, the phone home screen below it. */
export function Desk() {
  return (
    <>
      <div className="hidden lg:block">
        <DesktopDesk />
      </div>
      <div className="lg:hidden">
        <PhoneDesk />
      </div>
    </>
  )
}
