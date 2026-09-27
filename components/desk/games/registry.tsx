import type { ComponentType } from "react"
import { cn } from "@/lib/utils"
import { Match } from "./match"
import { Runner } from "./runner"
import { Snake } from "./snake"
import type { GameProps } from "./shared"

export type GameId = "runner" | "snake" | "match"

/** The three games. Icons sit on the symbols' 5×5 grid: "x" ink, "o" lime. */
export const GAMES: { id: GameId; file: string; name: string; width: number; icon: string[]; Game: ComponentType<GameProps> }[] = [
  { id: "runner", file: "runner.exe", name: "Runner", width: 543, Game: Runner, icon: ["xxx..", "xox..", "xxx..", "....x", "ooooo"] },
  { id: "snake", file: "snake.exe", name: "Snake", width: 543, Game: Snake, icon: ["xxxx.", "...x.", ".xxx.", ".x...", ".x..o"] },
  { id: "match", file: "match.exe", name: "Match", width: 460, Game: Match, icon: ["xx.oo", "xx.oo", ".....", "oo.xx", "oo.xx"] },
]

export function GameIcon({ cells, className }: { cells: string[]; className?: string }) {
  return (
    <span aria-hidden className={cn("grid size-10 shrink-0 grid-cols-5", className)}>
      {cells.flatMap((row, y) =>
        [...row].map((c, x) => (
          <span key={`${x}-${y}`} className={cn(c === "x" && "bg-current", c === "o" && "border border-border bg-lime")} />
        ))
      )}
    </span>
  )
}
