import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { MotionProvider } from "@/components/motion/motion-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

const description =
  "Unified Machines builds AI products for companies, designed to stay useful for years. Morse, for meetings, and Friday, for screen recordings, are the first."

// the deployed address; set NEXT_PUBLIC_SITE_URL wherever the site is hosted
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://unified-machines-web.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Unified Machines | AI products built to last",
  description,
  icons: { icon: "/favicon.svg" },
  alternates: { canonical: "/" },
  // the share image is app/opengraph-image.tsx, used for Open Graph and Twitter alike
  openGraph: {
    type: "website",
    siteName: "Unified Machines",
    title: "AI products built to last",
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: "AI products built to last", description },
}

export const viewport: Viewport = {
  themeColor: "#f1f0ee"
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
