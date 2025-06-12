"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "../../lib/utils"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Activity, Heart, Shield, Stethoscope } from "lucide-react"

const pacifico = Pacifico({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-pacifico",
})

export function AnimatedBadge({ text = "Next generation homecare management" }) {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${isDark ? "bg-white/[0.05] border-blue-500/20" : "bg-blue-50 border-blue-200"
                } border mb-8`}
        >
            <div className="w-5 h-5 rounded-full bg-blue-500/80 flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
            </div>
            <span className={`text-sm tracking-wide ${isDark ? "text-white/70" : "text-blue-700"
                }`}>{text}</span>
        </motion.div>
    )
}



function PulseWave({ className }: { className?: string }) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const strokeColor = isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.15)"
    const strokeColor2 = isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.25)"
    const strokeColor3 = isDark ? "rgba(59, 130, 246, 0.4)" : "rgba(59, 130, 246, 0.35)"

    return (
        <motion.div
            className={cn("absolute", className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
        >
            <svg width="100%" height="100%" viewBox="0 0 1200 200" preserveAspectRatio="none">
                <motion.path
                    d="M0,100 C150,0 350,200 500,100 C650,0 850,200 1000,100 C1150,0 1350,200 1500,100"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: 1,
                        opacity: 1,
                        pathOffset: [0, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                    }}
                />
                <motion.path
                    d="M0,100 C150,0 350,200 500,100 C650,0 850,200 1000,100 C1150,0 1350,200 1500,100"
                    fill="none"
                    stroke={strokeColor2}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: 1,
                        opacity: 1,
                        pathOffset: [0.2, 1.2],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        delay: 1,
                    }}
                />
                <motion.path
                    d="M0,100 C150,0 350,200 500,100 C650,0 850,200 1000,100 C1150,0 1350,200 1500,100"
                    fill="none"
                    stroke={strokeColor3}
                    strokeWidth="2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{
                        pathLength: 1,
                        opacity: 1,
                        pathOffset: [0.4, 1.4],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        delay: 2,
                    }}
                />
            </svg>
        </motion.div>
    )
}

function FloatingIcon({
    icon,
    delay = 0,
    x = 0,
    y = 0,
    size = 40,
    color = "text-blue-500",
}: {
    icon: React.ReactNode
    delay?: number
    x?: number
    y?: number
    size?: number
    color?: string
}) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const iconColor = isDark ? color : color.replace("500", "400").replace("400", "300")

    return (
        <motion.div
            className={cn("absolute z-10", iconColor)}
            initial={{ opacity: 0, x, y }}
            animate={{
                opacity: [0, 1, 0.8],
                x: [x, x + 20, x - 20, x],
                y: [y, y - 30, y - 60, y - 100],
            }}
            transition={{
                duration: 10,
                delay,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
            }}
            style={{ width: size, height: size }}
        >
            {icon}
        </motion.div>
    )
}

function DNAStrand({ className }: { className?: string }) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const strokeColor = isDark ? "rgba(59, 130, 246, 0.5)" : "rgba(59, 130, 246, 0.3)"
    const fillColor1 = isDark ? "rgba(59, 130, 246, 0.8)" : "rgba(59, 130, 246, 0.5)"
    const fillColor2 = isDark ? "rgba(14, 165, 233, 0.8)" : "rgba(14, 165, 233, 0.5)"

    return (
        <motion.div
            className={cn("absolute opacity-30", className)}
            initial={{ opacity: 0, rotateZ: 0 }}
            animate={{ opacity: isDark ? 0.3 : 0.2, rotateZ: 360 }}
            transition={{ duration: 120, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
            <svg width="600" height="600" viewBox="0 0 600 600">
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <g key={i}>
                            <motion.line
                                x1="200"
                                y1={60 + i * 50}
                                x2="400"
                                y2={60 + i * 50}
                                stroke={strokeColor}
                                strokeWidth="4"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{
                                    duration: 2,
                                    delay: i * 0.2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    repeatDelay: 5,
                                }}
                            />
                            <motion.circle
                                cx="200"
                                cy={60 + i * 50}
                                r="8"
                                fill={fillColor1}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    duration: 1,
                                    delay: i * 0.2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    repeatDelay: 5,
                                }}
                            />
                            <motion.circle
                                cx="400"
                                cy={60 + i * 50}
                                r="8"
                                fill={fillColor2}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    duration: 1,
                                    delay: i * 0.2 + 0.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatType: "reverse",
                                    repeatDelay: 5,
                                }}
                            />
                        </g>
                    ))}
                </motion.g>
            </svg>
        </motion.div>
    )
}

function NetworkNodes({ className }: { className?: string }) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const strokeColor = isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"
    const fillColor = isDark ? "rgba(59, 130, 246, 0.5)" : "rgba(59, 130, 246, 0.3)"

    // Generate random positions for nodes
    const nodes = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
    }))

    // Generate connections between nodes
    const connections = []
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (Math.random() > 0.7) {
                connections.push({
                    id: `${i}-${j}`,
                    source: i,
                    target: j,
                })
            }
        }
    }

    return (
        <motion.div
            className={cn("absolute", className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: isDark ? 0.6 : 0.4 }}
            transition={{ duration: 2 }}
        >
            <svg width="100%" height="100%" viewBox="0 0 100 100">
                {/* Connections */}
                {connections.map((connection) => {
                    const source = nodes[connection.source]
                    const target = nodes[connection.target]
                    return (
                        <motion.line
                            key={connection.id}
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            stroke={strokeColor}
                            strokeWidth="0.3"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, delay: Math.random() * 2 }}
                        />
                    )
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                    <motion.circle
                        key={node.id}
                        cx={node.x}
                        cy={node.y}
                        r={node.size / 10}
                        fill={fillColor}
                        initial={{ scale: 0 }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                            duration: 4,
                            delay: Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "reverse",
                        }}
                    />
                ))}
            </svg>
        </motion.div>
    )
}

export default function HeroHealthcare({
    title = "Transform Your Healthcare with AI",
    subtitle = "Streamline your care operations with our all-in-one platform featuring customizable forms, secure communication, medication management, and comprehensive reporting.",
    image = "/placeholder.svg?height=600&width=1200",
    isAuthenticated = false,
    onDashboardClick,
}: {
    title?: string
    subtitle?: string
    image?: string
    isAuthenticated?: boolean
    onDashboardClick?: () => void
}) {
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Split the title to highlight only the last two words
    const words = title.split(" ")
    const regularWords = words.slice(0, -2).join(" ")
    const highlightedWords = words.slice(-2).join(" ")

    const fadeUpVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    }

    const isDark = theme === "dark"

    return (
        <div
            className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden ${isDark ? "bg-[#030303]" : "bg-gradient-to-b from-blue-50/30 to-white"}`}
        >
            {/* Background elements */}
            <div
                className={`absolute inset-0 ${isDark ? "bg-gradient-to-br from-blue-900/[0.03] via-transparent to-cyan-900/[0.03]" : "bg-gradient-to-br from-blue-100/10 via-transparent to-cyan-100/10"}`}
            />

            {/* Animated background elements */}
            <PulseWave className="bottom-[20%] left-0 w-full h-32" />
            <PulseWave className="bottom-[30%] left-0 w-full h-32" />
            <DNAStrand className="top-[5%] right-[5%] w-[600px] h-[600px]" />
            <NetworkNodes className="inset-0 w-full h-full" />

            {/* Floating healthcare icons */}
            <FloatingIcon
                icon={<Heart className="w-full h-full" />}
                delay={0}
                x={100}
                y={200}
                size={30}
                color="text-blue-400/40"
            />
            <FloatingIcon
                icon={<Activity className="w-full h-full" />}
                delay={2}
                x={-150}
                y={300}
                size={40}
                color="text-blue-500/40"
            />
            <FloatingIcon
                icon={<Stethoscope className="w-full h-full" />}
                delay={4}
                x={200}
                y={400}
                size={35}
                color="text-sky-500/40"
            />
            <FloatingIcon
                icon={<Shield className="w-full h-full" />}
                delay={6}
                x={-100}
                y={150}
                size={25}
                color="text-cyan-500/40"
            />

            <div className="relative z-10 container mx-auto px-4 md:px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-center"
                    >
                        <AnimatedBadge text="Next generation homecare management" />
                    </motion.div>

                    <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 md:mb-8 tracking-tight">
                            <span className={isDark ? "text-white" : "text-black"}>{regularWords} </span>
                            <span
                                className={cn(
                                    "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400",
                                    pacifico.className,
                                )}
                            >
                                {highlightedWords}
                            </span>
                        </h1>
                    </motion.div>

                    <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
                        <p
                            className={`text-base sm:text-lg md:text-xl ${isDark ? "text-white/40" : "text-gray-600"} mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4`}
                        >
                            {subtitle}
                        </p>
                    </motion.div>

                    <motion.div
                        custom={3}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
                    >
                        {isAuthenticated ? (
                            <Button onClick={onDashboardClick} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Go to Dashboard
                            </Button>
                        ) : (
                            <>
                                <div className="flex-1">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className={`h-10 backdrop-blur-sm ${isDark
                                            ? "bg-white/10 text-white placeholder:text-white/50"
                                            : "bg-white text-black"
                                            } border-blue-500/20 focus:border-blue-500/50 focus:ring-blue-500/30 transition-all`}
                                    />
                                </div>
                                <Button onClick={() => router.push("/dashboard")} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Book a Demo
                                </Button>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Floating dashboard preview with heartbeat animation */}
                <motion.div
                    className="mt-16 max-w-5xl mx-auto relative"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 0 0 rgba(59, 130, 246, 0)",
                                "0 0 0 10px rgba(59, 130, 246, 0.1)",
                                "0 0 0 0 rgba(59, 130, 246, 0)",
                            ],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: "loop",
                            ease: "easeInOut",
                        }}
                        className={`relative ${isDark ? "shadow-2xl shadow-blue-500/10" : "shadow-lg shadow-blue-500/5"} rounded-xl overflow-hidden border ${isDark ? "border-white/10" : "border-gray-100"} backdrop-blur-sm`}
                    >
                        <Image
                            src={image || "/placeholder.svg"}
                            alt="Healthcare Dashboard Preview"
                            width={1200}
                            height={600}
                            className="w-full h-auto rounded-xl"
                            loading="lazy"
                        />
                        <div
                            className={`absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${isDark ? "from-[#030303]" : "from-white"} to-transparent`}
                        ></div>
                    </motion.div>
                </motion.div>
            </div>

            <div
                className={`absolute inset-0 bg-gradient-to-t ${isDark ? "from-[#030303] via-transparent to-[#030303]/80" : "from-white/80 via-transparent to-white/80"} pointer-events-none`}
            />
        </div>
    )
}
