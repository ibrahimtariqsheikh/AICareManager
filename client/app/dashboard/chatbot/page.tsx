"use client"

import type React from "react"

import { useChat } from "@ai-sdk/react"
import { useRef, useEffect, useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Lightbulb, ImageIcon, ArrowUp, Loader2 } from "lucide-react"
import { cn, getRandomPlaceholderImage } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Input } from "@/components/ui/input"
import { useCreateScheduleMutation } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { CustomSelect } from "@/components/ui/custom-select"
import { ToolInvocation } from "./chat-types"
import { AppointmentTool } from "./tools/appointment-tool"
import { CreateClientTool } from "./tools/create-client-tool"
import { CreateScheduleTool } from "./tools/create-schedule-tool"
import { ToolState } from "./chat-types"
import { SuggestionBar } from "./suggestion-bar"
import { PayrollTool } from "./tools/payroll-tool"
import { AssignCoverTool } from "./tools/assign-cover-tool"
import { SendMessageTool } from "./tools/send-message-tool"
import { HolidayRequestTool } from "./tools/holiday-request-tool"
import { RevenueReportTool } from "./tools/revenue-report-tool"
import { OnboardingInviteTool } from "./tools/onboarding-invite-tool"
import { CarePlanTool } from "./tools/care-plan-tool"
import { AlertsTool } from "./tools/alerts-tool"


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

export default function ChatUI() {
    const chat = useChat()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [hasMessages, setHasMessages] = useState(false)

    useEffect(() => {
        setHasMessages(chat.messages.length > 0)
    }, [chat.messages])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (chat.input.trim()) {
            chat.handleSubmit(e)
        }
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [chat.messages])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
        }
    }

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

    const shouldShowMessage = (message: any) => {
        // If the message has tool invocations, only show those
        if (message.parts.some((part: any) => part.type === "tool-invocation")) {
            return true
        }
        // If it's a user message, always show it
        if (message.role === "user") {
            return true
        }
        // For assistant messages, only show if they don't contain tool-related text
        if (message.role === "assistant") {
            const text = message.parts.find((part: any) => part.type === "text")?.text || ""
            return (
                !text.includes("createSchedule") &&
                !text.includes("Creating Schedule") &&
                !text.includes("Select Care Worker") &&
                !text.includes("Select Client")
            )
        }
        return true
    }

    const handleSuggestionSelect = (text: string) => {
        // Directly append the message
        chat.append({
            role: "user",
            content: text,
            createdAt: new Date(),
            id: `user-${Date.now()}`,
            parts: [
                {
                    type: "text",
                    text: text,
                },
            ],
        })
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] text-foreground">
            {/* Main content area */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {/* Messages area */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
                    {!hasMessages ? (
                        <div className="flex flex-col items-center justify-center w-full h-full px-4">
                            <div className="flex flex-col gap-4 items-center justify-center">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src="/logos/logo.svg" alt="AIM Assist" />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <div className="text-xl font-bold">Ask AIM Assist</div>
                                    <div className="text-sm text-neutral-500">Automate your healthcare operations with AIM Assist</div>
                                </div>
                                <div className="w-full relative">
                                    <SuggestionBar onSelect={handleSuggestionSelect} />
                                    <textarea
                                        placeholder="Ask Anything..."
                                        className="lg:w-[900px] md:w-[500px] sm:w-[400px] xs:w-[300px] p-4 text-sm text-neutral-900 placeholder:text-neutral-500 w-full rounded-xl border-0 focus:ring-0 shadow-sm"
                                        rows={5}
                                        value={chat.input}
                                        onChange={(e) => chat.handleInputChange(e)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 -translate-y-1/2">
                                        <div className="flex items-center justify-between px-4 w-full">
                                            <div className="flex items-center gap-2">
                                                <Button className="rounded-lg" size="icon" variant="outline">
                                                    <Lightbulb className="h-4 w-4" />
                                                </Button>
                                                <Button className="rounded-lg" size="icon" variant="outline">
                                                    <ImageIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Button
                                                className="rounded-lg bg-primary hover:bg-primary/80"
                                                size="icon"
                                                onClick={(e) => onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
                                                disabled={!chat.input.trim()}
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 w-full pb-32">
                            <AnimatePresence>
                                {chat.messages.filter(shouldShowMessage).map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="message"
                                    >
                                        <div
                                            className={cn(
                                                "flex items-start gap-2 mb-4",
                                                message.role === "user" ? "justify-end" : "justify-start",
                                            )}
                                        >
                                            {message.role === "assistant" && (
                                                <Avatar className="h-8 w-8 shrink-0 mt-1">
                                                    <AvatarImage src="/logos/logo.svg" alt="Assistant" />
                                                    <AvatarFallback>A</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={cn("max-w-[75%]", message.role === "user" ? "order-1" : "order-1")}>
                                                {message.parts.map((part, index) => {
                                                    if (part.type === "text") {
                                                        return (
                                                            <div
                                                                key={`${message.id}-text-${index}`}
                                                                className={cn(
                                                                    "px-4 py-2 rounded-md prose prose-sm max-w-none dark:prose-invert",
                                                                    message.role === "user" ? "bg-blue-500 text-white" : "bg-muted",
                                                                )}
                                                            >
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkGfm]}
                                                                    components={{
                                                                        code({ node, inline, className, children, ...props }: any) {
                                                                            const match = /language-(\w+)/.exec(className || "")
                                                                            return !inline && match ? (
                                                                                <SyntaxHighlighter
                                                                                    style={vscDarkPlus as any}
                                                                                    language={match[1]}
                                                                                    PreTag="div"
                                                                                    {...props}
                                                                                >
                                                                                    {String(children).replace(/\n$/, "")}
                                                                                </SyntaxHighlighter>
                                                                            ) : (
                                                                                <code className={className} {...props}>
                                                                                    {children}
                                                                                </code>
                                                                            )
                                                                        },
                                                                    }}
                                                                >
                                                                    {part.text}
                                                                </ReactMarkdown>
                                                            </div>
                                                        )
                                                    } else if (part.type === "tool-invocation") {

                                                        switch (part.toolInvocation.toolName) {
                                                            case "createClientProfile":
                                                                return <CreateClientTool {...part.toolInvocation} />
                                                            case "createSchedule":
                                                                return <CreateScheduleTool {...part.toolInvocation} />
                                                            case "displayScheduleAppointment":
                                                                return <AppointmentTool {...part.toolInvocation} />
                                                            case "payroll":
                                                                return <PayrollTool {...part.toolInvocation} />
                                                            case "assignCover":
                                                                return <AssignCoverTool {...part.toolInvocation} onSubmit={() => { }} />
                                                            case "sendMessage":
                                                                return <SendMessageTool {...part.toolInvocation} onSubmit={() => { }} />
                                                            case "holidayRequest":
                                                                return <HolidayRequestTool {...part.toolInvocation} onSubmit={() => { }} />
                                                            case "revenueReport":
                                                                return <RevenueReportTool {...part.toolInvocation} onSubmit={() => { }} />
                                                            case "onboardingInvite":
                                                                return <OnboardingInviteTool {...part.toolInvocation} onSubmit={() => { }} />
                                                            case "carePlan":
                                                                return <CarePlanTool {...part.toolInvocation} onSubmit={() => { }} />
                                                            case "alerts":
                                                                return <AlertsTool {...part.toolInvocation} onSubmit={() => { }} />
                                                            default:
                                                                return null
                                                        }
                                                    }
                                                    return null
                                                })}
                                                <div
                                                    className={cn(
                                                        "flex text-xs mt-1 text-muted-foreground",
                                                        message.role === "user" ? "justify-end" : "justify-start",
                                                    )}
                                                >
                                                    <span>
                                                        {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            {message.role === "user" && (
                                                <Avatar className="h-8 w-8 shrink-0 mt-1 order-2">
                                                    <AvatarImage src={getRandomPlaceholderImage() || "/placeholder.svg"} alt="You" />
                                                    <AvatarFallback>U</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Fixed Textarea at the Bottom - Only shown when messages exist */}
                {hasMessages && (
                    <div className="sticky bottom-0 bg-background pt-4 pb-6 px-4">
                        <div className="max-w-5xl mx-auto w-full flex justify-center relative">
                            <div className="w-full">
                                <SuggestionBar onSelect={handleSuggestionSelect} />
                                <textarea
                                    placeholder="Ask Anything..."
                                    className="p-4 text-sm text-neutral-900 placeholder:text-neutral-500 w-full rounded-xl border-0 focus:ring-0 shadow-sm"
                                    rows={3}
                                    value={chat.input}
                                    onChange={(e) => chat.handleInputChange(e)}
                                    onKeyDown={handleKeyDown}
                                />
                                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-4 w-full">
                                    <div className="flex items-center gap-2">
                                        <Button className="rounded-lg" size="icon" variant="outline">
                                            <Lightbulb className="h-4 w-4" />
                                        </Button>
                                        <Button className="rounded-lg" size="icon" variant="outline">
                                            <ImageIcon className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        className="rounded-lg bg-black hover:bg-black/80"
                                        size="icon"
                                        onClick={(e) => onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)}
                                        disabled={!chat.input.trim()}
                                    >
                                        <ArrowUp className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-center mt-2 flex items-center justify-center gap-1 text-muted-foreground">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/30 animate-pulse"></span>
                            AI Care Assistant may make mistakes. Please verify important information.
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
