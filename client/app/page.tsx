"use client"

import { MyNavbar } from "@/components/Navbar"
import { useEffect, useState } from "react"

export default function Home() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-white">
            <MyNavbar />
        </div>
    )
}
