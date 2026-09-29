import type { Metadata } from "next"
import { notFound } from "next/navigation"
import OptionsPage from "./options-page"

// Review-only route: the live page with a candidate centre nav in the header.
export const metadata: Metadata = { title: "Options | Unified Machines", robots: { index: false } }

const NAVS = ["a", "b", "c", "d"]

export default async function Options({ searchParams }: PageProps<"/options">) {
  const { v = "a" } = (await searchParams) as { v?: string }
  if (!NAVS.includes(v)) notFound()
  return <OptionsPage v={v} />
}

