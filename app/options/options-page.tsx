"use client"

import { NavChapters, NavSegmented, NavSignals, NavTaskbar } from "@/components/site/nav-centers"
import { SiteHeader } from "@/components/sections/site-header"
import { Consolidate } from "@/components/sections/consolidate"
import { Equation } from "@/components/sections/equation"
import { Friday } from "@/components/sections/friday"
import { Hero } from "@/components/sections/hero/hero"
import { Partner } from "@/components/sections/partner"
import { Principles } from "@/components/sections/principles"
import { Thinking } from "@/components/sections/thinking"

const CENTERS = { a: NavSegmented, b: NavTaskbar, c: NavChapters, d: NavSignals } as const

export default function OptionsPage({ v }: { v: string }) {
  const Center = CENTERS[v as keyof typeof CENTERS]
  return (
    <>
      <SiteHeader center={(active) => <Center active={active} />} />
      <main id="main">
        <Hero />
        <Thinking />
        <Equation />
        <Principles />
        <Consolidate />
        <Friday />
        <Partner />
      </main>
    </>
  )
}
