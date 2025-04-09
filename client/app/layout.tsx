import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Providers from "./providers"
import { Toaster } from "../components/ui/sonner"
import { useGetUserQuery } from "../state/api"

const font = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Care Manager",
  description: "AI Care Manager",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="dark:noise-bg w-full font-sans">{children}</div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

