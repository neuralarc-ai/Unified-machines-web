import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { HeroA, HeroB, HeroC, HeroD } from "@/components/options/hero-options"
import { Thinking1, Thinking2, Thinking3, Thinking4, ThinkingNow } from "@/components/options/thinking-options"
import { SiteHeader } from "@/components/sections/site-header"

// Review-only route: layout options side by side before one goes on the page.
export const metadata: Metadata = { title: "Options | Unified Machines", robots: { index: false } }

const OPTIONS = {
  hero: { a: HeroA, b: HeroB, c: HeroC, d: HeroD },
  thinking: { now: ThinkingNow, "1": Thinking1, "2": Thinking2, "3": Thinking3, "4": Thinking4 },
} as const

export default async function Options({ searchParams }: PageProps<"/options">) {
  const { s = "hero", v = "a" } = (await searchParams) as { s?: string; v?: string }
  const Section = (OPTIONS as Record<string, Record<string, () => React.JSX.Element>>)[s]?.[v]
  if (!Section) notFound()
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Section />
        <div className="h-[60vh]" />
      </main>
    </>
  )
}
