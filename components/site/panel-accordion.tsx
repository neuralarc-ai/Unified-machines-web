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

/**
 * Accordion row with a left rule that turns dashed when closed, as in the
 * reference. With `number`, the title is set large (a headline) beside a mono
 * number; without, the whole trigger is a mono line (FAQ questions).
 * `indicator` renders over the left rule, e.g. an auto-advance progress bar.
 */
export function PanelAccordionItem({
  value,
  title,
  number,
  indicator,
  children,
  tone = "ink",
}: {
  value: string
  title: string
  number?: string
  indicator?: ReactNode
  children: ReactNode
  tone?: keyof typeof tones
}) {
  return (
    <AccordionItem
      value={value}
      className={cn(
        "relative mb-5.5 border-l pl-4 transition-colors not-last:border-b-0 not-data-open:border-dashed",
        tones[tone].item
      )}
    >
      {indicator}
      <AccordionTrigger
        className={cn(
          "items-center gap-4 rounded-none py-1.5 font-mono text-xs font-normal hover:no-underline focus-visible:ring-0",
          "**:data-[slot=accordion-trigger-icon]:size-5 **:data-[slot=accordion-trigger-icon]:border **:data-[slot=accordion-trigger-icon]:border-current **:data-[slot=accordion-trigger-icon]:p-0.5 **:data-[slot=accordion-trigger-icon]:text-current **:data-[slot=accordion-trigger-icon]:transition-colors",
          tones[tone].icon
        )}
      >
        {number ? (
          <span className="flex items-baseline gap-4">
            <span className="font-mono text-xs">{number}</span>
            {/* closed titles recede; the open one reads at full ink */}
            <span className="font-sans text-[clamp(22.5px,2.02vw,29px)] leading-tight font-medium tracking-[-0.03em] text-ink/55 transition-colors group-hover/accordion-trigger:text-ink group-aria-expanded/accordion-trigger:text-ink">
              {title}
            </span>
          </span>
        ) : (
          <span className="text-base md:text-lg">{title}</span>
        )}
      </AccordionTrigger>
      <AccordionContent>
        <p className={cn(bodyLg, "mt-3.5 mb-2 max-w-140")}>{children}</p>
      </AccordionContent>
    </AccordionItem>
  )
}
