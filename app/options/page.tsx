import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Hero } from "@/components/sections/hero/hero"
import { SiteHeader } from "@/components/sections/site-header"

// Review-only route: layout options side by side before one goes on the page.
export const metadata: Metadata = { title: "Options | Unified Machines", robots: { index: false } }

const OPTIONS: Record<string, Record<string, () => React.JSX.Element>> = {
  hero: { b: () => <Hero />, ground: () => <Hero ground /> },
}

export default async function Options({ searchParams }: PageProps<"/options">) {
  const { s = "hero", v = "b" } = (await searchParams) as { s?: string; v?: string }
  const Section = OPTIONS[s]?.[v]
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
