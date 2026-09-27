import type { ReactNode } from "react"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("block font-mono text-base leading-snug tracking-[-0.01em]", className)}>{children}</span>
}

export const displaySm = "text-[clamp(34px,4.05vw,54px)] leading-[1.06] tracking-[-0.035em] text-balance"
export const display = "mx-auto max-w-[1100px] text-center text-[clamp(45px,6.98vw,99px)] text-balance"
export const bodyLg = "text-[clamp(19px,1.57vw,22.5px)] leading-[1.4] tracking-[-0.01em]"

export function SectionHead({
  id,
  label,
  children,
  className,
}: {
  id: string
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <Reveal className={cn("mb-14 grid items-start gap-3 lg:grid-cols-[260px_1fr] lg:gap-8", className)}>
      <MonoLabel>{label}</MonoLabel>
      <h2 id={id} className={displaySm}>
        {children}
      </h2>
    </Reveal>
  )
}
