import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { Toaster } from "../components/ui/sonner"
import { MessageProvider } from './context/MessageContext'
import { cn } from "@/lib/utils"

const font = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})


export const metadata: Metadata = {
  title: "AIM",
  description: "AI Manager",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(font.variable)}>
      <body className={cn("min-h-screen bg-transparent font-sans antialiased font-sans", font.variable)} suppressHydrationWarning>
        <MessageProvider>
          <Providers>
            <div className="w-full ">{children}</div>
          </Providers>
        </MessageProvider>
        <Toaster />
      </body>
    </html>
  )
}

