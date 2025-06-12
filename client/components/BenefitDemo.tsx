"use client"

import { useState, useRef, useLayoutEffect, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Heart, Star, Smile, Calendar, Clipboard, Pill, FileText, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import Image from "next/image"

import { AdminCostSavings } from "@/components/AdminCostSavings"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {

    XAxis,

    CartesianGrid,
    ResponsiveContainer,

    BarChart,
    Bar,
    Rectangle,
} from "recharts"


interface BenefitDemoProps {
    speed?: number
    benefit: "client" | "staff" | "admin" | "subscription"
}

interface ClientRetentionProps {
    speed?: number
}

// Memoize the emotions object to prevent recreation on each render
const emotions = {
    happy: {
        emoji: "😊",
        color: "text-yellow-500",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200"
    },
    excited: {
        emoji: "🤩",
        color: "text-orange-500",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200"
    },
    relieved: {
        emoji: "😌",
        color: "text-green-500",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
    },
    satisfied: {
        emoji: "🥰",
        color: "text-pink-500",
        bgColor: "bg-pink-50",
        borderColor: "border-pink-200"
    }
} as const

// Memoize the emotion sequence
const emotionSequence = ['happy', 'excited', 'relieved', 'satisfied'] as const

// Memoize the retention data
const retentionData = [
    { month: "Jan", rate: 30, clients: 120, fill: "rgb(219, 234, 254)" },
    { month: "Feb", rate: 35, clients: 125, fill: "rgb(191, 219, 254)" },
    { month: "Mar", rate: 42, clients: 132, fill: "rgb(147, 197, 253)" },
    { month: "Apr", rate: 50, clients: 138, fill: "rgb(96, 165, 250)" },
    { month: "May", rate: 60, clients: 145, fill: "rgb(59, 130, 246)" },
    { month: "Jun", rate: 68, clients: 152, fill: "hsl(var(--primary))" }
] as const

// Memoize the days data
const days = [
    { name: "Monday", emoji: "😔", task: "Manual paperwork" },
    { name: "Tuesday", emoji: "😕", task: "Complex scheduling" },
    { name: "Wednesday", emoji: "🙂", task: "Using our software" },
    { name: "Thursday", emoji: "😊", task: "Streamlined workflow" },
    { name: "Friday", emoji: "🥰", task: "Performance" }
] as const

// Memoize the features data
const features = [
    { name: "AI-Powered Scheduling", icon: <Calendar className="h-3.5 w-3.5" />, bgColor: "bg-red-500", radius: 125, orbit: 4 },
    { name: "Automated Care Planning", icon: <Clipboard className="h-3.5 w-3.5" />, bgColor: "bg-blue-500", radius: 95, orbit: 3 },
    { name: "Medication Management", icon: <Pill className="h-3.5 w-3.5" />, bgColor: "bg-green-500", radius: 60, orbit: 2 },
    { name: "Smart Visit Reporting", icon: <FileText className="h-3.5 w-3.5" />, bgColor: "bg-purple-500", radius: 23, orbit: 1 }
] as const

// Optimize HappyEmployeeAnimation component
const HappyEmployeeAnimation = memo(({ currentStep, speed = 1 }: { currentStep: number, speed: number }) => {
    const emotionIndex = Math.min(currentStep - 1, emotionSequence.length - 1)
    const currentEmotion = emotionSequence[emotionIndex] as keyof typeof emotions
    const showFloatingElements = currentStep > 0
    const currentEmotionData = emotions[currentEmotion]

    // Memoize floating elements
    const floatingElements = useMemo(() => (
        <>
            {[...Array(3)].map((_, i) => (
                <motion.div
                    key={`heart-${i}`}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0.8],
                        x: (i - 1) * 30,
                        y: -40 - (i * 10)
                    }}
                    transition={{
                        duration: 2 / speed,
                        repeat: Infinity,
                        delay: i * 0.5 / speed,
                        ease: "easeOut"
                    }}
                >
                    <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                </motion.div>
            ))}
            {[...Array(2)].map((_, i) => (
                <motion.div
                    key={`star-${i}`}
                    className="absolute"
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 1],
                        x: i === 0 ? -35 : 35,
                        y: -20,
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        duration: 3 / speed,
                        repeat: Infinity,
                        delay: (i * 0.8 + 1) / speed,
                        ease: "easeInOut"
                    }}
                >
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                </motion.div>
            ))}
        </>
    ), [speed])

    return (
        <div className="relative flex items-center justify-center">
            <div
                className={cn(
                    "relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500",
                    currentEmotionData.bgColor,
                    currentEmotionData.borderColor,
                    "border-2"
                )}
            >
                <span>{currentEmotionData.emoji}</span>
            </div>

            <AnimatePresence>
                {showFloatingElements && floatingElements}
            </AnimatePresence>

            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-md border">
                    <Smile className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">98% Happy</span>
                </div>
            </div>
        </div>
    )
})

// Optimize ClientRetentionChart component
const ClientRetentionChart = memo(({ speed = 1 }: ClientRetentionProps) => {
    const [animationStep, setAnimationStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const animationRef = useRef<number>()
    const lastTimeRef = useRef<number>()

    const animate = useCallback((time: number) => {
        if (lastTimeRef.current === undefined) {
            lastTimeRef.current = time
        }

        const delta = time - lastTimeRef.current

        if (delta > 800 / speed) {
            if (!isVisible) {
                setIsVisible(true)
            } else if (animationStep < retentionData.length) {
                setAnimationStep(prev => prev + 1)
            } else {
                setAnimationStep(0)
                setIsVisible(false)
                setTimeout(() => setIsVisible(true), 200)
            }
            lastTimeRef.current = time
        }

        animationRef.current = requestAnimationFrame(animate)
    }, [speed, isVisible, animationStep])

    useLayoutEffect(() => {
        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [animate])

    const chartConfig = useMemo(() => ({
        retention: {
            label: "Retention Rate",
            theme: {
                light: "#3b82f6",
                dark: "#60a5fa"
            }
        }
    }), [])

    return (
        <div className="relative w-full max-w-4xl mx-auto bg-gray-50 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 pt-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center">
                        <div>
                            <h3 className="text-md font-semibold text-gray-900 text-center leading-relaxed mb-4 mt-2">Improved Client Retention</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 h-[350px]">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ChartContainer config={chartConfig}>
                            <BarChart data={[...retentionData]}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                    interval={0}
                                    height={40}
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            labelFormatter={(label) => `${label}`}
                                            formatter={(value) => [`${value}%`, "Retention"]}
                                        />
                                    }
                                />
                                <Bar
                                    dataKey="rate"
                                    strokeWidth={2}
                                    radius={8}
                                    activeIndex={retentionData.length - 1}
                                    activeBar={({ ...props }) => (
                                        <Rectangle {...props} fillOpacity={1} />
                                    )}
                                />
                            </BarChart>
                        </ChartContainer>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
})

// Optimize StaffHappinessVisualization component
const StaffHappinessVisualization = memo(({ speed = 1 }: { speed: number }) => {
    const [currentDay, setCurrentDay] = useState(0)
    const [metrics, setMetrics] = useState({
        stressLevel: 90,
        happinessLevel: 30,
        productivityScore: 40,
        workLifeBalance: 25
    })

    const animationRef = useRef<number>()
    const lastTimeRef = useRef<number>()

    const updateMetrics = useCallback((nextDay: number) => {
        if (nextDay <= 2) {
            setMetrics({
                stressLevel: 90 - (nextDay * 15),
                happinessLevel: 30 + (nextDay * 20),
                productivityScore: 40 + (nextDay * 15),
                workLifeBalance: 25 + (nextDay * 15)
            })
        } else {
            setMetrics({
                stressLevel: Math.max(10, 60 - ((nextDay - 2) * 25)),
                happinessLevel: Math.min(95, 70 + ((nextDay - 2) * 15)),
                productivityScore: Math.min(98, 70 + ((nextDay - 2) * 14)),
                workLifeBalance: Math.min(92, 55 + ((nextDay - 2) * 18))
            })
        }
    }, [])

    const animate = useCallback((time: number) => {
        if (lastTimeRef.current === undefined) {
            lastTimeRef.current = time
        }

        const delta = time - lastTimeRef.current

        if (delta > 2000 / speed) {
            const nextDay = (currentDay + 1) % days.length
            updateMetrics(nextDay)
            setCurrentDay(nextDay)
            lastTimeRef.current = time
        }

        animationRef.current = requestAnimationFrame(animate)
    }, [speed, currentDay, updateMetrics])

    useLayoutEffect(() => {
        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [animate])

    const currentEmoji = days[currentDay]?.emoji || "😊"
    const currentTask = days[currentDay]?.task || "Happy working!"

    const metricsList = useMemo(() => [
        { label: "Stress Level", value: metrics.stressLevel, color: metrics.stressLevel > 50 ? "bg-blue-600" : "bg-blue-500", inverse: true },
        { label: "Happiness", value: metrics.happinessLevel, color: "bg-blue-500", inverse: false },
        { label: "Productivity", value: metrics.productivityScore, color: "bg-blue-400", inverse: false },
        { label: "Performance", value: metrics.workLifeBalance, color: "bg-blue-300", inverse: false }
    ], [metrics])

    return (
        <div className="flex flex-col items-center justify-center w-full h-full rounded-xl mt-4">
            <div className="h-full flex flex-col items-center justify-center">
                <div className="flex flex-col items-center mb-6">
                    <motion.div
                        key={currentDay}
                        className="relative w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-xl mb-2"
                        animate={{
                            scale: [1, 1.05, 1],
                            y: [0, -3, 0]
                        }}
                        transition={{
                            duration: 1.5 / speed,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <motion.span
                            key={`${currentDay}-${currentEmoji}`}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ duration: 0.6 / speed, type: "spring", bounce: 0.6 }}
                        >
                            {currentEmoji}
                        </motion.span>
                    </motion.div>

                    <motion.div
                        className="text-center"
                        key={currentTask}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 / speed }}
                    >
                        <h4 className="text-md font-semibold text-neutral-800">{days[currentDay]?.name}</h4>
                        <p className="text-xs text-neutral-600">{currentTask}</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {metricsList.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            className="bg-gray-100 rounded-xl p-4 flex flex-col justify-between"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 / speed }}
                        >
                            <div className="flex justify-between mb-1 items-center gap-2">
                                <span className="text-[11px] font-medium text-neutral-600">{metric.label}</span>
                                <span className="text-[14px] font-bold text-neutral-800">
                                    {Math.round(metric.value)}%
                                </span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className={cn("h-full rounded-full", metric.color)}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.value}%` }}
                                    transition={{ duration: 1 / speed, ease: "easeOut" }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-6 flex justify-center space-x-2">
                    {days.map((day, index) => (
                        <motion.div
                            key={index}
                            className={cn(
                                "w-1 h-1 rounded-full transition-all duration-300",
                                index === currentDay ? "bg-primary scale-110" : "bg-gray-200"
                            )}
                            animate={index === currentDay ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.5 / speed }}
                        />
                    ))}
                </div>

                <AnimatePresence>
                    {metrics.happinessLevel > 85 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            className="absolute top-16 right-4 bg-green-200/30 rounded-xl p-2"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-3 w-3 text-green-600" />
                                <span className="text-xs font-medium text-green-700">
                                    98% Staff Retention
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
})

// Optimize BenefitDemo component
export const BenefitDemo = memo(({ speed = 1, benefit }: BenefitDemoProps) => {
    const [rotations, setRotations] = useState({
        rotation1: 0,
        rotation2: 0,
        rotation3: 0,
        rotation4: 0
    })

    const animationRef = useRef<number>()
    const lastTimeRef = useRef<number>()

    const animate = useCallback((time: number) => {
        if (lastTimeRef.current === undefined) {
            lastTimeRef.current = time
        }

        const delta = time - lastTimeRef.current

        if (delta > 50 / speed) {
            setRotations(prev => ({
                rotation1: prev.rotation1 + 0.3,
                rotation2: prev.rotation2 + 0.4,
                rotation3: prev.rotation3 + 0.5,
                rotation4: prev.rotation4 + 0.6
            }))
            lastTimeRef.current = time
        }

        animationRef.current = requestAnimationFrame(animate)
    }, [speed])

    useLayoutEffect(() => {
        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [animate])

    if (benefit === "client") {
        return <ClientRetentionChart speed={speed} />
    }

    if (benefit === "staff") {
        return (
            <div className="relative w-full max-w-4xl mx-auto bg-gray-50 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-6 pt-6">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center">
                            <div>
                                <h3 className="text-md font-semibold text-gray-900 text-center leading-relaxed mb-4 mt-2">Higher Staff Retention</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-fit p-4">
                    <StaffHappinessVisualization speed={0.5} />
                </div>
            </div>
        )
    }

    if (benefit === "admin") {
        return <AdminCostSavings speed={speed} />
    }

    return (
        <div className="relative w-full mx-auto bg-gray-50 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 pt-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center mt-2 mb-6">
                        <div>
                            <h3 className="text-md font-semibold text-gray-900 leading-relaxed">Everything Under One Subscription</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative h-[300px] p-8 overflow-hidden flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-72 h-72 rounded-full border border-neutral-200 opacity-40" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-neutral-200 opacity-50" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-neutral-200 opacity-60" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-neutral-200 opacity-70" />
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                        className="w-10 h-10 rounded-full bg-gray-200/50 flex items-center justify-center border border-neutral-200"
                        animate={{
                            scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 4 / speed, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image src="/assets/aimlogo.png" alt="Aim Logo" width={28} height={28} loading="lazy" />
                    </motion.div>
                </div>

                {features.map((feature, index) => (
                    <motion.div
                        key={feature.name}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  overflow-visible"
                        animate={{ rotate: rotations[`rotation${index + 1}` as keyof typeof rotations] }}
                        transition={{ duration: 0, ease: "linear" }}
                    >
                        <motion.div
                            className="absolute"
                            style={{
                                left: `${feature.radius}px`,
                                top: '0',
                                transform: 'translate(-50%, -50%)'
                            }}
                            animate={{
                                rotate: -rotations[`rotation${index + 1}` as keyof typeof rotations]
                            }}
                            transition={{ duration: 0, ease: "linear" }}
                        >
                            <motion.div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm",
                                    "bg-blue-200/50 text-blue-700"
                                )}
                                whileHover={{ scale: 1.1 }}
                                animate={{
                                    y: [0, -3, 0]
                                }}
                                transition={{
                                    y: {
                                        duration: 2 + index * 0.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: index * 0.3
                                    }
                                }}
                            >
                                {feature.icon}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                ))}

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(4)].map((_, i) => (
                        <motion.div
                            key={`bg-dot-${i}`}
                            className="absolute w-1 h-1 bg-gray-300 rounded-full opacity-20"
                            animate={{
                                scale: [0, 1, 0],
                                opacity: [0, 0.3, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: i * 0.8,
                                ease: "easeInOut"
                            }}
                            style={{
                                left: `${30 + (i * 20)}%`,
                                top: `${30 + (i * 20)}%`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
})

