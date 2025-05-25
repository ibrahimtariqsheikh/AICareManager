"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Users, CreditCard, Sparkles, ChevronDown, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

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
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <div className={cn("p-1.5 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                            <DollarSign className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Total Revenue</h3>
                    </div>
                    <div className="flex justify-between items-baseline mb-0.5">
                        <div className="text-2xl font-bold text-neutral-800 dark:text-white">$45,231.89</div>
                        <div className="flex items-center text-blue-600 text-xs dark:text-blue-400">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            +20.1%
                        </div>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">From last month</div>
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
            <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <div className={cn("p-1.5 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                            <Users className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Active Clients</h3>
                    </div>
                    <div className="flex justify-between items-baseline mb-0.5">
                        <div className="text-2xl font-bold text-neutral-800 dark:text-white">235</div>
                        <div className="flex items-center text-blue-600 text-xs dark:text-blue-400">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            +12
                        </div>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">New clients this month</div>
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
            <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <div className={cn("p-1.5 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                            <CreditCard className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Outstanding Invoices</h3>
                    </div>
                    <div className="flex justify-between items-baseline mb-0.5">
                        <div className="text-2xl font-bold text-neutral-800 dark:text-white">$12,234</div>
                        <div className="flex items-center text-red-600 text-xs dark:text-red-400">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            15
                        </div>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Invoices pending</div>
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
            <Card className={cn("border border-neutral-200 shadow-sm", "dark:border-neutral-800 dark:bg-card")}>
                <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                        <div className={cn("p-1.5 rounded-md bg-neutral-100", "dark:bg-neutral-800")}>
                            <TrendingUp className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" />
                        </div>
                        <h3 className="ml-2 text-sm font-medium text-neutral-600 dark:text-neutral-300">Profit Margin</h3>
                    </div>
                    <div className="flex justify-between items-baseline mb-0.5">
                        <div className="text-2xl font-bold text-neutral-800 dark:text-white">32.5%</div>
                        <div className="flex items-center text-blue-600 text-xs dark:text-blue-400">
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                            +2.5%
                        </div>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">From last month</div>
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