import type { ReactNode } from "react"
import { Reveal } from "@/components/motion/reveal"
import { cn } from "@/lib/utils"

export function MonoLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("block font-mono text-xs leading-normal", className)}>{children}</span>
}

export const displaySm = "text-[clamp(30px,3.6vw,48px)] leading-[1.06] tracking-[-0.035em] text-balance"
export const display = "mx-auto max-w-[1100px] text-center text-[clamp(40px,6.2vw,88px)] text-balance"
export const bodyLg = "text-[clamp(17px,1.4vw,20px)] leading-[1.4] tracking-[-0.01em]"

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
    <Reveal className={cn("mb-14 grid items-start gap-3 lg:grid-cols-[200px_1fr] lg:gap-8", className)}>
      <MonoLabel>{label}</MonoLabel>
      <h2 id={id} className={displaySm}>
        {children}
      </h2>
    </Reveal>
  )
}
