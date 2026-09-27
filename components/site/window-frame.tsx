import type { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

/** Black retro title bar with the little close box. */
export function WindowTitlebar({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 bg-ink px-2 py-0.5 font-mono text-xs leading-normal text-paper",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1.5">{children}</span>
      <i aria-hidden className="inline-block size-[9px] border border-paper" />
    </div>
  )
}

/** Static window chrome: ink border, offset shadow, title bar, body. */
export function WindowFrame({
  title,
  className,
  bodyClassName,
  children,
  ...props
}: Omit<ComponentProps<"div">, "title"> & { title: ReactNode; bodyClassName?: string }) {
  return (
    <div className={cn("border-[1.5px] border-ink bg-paper text-ink shadow-hard-lg", className)} {...props}>
      <WindowTitlebar>{title}</WindowTitlebar>
      <div className={cn("flex flex-col gap-2 px-3.5 py-3", bodyClassName)}>{children}</div>
    </div>
  )
}
