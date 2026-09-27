import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { MotionProvider } from "@/components/motion/motion-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Unified Machines | AI products built to last.",
  description:
    "Unified Machines builds innovative AI products for companies, designed to stay useful for years. Morse, for meetings, is the first. More are coming across the domains businesses run on.",
  icons: { icon: "/favicon.svg" },
}

export const viewport: Viewport = {
  themeColor: "#f1f0ee",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("antialiased", geist.variable, geistMono.variable)}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
