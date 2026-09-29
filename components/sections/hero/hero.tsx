import Link from "next/link"
import { Desk } from "@/components/desk/desk"
import { PixelSteps } from "@/components/brand/pixel-steps"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { SplitButton } from "@/components/site/split-button"
import { Button } from "@/components/ui/button"

/**
 * Centred hero (option B, chosen 2026-09-28): headline, a two-line sub-copy
 * and both actions on one axis over the ruled grid from um-landing. Stepped
 * colour blocks rise at either edge and run down behind the desk; the grid
 * ends on the same line, about halfway down the desk, fading out rather than
 * stopping. The desk floats over both on a soft shadow.
 */

// where the grid and blocks end: this far below the copy, so about the desk's middle
const reach = "-bottom-80"

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="relative pt-16 pb-16 md:pt-24 md:pb-20">
        <div
          aria-hidden
          className={`grid-ground absolute inset-x-0 top-0 ${reach} [mask-image:linear-gradient(to_bottom,#000_70%,transparent)]`}
        />
        {/* mirrored pair, set low so they end with the grid; each steps in toward the desk */}
        <div aria-hidden className={`absolute inset-x-0 h-[74%] max-md:hidden ${reach}`}>
          <PixelSteps
            corner="bl"
            className="h-full w-[22%]"
            steps={[
              [100, 34],
              [72, 68],
              [40, 100],
            ]}
            from="#caeb6b"
            to="#99ebfa"
          />
          <PixelSteps
            corner="br"
            className="h-full w-[22%]"
            steps={[
              [100, 34],
              [72, 68],
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
            <SplitButton href="#consolidate">See our products</SplitButton>
            <Button size="cta" variant="outline" nativeButton={false} render={<Link href="#thinking" />}>
              How we think
            </Button>
          </StaggerItem>
        </Stagger>
      </div>

      {/* bottom padding leaves room for the shadow, which overflow-hidden would otherwise clip */}
      <Reveal className="container-page relative z-[1] pb-16" delay={0.3}>
        <div className="rounded-(--radius) shadow-[0_2px_4px_rgb(16_16_16/0.04),0_12px_24px_-6px_rgb(16_16_16/0.10),0_40px_80px_-24px_rgb(16_16_16/0.22)]">
          <Desk />
        </div>
      </Reveal>
    </section>
  )
}
