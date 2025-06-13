import { MyNavbar } from "@/components/Navbar"
import { cn } from "@/lib/utils"
import type React from "react"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(
                "min-h-screen antialiased bg-background font-sans",

            )} suppressHydrationWarning>
                <div className="flex flex-col min-h-screen w-full">
                    <div className="flex flex-col min-h-screen w-full">
                        <div className='mt-10'>
                            <MyNavbar />
                        </div>
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}

