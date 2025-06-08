"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, User, FileText, Calendar, Check, ArrowRight, Download, UserPlus, Clock, AlertCircle, MessageSquare, FileSpreadsheet, Loader2, CheckCircle2, Shield } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn, getRandomPlaceholderImage } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
    id: number
    type: "user" | "assistant"
    content: string
    timestamp: Date
    attachment?: {
        type: "pdf" | "schedule" | "map" | "report" | "alert"
        name: string
        status: "generating" | "complete"
    }
}

interface ConversationMessage {
    type: "user" | "assistant"
    content: string
    attachment?: {
        type: "pdf" | "schedule" | "map" | "report" | "alert"
        name: string
        status: "generating" | "complete"
    }
}

interface AIChatDemoProps {
    speed?: number
}

export function AIChatDemo({ speed = 1 }: AIChatDemoProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isTyping, setIsTyping] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const userAvatar = useRef(getRandomPlaceholderImage())

    const conversation: ConversationMessage[] = [
        {
            type: "assistant",
            content: "How can I help you with care management today?",
        },
        {
            type: "user",
            content: "I need to create a new client profile.",
        },
        {
            type: "assistant",
            content: "I'll help you create a new client profile. I'll need some basic information to get started.",
            attachment: {
                type: "pdf",
                name: "Create_Client_Form.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Client profile created successfully. Would you like to create a care plan for this client?",
        },
        {
            type: "user",
            content: "Yes, please create a care plan.",
        },
        {
            type: "assistant",
            content: "I'll create a comprehensive care plan based on the client's needs.",
            attachment: {
                type: "pdf",
                name: "Care_Plan.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Care plan has been created. Would you like to create a schedule for this client?",
        },
        {
            type: "user",
            content: "Yes, create a schedule.",
        },
        {
            type: "assistant",
            content: "I'll create a schedule and find available care workers in the area.",
            attachment: {
                type: "map",
                name: "Available_Care_Workers.png",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "I've found available care workers. Now creating the schedule.",
        },
        {
            type: "assistant",
            content: "Schedule created successfully. Would you like to generate a revenue report?",
            attachment: {
                type: "schedule",
                name: "Weekly_Schedule.pdf",
                status: "complete",
            },
        },
        {
            type: "user",
            content: "Yes, show me the revenue report.",
        },
        {
            type: "assistant",
            content: "Generating a detailed revenue report for this client arrangement.",
            attachment: {
                type: "report",
                name: "Revenue_Report.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Here's the revenue report. Would you like to create a holiday request for any care workers?",
        },
        {
            type: "user",
            content: "Yes, create a holiday request.",
        },
        {
            type: "assistant",
            content: "I'll help you create a holiday request. This will help manage cover arrangements.",
            attachment: {
                type: "pdf",
                name: "Holiday_Request.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Holiday request created. Would you like me to help arrange cover for this period?",
        },
        {
            type: "user",
            content: "Yes, arrange cover.",
        },
        {
            type: "assistant",
            content: "I'll help you assign cover for the holiday period.",
            attachment: {
                type: "pdf",
                name: "Cover_Assignment.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Cover has been arranged. Would you like to send a message to the covering care worker?",
        },
        {
            type: "user",
            content: "Yes, send a message.",
        },
        {
            type: "assistant",
            content: "I'll help you compose and send a message to the care worker.",
            attachment: {
                type: "pdf",
                name: "Message_Draft.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Message sent successfully. Would you like to process the payroll for this period?",
        },
        {
            type: "user",
            content: "Yes, process payroll.",
        },
        {
            type: "assistant",
            content: "I'll help you process the payroll for all care workers.",
            attachment: {
                type: "report",
                name: "Payroll_Report.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Payroll has been processed. Would you like to create an appointment for the client?",
        },
        {
            type: "user",
            content: "Yes, create an appointment.",
        },
        {
            type: "assistant",
            content: "I'll help you schedule an appointment for the client.",
            attachment: {
                type: "pdf",
                name: "Appointment_Schedule.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Appointment scheduled successfully. Would you like to check for any alerts or notifications?",
        },
        {
            type: "user",
            content: "Yes, show me alerts.",
        },
        {
            type: "assistant",
            content: "I'll check for any alerts or notifications in the system.",
            attachment: {
                type: "alert",
                name: "System_Alerts.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Here are the current alerts. Would you like to create a new office staff member?",
        },
        {
            type: "user",
            content: "Yes, create office staff.",
        },
        {
            type: "assistant",
            content: "I'll help you create a new office staff member profile.",
            attachment: {
                type: "pdf",
                name: "Office_Staff_Form.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Office staff member created successfully. Would you like to send an onboarding invite?",
        },
        {
            type: "user",
            content: "Yes, send invite.",
        },
        {
            type: "assistant",
            content: "I'll help you send an onboarding invite to the new staff member.",
            attachment: {
                type: "pdf",
                name: "Onboarding_Invite.pdf",
                status: "generating",
            },
        },
        {
            type: "assistant",
            content: "Onboarding invite sent successfully. Is there anything else you'd like me to help you with?",
        },
    ]

    useEffect(() => {
        if (currentStep < conversation.length) {
            const currentMessage = conversation[currentStep]
            if (currentMessage) {

                if (currentMessage.type === "assistant") {
                    setIsTyping(true)
                }

                const timer = setTimeout(
                    () => {
                        const newMessage: Message = {
                            id: Date.now(),
                            type: currentMessage.type,
                            content: currentMessage.content,
                            timestamp: new Date(),
                            ...(currentMessage.attachment && { attachment: currentMessage.attachment }),
                        }
                        setMessages((prev) => [...prev, newMessage])
                        setIsTyping(false)

                        // Auto advance to next step after a delay
                        const nextTimer = setTimeout(
                            () => {
                                setCurrentStep((prev) => prev + 1)
                            },
                            // Divide the delay by the speed factor to make it faster
                            (currentMessage.type === "assistant" ? 3000 : 2000) / speed,
                        )

                        return () => clearTimeout(nextTimer)
                    },
                    // Divide the typing delay by the speed factor
                    (Math.random() * 500 + 800) / speed,
                )

                return () => clearTimeout(timer)
            }
        } else {
            // Restart the animation after a longer pause
            const resetTimer = setTimeout(() => {
                setMessages([])
                setCurrentStep(0)
            }, 5000 / speed)

            return () => clearTimeout(resetTimer)
        }
    }, [currentStep, speed])

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages])

    // Update attachment status from generating to complete
    useEffect(() => {
        const message = messages.find((m) => m.attachment?.status === "generating")

        if (message) {
            const timer = setTimeout(() => {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === message.id && m.attachment
                            ? {
                                ...m,
                                attachment: {
                                    ...m.attachment,
                                    status: "complete",
                                },
                            }
                            : m,
                    ),
                )
            }, 3000 / speed)

            return () => clearTimeout(timer)
        }
    }, [messages, speed])

    return (
        <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-8 py-2 border-b border-gray-200 flex items-center gap-3">
                <Image src="/logos/logo_full.svg" alt="Assistant" width={120} height={120} quality={100} />

            </div>

            <div ref={chatContainerRef} className="h-[380px] overflow-y-auto p-4 space-y-4 bg-white">
                <AnimatePresence>
                    {messages.map((message) => (
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
                                    message.type === "user" ? "justify-end" : "justify-start",
                                )}
                            >
                                {message.type === "assistant" && (
                                    <Avatar className="h-8 w-8 shrink-0 mt-1">
                                        <AvatarImage src="/logos/logo.svg" alt="Assistant" />
                                        <AvatarFallback>A</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-[75%]", message.type === "user" ? "order-1" : "order-1")}>
                                    <div
                                        className={cn(
                                            "px-4 py-3 rounded-md prose prose-sm max-w-none dark:prose-invert",
                                            message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-50",
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
                                            {message.content}
                                        </ReactMarkdown>

                                        {message.attachment && (
                                            <div className="mt-3 bg-white rounded-lg shadow-sm overflow-hidden">
                                                <div className="p-3 bg-muted">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center">
                                                            {message.attachment.status === "generating" ? (
                                                                <Loader2 className="h-4 w-4 text-neutral-500 animate-spin" />
                                                            ) : (
                                                                <CheckCircle2 className="h-4 w-4 text-black" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-black text-sm">
                                                                {message.attachment.type === "pdf"
                                                                    ? "Document Processing"
                                                                    : message.attachment.type === "map"
                                                                        ? "Finding Available Carers"
                                                                        : message.attachment.type === "report"
                                                                            ? "Generating Report"
                                                                            : "Processing Request"}
                                                            </div>
                                                            <div className="text-xs text-neutral-500">
                                                                {message.attachment.status === "generating"
                                                                    ? "Please wait..."
                                                                    : "Successfully completed"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.attachment.type === "pdf"
                                                            ? "bg-red-100"
                                                            : message.attachment.type === "map"
                                                                ? "bg-green-100"
                                                                : message.attachment.type === "report"
                                                                    ? "bg-blue-100"
                                                                    : "bg-yellow-100"
                                                            }`}>
                                                            {message.attachment.type === "pdf" ? (
                                                                <FileText className="h-5 w-5 text-red-600" />
                                                            ) : message.attachment.type === "map" ? (
                                                                <Calendar className="h-5 w-5 text-green-600" />
                                                            ) : message.attachment.type === "report" ? (
                                                                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                                                            ) : (
                                                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{message.attachment.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {message.attachment.status === "generating" ? (
                                                                    <>
                                                                        <div className="relative w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                                            <motion.div
                                                                                className={`absolute top-0 left-0 h-full ${message.attachment.type === "pdf"
                                                                                    ? "bg-red-500"
                                                                                    : message.attachment.type === "map"
                                                                                        ? "bg-green-500"
                                                                                        : message.attachment.type === "report"
                                                                                            ? "bg-blue-500"
                                                                                            : "bg-yellow-500"
                                                                                    }`}
                                                                                initial={{ width: "0%" }}
                                                                                animate={{ width: "100%" }}
                                                                                transition={{ duration: 3 }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-xs text-neutral-500">
                                                                            {message.attachment.type === "pdf"
                                                                                ? "Generating document..."
                                                                                : message.attachment.type === "map"
                                                                                    ? "Finding available carers..."
                                                                                    : message.attachment.type === "report"
                                                                                        ? "Generating report..."
                                                                                        : "Processing..."}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                                            <Check className="h-3 w-3 mr-1" />
                                                                            {message.attachment.type === "pdf"
                                                                                ? "Document ready"
                                                                                : message.attachment.type === "map"
                                                                                    ? "Map generated"
                                                                                    : message.attachment.type === "report"
                                                                                        ? "Report complete"
                                                                                        : "Complete"}
                                                                        </Badge>
                                                                        <button className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                                                                            <Download className="h-3 w-3" />
                                                                            {message.attachment.type === "pdf"
                                                                                ? "Download PDF"
                                                                                : message.attachment.type === "map"
                                                                                    ? "View Details"
                                                                                    : message.attachment.type === "report"
                                                                                        ? "Download Report"
                                                                                        : "View Details"}
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Map visualization for completed map attachments */}
                                                    {message.attachment.type === "map" && message.attachment.status === "complete" && (
                                                        <div className="mt-3 bg-white rounded-lg p-3 border border-gray-200">
                                                            <div className="relative h-32 bg-blue-50 rounded-lg overflow-hidden">
                                                                {/* Map background with grid */}
                                                                <div className="absolute inset-0 bg-blue-100 opacity-30"></div>
                                                                <div className="absolute inset-0" style={{
                                                                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                                                                                     linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                                                                    backgroundSize: '20px 20px'
                                                                }}></div>

                                                                {/* Main roads */}
                                                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-400"></div>
                                                                <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400"></div>
                                                                <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-300"></div>
                                                                <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-300"></div>
                                                                <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-gray-300"></div>
                                                                <div className="absolute top-0 bottom-0 right-1/3 w-0.5 bg-gray-300"></div>

                                                                {/* Client location (center) */}
                                                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                                                                    <div className="absolute top-0 left-0 right-0 bottom-0 animate-ping bg-red-400 rounded-full opacity-75"></div>
                                                                </div>

                                                                {/* Carer locations with distance rings */}
                                                                <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                                                                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                                                                    <div className="absolute -inset-1 border-2 border-green-200 rounded-full"></div>
                                                                </div>
                                                                <div className="absolute top-2/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                                                                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                                                                    <div className="absolute -inset-1 border-2 border-green-200 rounded-full"></div>
                                                                </div>
                                                                <div className="absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                                                                    <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                                                                    <div className="absolute -inset-1 border-2 border-green-200 rounded-full"></div>
                                                                </div>

                                                                {/* Distance indicators */}
                                                                <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                                                                    2.1 miles
                                                                </div>
                                                                <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                                                                    3.4 miles
                                                                </div>
                                                                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                                                                    4.2 miles
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                                        <span>Client</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                        <span>Carers</span>
                                                                    </div>
                                                                </div>
                                                                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">View full map</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {message.type === "user" && (
                                    <Avatar className="h-8 w-8 shrink-0 mt-1 order-2">
                                        <AvatarImage src={userAvatar.current} alt="You" />
                                        <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-gray-500 text-sm"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="/logos/logo.svg" alt="Assistant" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-md">
                            <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </motion.div>
                )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type your question here..."
                        className="w-full rounded-lg border border-gray-200 py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-white"
                        disabled
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
} 