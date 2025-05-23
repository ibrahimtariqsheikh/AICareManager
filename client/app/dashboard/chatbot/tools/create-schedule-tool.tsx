"use client"

import { Card } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { ToolInvocation } from "ai"
import { Loader2 } from "lucide-react"

export function CreateScheduleTool(toolInvocation: ToolInvocation) {
    if (toolInvocation.state === "partial-call" || toolInvocation.state === "call") {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating schedule...
            </div>
        )
    }

    if (toolInvocation.state === "result" && 'result' in toolInvocation) {
        const { careWorker_name, client_name, date, start_time, end_time } = toolInvocation.result
        return (
            <Card className="bg-neutral-100 backdrop-blur-lg p-4 rounded-lg my-2 w-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="schedule-success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-green-600">Schedule Created Successfully</div>
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Care Worker:</span>
                                <span className="font-medium">{careWorker_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Client:</span>
                                <span className="font-medium">{client_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Date:</span>
                                <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Time:</span>
                                <span className="font-medium">
                                    {start_time} - {end_time}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Card>
        )
    }

    return null
}
