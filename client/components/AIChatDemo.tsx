"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, User, FileText, Calendar, Check, ArrowRight, Download, UserPlus, Clock, AlertCircle, MessageSquare, FileSpreadsheet, Loader2, CheckCircle2, Shield, MoreHorizontal } from "lucide-react"
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
        type: "profile" | "schedule" | "map" | "report" | "alert" | "invoice" | "care-plan" | "medication" | "certification"
        name: string
        status: "generating" | "complete"
        statusMessage?: string
        completeMessage?: string
    }
}

interface ConversationMessage {
    type: "user" | "assistant"
    content: string
    attachment?: {
        type: "profile" | "schedule" | "map" | "report" | "alert" | "invoice" | "care-plan" | "medication" | "certification"
        name: string
        status: "generating" | "complete"
        statusMessage?: string
        completeMessage?: string
    }
}

interface AIChatDemoProps {
    speed?: number
    feature: 'onboarding' | 'pay-rates' | 'care-planning' | 'medication' | 'scheduling' | 'invoicing' | 'visit-reporting' | 'compliance'
}

export function AIChatDemo({ speed = 1, feature = 'onboarding' }: AIChatDemoProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [isTyping, setIsTyping] = useState(false)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const userAvatar = useRef(getRandomPlaceholderImage())
    const [isVisible, setIsVisible] = useState(false)
    const demoRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry && entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            {
                threshold: 0.1 // Trigger when 10% of the element is visible
            }
        )

        if (demoRef.current) {
            observer.observe(demoRef.current)
        }

        return () => {
            if (demoRef.current) {
                observer.unobserve(demoRef.current)
            }
        }
    }, [])

    const getFeatureSpecificConversation = (feature: string): ConversationMessage[] => {
        switch (feature) {
            case 'onboarding':
                return [
                    {
                        type: 'user',
                        content: 'Hey, can you onboard a new staff called Jane Doe, she\'s a care worker starting next week.'
                    },
                    {
                        type: 'assistant',
                        content: 'Sure! I\'ll invite Jane Doe and create her profile as a Care Worker.'
                    },
                    {
                        type: 'assistant',
                        content: '',
                        attachment: {
                            type: 'profile',
                            name: 'Jane_Doe_Profile',
                            status: 'generating',
                            statusMessage: 'Sending invite and creating profile...',
                            completeMessage: 'Staff profile for Jane created successfully.'
                        }
                    }
                ];

            case 'pay-rates':
                return [
                    {
                        type: 'user',
                        content: 'Assign £15/hour weekday and £18/hour weekend rate to Sarah Smith.'
                    },
                    {
                        type: 'assistant',
                        content: 'Got it! Applying weekday rate: £15/hr and weekend: £18/hr to Sarah Smith.'
                    },
                    {
                        type: 'assistant',
                        content: '',
                        attachment: {
                            type: 'report',
                            name: 'Sarah_Smith_Pay_Rate',
                            status: 'generating',
                            statusMessage: 'Configuring rates...',
                            completeMessage: 'Pay rates assigned successfully.'
                        }
                    }
                ];

            case 'care-planning':
                return [
                    {
                        type: 'user',
                        content: 'Draft a care plan from the consultation notes I uploaded for Mr. Alan.'
                    },
                    {
                        type: 'assistant',
                        content: 'Reviewing consultation notes for Mr. Alan and drafting the care plan.'
                    },
                    {
                        type: 'assistant',
                        content: '',
                        attachment: {
                            type: 'care-plan',
                            name: 'Alan_Care_Plan',
                            status: 'generating',
                            statusMessage: 'Drafting care plan...',
                            completeMessage: 'Care plan ready for review and signature.'
                        }
                    }
                ];

            case 'medication':
                return [
                    {
                        type: 'user',
                        content: 'Can you show me the meds and dosages for Mary?'
                    },
                    {
                        type: 'assistant',
                        content: 'Here\'s the current medication list for Mary with dosages.'
                    },
                    {
                        type: 'assistant',
                        content: '',
                        attachment: {
                            type: 'medication',
                            name: 'Mary_Meds',
                            status: 'generating',
                            statusMessage: 'Fetching medication data...',
                            completeMessage: 'Medication list ready with alert summary.'
                        }
                    }
                ];

            case 'scheduling':
                return [
                    {
                        type: 'user',
                        content: 'Schedule James Mon–Wed 8–10am, and Thu–Fri 2–4pm for Client Zoe.'
                    },
                    {
                        type: 'assistant',
                        content: 'Creating schedule for James as requested for Client Zoe.'
                    },
                    {
                        type: 'assistant',
                        content: '',
                        attachment: {
                            type: 'schedule',
                            name: 'Zoe_Schedule',
                            status: 'generating',
                            statusMessage: 'Building rota...',
                            completeMessage: 'Schedule created and sent to James.'
                        }
                    }
                ];

            case 'invoicing':
                return [
                    {
                        type: 'user',
                        content: 'Can you generate this week\'s invoices and payslips?'
                    },
                    {
                        type: 'assistant',
                        content: 'Sure! Calculating visit logs to generate invoices and payslips.'
                    },
                    {
                        type: 'assistant',
                        content: '',
                        attachment: {
                            type: 'report',
                            name: 'Weekly_Financials',
                            status: 'generating',
                            statusMessage: 'Processing visit data...',
                            completeMessage: 'Invoices and payslips are ready.'
                        }
                    }
                ];

            case 'visit-reporting':
                return [
                    {
                        type: 'user',
                        content: 'Just had a visit with Client A. Notes are written — can you format them?'
                    },
                    {
                        type: 'assistant',
                        content: 'Formatting visit notes with professional tone and compliance checks.'
                    },
                    {
                        type: 'assistant',
                        content: '',
                        attachment: {
                            type: 'report',
                            name: 'Client_A_Visit',
                            status: 'generating',
                            statusMessage: 'Formatting notes...',
                            completeMessage: 'Visit log formatted and saved.'
                        }
                    }
                ];

            case 'compliance':
                return [
                    {
                        type: 'user',
                        content: 'Can I get a dashboard showing unresolved alerts and audit status?'
                    },
                    {
                        type: 'assistant',
                        content: 'Generating custom compliance dashboard with unresolved alerts.'
                    },
                    {
                        type: 'assistant',
                        content: '',
                        attachment: {
                            type: 'report',
                            name: 'Compliance_Overview',
                            status: 'generating',
                            statusMessage: 'Building dashboard...',
                            completeMessage: 'Dashboard ready with real-time updates.'
                        }
                    }
                ];

            default:
                return [];
        }
    };

    const conversation = getFeatureSpecificConversation(feature)

    useEffect(() => {
        if (!isVisible) return // Don't start messages if not visible

        if (currentStep < conversation.length) {
            const currentMessage = conversation[currentStep]

            // Ensure we have a valid message
            if (!currentMessage) {
                console.error('Invalid message at step:', currentStep)
                setCurrentStep(prev => prev + 1)
                return
            }

            // Show typing indicator before assistant messages
            if (currentMessage.type === 'assistant') {
                setIsTyping(true)
            }

            const timer = setTimeout(
                () => {
                    try {
                        // Check if this message is already in the messages array
                        const messageExists = messages.some(
                            m => m.content === currentMessage.content &&
                                m.type === currentMessage.type
                        )

                        if (!messageExists) {
                            const newMessage: Message = {
                                id: Date.now(),
                                type: currentMessage.type,
                                content: currentMessage.content,
                                timestamp: new Date(),
                                ...(currentMessage.attachment && { attachment: currentMessage.attachment }),
                            }
                            setMessages(prev => [...prev, newMessage])
                            setIsTyping(false) // Clear typing indicator after message is added

                            // If message has attachment, wait before resetting
                            if (currentMessage.attachment) {
                                const resetTimer = setTimeout(() => {
                                    setMessages([])
                                    setCurrentStep(0)
                                }, 10000 / speed)
                                return () => clearTimeout(resetTimer)
                            }

                            // Only advance to next step if message was added successfully and doesn't have an attachment
                            if (!currentMessage.attachment) {
                                const nextTimer = setTimeout(
                                    () => {
                                        setCurrentStep(prev => prev + 1)
                                    },
                                    (currentMessage.type === "assistant" ? 3000 : 2000) / speed
                                )
                                return () => clearTimeout(nextTimer)
                            }
                        }
                    } catch (error) {
                        console.error('Error processing message:', error)
                        // Try to recover by moving to next step
                        setCurrentStep(prev => prev + 1)
                        setIsTyping(false) // Hide typing indicator on error
                    }
                },
                (Math.random() * 500 + 1000) / speed
            )

            return () => clearTimeout(timer)
        } else {
            // Reset after conversation ends
            const resetTimer = setTimeout(() => {
                setMessages([])
                setCurrentStep(0)
                setIsTyping(false)
            }, 10000 / speed)

            return () => clearTimeout(resetTimer)
        }
    }, [currentStep, speed, conversation, messages, isVisible])

    useEffect(() => {
        // Reset messages and step when feature changes
        setMessages([])
        setCurrentStep(0)
    }, [feature])

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
        <div ref={demoRef} className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-8 py-2 border-b border-gray-200 flex items-center gap-3">
                <Image src="/logos/logo_full.svg" alt="Assistant" width={120} height={120} quality={100} />
            </div>

            <div ref={chatContainerRef} className="h-[380px] overflow-y-auto p-4 space-y-4 bg-white scrollbar-none select-none pointer-events-none">
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
                                            "prose prose-sm max-w-none dark:prose-invert",
                                            message.type === "user" ? "bg-blue-500 text-white px-4 py-3 rounded-md" : message.attachment ? "" : "bg-gray-50 px-4 py-3 rounded-md",
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
                                            <div className="mt-3 bg-gray-50/50 rounded-lg overflow-hidden">
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
                                                                {message.attachment.type === "profile" && "Creating Staff Profile"}
                                                                {message.attachment.type === "report" && message.attachment.name.includes("Pay_Rate") && "Creating Pay Rate Sheet"}
                                                                {message.attachment.type === "report" && message.attachment.name.includes("Payroll") && "Processing Payroll"}
                                                                {message.attachment.type === "care-plan" && message.attachment.name.includes("Care_Plan") && "Creating Care Plan"}
                                                                {message.attachment.type === "care-plan" && message.attachment.name.includes("Medical") && "Adding Medical Information"}
                                                                {message.attachment.type === "medication" && "Creating Medication Schedule"}
                                                                {message.attachment.type === "alert" && "Setting Up Medication Alerts"}
                                                                {message.attachment.type === "schedule" && "Creating Schedule Template"}
                                                                {message.attachment.type === "invoice" && "Generating Invoice"}
                                                                {message.attachment.type === "report" && !message.attachment.name.includes("Pay_Rate") && !message.attachment.name.includes("Payroll") && "Generating Report"}
                                                            </div>
                                                            <div className="text-xs text-neutral-500">
                                                                {message.attachment.status === "generating"
                                                                    ? message.attachment.statusMessage
                                                                    : message.attachment.completeMessage}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.attachment.type === "profile"
                                                            ? "bg-red-100"
                                                            : message.attachment.type === "report"
                                                                ? "bg-blue-100"
                                                                : message.attachment.type === "care-plan"
                                                                    ? "bg-green-100"
                                                                    : message.attachment.type === "medication"
                                                                        ? "bg-yellow-100"
                                                                        : message.attachment.type === "alert"
                                                                            ? "bg-yellow-100"
                                                                            : "bg-yellow-100"
                                                            }`}>
                                                            {message.attachment.type === "profile" ? (
                                                                <User className="h-4 w-4 text-red-600" />
                                                            ) : message.attachment.type === "report" ? (
                                                                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                                                            ) : message.attachment.type === "care-plan" ? (
                                                                <FileText className="h-4 w-4 text-green-600" />
                                                            ) : message.attachment.type === "medication" ? (
                                                                <FileText className="h-4 w-4 text-yellow-600" />
                                                            ) : message.attachment.type === "alert" ? (
                                                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                            ) : (
                                                                <FileText className="h-4 w-4 text-yellow-600" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">{message.attachment.name}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {message.attachment.status === "generating" ? (
                                                                    <>
                                                                        <div className="relative w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                                            <motion.div
                                                                                className={`absolute top-0 left-0 h-full ${message.attachment.type === "profile"
                                                                                    ? "bg-red-500"
                                                                                    : message.attachment.type === "report"
                                                                                        ? "bg-blue-500"
                                                                                        : message.attachment.type === "care-plan"
                                                                                            ? "bg-green-500"
                                                                                            : message.attachment.type === "medication"
                                                                                                ? "bg-yellow-500"
                                                                                                : "bg-yellow-500"
                                                                                    }`}
                                                                                initial={{ width: "0%" }}
                                                                                animate={{ width: "100%" }}
                                                                                transition={{ duration: 3 }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-xs text-neutral-500">
                                                                            {message.attachment.status === "generating"
                                                                                ? "Processing..."
                                                                                : "Complete"}
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                                            <Check className="h-3 w-3 mr-1" />
                                                                            {message.attachment.type === "profile"
                                                                                ? "Staff profile created"
                                                                                : message.attachment.type === "report"
                                                                                    ? "Report complete"
                                                                                    : message.attachment.type === "care-plan"
                                                                                        ? "Medical information added"
                                                                                        : message.attachment.type === "medication"
                                                                                            ? "Medication schedule created"
                                                                                            : message.attachment.type === "alert"
                                                                                                ? "Medication alerts configured"
                                                                                                : message.attachment.type === "schedule"
                                                                                                    ? "Schedule template created"
                                                                                                    : message.attachment.type === "invoice"
                                                                                                        ? "Invoice generated"
                                                                                                        : "Complete"}
                                                                        </Badge>
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
                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-start gap-2 mb-4"
                        >
                            <Avatar className="h-8 w-8 shrink-0 mt-1">
                                <AvatarImage src="/logos/logo.svg" alt="Assistant" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-md">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Type your question here..."
                        className="w-full rounded-lg border border-gray-200 py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-neutral-500 bg-white cursor-not-allowed opacity-50"
                        disabled
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center cursor-not-allowed opacity-50" disabled>
                        <ArrowRight className="h-4 w-4 text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
} 