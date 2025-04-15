"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Users, CreditCard, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function BillingStats() {
    const [showRecommendations, setShowRecommendations] = useState<string | null>(null)

    const recommendations = {
        revenue: [
            "Consider increasing prices by 5% for premium services",
            "Focus on upselling add-on services to existing clients",
            "Launch a referral program to boost new client acquisition"
        ],
        clients: [
            "Client retention rate is below industry average",
            "Implement a client feedback system to improve satisfaction",
            "Offer loyalty discounts for long-term clients"
        ],
        invoices: [
            "3 invoices are overdue by more than 30 days",
            "Consider implementing automatic payment reminders",
            "Offer early payment discounts to improve cash flow"
        ],
        profit: [
            "Reduce operational costs by optimizing staff schedules",
            "Review supplier contracts for potential savings",
            "Implement energy-saving measures in office locations"
        ]
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs w-full justify-between"
                        onClick={() => setShowRecommendations(showRecommendations === 'revenue' ? null : 'revenue')}
                    >
                        <div className="flex items-center">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Insights
                        </div>
                        <motion.div
                            animate={{ rotate: showRecommendations === 'revenue' ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="h-3 w-3" />
                        </motion.div>
                    </Button>
                    <AnimatePresence>
                        {showRecommendations === 'revenue' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2 space-y-1 text-xs text-muted-foreground overflow-hidden"
                            >
                                {recommendations.revenue.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-1"
                                    >
                                        <span>•</span>
                                        <span>{rec}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Active Clients
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">235</div>
                    <p className="text-xs text-muted-foreground">
                        +12 new clients this month
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs w-full justify-between"
                        onClick={() => setShowRecommendations(showRecommendations === 'clients' ? null : 'clients')}
                    >
                        <div className="flex items-center">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Insights
                        </div>
                        <motion.div
                            animate={{ rotate: showRecommendations === 'clients' ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="h-3 w-3" />
                        </motion.div>
                    </Button>
                    <AnimatePresence>
                        {showRecommendations === 'clients' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2 space-y-1 text-xs text-muted-foreground overflow-hidden"
                            >
                                {recommendations.clients.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-1"
                                    >
                                        <span>•</span>
                                        <span>{rec}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Outstanding Invoices
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$12,234</div>
                    <p className="text-xs text-muted-foreground">
                        15 invoices pending
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs w-full justify-between"
                        onClick={() => setShowRecommendations(showRecommendations === 'invoices' ? null : 'invoices')}
                    >
                        <div className="flex items-center">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Insights
                        </div>
                        <motion.div
                            animate={{ rotate: showRecommendations === 'invoices' ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="h-3 w-3" />
                        </motion.div>
                    </Button>
                    <AnimatePresence>
                        {showRecommendations === 'invoices' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2 space-y-1 text-xs text-muted-foreground overflow-hidden"
                            >
                                {recommendations.invoices.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-1"
                                    >
                                        <span>•</span>
                                        <span>{rec}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Profit Margin
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">32.5%</div>
                    <p className="text-xs text-muted-foreground">
                        +2.5% from last month
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-xs w-full justify-between"
                        onClick={() => setShowRecommendations(showRecommendations === 'profit' ? null : 'profit')}
                    >
                        <div className="flex items-center">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Insights
                        </div>
                        <motion.div
                            animate={{ rotate: showRecommendations === 'profit' ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown className="h-3 w-3" />
                        </motion.div>
                    </Button>
                    <AnimatePresence>
                        {showRecommendations === 'profit' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2 space-y-1 text-xs text-muted-foreground overflow-hidden"
                            >
                                {recommendations.profit.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-1"
                                    >
                                        <span>•</span>
                                        <span>{rec}</span>
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