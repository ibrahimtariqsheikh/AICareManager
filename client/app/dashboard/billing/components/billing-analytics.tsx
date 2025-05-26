"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronDown, TrendingUp, DollarSign, CreditCard, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie } from "recharts"
import { useChat } from 'ai/react'

const revenueData = [
    { name: "Jan", revenue: 45000, expenses: 28000 },
    { name: "Feb", revenue: 52000, expenses: 30000 },
    { name: "Mar", revenue: 48000, expenses: 29000 },
    { name: "Apr", revenue: 55000, expenses: 32000 },
    { name: "May", revenue: 60000, expenses: 35000 },
    { name: "Jun", revenue: 65000, expenses: 38000 },
]

const paymentMethodData = [
    { name: "Credit Card", value: 45, fill: "hsl(var(--chart-1))" },
    { name: "Bank Transfer", value: 30, fill: "hsl(var(--chart-2))" },
    { name: "Cash", value: 15, fill: "hsl(var(--chart-3))" },
    { name: "Other", value: 10, fill: "hsl(var(--chart-4))" },
]

const clientRetentionData = [
    { name: "Jan", retention: 85 },
    { name: "Feb", retention: 88 },
    { name: "Mar", retention: 90 },
    { name: "Apr", retention: 92 },
    { name: "May", retention: 95 },
    { name: "Jun", retention: 94 },
]

const revenueChartConfig = {
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-1))",
    },
    expenses: {
        label: "Expenses",
        color: "hsl(var(--chart-2))",
    },
}

const paymentChartConfig = {
    "Credit Card": {
        label: "Credit Card",
        color: "hsl(var(--chart-1))",
    },
    "Bank Transfer": {
        label: "Bank Transfer",
        color: "hsl(var(--chart-2))",
    },
    Cash: {
        label: "Cash",
        color: "hsl(var(--chart-3))",
    },
    Other: {
        label: "Other",
        color: "hsl(var(--chart-4))",
    },
}

const retentionChartConfig = {
    retention: {
        label: "Retention Rate (%)",
        color: "hsl(var(--chart-1))",
    },
}

export default function BillingAnalytics() {
    const [showInsights, setShowInsights] = useState({
        revenue: false,
        payments: false,
        retention: false,
    })

    const [insights, setInsights] = useState({
        revenue: [],
        payments: [],
        retention: [],
    })

    const { handleSubmit, messages, isLoading } = useChat({
        api: '/api/chat',
        body: {
            route: 'billing'
        }
    })

    const toggleInsights = useCallback(async (section: keyof typeof showInsights) => {
        setShowInsights(prev => ({
            ...prev,
            [section]: !prev[section]
        }))

        // Fetch insights when toggling
        if (!insights[section].length) {
            const data = {
                revenue: {
                    monthlyRevenue: [12000, 13500, 14200, 15800],
                    expenses: [8000, 8500, 9200, 9500],
                    profitMargin: [33.3, 37.0, 35.2, 39.9]
                },
                payments: {
                    creditCard: 45,
                    bankTransfer: 35,
                    cash: 15,
                    other: 5,
                    trends: {
                        creditCard: 5,
                        bankTransfer: 15,
                        cash: -5,
                        other: -15
                    }
                },
                retention: {
                    rate: 92,
                    topClients: [
                        { name: 'Client A', revenue: 45000 },
                        { name: 'Client B', revenue: 38000 },
                        { name: 'Client C', revenue: 32000 }
                    ],
                    satisfaction: 4.7
                }
            }[section]

            await handleSubmit({
                section,
                data
            } as any)

            // Get the last message from the chat
            const lastMessage = messages[messages.length - 1]
            if (lastMessage?.content) {
                try {
                    const parsedInsights = JSON.parse(lastMessage.content)
                    setInsights(prev => ({
                        ...prev,
                        [section]: parsedInsights
                    }))
                } catch (error) {
                    console.error('Error parsing insights:', error)
                }
            }
        }
    }, [handleSubmit, messages, insights])

    return (
        <div className="space-y-4">
            {/* Charts */}
            <div className="grid gap-3 grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <div>
                            <CardTitle className="text-base">Revenue & Expenses</CardTitle>
                            <CardDescription className="text-xs">Monthly financial overview</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toggleInsights("revenue")} className="h-8">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Insights
                            <motion.div animate={{ rotate: showInsights.revenue ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </motion.div>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                        <AnimatePresence>
                            {showInsights.revenue && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mb-4 p-4 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                                >
                                    {insights.revenue.map((item, i) => (
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
                        <ChartContainer config={revenueChartConfig} className="min-h-[200px]">
                            <BarChart data={revenueData} width={300} height={200}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <div>
                            <CardTitle className="text-base">Payment Methods</CardTitle>
                            <CardDescription className="text-xs">Distribution of payment methods</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toggleInsights("payments")} className="h-8">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Insights
                            <motion.div animate={{ rotate: showInsights.payments ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </motion.div>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                        <AnimatePresence>
                            {showInsights.payments && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mb-4 p-4 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                                >
                                    {insights.payments.map((item, i) => (
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
                        <ChartContainer config={paymentChartConfig} className="min-h-[200px]">
                            <PieChart width={300} height={200}>
                                <Pie
                                    data={paymentMethodData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={60}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <div>
                            <CardTitle className="text-base">Client Retention</CardTitle>
                            <CardDescription className="text-xs">Monthly client retention rate</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => toggleInsights("retention")} className="h-8">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Insights
                            <motion.div animate={{ rotate: showInsights.retention ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                <ChevronDown className="ml-1 h-3 w-3" />
                            </motion.div>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                        <AnimatePresence>
                            {showInsights.retention && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mb-4 p-4 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                                >
                                    {insights.retention.map((item, i) => (
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
                        <ChartContainer config={retentionChartConfig} className="min-h-[200px]">
                            <LineChart data={clientRetentionData} width={300} height={200}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line
                                    type="monotone"
                                    dataKey="retention"
                                    stroke="var(--color-retention)"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
