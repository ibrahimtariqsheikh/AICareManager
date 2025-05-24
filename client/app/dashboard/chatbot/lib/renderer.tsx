import { Input } from "@/components/ui/input"
import { useCreateScheduleMutation } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { CustomSelect } from "@/components/ui/custom-select"
import { useEffect, useState } from "react"
import { ToolInvocation, ToolState } from "../chat-types"
import { useChat } from "@ai-sdk/react"
import { AppointmentTool } from "../tools/appointment-tool"
import { CreateClientTool } from "../tools/create-client-tool"
import { CreateScheduleTool } from "../tools/create-schedule-tool"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const mapToolState = (state: string): ToolState => {
    switch (state) {
        case "partial-call":
        case "call":
            return "pending"
        case "executing":
            return "loading"
        case "result":
            return "result"
        case "error":
            return "error"
        default:
            return "pending"
    }
}



function ToolRenderer({ toolInvocation }: { toolInvocation: ToolInvocation }) {
    const { name, result, state } = toolInvocation
    const { handleSubmit, setMessages } = useChat()
    const [createSchedule] = useCreateScheduleMutation()
    const { user, clients, careWorkers } = useAppSelector((state) => state.user)
    const [toolState, setToolState] = useState<ToolState>(state)
    const [toolResult, setToolResult] = useState<any>(result)

    useEffect(() => {
        setToolState(state)
        setToolResult(result)
    }, [state, result])

    const getClientIdFromName = (name: string) => {
        const client = clients.find((client) => client.fullName === name)
        return client?.id || ""
    }

    const getCareWorkerIdFromName = (name: string) => {
        const careWorker = careWorkers.find((user) => user.fullName === name)
        return careWorker?.id || ""
    }

    const [formData, setFormData] = useState({
        careWorker_name: "",
        client_name: "",
        start_time: "",
        end_time: "",
        date: "",
    })

    const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const isFormValid = Object.values(formData).every((value) => value.trim() !== "")

    const handleCreateSchedule = async (data: {
        careWorker_name: string
        client_name: string
        start_time: string
        end_time: string
        date: string
    }) => {
        // Validate form data before proceeding
        const requiredFields = {
            date: data.date,
            start_time: data.start_time,
            end_time: data.end_time,
            client_name: data.client_name,
        }

        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key)

        if (missingFields.length > 0) {
            console.error("Missing required fields:", missingFields.join(", "))
            toolInvocation.state = "error"
            toolInvocation.result = {
                error: `Missing required fields: ${missingFields.join(", ")}`,
            }
            return
        }

        const toolData = {
            careWorker_name: data.careWorker_name,
            client_name: data.client_name,
            start_time: data.start_time,
            end_time: data.end_time,
            date: data.date,
        }
        console.log("Creating schedule:", toolData)

        // Update the tool invocation state
        toolInvocation.state = "loading"
        toolInvocation.result = toolData
        toolInvocation.name = "createSchedule"
        toolInvocation.toolName = "createSchedule"
        toolInvocation.toolCallId = `schedule-${Date.now()}`

        console.log("Tool invocation updated:", toolInvocation)

        const event = new Event("submit") as any
        event.preventDefault = () => { }
        handleSubmit(event)

        // Reset form
        setFormData({
            careWorker_name: "",
            client_name: "",
            start_time: "",
            end_time: "",
            date: "",
        })
    }

    useEffect(() => {
        if (state === "loading") {
            const createScheduleAsync = async () => {
                try {
                    const clientId = getClientIdFromName(toolInvocation.result.client_name)
                    if (!clientId) {
                        console.error("Client not found:", toolInvocation.result.client_name)
                        toolInvocation.state = "error"
                        toolInvocation.result = {
                            error: `Client not found: ${toolInvocation.result.client_name}`,
                        }
                        return
                    }

                    const careWorkerId = getCareWorkerIdFromName(toolInvocation.result.careWorker_name)
                    if (!careWorkerId) {
                        console.error("Care worker not found:", toolInvocation.result.careWorker_name)
                        toolInvocation.state = "error"
                        toolInvocation.result = {
                            error: `Care worker not found: ${toolInvocation.result.careWorker_name}`,
                        }
                        return
                    }

                    if (!user?.userInfo?.agencyId || !user?.userInfo?.id) {
                        console.error("Missing user or agency information")
                        toolInvocation.state = "error"
                        toolInvocation.result = {
                            error: "Missing user or agency information",
                        }
                        return
                    }

                    const response = await createSchedule({
                        agencyId: user.userInfo.agencyId,
                        clientId: clientId,
                        userId: careWorkerId,
                        date: new Date(toolInvocation.result.date),
                        startTime: toolInvocation.result.start_time,
                        endTime: toolInvocation.result.end_time,
                        status: "PENDING",
                        type: "APPOINTMENT",
                        notes: "Created by AIM Assist",
                    })

                    if ("error" in response) {
                        console.error("Schedule creation failed:", response.error)
                        toolInvocation.state = "error"
                        toolInvocation.result = {
                            error: "Schedule creation failed",
                        }
                        return
                    }

                    if (response.data) {
                        setMessages([
                            {
                                id: `schedule-success-${Date.now()}`,
                                role: "assistant",
                                content: "Schedule created successfully!",
                                createdAt: new Date(),
                                parts: [
                                    {
                                        type: "text",
                                        text: "Schedule created successfully!",
                                    },
                                ],
                            },
                        ])

                        toolInvocation.state = "result"
                        toolInvocation.result = {
                            success: true,
                            message: "Schedule created successfully",
                            data: response.data,
                        }
                    }
                } catch (error) {
                    console.error("Error creating schedule:", error)
                    toolInvocation.state = "error"
                    toolInvocation.result = {
                        error: "An unexpected error occurred while creating the schedule",
                    }
                }
            }
            createScheduleAsync()
        }
    }, [state, user, clients, createSchedule, toolInvocation, setMessages])

    if (toolState === "loading") {
        return (
            <div className="bg-neutral-100 backdrop-blur-lg p-4 rounded-lg my-2 w-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={toolState}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-neutral-400 flex items-center gap-2 justify-between"
                    >
                        <div className="font-medium text-xs">
                            {toolState === "loading" ? "Creating Schedule..." : "Checking Availability..."}
                        </div>
                        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                    </motion.div>
                </AnimatePresence>
            </div>
        )
    }

    if (toolState === "error") {
        return <div>Error executing tool</div>
    }

    if (toolState === "result" && toolResult) {
        switch (name) {
            case "displayScheduleAppointment":
                return <AppointmentTool {...toolResult} />
            case "createClientProfile":
                if (toolResult.success) {
                    return <CreateClientTool {...toolResult} />
                }
                break
            case "createSchedule":
                if (toolResult.success) {
                    return <CreateScheduleTool {...toolResult} />
                }
                return (
                    <div className="bg-neutral-100 backdrop-blur-lg p-4 rounded-lg my-2 w-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="create-schedule"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-sm text-neutral-400 flex items-center gap-2 justify-between"
                            >
                                <div className="font-medium text-xs">Creating Schedule...</div>
                                <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                            </motion.div>
                        </AnimatePresence>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                handleCreateSchedule(formData)
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 gap-2">
                                <CustomSelect
                                    name="careWorker_name"
                                    value={formData.careWorker_name}
                                    onChange={(value: string) => handleSelectChange("careWorker_name", value)}
                                    options={careWorkers.map((worker) => ({
                                        value: worker.fullName,
                                        label: worker.fullName,
                                    }))}
                                    placeholder="Select Care Worker"
                                    className="placeholder:text-neutral-400 placeholder:text-sm mt-2"
                                />

                                <CustomSelect
                                    name="client_name"
                                    value={formData.client_name}
                                    onChange={(value: string) => handleSelectChange("client_name", value)}
                                    options={clients.map((client) => ({
                                        value: client.fullName,
                                        label: client.fullName,
                                    }))}
                                    placeholder="Select Client"
                                    className="placeholder:text-neutral-400 placeholder:text-sm mt-2"
                                />

                                <Input
                                    name="date"
                                    placeholder="Date"
                                    type="date"
                                    className="placeholder:text-neutral-400 placeholder:text-sm mt-2"
                                    required
                                    value={formData.date}
                                    onChange={handleFormInputChange}
                                />
                                <Input
                                    name="start_time"
                                    placeholder="Start Time"
                                    type="time"
                                    className="placeholder:text-neutral-400 placeholder:text-sm mt-2"
                                    required
                                    value={formData.start_time}
                                    onChange={handleFormInputChange}
                                />
                                <Input
                                    name="end_time"
                                    placeholder="End Time"
                                    type="time"
                                    className="placeholder:text-neutral-400 placeholder:text-sm mt-2"
                                    required
                                    value={formData.end_time}
                                    onChange={handleFormInputChange}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={!isFormValid}>
                                Create Schedule
                            </Button>
                        </form>
                    </div>
                )
            default:
                return <pre>{JSON.stringify(toolResult, null, 2)}</pre>
        }
    }

    return null
}

