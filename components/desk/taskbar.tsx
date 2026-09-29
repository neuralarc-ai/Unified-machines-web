"use client"

import { BrandMarks, Glyph } from "@/components/brand/symbols"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNow } from "@/hooks/use-now"
import { desk, type SymbolKey } from "@/lib/content"
import { cn } from "@/lib/utils"
import { GameIcon, GAMES } from "./games/registry"
import type { AppId, WindowId, WindowManager } from "./use-window-manager"

const WINDOWS: { id: WindowId; label: string }[] = [
  { id: "call", label: desk.call.task },
  { id: "notes", label: desk.notes.file },
  { id: "cal", label: desk.cal.file },
  { id: "clock", label: desk.clock },
  { id: "readme", label: desk.readme.file },
]

const APPS: { id: AppId; label: string }[] = [
  { id: "morse-app", label: desk.apps.morse.file },
  { id: "friday-app", label: desk.apps.friday.file },
  { id: "files", label: "files/" },
  { id: "trash", label: desk.trash.file },
]

const menuItem = "gap-2.5 rounded-none px-2.5 py-2 text-[17px] focus:bg-pink focus:text-ink"

function TrayClock() {
  const now = useNow(10_000)
  return <>{now?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) ?? "--:--"}</>
}

export function Taskbar({ wm, onPickSymbol }: { wm: WindowManager; onPickSymbol: (key: SymbolKey) => void }) {
  const apps = APPS.filter((a) => wm.apps.includes(a.id))
  const tasks = [
    ...WINDOWS,
    ...apps,
    ...GAMES.filter((g) => wm.games.includes(g.id)).map((g) => ({ id: g.id, label: g.file })),
  ]

  return (
    <div className="z-40 -mx-3 mt-3 flex h-11 items-center gap-2.5 border-t border-border bg-card px-2 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mx-0 lg:mt-0">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="accent" className="h-7.5 gap-2 rounded-none px-2.5 font-mono text-[14.5px]" />}
        >
          <BrandMarks glyphClassName="size-[11px]" />
          UM
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          sideOffset={6}
          className="w-60 rounded-none border border-ink bg-card p-1.5 shadow-hard ring-0"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2.5 font-mono text-[14.5px] font-medium uppercase">Apps</DropdownMenuLabel>
            {APPS.map((a) => (
              <DropdownMenuItem key={a.id} className={menuItem} onClick={() => wm.openApp(a.id)}>
                {a.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {desk.icons.map((icon) => (
              <DropdownMenuItem key={icon.key} className={menuItem} onClick={() => onPickSymbol(icon.key)}>
                <Glyph symbol={icon.key} className="size-4" />
                {icon.title.replace(".", "")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2.5 font-mono text-[14.5px] font-medium uppercase">
              Games
            </DropdownMenuLabel>
            {GAMES.map((game) => (
              <DropdownMenuItem key={game.id} className={menuItem} onClick={() => wm.openGame(game.id)}>
                <GameIcon cells={game.icon} className="size-4" />
                {game.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <nav aria-label="Open windows" className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none]">
        {tasks.map((task) => {
          const minimized = wm.isMin(task.id)
          const front = !minimized && wm.front === task.id
          return (
            <Button
              key={task.id}
              variant="outline"
              aria-current={front || undefined}
              onClick={() => wm.toggleTask(task.id)}
              className={cn(
                "h-7.5 shrink-0 rounded-none bg-card px-3 font-mono text-[14.5px] font-medium",
                // the front window's task sits pressed in, like a real taskbar
                front && "translate-px bg-ink text-paper shadow-none hover:bg-ink hover:text-paper",
                minimized && "border-dashed text-muted-foreground"
              )}
            >
              {task.label}
            </Button>
          )
        })}
      </nav>

      <span className="flex h-7.5 items-center border-l border-line px-2 font-mono text-[14.5px] tabular-nums">
        <TrayClock />
      </span>
    </div>
  )
}
