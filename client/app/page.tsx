"use client"

import { useEffect, useState } from "react"
import { MyNavbar } from "../components/Navbar"

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
