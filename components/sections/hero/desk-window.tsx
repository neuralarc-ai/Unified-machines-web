"use client"

import type { CSSProperties, ReactNode, RefObject } from "react"
import { motion, useDragControls } from "framer-motion"
import { WindowTitlebar } from "@/components/site/window-frame"
import { cn } from "@/lib/utils"

type DeskWindowProps = {
  title?: ReactNode
  /** Resting position on the desktop (md and up), as CSS lengths. */
  x: string
  y: string
  /** Pop-in order after boot. */
  index: number
  booted: boolean
  z?: number
  draggable: boolean
  bounds: RefObject<HTMLDivElement | null>
  onRaise: () => void
  className?: string
  bodyClassName?: string
  children: ReactNode
}

/** A retro window that pops in after boot and drags by its title bar. */
export function DeskWindow({
  title,
  x,
  y,
  index,
  booted,
  z = 3,
  draggable,
  bounds,
  onRaise,
  className,
  bodyClassName,
  children,
}: DeskWindowProps) {
  const controls = useDragControls()

  return (
    <motion.div
      drag={draggable}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.08}
      dragConstraints={bounds}
      onPointerDown={onRaise}
      initial={{ opacity: 0, y: 12, scale: 0.94 }}
      animate={booted ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 24, delay: index * 0.09 }}
      whileDrag={{ boxShadow: "8px 8px 0 #101010", scale: 1.01 }}
      style={{ "--x": x, "--y": y, zIndex: z } as CSSProperties}
      className={cn(
        "relative min-w-0 border-[1.5px] border-ink bg-paper text-left text-ink shadow-hard-sm select-none md:absolute md:top-(--y) md:left-(--x) md:min-w-[150px] md:shadow-hard",
        className
      )}
    >
      {title && (
        <WindowTitlebar
          onPointerDown={(e) => draggable && controls.start(e)}
          className={cn(draggable && "cursor-grab touch-none active:cursor-grabbing")}
        >
          {title}
        </WindowTitlebar>
      )}
      <div className={cn("flex flex-col gap-2 p-2.5 md:px-3.5 md:py-3", bodyClassName)}>{children}</div>
    </motion.div>
  )
}
