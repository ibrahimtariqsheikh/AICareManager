"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronDown, TrendingUp, DollarSign, CreditCard, Users, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from 'ai/react'
import { cn } from "@/lib/utils"

export default function BillingStats() {
    const [showRecommendations, setShowRecommendations] = useState({
        revenue: false,
        clients: false,
        invoices: false,
        profit: false,
    })

    const [recommendations, setRecommendations] = useState({
        revenue: [],
        clients: [],
        invoices: [],
        profit: [],
    })

    const { handleSubmit, messages, isLoading } = useChat({
        api: '/api/chat/billing',
        onFinish: (message) => {
            try {
                const parsedInsights = JSON.parse(message.content)
                return parsedInsights
            } catch (error) {
                console.error('Error parsing insights:', error)
                return []
            }
        }
    })

    const toggleRecommendations = useCallback(async (section: keyof typeof showRecommendations) => {
        setShowRecommendations(prev => ({
            ...prev,
            [section]: !prev[section]
        }))

        // Fetch recommendations when toggling
        if (!recommendations[section].length) {
            const data = {
                revenue: {
                    currentRevenue: 45000,
                    growthRate: 12,
                    targetRevenue: 50000,
                    services: ['Home Care', 'Live-in Care', 'Specialist Care']
                },
                clients: {
                    totalClients: 45,
                    retentionRate: 85,
                    satisfactionScore: 4.2,
                    newClientsThisMonth: 5
                },
                invoices: {
                    totalInvoices: 120,
                    overdueInvoices: 3,
                    averagePaymentTime: 15,
                    outstandingAmount: 8500
                },
                profit: {
                    currentProfit: 28000,
                    profitMargin: 35,
                    operationalCosts: 17000,
                    revenueGrowth: 15
                }
            }[section]

            const response = await handleSubmit({
                section,
                data
            } as any)

            // The response will be handled by onFinish callback
            setRecommendations(prev => ({
                ...prev,
                [section]: recommendations[section]
            }))
        }
    }, [handleSubmit, recommendations])

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <div>
                        <div className="flex items-center mb-1.5">
                            <div className={cn("p-1.5 rounded-full bg-blue-100", "dark:bg-blue-900/30")}>
                                <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <CardTitle className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Revenue</CardTitle>
                        </div>
                        <CardDescription className="text-xs">Monthly revenue overview</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold">$45,000</p>
                        </div>
                        <div className="flex items-center text-blue-600 text-sm font-medium dark:text-blue-400">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            +12%
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRecommendations("revenue")}
                        className="w-full h-8"
                        disabled={isLoading}
                    >
                        <Sparkles className="mr-1 h-3 w-3" />
                        {isLoading ? "Loading..." : "AI Insights"}
                        <motion.div animate={{ rotate: showRecommendations.revenue ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="ml-1 h-3 w-3" />
                        </motion.div>
                    </Button>
                    <AnimatePresence>
                        {showRecommendations.revenue && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 p-4 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                            >
                                {recommendations.revenue.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <span className="text-primary">•</span>
                                        <span>{item}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <div>
                        <div className="flex items-center mb-1.5">
                            <div className={cn("p-1.5 rounded-full bg-green-100", "dark:bg-green-900/30")}>
                                <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <CardTitle className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Clients</CardTitle>
                        </div>
                        <CardDescription className="text-xs">Active client overview</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold">45</p>
                        </div>
                        <div className="flex items-center text-blue-600 text-sm font-medium dark:text-blue-400">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            +5 new
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRecommendations("clients")}
                        className="w-full h-8"
                        disabled={isLoading}
                    >
                        <Sparkles className="mr-1 h-3 w-3" />
                        {isLoading ? "Loading..." : "AI Insights"}
                        <motion.div animate={{ rotate: showRecommendations.clients ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="ml-1 h-3 w-3" />
                        </motion.div>
                    </Button>
                    <AnimatePresence>
                        {showRecommendations.clients && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 p-4 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                            >
                                {recommendations.clients.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <span className="text-primary">•</span>
                                        <span>{item}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <div>
                        <div className="flex items-center mb-1.5">
                            <div className={cn("p-1.5 rounded-full bg-orange-100", "dark:bg-orange-900/30")}>
                                <CreditCard className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            <CardTitle className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Invoices</CardTitle>
                        </div>
                        <CardDescription className="text-xs">Invoice status overview</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold">120</p>
                        </div>
                        <div className="flex items-center text-red-600 text-sm font-medium dark:text-red-400">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            3 overdue
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRecommendations("invoices")}
                        className="w-full h-8"
                        disabled={isLoading}
                    >
                        <Sparkles className="mr-1 h-3 w-3" />
                        {isLoading ? "Loading..." : "AI Insights"}
                        <motion.div animate={{ rotate: showRecommendations.invoices ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="ml-1 h-3 w-3" />
                        </motion.div>
                    </Button>
                    <AnimatePresence>
                        {showRecommendations.invoices && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 p-4 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                            >
                                {recommendations.invoices.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <span className="text-primary">•</span>
                                        <span>{item}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>

            <Card className={cn("border border-neutral-200 shadow-none", "dark:border-neutral-800 dark:bg-card")}>
                <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <div>
                        <div className="flex items-center mb-1.5">
                            <div className={cn("p-1.5 rounded-full bg-purple-100", "dark:bg-purple-900/30")}>
                                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <CardTitle className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Profit</CardTitle>
                        </div>
                        <CardDescription className="text-xs">Monthly profit overview</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold">$28,000</p>
                        </div>
                        <div className="flex items-center text-blue-600 text-sm font-medium dark:text-blue-400">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            35% margin
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRecommendations("profit")}
                        className="w-full h-8"
                        disabled={isLoading}
                    >
                        <Sparkles className="mr-1 h-3 w-3" />
                        {isLoading ? "Loading..." : "AI Insights"}
                        <motion.div animate={{ rotate: showRecommendations.profit ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="ml-1 h-3 w-3" />
                        </motion.div>
                    </Button>
                    <AnimatePresence>
                        {showRecommendations.profit && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-4 p-4 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                            >
                                {recommendations.profit.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-2 text-sm"
                                    >
                                        <span className="text-primary">•</span>
                                        <span>{item}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    )
} 