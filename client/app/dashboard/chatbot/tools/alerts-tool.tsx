"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2, Bell, Calendar } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { ToolInvocation } from "ai"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface AlertsToolResult {
    month: string
    year: string
    status: string
}

type ExtendedToolInvocation = ToolInvocation & {
    result?: AlertsToolResult
}

export function AlertsTool(toolInvocation: ExtendedToolInvocation) {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const fetchAlerts = async (data: { month: string; year: string }) => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            toast({
                title: "Success",
                description: "Alerts fetched successfully",
                variant: "default",
            })

            return { ...data, status: 'loaded' }
        } catch (error: any) {
            console.error("Error fetching alerts:", error)
            const errorMessage = error?.message || "Failed to fetch alerts. Please try again."
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            })
            throw new Error(errorMessage)
        }
    }

    useEffect(() => {
        let isMounted = true;

        if (toolInvocation.state === "result" && !isLoading) {
            const { month, year } = toolInvocation.result;
            setIsLoading(true);

            fetchAlerts({
                month,
                year
            }).catch((err) => {
                if (isMounted) {
                    setError(err.message || "Failed to fetch alerts");
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, [toolInvocation.state, toolInvocation.result]);

    if (toolInvocation.state === "partial-call" || toolInvocation.state === "call") {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-[320px]">
                <Card className="bg-background p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                <Loader2 className="h-4 w-4 text-neutral-500 animate-spin" />
                            </div>
                        </div>
                        <div>
                            <div className="font-medium">Fetching alerts</div>
                            <div className="text-sm text-neutral-500">Loading data...</div>
                        </div>
                    </div>

                    {/* Loading skeleton */}
                    <div className="mt-3 space-y-2">
                        {[1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="flex justify-between items-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="h-2 bg-muted rounded w-16"></div>
                                <div className="h-2 bg-muted rounded w-24"></div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        )
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-[320px]"
            >
                <Card className="bg-background p-4 rounded-lg shadow-sm border-red-200">
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <Bell className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="font-medium">Error</div>
                            <div className="text-sm text-red-500">{error}</div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }

    if (toolInvocation.state === "result") {
        const { month, year, status } = toolInvocation.result

        return (
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-[320px]"
            >
                <Card className="bg-background rounded-lg shadow-sm overflow-hidden">
                    {/* Header */}
                    <div className="bg-muted p-3">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="h-4 w-4 text-black" />
                            </div>
                            <div>
                                <div className="font-medium text-black text-sm">Alerts Loaded</div>
                                <div className="text-xs text-neutral-500">Successfully retrieved</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex items-center gap-2 pb-2 border-b"
                        >
                            <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
                                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                            </div>
                            <div>
                                <div className="text-sm font-medium">{month}</div>
                                <div className="text-[10px] text-neutral-700">Month</div>
                            </div>
                        </motion.div>

                        <div className="space-y-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-2"
                            >
                                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                                <div className="flex-1">
                                    <Label className="text-xs text-neutral-500 shadow-none">Year</Label>
                                    <div className="text-xs font-medium">{year}</div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-2"
                            >
                                <Badge variant="outline" className="bg-green-100 text-green-700">
                                    {status}
                                </Badge>
                            </motion.div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }

    return null
} 