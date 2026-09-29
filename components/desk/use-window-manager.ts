import { useReducer } from "react"
import type { GameId } from "./games/registry"

export type AppId = "morse-app" | "friday-app" | "files" | "trash"
export type WindowId = "call" | "notes" | "cal" | "clock" | "readme" | GameId | AppId

export const APP_IDS: AppId[] = ["morse-app", "friday-app", "files", "trash"]
const STORY: WindowId[] = ["call", "notes", "cal", "clock"]
const isApp = (id: WindowId): id is AppId => APP_IDS.includes(id as AppId)

type State = {
  /** Stacking order, back to front. */
  order: WindowId[]
  minimized: WindowId[]
  maximized: WindowId | null
  /** Games start closed; opening one mounts it, so nothing runs until asked for. */
  games: GameId[]
  /** App windows (products, files, trash), mounted when opened. */
  apps: AppId[]
}

type Action =
  | { type: "focus"; id: WindowId }
  | { type: "minimize"; id: WindowId }
  | { type: "toggleMax"; id: WindowId }
  | { type: "openGame"; id: GameId }
  | { type: "closeGame"; id: GameId }
  | { type: "openApp"; id: AppId }
  | { type: "closeApp"; id: AppId }
  /** Show exactly these windows beside the tour: the rest of the story minimises, other apps close. */
  | { type: "arrange"; ids: WindowId[] }
  | { type: "reset" }

const without = <T,>(list: T[], id: T) => list.filter((x) => x !== id)

// a calm first screen: only the tour; the meeting waits in the taskbar until the tour gets to it
const initial: State = {
  order: ["notes", "cal", "clock", "call", "readme"],
  minimized: ["call", "notes", "cal", "clock"],
  maximized: null,
  games: [],
  apps: [],
}

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
        ...s,
        order: without(s.order, a.id),
        minimized: without(s.minimized, a.id),
        maximized: s.maximized === a.id ? null : s.maximized,
        games: without(s.games, a.id),
      }
    case "openApp":
      return reducer({ ...s, apps: [...without(s.apps, a.id), a.id] }, { type: "focus", id: a.id })
    case "closeApp":
      return {
        ...s,
        order: without(s.order, a.id),
        minimized: without(s.minimized, a.id),
        maximized: s.maximized === a.id ? null : s.maximized,
        apps: without(s.apps, a.id),
      }
    case "arrange": {
      let next: State = {
        ...s,
        maximized: null,
        minimized: [...s.minimized.filter((id) => !STORY.includes(id)), ...STORY.filter((id) => !a.ids.includes(id))],
        apps: a.ids.filter(isApp),
        order: s.order.filter((id) => !isApp(id) || a.ids.includes(id)),
      }
      for (const id of [...a.ids, "readme" as WindowId]) next = reducer(next, { type: "focus", id })
      return next
    }
    case "reset":
      return initial
  }
}

/** Window stacking, minimise, maximise, and opening games and apps for UM.OS. */
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
    openApp: (id: AppId) => dispatch({ type: "openApp", id }),
    closeApp: (id: AppId) => dispatch({ type: "closeApp", id }),
    arrange: (ids: WindowId[]) => dispatch({ type: "arrange", ids }),
    reset: () => dispatch({ type: "reset" }),
    /** Taskbar behaviour: restore if minimised, minimise if in front, else bring forward. */
    toggleTask: (id: WindowId) =>
      dispatch({ type: state.minimized.includes(id) || front !== id ? "focus" : "minimize", id }),
  }
}

export type WindowManager = ReturnType<typeof useWindowManager>
