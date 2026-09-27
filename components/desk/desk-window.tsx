"use client"

import { useEffect, useState, type CSSProperties, type ReactNode, type RefObject } from "react"
import { motion, useDragControls, useMotionValue } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, MinusSignIcon, SquareIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { WindowId, WindowManager } from "./use-window-manager"

type DeskWindowProps = {
  id: WindowId
  title: string
  /** Resting position and width on desktop screens, as CSS lengths. */
  x: string
  y: string
  width: string
  wm: WindowManager
  /** Desktop layout: windows float, drag and maximise. Below it they stack. */
  floating: boolean
  bounds: RefObject<HTMLDivElement | null>
  meta?: ReactNode
  onClose?: () => void
  children: ReactNode
}

function WindowControl({ label, icon, onClick }: { label: string; icon: typeof Cancel01Icon; onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={label}
      onClick={onClick}
      // keep the title bar from starting a drag
      onPointerDown={(e) => e.stopPropagation()}
      className="size-4.5 rounded-none border border-paper/50 text-paper hover:border-lime hover:bg-lime hover:text-ink"
    >
      <HugeiconsIcon icon={icon} strokeWidth={2} className="size-2.5" />
    </Button>
  )
}

/** An UM.OS window: drags by its title bar, minimises, maximises, comes to the front. */
export function DeskWindow({ id, title, x, y, width, wm, floating, bounds, meta, onClose, children }: DeskWindowProps) {
  const controls = useDragControls()
  const dx = useMotionValue(0)
  const dy = useMotionValue(0)
  const [dragging, setDragging] = useState(false)
  const minimized = wm.isMin(id)
  const maximized = floating && wm.maximized === id
  const draggable = floating && !maximized

  // maximising takes the whole desk, so forget where it was dragged to
  useEffect(() => {
    if (!maximized) return
    dx.set(0)
    dy.set(0)
  }, [maximized, dx, dy])

  return (
    <motion.section
      aria-label={title}
      inert={minimized}
      layout={floating}
      drag={draggable}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={bounds}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onPointerDown={() => wm.focus(id)}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: minimized ? 0 : 1, scale: minimized ? 0.9 : 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      style={{ x: dx, y: dy, zIndex: wm.z(id), "--x": x, "--y": y, "--w": width } as unknown as CSSProperties}
      className={cn(
        "relative flex origin-bottom flex-col overflow-hidden border border-border bg-card shadow-hard-sm",
        minimized && "pointer-events-none max-lg:hidden",
        dragging && "shadow-hard-xl",
        floating &&
          (maximized
            ? "absolute! top-11 left-4 h-[calc(100%-6.5rem)] w-[calc(100%-2rem)]"
            : "absolute! top-(--y) left-(--x) w-(--w)")
      )}
    >
      <div
        onPointerDown={(e) => draggable && controls.start(e)}
        onDoubleClick={() => floating && wm.toggleMax(id)}
        className={cn(
          "flex h-7.5 shrink-0 items-center justify-between gap-2.5 bg-ink px-2.5 font-mono text-[13px] leading-none font-medium text-paper select-none",
          draggable && "cursor-grab touch-none active:cursor-grabbing"
        )}
      >
        <span className="truncate">{title}</span>
        <span className="flex items-center gap-2">
          {meta}
          {floating && (
            <>
              <WindowControl label={`Minimise ${title}`} icon={MinusSignIcon} onClick={() => wm.minimize(id)} />
              <WindowControl
                label={maximized ? `Restore ${title}` : `Maximise ${title}`}
                icon={SquareIcon}
                onClick={() => wm.toggleMax(id)}
              />
            </>
          )}
          {onClose && <WindowControl label={`Close ${title}`} icon={Cancel01Icon} onClick={onClose} />}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </motion.section>
  )
}
