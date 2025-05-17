import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { Toaster } from "../components/ui/sonner"
import { MessageProvider } from './context/MessageContext'


const font = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Care Manager",
  description: "AI Care Manager",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`} suppressHydrationWarning>
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

