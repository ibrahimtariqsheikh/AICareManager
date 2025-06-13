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
  title: "AIM Manager",
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
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen antialiased bg-background font-sans",
        inter.variable
      )} suppressHydrationWarning>
        <MessageProvider>
          <Providers>
            {children}
          </Providers>
        </MessageProvider>
        <Toaster />
      </body>
    </html>
  )
}

