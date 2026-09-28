import { Consolidate } from "@/components/sections/consolidate"
import { Control } from "@/components/sections/control"
import { Equation } from "@/components/sections/equation"
import { Faq } from "@/components/sections/faq"
import { Hero } from "@/components/sections/hero/hero"
import { Partner } from "@/components/sections/partner"
import { Principles } from "@/components/sections/principles"
import { Problems } from "@/components/sections/problems"
import { Process } from "@/components/sections/process"
import { Products } from "@/components/sections/products"
import { SiteFooter } from "@/components/sections/site-footer"
import { SiteHeader } from "@/components/sections/site-header"
import { Thinking } from "@/components/sections/thinking"

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="fixed -top-20 left-3 z-50 border border-ink bg-chalk p-3 transition-[top] focus:top-3"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Thinking />
        <Equation />
        <Principles />
        <Process />
        <Problems />
        <Consolidate />
        <Control />
        <Products />
        <Partner />
        <Faq />
      </main>
      <SiteFooter />
    </>
  )
}
