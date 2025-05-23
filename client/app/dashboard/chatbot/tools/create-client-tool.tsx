import { Card } from "@/components/ui/card"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { ToolInvocation } from "ai"


export function CreateClientTool(
    toolInvocation: ToolInvocation
) {
    if (toolInvocation.state === "partial-call" || toolInvocation.state === "call") {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating client profile...
            </div>
        )
    }

    if (toolInvocation.state === "result") {
        const { name, address, start_date, care_type, status } = toolInvocation.result
        return (
            <Card className="bg-neutral-100 backdrop-blur-lg p-4 rounded-lg my-2 w-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="client-success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-green-600">Client Profile Created</div>
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <Label className="text-neutral-500">Name:</Label>
                                <span className="font-medium">{name}</span>
                            </div>
                            <div className="flex justify-between">
                                <Label className="text-neutral-500">Address:</Label>
                                <span className="font-medium">{address}</span>
                            </div>
                            <div className="flex justify-between">
                                <Label className="text-neutral-500">Start Date:</Label>
                                <span className="font-medium">{new Date(start_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <Label className="text-neutral-500">Care Type:</Label>
                                <span className="font-medium">{care_type}</span>
                            </div>
                            <div className="flex justify-between">
                                <Label className="text-neutral-500">Status:</Label>
                                <span className="font-medium">{status}</span>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Card>
        )
    }

    return null
}
