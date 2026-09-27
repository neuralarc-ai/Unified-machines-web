import { useReducer } from "react"
import type { GameId } from "./games/registry"

export type WindowId = "call" | "notes" | "cal" | "clock" | "readme" | GameId

type State = {
  /** Stacking order, back to front. */
  order: WindowId[]
  minimized: WindowId[]
  maximized: WindowId | null
  /** Games start closed; opening one mounts it, so nothing runs until asked for. */
  games: GameId[]
}

type Action =
  | { type: "focus"; id: WindowId }
  | { type: "minimize"; id: WindowId }
  | { type: "toggleMax"; id: WindowId }
  | { type: "openGame"; id: GameId }
  | { type: "closeGame"; id: GameId }

const without = <T,>(list: T[], id: T) => list.filter((x) => x !== id)

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "focus":
      return { ...s, order: [...without(s.order, a.id), a.id], minimized: without(s.minimized, a.id) }
    case "minimize":
      return {
        ...s,
        minimized: [...without(s.minimized, a.id), a.id],
        maximized: s.maximized === a.id ? null : s.maximized,
      }
    case "toggleMax":
      return reducer({ ...s, maximized: s.maximized === a.id ? null : a.id }, { type: "focus", id: a.id })
    case "openGame":
      return reducer({ ...s, games: [...without(s.games, a.id), a.id] }, { type: "focus", id: a.id })
    case "closeGame":
      return {
        order: without(s.order, a.id),
        minimized: without(s.minimized, a.id),
        maximized: s.maximized === a.id ? null : s.maximized,
        games: without(s.games, a.id),
      }
  }
}

const initial: State = {
  order: ["notes", "cal", "clock", "readme", "call"],
  minimized: [],
  maximized: null,
  games: [],
}

/** Window stacking, minimise, maximise and open games for UM.OS. */
export function useWindowManager() {
  const [state, dispatch] = useReducer(reducer, initial)
  const front = state.order.findLast((id) => !state.minimized.includes(id))

  return {
    ...state,
    front,
    z: (id: WindowId) => 10 + state.order.indexOf(id),
    isMin: (id: WindowId) => state.minimized.includes(id),
    focus: (id: WindowId) => dispatch({ type: "focus", id }),
    minimize: (id: WindowId) => dispatch({ type: "minimize", id }),
    toggleMax: (id: WindowId) => dispatch({ type: "toggleMax", id }),
    openGame: (id: GameId) => dispatch({ type: "openGame", id }),
    closeGame: (id: GameId) => dispatch({ type: "closeGame", id }),
    /** Taskbar behaviour: restore if minimised, minimise if in front, else bring forward. */
    toggleTask: (id: WindowId) =>
      dispatch({ type: state.minimized.includes(id) || front !== id ? "focus" : "minimize", id }),
  }
}

export type WindowManager = ReturnType<typeof useWindowManager>
