import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PrinciplesA, PrinciplesB, PrinciplesC, PrinciplesD } from "@/components/options/principles-options"
import { SiteHeader } from "@/components/sections/site-header"

// Review-only route: layout options side by side before one goes on the page.
export const metadata: Metadata = { title: "Options | Unified Machines", robots: { index: false } }

const OPTIONS: Record<string, Record<string, () => React.JSX.Element>> = {
  principles: { a: PrinciplesA, b: PrinciplesB, c: PrinciplesC, d: PrinciplesD },
}

export default async function Options({ searchParams }: PageProps<"/options">) {
  const { s = "principles", v = "a" } = (await searchParams) as { s?: string; v?: string }
  const Section = OPTIONS[s]?.[v]
  if (!Section) notFound()
  return (
    <>
      <SiteHeader />
      <main id="main" className="pt-16">
        <Section />
        <div className="h-[60vh]" />
      </main>
    </>
  )
}
