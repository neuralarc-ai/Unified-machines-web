import type { ReactNode } from "react"
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { bodyLg } from "@/components/site/section-head"
import { cn } from "@/lib/utils"

const tones = {
  ink: {
    item: "border-ink not-data-open:border-[#8a8985]",
    icon: "aria-expanded:**:data-[slot=accordion-trigger-icon]:bg-ink aria-expanded:**:data-[slot=accordion-trigger-icon]:text-lime",
  },
  paper: {
    item: "border-paper not-data-open:border-[#6b6b68]",
    icon: "aria-expanded:**:data-[slot=accordion-trigger-icon]:border-lime aria-expanded:**:data-[slot=accordion-trigger-icon]:bg-lime aria-expanded:**:data-[slot=accordion-trigger-icon]:text-ink",
  },
}

/** Accordion row with a left rule that turns dashed when closed, as in the reference. */
export function PanelAccordionItem({
  value,
  title,
  children,
  tone = "ink",
}: {
  value: string
  title: string
  children: ReactNode
  tone?: keyof typeof tones
}) {
  return (
    <AccordionItem
      value={value}
      className={cn("mb-5.5 border-l pl-4 transition-colors not-last:border-b-0 not-data-open:border-dashed", tones[tone].item)}
    >
      <AccordionTrigger
        className={cn(
          "items-center gap-4 rounded-none py-1.5 font-mono text-xs font-normal hover:no-underline focus-visible:ring-0",
          "**:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:border **:data-[slot=accordion-trigger-icon]:border-current **:data-[slot=accordion-trigger-icon]:p-0.5 **:data-[slot=accordion-trigger-icon]:text-current **:data-[slot=accordion-trigger-icon]:transition-colors",
          tones[tone].icon
        )}
      >
        {title}
      </AccordionTrigger>
      <AccordionContent>
        <p className={cn(bodyLg, "mt-3.5 mb-2 max-w-140")}>{children}</p>
      </AccordionContent>
    </AccordionItem>
  )
}
