"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Users, Shield, CreditCard, Loader2, ArrowRight, TrendingUp, Eye, Heart, Star, Smile, Calendar, ClipboardList, Pill, FileText, Bell } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminCostSavings } from "@/components/AdminCostSavings"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Area,
    AreaChart,
    BarChart,
    Bar,
    Rectangle,
} from "recharts"

interface BenefitMessage {
    id: number
    type: "system" | "user"
    content: string
    timestamp: Date
    icon?: React.ReactNode
    status?: "processing" | "complete"
}

interface BenefitDemoProps {
    speed?: number
    benefit: "client" | "staff" | "admin" | "subscription"
}

interface ClientRetentionProps {
    speed?: number
}

// Happy Employee Animation Component
function HappyEmployeeAnimation({ currentStep, speed = 1 }: { currentStep: number, speed: number }) {
    const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'excited' | 'relieved' | 'satisfied'>('happy')
    const [showFloatingElements, setShowFloatingElements] = useState(false)

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
    }

    const emotionSequence: Array<keyof typeof emotions> = ['happy', 'excited', 'relieved', 'satisfied']

    useEffect(() => {
        if (currentStep > 0) {
            const emotionIndex = Math.min(currentStep - 1, emotionSequence.length - 1)
            setCurrentEmotion(emotionSequence[emotionIndex] as keyof typeof emotions)
            setShowFloatingElements(true)
        }
    }, [currentStep])

    const currentEmotionData = emotions[currentEmotion]

    return (
        <div className="relative flex items-center justify-center">
            {/* Main Employee Avatar */}
            <motion.div
                className={cn(
                    "relative w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-500",
                    currentEmotionData.bgColor,
                    currentEmotionData.borderColor,
                    "border-2"
                )}
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 2 / speed,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <motion.span
                    key={currentEmotion}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5 / speed, type: "spring", bounce: 0.6 }}
                >
                    {currentEmotionData.emoji}
                </motion.span>
            </motion.div>

            {/* Floating Elements */}
            <AnimatePresence>
                {showFloatingElements && (
                    <>
                        {/* Hearts */}
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={`heart-${i}`}
                                className="absolute"
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                    x: 0,
                                    y: 0
                                }}
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

                        {/* Stars */}
                        {[...Array(2)].map((_, i) => (
                            <motion.div
                                key={`star-${i}`}
                                className="absolute"
                                initial={{
                                    opacity: 0,
                                    scale: 0,
                                    x: 0,
                                    y: 0
                                }}
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

                        {/* Sparkle Effect */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.6, 0] }}
                            transition={{
                                duration: 1.5 / speed,
                                repeat: Infinity,
                                delay: 0.5 / speed
                            }}
                        >
                            <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full blur-sm" />
                            <div className="absolute bottom-0 left-0 w-1 h-1 bg-pink-400 rounded-full blur-sm" />
                            <div className="absolute top-2 left-2 w-1.5 h-1.5 bg-blue-400 rounded-full blur-sm" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Satisfaction Meter */}
            <motion.div
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: currentStep > 2 ? 1 : 0, y: currentStep > 2 ? 0 : 10 }}
                transition={{ duration: 0.5 / speed }}
            >
                <div className="flex items-center gap-1 bg-white rounded-full px-3 py-1 shadow-md border">
                    <Smile className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">98% Happy</span>
                </div>
            </motion.div>
        </div>
    )
}

function ClientRetentionChart({ speed = 1 }: ClientRetentionProps) {
    const [animationStep, setAnimationStep] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    // Sample data for client retention with exponential growth - only 6 months
    const retentionData = [
        { month: "Jan", rate: 30, clients: 120, fill: "rgb(219, 234, 254)" }, // very light blue
        { month: "Feb", rate: 35, clients: 125, fill: "rgb(191, 219, 254)" }, // light blue
        { month: "Mar", rate: 42, clients: 132, fill: "rgb(147, 197, 253)" }, // medium light blue
        { month: "Apr", rate: 50, clients: 138, fill: "rgb(96, 165, 250)" }, // medium blue
        { month: "May", rate: 60, clients: 145, fill: "rgb(59, 130, 246)" }, // dark blue
        { month: "Jun", rate: 68, clients: 152, fill: "hsl(var(--primary))" }  // primary color
    ]

    const maxRate = Math.max(...retentionData.map(d => d.rate))
    const currentRate = retentionData[retentionData.length - 1]?.rate ?? 0

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 500 / speed)

        return () => clearTimeout(timer)
    }, [speed])

    useEffect(() => {
        if (isVisible && animationStep < retentionData.length) {
            const timer = setTimeout(() => {
                setAnimationStep(prev => prev + 1)
            }, 800 / speed)

            return () => clearTimeout(timer)
        } else if (animationStep >= retentionData.length) {
            const resetTimer = setTimeout(() => {
                setAnimationStep(0)
                setIsVisible(false)
                setTimeout(() => setIsVisible(true), 200)
            }, 3000 / speed)

            return () => clearTimeout(resetTimer)
        }
    }, [isVisible, animationStep, speed, retentionData.length])

    const chartConfig = {
        retention: {
            label: "Retention Rate",
            theme: {
                light: "#3b82f6",
                dark: "#60a5fa"
            }
        }
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto bg-gray-50 rounded-2xl overflow-hidden ">
            {/* Header */}
            <div className="bg-gray-50 px-6 pt-6 ">
                <div className="flex items-center justify-center">
                    <div className="flex items-center">

                        <div>
                            <h3 className="text-md font-semibold text-gray-900 text-center leading-relaxed mb-4 mt-2">Improved Client Retention</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="p-4 h-[350px]">
                <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ChartContainer config={chartConfig}>
                            <BarChart data={retentionData}>
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
                                    activeBar={({ ...props }) => {
                                        return (
                                            <Rectangle
                                                {...props}
                                                fillOpacity={1}
                                            />
                                        )
                                    }}
                                />
                            </BarChart>
                        </ChartContainer>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

// Interactive Employee Happiness Visualization for Staff Retention
function StaffHappinessVisualization({ speed = 1 }: { speed: number }) {
    const [currentDay, setCurrentDay] = useState(0)
    const [stressLevel, setStressLevel] = useState(90)
    const [happinessLevel, setHappinessLevel] = useState(30)
    const [productivityScore, setProductivityScore] = useState(40)
    const [workLifeBalance, setWorkLifeBalance] = useState(25)

    const days = [
        { name: "Monday", emoji: "😔", task: "Manual paperwork" },
        { name: "Tuesday", emoji: "😕", task: "Complex scheduling" },
        { name: "Wednesday", emoji: "🙂", task: "Using our software" },
        { name: "Thursday", emoji: "😊", task: "Streamlined workflow" },
        { name: "Friday", emoji: "🥰", task: "Performance" }
    ]

    const currentEmoji = days[currentDay]?.emoji || "😊"
    const currentTask = days[currentDay]?.task || "Happy working!"

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDay(prev => {
                const nextDay = (prev + 1) % days.length

                // Update metrics based on the day
                if (nextDay <= 2) {
                    // Before/during software adoption
                    setStressLevel(90 - (nextDay * 15))
                    setHappinessLevel(30 + (nextDay * 20))
                    setProductivityScore(40 + (nextDay * 15))
                    setWorkLifeBalance(25 + (nextDay * 15))
                } else {
                    // After software adoption
                    setStressLevel(Math.max(10, 60 - ((nextDay - 2) * 25)))
                    setHappinessLevel(Math.min(95, 70 + ((nextDay - 2) * 15)))
                    setProductivityScore(Math.min(98, 70 + ((nextDay - 2) * 14)))
                    setWorkLifeBalance(Math.min(92, 55 + ((nextDay - 2) * 18)))
                }

                return nextDay
            })
        }, 2000 / speed)

        return () => clearInterval(interval)
    }, [speed, days.length])

    const metrics = [
        { label: "Stress Level", value: stressLevel, color: stressLevel > 50 ? "bg-blue-600" : "bg-blue-500", inverse: true },
        { label: "Happiness", value: happinessLevel, color: "bg-blue-500", inverse: false },
        { label: "Productivity", value: productivityScore, color: "bg-blue-400", inverse: false },
        { label: "Performance", value: workLifeBalance, color: "bg-blue-300", inverse: false }
    ]

    return (
        <div className="flex flex-col items-center justify-center w-full h-full  rounded-xl mt-4">
            {/* Content */}
            <div className="h-full flex flex-col items-center justify-center">
                {/* Main Employee Avatar */}
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

                {/* Metrics Dashboard */}
                <div className="grid grid-cols-2 gap-2 ">
                    {metrics.map((metric, index) => (
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

                {/* Weekly Progress Indicator */}
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

                {/* Success Message */}
                <AnimatePresence>
                    {happinessLevel > 85 && (
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
}

export function BenefitDemo({ speed = 1, benefit }: BenefitDemoProps) {
    // If it's the client benefit, show the chart
    if (benefit === "client") {
        return <ClientRetentionChart speed={speed} />
    }

    // Show unique staff happiness visualization for staff benefit
    if (benefit === "staff") {
        return (
            <div className="relative w-full max-w-4xl mx-auto bg-gray-50 rounded-2xl overflow-hidden ">
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

    // Show admin cost savings visualization for admin benefit
    if (benefit === "admin") {
        return <AdminCostSavings speed={speed} />
    }

    // Cal.com-style orbiting visualization for subscription
    const [rotation1, setRotation1] = useState(0)
    const [rotation2, setRotation2] = useState(0)
    const [rotation3, setRotation3] = useState(0)
    const [rotation4, setRotation4] = useState(0)

    const features = [
        { name: "AI-Powered Scheduling", icon: <Calendar className="h-3.5 w-3.5" />, bgColor: "bg-red-500", rotation: rotation1, radius: 125, orbit: 4 },
        { name: "Automated Care Planning", icon: <ClipboardList className="h-3.5 w-3.5" />, bgColor: "bg-blue-500", rotation: rotation2, radius: 95, orbit: 3 },
        { name: "Medication Management", icon: <Pill className="h-3.5 w-3.5" />, bgColor: "bg-green-500", rotation: rotation3, radius: 60, orbit: 2 },
        { name: "Smart Visit Reporting", icon: <FileText className="h-3.5 w-3.5" />, bgColor: "bg-purple-500", rotation: rotation4, radius: 23, orbit: 1 }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation1(prev => prev + 0.3) // Slowest rotation
            setRotation2(prev => prev + 0.4) // Slightly faster
            setRotation3(prev => prev + 0.5) // Medium speed
            setRotation4(prev => prev + 0.6) // Fastest rotation
        }, 50 / speed)

        return () => clearInterval(interval)
    }, [speed])

    return (
        <div className="relative w-full  mx-auto bg-gray-50 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 pt-6">
                <div className="flex items-center justify-center">
                    <div className="flex items-center mt-2 mb-6">
                        <div>
                            <h3 className="text-md font-semibold text-gray-900  leading-relaxed">Everything Under One Subscription</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative h-[300px] p-8  overflow-hidden flex items-center justify-center">
                {/* Orbital Rings */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* ring 1*/}
                    <div className="w-72 h-72 rounded-full border border-neutral-200 opacity-40" />
                    {/* ring 2 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-neutral-200 opacity-50" />
                    {/* ring 3 */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-neutral-200 opacity-60" />
                    {/* ring 4 */}
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
                        <Image src="/assets/aimlogo.png" alt="Aim Logo" width={28} height={28} />
                    </motion.div>
                </div>

                {/* Individual Orbiting Features */}
                {features.map((feature, index) => {
                    return (
                        <motion.div
                            key={feature.name}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-visible"
                            animate={{ rotate: feature.rotation }}
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
                                    rotate: -feature.rotation // Counter-rotate to keep icons upright
                                }}
                                transition={{ duration: 0, ease: "linear" }}
                            >
                                <motion.div
                                    className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm z-50",
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
                    )
                })}

                {/* Background decoration - Fixed positioning and reduced opacity */}
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
}

