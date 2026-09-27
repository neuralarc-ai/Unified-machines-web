import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { Frame, Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Desktop } from "./desktop"

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="pt-10">
      <Frame className="container-page pt-8 pb-6 md:pt-14 md:pb-10">
        <Stagger gap={0.12}>
          <StaggerItem className="mb-6.5 flex items-center gap-3 font-mono text-xs">
            <Badge variant="tag">UM.OS 1.0</Badge>
            <span>Unified Machines</span>
          </StaggerItem>
          <h1 id="hero-title" className="max-w-[1100px] text-[clamp(44px,6.4vw,92px)]">
            <StaggerItem as="span" className="block">
              AI products built to last.
            </StaggerItem>
            <StaggerItem as="span" className="block">
              Intelligence at the core.
            </StaggerItem>
          </h1>
          <StaggerItem
            as="p"
            className="mt-6.5 max-w-160 text-[clamp(17px,1.5vw,20px)] leading-normal text-ink-soft"
          >
            Unified Machines builds innovative AI products for companies, designed to stay useful for years rather
            than quarters. Morse, for meetings and everything around them, is the first. More are coming across the
            domains businesses run on.
          </StaggerItem>
          <StaggerItem className="mt-7.5 flex flex-wrap gap-2.5">
            <Button size="cta" variant="accent" nativeButton={false} render={<Link href="#products" />}>
              See our products <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={1.5} />
            </Button>
            <Button size="cta" variant="outline" nativeButton={false} render={<Link href="#thinking" />}>
              How we think
            </Button>
          </StaggerItem>
        </Stagger>
      </Frame>

      <Reveal className="container-page" delay={0.3}>
        <Desktop />
      </Reveal>
    </section>
  )
}
