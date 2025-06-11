import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { Toaster } from "../components/ui/sonner"
import { MessageProvider } from './context/MessageContext'
import { cn } from "@/lib/utils"
import { NavigationWrapper } from "../components/NavigationWrapper"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "AIM Assist - AI-Powered Care Management",
  description: "All-in-one AI platform for care, HR, compliance, scheduling, finance, and growth.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(inter.variable)} suppressHydrationWarning >
      <body className={cn("min-h-screen bg-background antialiased font-sans", inter.variable)} suppressHydrationWarning>
        <MessageProvider>
          <Providers>
            <NavigationWrapper>
              {children}
            </NavigationWrapper>
          </Providers>
        </MessageProvider>
        <Toaster />
      </body>
    </html>
  )
}

