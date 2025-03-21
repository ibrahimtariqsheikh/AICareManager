"use client"

// Update hero section colors to purple/magenta
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fadeIn } from "../../lib/utils"
import { Input } from "../../components/ui/input"
import Image from "next/image"
import { Section } from "./section"
import { CTAButton } from "./cta-button"

interface HeroSectionProps {
    title: string
    subtitle: string
    image: string
    isAuthenticated?: boolean
    onDashboardClick?: () => void
}

export function HeroSection({ title, subtitle, image, isAuthenticated = false, onDashboardClick }: HeroSectionProps) {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Split the title to highlight only the last two words
    const words = title.split(" ")
    const regularWords = words.slice(0, -2).join(" ")
    const highlightedWords = words.slice(-2).join(" ")

    return (
        <Section className="pt-20 pb-16 md:pt-32 md:pb-24 relative z-10">
            <motion.div className="max-w-4xl mx-auto text-center space-y-8" variants={fadeIn}>
                <motion.div
                    className={`inline-block px-4 py-1 rounded-full ${theme === "dark" ? "bg-purple-500/10" : "bg-purple-100"} backdrop-blur-sm text-purple-500 text-sm font-medium mb-4`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Next generation homecare management
                </motion.div>

                <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2" variants={fadeIn}>
                    <span className={theme === "dark" ? "text-white" : "text-black"}>{regularWords}</span>{" "}
                    <span className="purple-gradient-text">{highlightedWords}</span>
                </motion.h1>

                <motion.p className="text-md md:text-lg text-muted-foreground max-w-2xl mx-auto" variants={fadeIn}>
                    {subtitle}
                </motion.p>

                {isAuthenticated ? (
                    <motion.div className="flex flex-col items-center gap-4" variants={fadeIn}>
                        <CTAButton onClick={onDashboardClick}>Go to Dashboard</CTAButton>
                    </motion.div>
                ) : (
                    <motion.div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto" variants={fadeIn}>
                        <div className="flex-1">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className={`h-12 backdrop-blur-sm ${theme === "dark" ? "bg-white/10 dark:bg-black/20" : "bg-gray-50"} border-purple-500/20 focus:border-purple-500/50 transition-all`}
                            />
                        </div>
                        <CTAButton>Book a Demo</CTAButton>
                    </motion.div>
                )}
            </motion.div>

            {/* Floating dashboard preview */}
            <motion.div
                className="mt-16 max-w-5xl mx-auto relative"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
            >
                <div
                    className={`relative ${theme === "dark" ? "shadow-2xl shadow-purple-500/10" : "shadow-lg shadow-purple-500/5"} rounded-xl overflow-hidden border ${theme === "dark" ? "border-white/10" : "border-gray-100"} backdrop-blur-sm`}
                >
                    <Image
                        src={image || "/placeholder.svg"}
                        alt="Dashboard Preview"
                        width={1200}
                        height={600}
                        className="w-full h-auto"
                    />
                </div>
            </motion.div>
        </Section>
    )
}

