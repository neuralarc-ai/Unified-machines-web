"use client"

import { useSyncExternalStore } from "react"

const subscribe = (onTick: () => void) => {
  const id = setInterval(onTick, 1000)
  return () => clearInterval(id)
}

/** Live local date and time; blank on the server so hydration never mismatches. */
export function Clock() {
  const seconds = useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / 1000),
    () => null
  )
  const now = seconds === null ? null : new Date(seconds * 1000)

  return (
    <>
      <span className="text-[10px] md:text-xs">
        {now?.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" }) ?? " "}
      </span>
      <time className="text-base tabular-nums md:text-lg" dateTime={now?.toISOString()}>
        {now?.toLocaleTimeString("en-GB") ?? "--:--:--"}
      </time>
    </>
  )
}
