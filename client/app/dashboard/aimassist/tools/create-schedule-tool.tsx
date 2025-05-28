"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Loader2, CheckCircle2, User, Calendar, Clock, Building2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ToolInvocation } from "ai"
import { useCreateScheduleMutation } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect, useRef } from "react"

interface ScheduleToolResult {
    careWorker_name: string
    client_name: string
    date: string
    start_time: string
    end_time: string
    type: string
    status: string
}

type ExtendedToolInvocation = ToolInvocation & {
    result?: ScheduleToolResult
}

const formatTime = (time: string): string => {
    try {
        let hours: number, minutes: number

        if (time.toLowerCase().includes("am") || time.toLowerCase().includes("pm")) {
            const period = time.toLowerCase().includes("am") ? "am" : "pm"
            const timePart = time.toLowerCase().replace(period, "").trim()
            const timeValues = timePart.split(":").map(Number)

            const h = timeValues[0]!
            const m = timeValues[1]!

            if (period === "pm" && h !== 12) {
                hours = h + 12
            } else if (period === "am" && h === 12) {
                hours = 0
            } else {
                hours = h
            }
            minutes = m
        } else {
            const timeValues = time.split(":").map(Number)
            hours = timeValues[0]!
            minutes = timeValues[1]!
        }

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    } catch (error) {
        throw new Error("Invalid time format")
    }
}

export function CreateScheduleTool(toolInvocation: ExtendedToolInvocation) {
    const [status, setStatus] = useState<"idle" | "creating" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [createSchedule] = useCreateScheduleMutation()
    const { user } = useAppSelector((state) => state.user)
    const clients = useAppSelector((state) => state.user.clients) || []
    const careWorkers = useAppSelector((state) => state.user.careWorkers) || []
    const { toast } = useToast()

    // Track processed invocations to prevent duplicates
    const processedRef = useRef<Set<string>>(new Set())
    const isProcessingRef = useRef(false)

    useEffect(() => {
        // Only process when we have a result
        if (toolInvocation.state === "result" && toolInvocation.result) {
            const invocationKey = `${toolInvocation.toolCallId}-${JSON.stringify(toolInvocation.result)}`

            // Skip if already processed or currently processing
            if (processedRef.current.has(invocationKey) || isProcessingRef.current) {
                return
            }

            // Mark as processed immediately to prevent duplicates
            processedRef.current.add(invocationKey)
            isProcessingRef.current = true
            setStatus("creating")

            const processSchedule = async () => {
                try {
                    const {
                        careWorker_name,
                        client_name,
                        date,
                        start_time,
                        end_time,
                        type,
                        status: scheduleStatus,
                    } = toolInvocation.result!

                    const client = clients.find((c) => c?.fullName?.toLowerCase() === client_name.toLowerCase())
                    const careWorker = careWorkers.find((c) => c?.fullName?.toLowerCase() === careWorker_name.toLowerCase())

                    if (!client) throw new Error(`Client "${client_name}" not found`)
                    if (!careWorker) throw new Error(`Care worker "${careWorker_name}" not found`)

                    await createSchedule({
                        agencyId: user?.userInfo?.agencyId || "",
                        clientId: client.id,
                        userId: careWorker.id,
                        date: new Date(date),
                        startTime: formatTime(start_time),
                        endTime: formatTime(end_time),
                        status: scheduleStatus as any,
                        type: type as any,
                    }).unwrap()

                    setStatus("success")
                    toast({
                        title: "Success",
                        description: "Schedule created successfully",
                    })
                } catch (error: any) {
                    const message = error?.data?.message || error?.message || "Failed to create schedule"
                    setErrorMessage(message)
                    setStatus("error")
                    toast({
                        title: "Error",
                        description: message,
                        variant: "destructive",
                    })
                } finally {
                    isProcessingRef.current = false
                }
            }

            processSchedule()
        }
    }, [])

    // Reset when new call starts
    useEffect(() => {
        if (toolInvocation.state === "call") {
            setStatus("idle")
            setErrorMessage(null)
            isProcessingRef.current = false
            // Don't clear processedRef to prevent duplicate processing of same data
        }
    }, [toolInvocation.state])

    if (toolInvocation.state === "partial-call" || toolInvocation.state === "call" || status === "creating") {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-[320px]">
                <Card className="bg-background p-4 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 text-neutral-500 animate-spin" />
                        <div>
                            <div className="font-medium">Creating schedule</div>
                            <div className="text-sm text-neutral-500">Processing...</div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }

    if (status === "error") {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-[320px]">
                <Card className="bg-background p-4 rounded-lg shadow-sm border-red-200">
                    <div className="flex items-center gap-2 text-red-600">
                        <Building2 className="h-4 w-4" />
                        <div>
                            <div className="font-medium">Error</div>
                            <div className="text-sm">{errorMessage}</div>
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }

    if (status === "success" && toolInvocation.result) {
        const { careWorker_name, client_name, date, start_time, end_time, status: scheduleStatus } = toolInvocation.result

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-[320px]">
                <Card className="bg-background rounded-lg shadow-sm overflow-hidden">
                    <div className="bg-muted p-3">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <div>
                                <div className="font-medium text-sm">Schedule Created</div>
                                <div className="text-xs text-neutral-500">Successfully added</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 space-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                            <div className="text-sm font-medium">{new Date(date).toLocaleDateString()}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-neutral-500" />
                            <div className="text-xs">
                                {careWorker_name} → {client_name}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-neutral-500" />
                            <div className="text-xs">
                                {start_time} - {end_time}
                            </div>
                        </div>

                        <Badge variant="outline" className="text-xs">
                            {scheduleStatus}
                        </Badge>
                    </div>
                </Card>
            </motion.div>
        )
    }

    return null
}
