import { cn } from "@/lib/utils"

/** Waveform of bouncing bars. CSS keyframes, since dozens of infinite loops are cheaper off the JS thread. */
export function Signal({
  bars = 30,
  scale = 1,
  className,
  barClassName,
}: {
  bars?: number
  scale?: number
  className?: string
  barClassName?: string
}) {
  return (
    <div aria-hidden className={cn("flex h-9 items-end gap-0.5", className)}>
      {Array.from({ length: bars }, (_, i) => {
        // rounded so server and client markup match
        const h = Math.round((8 + Math.abs(Math.sin(i * 0.35)) * 22 + Math.cos(i * 0.9) * 6) * scale * 10) / 10
        return (
          <i
            key={i}
            className={cn("block w-1 origin-bottom animate-signal bg-ink motion-reduce:animate-none", barClassName)}
            style={{ height: h, animationDelay: `${-i * 0.08}s` }}
          />
        )
      })}
    </div>
  )
}
