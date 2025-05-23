"use client"

import { useAuthenticator } from "@aws-amplify/ui-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Navbar from "../components/Navbar"
import { HeroSection } from "../components/homepage/hero-section"

import { Spotlight } from "../components/ui/spotlight-new"

export default function Home() {
    const router = useRouter()
    const { user } = useAuthenticator((context) => [context.user])
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (user) {
            console.log("user", user)
        }
    }, [user, router])

    if (!mounted) return null

    return (
        <div className="min-h-screen w-full overflow-visible ">
            {/* Navbar */}
            <Navbar />
            {/* Main content */}
            <div className="relative ">
                {theme === "dark" && <Spotlight />}
                <HeroSection
                    title="Transform Your Healthcare with Our AI-Powered Platform"
                    subtitle="Streamline your care operations with our all-in-one platform featuring customizable forms, secure communication, medication management, and comprehensive reporting."
                    image={theme === "dark" ? "/assets/dashboard-preview.png" : "/assets/dashboard-preview-light.png"}

                />
            </div>
        </div>
    )
}
