"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronDown } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DateRange } from "react-day-picker"

const data = [
    { name: "Jan", revenue: 4000, expenses: 2400 },
    { name: "Feb", revenue: 3000, expenses: 1398 },
    { name: "Mar", revenue: 2000, expenses: 9800 },
    { name: "Apr", revenue: 2780, expenses: 3908 },
    { name: "May", revenue: 1890, expenses: 4800 },
    { name: "Jun", revenue: 2390, expenses: 3800 },
]

interface BillingReportsProps {
    dateRange: DateRange | undefined
}

export function BillingReports({ }: BillingReportsProps) {
    const [showAnalysis, setShowAnalysis] = useState({
        overview: false,
        clients: false,
        payments: false
    })

    const aiAnalysis = {
        overview: [
            "Revenue growth is strong at 20.1% month-over-month",
            "Expenses are trending higher than expected in Q2",
            "Profit margin is stable but could be improved",
            "Recommend reviewing supplier contracts for cost savings"
        ],
        clients: [
            "Top 3 clients contribute 45% of total revenue",
            "Client B has shown consistent growth over 6 months",
            "Consider offering premium services to high-value clients",
            "Client retention rate is above industry average"
        ],
        payments: [
            "Credit card payments are most popular (45%)",
            "Bank transfers have increased by 15% this quarter",
            "Consider implementing mobile payment options",
            "Payment processing fees are within industry standards"
        ]
    }

    const toggleAnalysis = (section: keyof typeof showAnalysis) => {
        setShowAnalysis(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Financial Overview</CardTitle>
                        <CardDescription>
                            Revenue and expenses analysis for the selected period
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAnalysis('overview')}
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Analysis
                        <motion.div
                            animate={{ rotate: showAnalysis.overview ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </motion.div>
                    </Button>
                </CardHeader>
                <CardContent>
                    <AnimatePresence>
                        {showAnalysis.overview && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mb-4 p-4 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                            >
                                {aiAnalysis.overview.map((item, i) => (
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
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#8884d8" />
                                <Bar dataKey="expenses" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Top Clients</CardTitle>
                            <CardDescription>Revenue by client</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAnalysis('clients')}
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            AI Insights
                            <motion.div
                                animate={{ rotate: showAnalysis.clients ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </motion.div>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Client A", amount: "$12,000" },
                                { name: "Client B", amount: "$8,500" },
                                { name: "Client C", amount: "$6,200" },
                            ].map((client) => (
                                <div key={client.name} className="flex items-center justify-between">
                                    <div className="font-medium">{client.name}</div>
                                    <div className="text-muted-foreground">{client.amount}</div>
                                </div>
                            ))}
                            <AnimatePresence>
                                {showAnalysis.clients && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-4 p-3 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                                    >
                                        {aiAnalysis.clients.map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-2 text-xs"
                                            >
                                                <span className="text-primary">•</span>
                                                <span>{item}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Payment Methods</CardTitle>
                            <CardDescription>Distribution of payment methods</CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAnalysis('payments')}
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            AI Insights
                            <motion.div
                                animate={{ rotate: showAnalysis.payments ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </motion.div>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { method: "Credit Card", percentage: "45%" },
                                { method: "Bank Transfer", percentage: "30%" },
                                { method: "Cash", percentage: "15%" },
                                { method: "Other", percentage: "10%" },
                            ].map((item) => (
                                <div key={item.method} className="flex items-center justify-between">
                                    <div className="font-medium">{item.method}</div>
                                    <div className="text-muted-foreground">{item.percentage}</div>
                                </div>
                            ))}
                            <AnimatePresence>
                                {showAnalysis.payments && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-4 p-3 bg-muted/50 rounded-md space-y-2 overflow-hidden"
                                    >
                                        {aiAnalysis.payments.map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-start gap-2 text-xs"
                                            >
                                                <span className="text-primary">•</span>
                                                <span>{item}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 