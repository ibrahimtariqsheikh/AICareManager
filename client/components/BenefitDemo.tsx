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

    // Sample data for client retention with exponential growth
    const retentionData = [
        { month: "January", rate: 30, clients: 120 },
        { month: "February", rate: 35, clients: 125 },
        { month: "March", rate: 42, clients: 132 },
        { month: "April", rate: 50, clients: 138 },
        { month: "May", rate: 60, clients: 145 },
        { month: "June", rate: 68, clients: 152 },
        { month: "July", rate: 74, clients: 158 },
        { month: "August", rate: 79, clients: 162 },
        { month: "September", rate: 83, clients: 165 },
        { month: "October", rate: 86, clients: 168 },
        { month: "November", rate: 88, clients: 170 },
        { month: "December", rate: 90, clients: 172 }
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
        <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center tracking-tight leading-relaxed">Improved Client Retention</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-900">{currentRate}%</div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>+60%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="p-4">
                <div className="h-64">
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            data={retentionData}
                            margin={{
                                left: 12,
                                right: 12,
                                top: 12,
                                bottom: 12
                            }}
                        >
                            <defs>
                                <linearGradient id="fillRetention" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-retention)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-retention)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                interval={0}
                                tickFormatter={(value) => value.slice(0, 3)}
                                height={40}
                            />
                            <YAxis
                                domain={[20, 100]}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `${value}%`}
                                width={40}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(label) => `${label}`}
                                        formatter={(value) => [`${value}%`, "Retention"]}
                                    />
                                }
                            />
                            <Area
                                type="natural"
                                dataKey="rate"
                                stroke="var(--color-retention)"
                                strokeWidth={2}
                                fill="url(#fillRetention)"
                                fillOpacity={0.4}
                                dot={{ r: 4, fill: "var(--color-retention)", strokeWidth: 2, stroke: "white" }}
                                activeDot={{ r: 6, fill: "var(--color-retention)", strokeWidth: 2, stroke: "white" }}
                            />
                        </AreaChart>
                    </ChartContainer>
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
        { name: "Friday", emoji: "🥰", task: "Work-life balance!" }
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
        { label: "Stress Level", value: stressLevel, color: stressLevel > 50 ? "bg-red-500" : "bg-green-500", inverse: true },
        { label: "Happiness", value: happinessLevel, color: "bg-yellow-500", inverse: false },
        { label: "Productivity", value: productivityScore, color: "bg-blue-500", inverse: false },
        { label: "Work-Life Balance", value: workLifeBalance, color: "bg-purple-500", inverse: false }
    ]

    return (
        <div className="relative w-full h-full bg-white rounded-xl">

            {/* Content */}
            <div className="p-4 h-[calc(100%-4rem)] flex flex-col">
                {/* Main Employee Avatar */}
                <div className="flex flex-col items-center mb-3">
                    <motion.div
                        key={currentDay}
                        className="relative w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-xl mb-2 border-2 border-gray-100"
                        animate={{
                            scale: [1, 1.1, 1],
                            y: [0, -5, 0]
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

                        {/* Floating particles based on happiness */}
                        {happinessLevel > 70 && (
                            <>
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={`particle-${i}`}
                                        className="absolute w-2 h-2 rounded-full bg-yellow-400"
                                        animate={{
                                            y: [-40, -80],
                                            x: [(i - 1) * 20, (i - 1) * 30],
                                            opacity: [1, 0],
                                            scale: [1, 0.5]
                                        }}
                                        transition={{
                                            duration: 2 / speed,
                                            repeat: Infinity,
                                            delay: i * 0.3 / speed
                                        }}
                                    />
                                ))}
                            </>
                        )}
                    </motion.div>

                    <motion.div
                        className="text-center"
                        key={currentTask}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 / speed }}
                    >
                        <h4 className="text-sm font-medium text-gray-800">{days[currentDay]?.name}</h4>
                        <p className="text-xs text-gray-600">{currentTask}</p>
                    </motion.div>
                </div>

                {/* Metrics Dashboard */}
                <div className="grid grid-cols-2 gap-2 flex-1 min-h-[120px]">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            className="bg-gray-50 rounded-lg p-2 flex flex-col justify-between"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 / speed }}
                        >
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-medium text-gray-600">{metric.label}</span>
                                <span className="text-xs font-bold text-gray-800">
                                    {Math.round(metric.value)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
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
                <div className="mt-2 flex justify-center space-x-1.5">
                    {days.map((day, index) => (
                        <motion.div
                            key={index}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                index === currentDay ? "bg-blue-500 scale-125" : "bg-gray-200"
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
                            className="absolute top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-1.5"
                        >
                            <div className="flex items-center gap-1.5">
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
            <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 text-center tracking-tight leading-relaxed">Higher Staff Retention</h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-gray-900">98%</div>
                            <div className="flex items-center gap-1 text-xs text-green-600">
                                <TrendingUp className="h-3 w-3" />
                                <span>+45%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-[300px] p-4">
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
    const [rotation, setRotation] = useState(0)

    const features = [
        { name: "AI-Powered Scheduling", icon: <Calendar className="h-4 w-4" />, bgColor: "bg-red-500" },
        { name: "Automated Care Planning", icon: <ClipboardList className="h-4 w-4" />, bgColor: "bg-blue-500" },
        { name: "Medication Management", icon: <Pill className="h-4 w-4" />, bgColor: "bg-green-500" },
        { name: "Smart Visit Reporting", icon: <FileText className="h-4 w-4" />, bgColor: "bg-purple-500" }
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation(prev => prev + 0.5) // Slow continuous rotation
        }, 50 / speed)

        return () => clearInterval(interval)
    }, [speed])

    return (
        <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center tracking-tight leading-relaxed">Everything Under One Subscription</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-bold text-gray-900">4+</div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            <span>Tools</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative h-[300px] p-8  overflow-hidden flex items-center justify-center">
                {/* Orbital Rings */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {/* Outer ring */}
                    <div className="w-64 h-64 rounded-full border border-neutral-200 opacity-60" />
                    {/* Middle ring */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-neutral-200 opacity-60" />
                    {/* Inner ring */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-neutral-200 opacity-60" />
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <motion.div
                        className="w-16 h-10 rounded-full bg-gray-200/50 flex items-center justify-center border border-neutral-200"
                        animate={{
                            scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 4 / speed, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Image src="/assets/aimlogo.png" alt="Aim Logo" width={32} height={32} />
                    </motion.div>
                </div>

                {/* Orbiting Features Container */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: rotation }}
                    transition={{ duration: 0, ease: "linear" }}
                >
                    {features.map((feature, index) => {
                        const angle = (index * 90) // 360/4 = 90 degrees between each feature
                        const radius = 110 // Reduced radius to fit smaller container
                        const x = Math.cos((angle * Math.PI) / 180) * radius
                        const y = Math.sin((angle * Math.PI) / 180) * radius

                        return (
                            <motion.div
                                key={feature.name}
                                className="absolute"
                                style={{
                                    left: `${x}px`,
                                    top: `${y}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                animate={{
                                    rotate: -rotation // Counter-rotate to keep icons upright
                                }}
                                transition={{ duration: 0, ease: "linear" }}
                            >
                                <motion.div
                                    className={cn(
                                        "w-9 h-9 rounded-full flex items-center justify-center shadow-sm border border-blue-300/50 backdrop-blur-sm",
                                        "bg-blue-200/50 text-blue-700"
                                    )}
                                    whileHover={{ scale: 1.1 }}
                                    animate={{
                                        y: [0, -3, 0] // Reduced vertical movement
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
                                    <div className="">
                                        {feature.icon}
                                    </div>
                                </motion.div>
                            </motion.div>
                        )
                    })}
                </motion.div>

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

const Sparkles = () => {
    const randomMove = () => Math.random() * 2 - 1;
    const randomOpacity = () => Math.random();
    const random = () => Math.random();

    return (
        <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
                <motion.span
                    key={`star-${i}`}
                    animate={{
                        top: `calc(${random() * 100}% + ${randomMove()}px)`,
                        left: `calc(${random() * 100}% + ${randomMove()}px)`,
                        opacity: randomOpacity(),
                        scale: [1, 1.2, 0],
                    }}
                    transition={{
                        duration: random() * 2 + 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        position: "absolute",
                        top: `${random() * 100}%`,
                        left: `${random() * 100}%`,
                        width: `2px`,
                        height: `2px`,
                        borderRadius: "50%",
                        zIndex: 1,
                    }}
                    className="inline-block bg-blue-500"
                />
            ))}
        </div>
    );
};