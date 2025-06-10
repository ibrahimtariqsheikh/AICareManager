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
                        type: "user",
                        content: "I need to create a new staff member profile.",
                    },
                    {
                        type: "assistant",
                        content: "I'll help you create a new staff member profile. Please provide the following information:\n\n- Full name\n- Role (Care Worker or Office Staff)\n- Email address\n- Phone number (optional)\n- Sub-role (optional)",
                    },
                    {
                        type: "user",
                        content: "The name is Sarah Smith, she's a Care Worker, and her email is sarah.smith@example.com",
                    },
                    {
                        type: "assistant",
                        content: "Great! I'll create Sarah's profile as a Care Worker. Would you like to specify a sub-role? Options include:\n\n- Senior Caregiver\n- Junior Caregiver\n- Trainee Caregiver\n- Live-in Caregiver\n- Part-time Caregiver\n- Specialized Caregiver\n- Nursing Assistant",
                    },
                    {
                        type: "user",
                        content: "Yes, make her a Senior Caregiver.",
                    },
                    {
                        type: "assistant",
                        content: "Creating Sarah's profile as a Senior Caregiver...",
                        attachment: {
                            type: "profile",
                            name: "Sarah_Smith_Profile",
                            status: "generating",
                            statusMessage: "Creating staff profile...",
                            completeMessage: "Staff profile created successfully"
                        },
                    },

                ]
            case 'pay-rates':
                return [
                    {
                        type: "user",
                        content: "I need to set up a new pay rate sheet.",
                    },
                    {
                        type: "assistant",
                        content: "I'll help you create a new pay rate sheet. Please provide the following information:\n\n- Staff type (Care Worker, Office Staff, etc.)\n- Base hourly rate\n- Overtime rate (if applicable)\n- Weekend rate (if applicable)\n- Holiday rate (if applicable)",
                    },
                    {
                        type: "user",
                        content: "For Care Workers, base rate is £12.50, overtime is £15.00, weekend is £14.00, and holiday is £16.00.",
                    },
                    {
                        type: "assistant",
                        content: "Great! I'll create a pay rate sheet for Care Workers with those rates. Would you like to add any additional allowances or bonuses?",
                    },
                    {
                        type: "user",
                        content: "Yes, add a £2.00 per hour travel allowance.",
                    },
                    {
                        type: "assistant",
                        content: "Creating pay rate sheet with all specified rates and allowances...",
                        attachment: {
                            type: "report",
                            name: "Pay_Rate_Sheet",
                            status: "generating",
                            statusMessage: "Creating pay rate sheet...",
                            completeMessage: "Pay rate sheet created successfully"
                        },
                    }
                ]
            case 'care-planning':
                return [
                    {
                        type: "user",
                        content: "I need to create a new care plan.",
                    },
                    {
                        type: "assistant",
                        content: "I'll help you create a new care plan. Please provide the following information:\n\n- Client's full name\n- Primary care needs\n- Medical conditions\n- Allergies\n- Emergency contact details",
                    },
                    {
                        type: "user",
                        content: "Client is John Davis, needs assistance with mobility and medication, has diabetes, no allergies, and emergency contact is his daughter at 07700 900123.",
                    },
                    {
                        type: "assistant",
                        content: "Thank you for the information. Would you like to specify any specific care routines or preferences? For example:\n\n- Preferred meal times\n- Medication schedule\n- Mobility assistance requirements\n- Personal care preferences",
                    },
                    {
                        type: "user",
                        content: "Yes, he needs help with morning and evening routines, takes medication at 8am and 8pm, and prefers assistance with bathing in the morning.",
                    },
                    {
                        type: "assistant",
                        content: "Creating comprehensive care plan for John Davis...",
                        attachment: {
                            type: "care-plan",
                            name: "John_Davis_Care_Plan",
                            status: "generating",
                            statusMessage: "Creating care plan...",
                            completeMessage: "Care plan created successfully"
                        },
                    }
                ]
            case 'medication':
                return [
                    {
                        type: "user",
                        content: "I need to add a new medication schedule.",
                    },
                    {
                        type: "assistant",
                        content: "I'll help you create a medication schedule. Please provide the following information:\n\n- Client's name\n- Medication name\n- Dosage\n- Frequency\n- Special instructions (if any)",
                    },
                    {
                        type: "user",
                        content: "For John Davis, he needs Metformin 500mg twice daily with meals, and Insulin 10 units before breakfast and dinner.",
                    },
                    {
                        type: "assistant",
                        content: "I'll set up the medication schedule. Would you like to add any specific timing preferences or reminders? For example:\n\n- Exact times for each dose\n- Reminder notifications\n- Special storage instructions\n- Administration method",
                    },
                    {
                        type: "user",
                        content: "Yes, Metformin at 8am and 8pm with meals, Insulin 30 minutes before meals, and set reminders 15 minutes before each dose.",
                    },
                    {
                        type: "assistant",
                        content: "Creating medication schedule with specified timings and reminders...",
                        attachment: {
                            type: "medication",
                            name: "John_Davis_Medication_Schedule",
                            status: "generating",
                            statusMessage: "Creating medication schedule...",
                            completeMessage: "Medication schedule created successfully"
                        },
                    }
                ]
            case 'scheduling':
                return [
                    {
                        type: "user",
                        content: "I need to create a new schedule.",
                    },
                    {
                        type: "assistant",
                        content: "I'll help you create a new schedule. Please provide the following information:\n\n- Client's name\n- Required visit times\n- Duration of each visit\n- Type of care needed\n- Preferred care worker (if any)",
                    },
                    {
                        type: "user",
                        content: "For John Davis, we need morning visits at 7am for 1 hour, evening visits at 7pm for 1 hour, and he prefers Sarah Smith as his care worker.",
                    },
                    {
                        type: "assistant",
                        content: "I'll check Sarah's availability and create the schedule. Would you like to set up any recurring patterns? For example:\n\n- Daily visits\n- Weekday only\n- Weekend only\n- Specific days of the week",
                    },
                    {
                        type: "user",
                        content: "Yes, set it up for daily visits, including weekends.",
                    },
                    {
                        type: "assistant",
                        content: "Creating daily schedule with Sarah Smith...",
                        attachment: {
                            type: "schedule",
                            name: "John_Davis_Schedule",
                            status: "generating",
                            statusMessage: "Creating schedule...",
                            completeMessage: "Schedule created successfully"
                        },
                    }
                ]
            case 'invoicing':
                return [
                    {
                        type: "user",
                        content: "I need to generate an invoice.",
                    },
                    {
                        type: "assistant",
                        content: "I'll help you generate an invoice. Please provide the following information:\n\n- Client's name\n- Invoice period\n- Services provided\n- Any additional charges",
                    },
                    {
                        type: "user",
                        content: "For John Davis, invoice period is 1st to 31st March, daily morning and evening visits, and include travel allowance.",
                    },
                    {
                        type: "assistant",
                        content: "I'll calculate the total based on the care plan. Would you like to include any additional details? For example:\n\n- Payment terms\n- Special notes\n- Tax information\n- Payment methods",
                    },
                    {
                        type: "user",
                        content: "Yes, add standard payment terms of 30 days and include bank details for payment.",
                    },
                    {
                        type: "assistant",
                        content: "Generating invoice for John Davis...",
                        attachment: {
                            type: "invoice",
                            name: "John_Davis_March_Invoice",
                            status: "generating",
                            statusMessage: "Generating invoice...",
                            completeMessage: "Invoice generated successfully"
                        },
                    }
                ]
            case 'visit-reporting':
                return [
                    {
                        type: "user",
                        content: "I need to create a visit report.",
                    },
                    {
                        type: "assistant",
                        content: "I'll help you create a visit report. Please provide the following information:\n\n- Client's name\n- Visit date and time\n- Care worker name\n- Services provided\n- Any observations or concerns",
                    },
                    {
                        type: "user",
                        content: "For John Davis, visit was today at 7am with Sarah Smith, provided morning care and medication, and noticed he was a bit tired.",
                    },
                    {
                        type: "assistant",
                        content: "I'll document the visit. Would you like to add any specific details? For example:\n\n- Medication administered\n- Vital signs\n- Client's mood\n- Any incidents or concerns",
                    },
                    {
                        type: "user",
                        content: "Yes, add that Metformin was given at 7:15am, blood sugar was 6.2, and he mentioned not sleeping well last night.",
                    },
                    {
                        type: "assistant",
                        content: "Creating detailed visit report...",
                        attachment: {
                            type: "report",
                            name: "John_Davis_Visit_Report",
                            status: "generating",
                            statusMessage: "Creating visit report...",
                            completeMessage: "Visit report created successfully"
                        },
                    }
                ]
            case 'compliance':
                return [
                    {
                        type: "user",
                        content: "I need to check staff certifications.",
                    },
                    {
                        type: "assistant",
                        content: "I'll help you check staff certifications. Please provide the following information:\n\n- Staff member's name\n- Type of certification\n- Current expiry date\n- Training provider",
                    },
                    {
                        type: "user",
                        content: "For Sarah Smith, she has a Level 3 Diploma in Health and Social Care expiring next month, and her Moving and Handling certificate expired last week.",
                    },
                    {
                        type: "assistant",
                        content: "I'll check the certification status. Would you like to set up renewal reminders? For example:\n\n- Email notifications\n- SMS alerts\n- Calendar reminders\n- Manager notifications",
                    },
                    {
                        type: "user",
                        content: "Yes, set up email notifications for both certificates and add calendar reminders.",
                    },
                    {
                        type: "assistant",
                        content: "Checking certification status and setting up reminders...",
                        attachment: {
                            type: "certification",
                            name: "Sarah_Smith_Certifications",
                            status: "generating",
                            statusMessage: "Checking certifications...",
                            completeMessage: "Certification check complete and reminders set up"
                        },
                    }
                ]
            default:
                return [
                    {
                        type: "user",
                        content: "How can I help you with care management today?",
                    }
                ]
        }
    }

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
                        }

                        // Only advance to next step if message was added successfully
                        if (!messageExists) {
                            const nextTimer = setTimeout(
                                () => {
                                    setCurrentStep(prev => prev + 1)
                                },
                                (currentMessage.type === "assistant" ? 5000 : 3000) / speed
                            )
                            return () => clearTimeout(nextTimer)
                        }
                    } catch (error) {
                        console.error('Error processing message:', error)
                        // Try to recover by moving to next step
                        setCurrentStep(prev => prev + 1)
                    }
                },
                (Math.random() * 1000 + 1500) / speed
            )

            return () => clearTimeout(timer)
        } else {
            // Reset after conversation ends
            const resetTimer = setTimeout(() => {
                setMessages([])
                setCurrentStep(0)
            }, 8000 / speed)

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
                                                                <User className="h-5 w-5 text-red-600" />
                                                            ) : message.attachment.type === "report" ? (
                                                                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                                                            ) : message.attachment.type === "care-plan" ? (
                                                                <FileText className="h-5 w-5 text-green-600" />
                                                            ) : message.attachment.type === "medication" ? (
                                                                <FileText className="h-5 w-5 text-yellow-600" />
                                                            ) : message.attachment.type === "alert" ? (
                                                                <AlertCircle className="h-5 w-5 text-yellow-600" />
                                                            ) : (
                                                                <FileText className="h-5 w-5 text-yellow-600" />
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
                </AnimatePresence>
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