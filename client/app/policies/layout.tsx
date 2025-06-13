import { MyNavbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import type React from "react"

export default function PoliciesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <div className="flex flex-col min-h-screen w-full">
                <div className='mt-10'>
                    <MyNavbar />
                </div>
                {children}
                <Footer />
            </div>
        </div>
    )
} 