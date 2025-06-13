import { MyNavbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import type React from "react"

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <div className="flex flex-col min-h-screen w-full">
                <div className="mt-10 fixed top-0 left-0 right-0 z-50">
                    <MyNavbar />
                </div>
                <div className="mt-32">
                    {children}
                </div>
                <Footer />
            </div>
        </div>
    )
} 