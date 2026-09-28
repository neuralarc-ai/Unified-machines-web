import Link from "next/link"
import { Desk } from "@/components/desk/desk"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { Button } from "@/components/ui/button"

/**
 * Centred hero (option B, chosen 2026-09-28): headline, a two-line sub-copy
 * and both actions on one axis over the ruled grid from um-landing. Stepped
 * colour blocks rise at either edge and run on down behind the desk, which
 * sits over them.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="grid-ground relative overflow-hidden">
      <div className="relative pt-16 pb-16 md:pt-24 md:pb-20">
        {/* anchored low: the blocks start beside the copy and end 300px into the desk */}
        <div aria-hidden className="absolute inset-x-0 top-[38%] -bottom-75 max-md:hidden">
          <PixelSteps
            corner="bl"
            className="h-full w-[18%]"
            steps={[
              [100, 52],
              [56, 100],
            ]}
            from="#caeb6b"
            to="#99ebfa"
          />
          <PixelSteps
            corner="br"
            className="h-full w-[22%]"
            steps={[
              [100, 40],
              [72, 72],
              [40, 100],
            ]}
            from="#f5c36b"
            to="#ff6fb0"
          />
        </div>

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

      <Reveal className="container-page relative z-[1]" delay={0.3}>
        <Desk />
      </Reveal>
    </section>
  )
}
