"use client"

// Update hero section colors to blue
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { fadeIn } from "../../lib/utils"
import Image from "next/image"
import { Section } from "./section"

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


    return (
        <Section className="pt-20 pb-16 md:pt-32 md:pb-24 relative z-10">
            <motion.div className=" mx-auto text-center space-y-8" variants={fadeIn}>

                <div className="flex justify-center">
                    <div className="text-sm font-medium text-blue-500 bg-blue-500/10 px-4 py-2 rounded-lg">
                        Level Up Your Care Management with AI
                    </div>
                </div>

                <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight px-2" variants={fadeIn}>
                    {title
                        .split(" ")
                        .map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                    ease: "easeInOut",
                                }}
                                className={`mr-2 inline-block ${index >= words.length - 2 ? "text-primary" : theme === "dark" ? "text-white" : "text-black"
                                    }`}
                            >
                                {word}
                            </motion.span>
                        ))}
                </motion.h1>

                <motion.p className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400" variants={fadeIn}>
                    {subtitle}
                </motion.p>

                {/* Floating dashboard preview */}
                <motion.div
                    className="max-w-5xl mx-auto relative"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.3,
                            delay: 1.2,
                        }}
                        className="relative z-10  rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 layer-blur-md">
                            <Image
                                src={image}
                                alt="Landing page preview"
                                className="aspect-[16/9] h-auto w-full object-cover"
                                height={1000}
                                width={1000}
                            />
                        </div>
                    </motion.div>
                </motion.div>




            </motion.div>


        </Section>
    )
}

