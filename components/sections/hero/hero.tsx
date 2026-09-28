import Link from "next/link"
import { Desk } from "@/components/desk/desk"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Centred hero (option B, chosen 2026-09-28): headline, a two-line sub-copy
 * and both actions on one axis, the desk given room below. `ground` lays the
 * ruled grid and stepped colour blocks from um-landing behind it (on review).
 */
export function Hero({ ground = false }: { ground?: boolean }) {
  return (
    <section aria-labelledby="hero-title" className={cn("relative", ground && "grid-ground overflow-hidden")}>
      <div className="relative pt-16 pb-16 md:pt-24 md:pb-20">
        {ground && (
          <>
            <PixelSteps
              corner="bl"
              className="h-[62%] w-[18%] max-md:hidden"
              steps={[
                [100, 46],
                [56, 100],
              ]}
              from="#caeb6b"
              to="#99ebfa"
            />
            <PixelSteps
              corner="br"
              className="h-[74%] w-[22%] max-md:hidden"
              steps={[
                [100, 34],
                [72, 68],
                [40, 100],
              ]}
              from="#f5c36b"
              to="#ff6fb0"
            />
          </>
        )}
        <Stagger gap={0.12} className="container-page relative flex flex-col items-center text-center">
          <h1 id="hero-title" className="text-[clamp(46px,6.6vw,92px)] text-balance">
            <StaggerItem as="span" className="block">
              AI products built to last.
            </StaggerItem>
            <StaggerItem as="span" className="block">
              Intelligence at the core.
            </StaggerItem>
          </h1>
          <StaggerItem as="p" className="mt-6 max-w-[48ch] text-[clamp(18px,1.45vw,20px)] leading-[1.5] text-ink-soft">
            AI products for companies, designed to stay useful for years, not quarters. Morse, for meetings, is the
            first.
          </StaggerItem>
          <StaggerItem className="mt-8 flex flex-wrap justify-center gap-2.5">
            <SplitButton href="#products">See our products</SplitButton>
            <Button size="cta" variant="outline" nativeButton={false} render={<Link href="#thinking" />}>
              How we think
            </Button>
          </StaggerItem>
        </Stagger>
      </div>

      <Reveal className="container-page relative" delay={0.3}>
        <Desk />
      </Reveal>
    </section>
  )
}
