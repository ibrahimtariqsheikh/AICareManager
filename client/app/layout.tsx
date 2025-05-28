import type React from "react"
import type { Metadata } from "next"
import { Inter, Dancing_Script } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { Toaster } from "../components/ui/sonner"
import { MessageProvider } from './context/MessageContext'
import { cn } from "@/lib/utils"


const font = Inter({ subsets: ["latin"] })
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
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
    <html lang="en" suppressHydrationWarning className={cn(dancingScript.variable)}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", dancingScript.variable)} suppressHydrationWarning>
        <MessageProvider>
          <Providers>
            <div className="dark:noise-bg w-full font-sans">{children}</div>
          </Providers>
        </MessageProvider>
        <Toaster />
      </body>
    </html>
  )
}

