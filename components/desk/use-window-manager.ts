import { useEffect, useReducer } from "react"
import type { GameId } from "./games/registry"

export type AppId = "morse-app" | "friday-app"
export type WindowId = "call" | "notes" | "cal" | "clock" | "readme" | GameId | AppId

type State = {
  /** Stacking order, back to front. */
  order: WindowId[]
  minimized: WindowId[]
  maximized: WindowId | null
  /** Games start closed; opening one mounts it, so nothing runs until asked for. */
  games: GameId[]
  /** Product windows, mounted when opened from their desktop icons. */
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

const without = <T>(list: T[], id: T) => list.filter((x) => x !== id)

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
  }
}

// a calm first screen: the tour and the meeting open, the rest waiting in the taskbar
const initial: State = {
  order: ["notes", "cal", "clock", "call", "readme"],
  minimized: ["notes", "cal", "clock"],
  maximized: null,
  games: [],
  apps: [],
}

/**
 * Window stacking, minimise, maximise and open games for UM.OS. `compact`
 * windows start minimised below the desk breakpoint, where windows stack in a
 * column: the taskbar still lists them, so they are one tap away.
 */
export function useWindowManager(compact: WindowId[] = []) {
  const [state, dispatch] = useReducer(reducer, initial)

  // decided once, in the browser: the server can't know the screen
  useEffect(() => {
    if (matchMedia("(min-width: 1024px)").matches) return
    const t = setTimeout(() => compact.forEach((id) => dispatch({ type: "minimize", id })))
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- first screen only
  }, [])
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
    /** Taskbar behaviour: restore if minimised, minimise if in front, else bring forward. */
    toggleTask: (id: WindowId) =>
      dispatch({ type: state.minimized.includes(id) || front !== id ? "focus" : "minimize", id }),
  }
}

export type WindowManager = ReturnType<typeof useWindowManager>
