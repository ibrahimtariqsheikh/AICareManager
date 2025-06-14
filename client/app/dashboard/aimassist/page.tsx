"use client"

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react"
import { useChat } from "@ai-sdk/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowUp, Mic, Plus } from "lucide-react"
import { cn, getRandomPlaceholderImage } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { FileUpload } from "./components/file-upload"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { AppointmentTool } from "./tools/appointment-tool"
import { CreateClientTool } from "./tools/create-client-tool"
import { CreateScheduleTool } from "./tools/create-schedule-tool"
import { SuggestionDialog } from "./components/suggestion-dialog"
import { SendMessageTool } from "./tools/send-message-tool"
import { HolidayRequestTool } from "./tools/holiday-request-tool"
import { RevenueReportTool } from "./tools/revenue-report-tool"
import { OnboardingInviteTool } from "./tools/onboarding-invite-tool"
import { AlertsTool } from "./tools/alerts-tool"
import CreateCareWorkerTool from "./tools/create-care-worker-tool"
import CreateOfficeStaffTool from "./tools/create-office-staff-tool"
import { useAppSelector } from "@/hooks/useAppSelector"
import { RootState } from "@/state/redux"
import Image from "next/image"
import { MedicationTool } from "./tools/medication-tool"

// Add type declarations at the top of the file
interface SpeechRecognitionEvent extends Event {
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionError extends Event {
    error: string;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionError) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}

// Function to process speech transcript and handle special cases like emails
const processSpeechTranscript = (transcript: string): string => {
    let processed = transcript;

    // Handle email addresses - replace common speech patterns
    processed = processed.replace(/at gmail dot com/gi, '@gmail.com');
    processed = processed.replace(/at yahoo dot com/gi, '@yahoo.com');
    processed = processed.replace(/at hotmail dot com/gi, '@hotmail.com');
    processed = processed.replace(/at outlook dot com/gi, '@outlook.com');
    processed = processed.replace(/at icloud dot com/gi, '@icloud.com');

    // More generic email pattern replacements
    processed = processed.replace(/(\w+)\s+at\s+(\w+)\s+dot\s+com/gi, '$1@$2.com');
    processed = processed.replace(/(\w+)\s+at\s+(\w+)\s+dot\s+(\w+)/gi, '$1@$2.$3');

    // Handle common punctuation spoken aloud
    processed = processed.replace(/\bdot\b/gi, '.');
    processed = processed.replace(/\bat\b(?=\s*\w+\s*\.)/gi, '@');

    return processed;
};

// Memoized tool component to prevent unnecessary re-renders
const ToolComponent = React.memo(({ part, messageId, index }: { part: any; messageId: string; index: number }) => {
    // Create a stable key that includes the tool invocation ID if available
    const toolKey = part.toolInvocation?.toolCallId || `${messageId}-tool-${index}`

    switch (part.toolInvocation.toolName) {
        case "createClientProfile":
            return <CreateClientTool key={toolKey} {...part.toolInvocation} />
        case "createCareWorkerProfile":
            return <CreateCareWorkerTool key={toolKey} {...part.toolInvocation} />
        case "createOfficeStaffProfile":
            return <CreateOfficeStaffTool key={toolKey} {...part.toolInvocation} />
        case "createSchedule":
            return <CreateScheduleTool key={toolKey} {...part.toolInvocation} />
        case "displayScheduleAppointment":
            return <AppointmentTool key={toolKey} toolInvocation={part.toolInvocation} />
        case "sendMessage":
            return <SendMessageTool key={toolKey} {...part.toolInvocation} />
        case "holidayRequest":
            return <HolidayRequestTool key={toolKey} {...part.toolInvocation} />
        case "generateRevenueReport":
            return <RevenueReportTool key={toolKey} {...part.toolInvocation} />
        case "sendOnboardingInvite":
            return <OnboardingInviteTool key={toolKey} {...part.toolInvocation} />
        case "viewAlerts":
            return <AlertsTool key={toolKey} {...part.toolInvocation} />
        case "medication":
            return <MedicationTool key={toolKey} {...part.toolInvocation} />
        default:
            return null
    }
})

ToolComponent.displayName = "ToolComponent"

// Memoized text content component
const TextContent = React.memo(({ part, messageRole }: { part: any; messageRole: string }) => {
    return (
        <div
            className={cn(
                "px-4 py-2 rounded-md prose prose-sm max-w-none dark:prose-invert",
                messageRole === "user" ? "bg-blue-500 text-white" : "bg-muted",
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
})

TextContent.displayName = "TextContent"

// Memoized message component
const MessageComponent = React.memo(({ message }: { message: any }) => {
    // Check if this message has any tool invocations
    const messageHasTools = useMemo(() =>
        message.parts?.some((p: any) => p.type === "tool-invocation"),
        [message.parts]
    )

    const user = useAppSelector((state: RootState) => state.user.user.userInfo)

    return (
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
                    {message.parts?.map((part: any, index: number) => {
                        if (part.type === "text") {
                            // Skip rendering text if this message also contains tools
                            if (messageHasTools) {
                                return null
                            }
                            return (
                                <TextContent
                                    key={`${message.id}-text-${index}`}
                                    part={part}
                                    messageRole={message.role}
                                />
                            )
                        } else if (part.type === "tool-invocation") {
                            return (
                                <ToolComponent
                                    key={part.toolInvocation?.toolCallId || `${message.id}-tool-${index}`}
                                    part={part}
                                    messageId={message.id}
                                    index={index}
                                />
                            )
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
                        <AvatarImage src={user?.imageUrl || getRandomPlaceholderImage()} alt="You" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                )}
            </div>
        </motion.div>
    )
})

MessageComponent.displayName = "MessageComponent"

export default function ChatUI() {
    // Configure useChat with proper options to prevent duplicate calls
    const chat = useChat({
        api: "/api/chat", // Explicitly set the API endpoint
        onError: (error) => {
            console.error("Chat error:", error)
        },
        // Add these options to help prevent re-renders
        keepLastMessageOnError: true,
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [recognition, setRecognition] = useState<any>(null)
    const [interimTranscript, setInterimTranscript] = useState("")
    const [finalTranscript, setFinalTranscript] = useState("")
    const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null)
    const [shouldRestart, setShouldRestart] = useState(false)
    const [showFileUpload, setShowFileUpload] = useState(false)

    // Memoize hasMessages to prevent unnecessary re-renders
    const hasMessages = useMemo(() => chat.messages.length > 0, [chat.messages.length])

    // Memoize messages to prevent unnecessary re-renders when reference changes but content is same
    const memoizedMessages = useMemo(() => chat.messages, [chat.messages])

    // Memoize the submit handler to prevent re-creation on every render
    const onSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (chat.input.trim() && chat.status !== 'streaming') {
                chat.handleSubmit(e)
            }
        },
        [chat.input, chat.handleSubmit, chat.status],
    )

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [memoizedMessages.length]) // Only depend on length, not entire messages array

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey && chat.status !== 'streaming' && !isListening) {
                e.preventDefault()
                onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
            }
        },
        [onSubmit, chat.status, isListening],
    )

    // Memoize suggestion handler to prevent re-creation
    const handleSuggestionSelect = useCallback(
        (text: string) => {
            if (chat.status === 'streaming') return

            chat.append({
                role: "user",
                content: text,
                createdAt: new Date(),
                id: `user-${Date.now()}-${Math.random()}`,
            })
        },
        [chat.append, chat.status],
    )

    // Memoize button click handler
    const handleSendClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            if (chat.input.trim() && chat.status !== 'streaming') {
                onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
            }
        },
        [onSubmit, chat.input, chat.status],
    )

    // Function to restart recognition after silence
    const restartRecognition = useCallback(() => {
        if (recognition && isListening && chat.status !== 'streaming') {
            try {
                recognition.stop()
                setShouldRestart(true)
            } catch (error) {
                console.log('Recognition already stopped')
            }
        }
    }, [recognition, isListening, chat.status])

    // Initialize speech recognition with improved continuous listening
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition()
                recognition.continuous = true
                recognition.interimResults = true
                recognition.lang = 'en-US'

                recognition.onstart = () => {
                    console.log('Speech recognition started')
                    setIsConnecting(false)
                    setIsListening(true)
                    setShouldRestart(false)
                }

                recognition.onresult = (event: any) => {
                    let interimTranscript = ''
                    let finalTranscript = ''

                    // Process all results
                    for (let i = 0; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript
                        if (event.results[i].isFinal) {
                            finalTranscript += processSpeechTranscript(transcript)
                        } else {
                            interimTranscript += transcript
                        }
                    }

                    // Update states
                    setInterimTranscript(interimTranscript)

                    if (finalTranscript) {
                        console.log('Final transcript:', finalTranscript)
                        setFinalTranscript(prev => prev + finalTranscript)

                        // Update the input field with processed transcript
                        const currentText = chat.input
                        const newText = currentText ? `${currentText} ${finalTranscript}`.trim() : finalTranscript
                        chat.setInput(newText)

                        // Clear any existing silence timer
                        if (silenceTimer) {
                            clearTimeout(silenceTimer)
                        }

                        // Set a new silence timer to restart recognition after 2 seconds of silence
                        const timer = setTimeout(() => {
                            restartRecognition()
                        }, 2000)
                        setSilenceTimer(timer)
                    }
                }

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error)

                    // Don't stop on network errors or no-speech errors if we want to continue
                    if (event.error === 'network' || event.error === 'no-speech') {
                        setShouldRestart(true)
                    } else {
                        setIsListening(false)
                        setIsConnecting(false)
                        setInterimTranscript("")
                        if (silenceTimer) {
                            clearTimeout(silenceTimer)
                            setSilenceTimer(null)
                        }
                    }
                }

                recognition.onend = () => {
                    console.log('Speech recognition ended')

                    // Clear silence timer
                    if (silenceTimer) {
                        clearTimeout(silenceTimer)
                        setSilenceTimer(null)
                    }

                    // Restart if we should continue listening
                    if (shouldRestart && isListening && chat.status !== 'streaming') {
                        console.log('Restarting recognition...')
                        setTimeout(() => {
                            try {
                                recognition.start()
                            } catch (error) {
                                console.error('Error restarting recognition:', error)
                                setIsListening(false)
                                setIsConnecting(false)
                            }
                        }, 100)
                    } else {
                        setIsListening(false)
                        setIsConnecting(false)
                        setInterimTranscript("")
                        setFinalTranscript("")
                    }
                }

                setRecognition(recognition)
            }
        }
    }, [chat.setInput, silenceTimer, shouldRestart, isListening, chat.status])

    const toggleListening = useCallback(() => {
        if (!recognition) return

        if (isListening) {
            console.log('Stopping speech recognition')
            setShouldRestart(false)
            setIsListening(false)
            recognition.stop()
            if (silenceTimer) {
                clearTimeout(silenceTimer)
                setSilenceTimer(null)
            }
            setInterimTranscript("")
            setFinalTranscript("")
        } else {
            console.log('Starting speech recognition')
            setIsConnecting(true)
            setFinalTranscript("")
            setShouldRestart(true)
            recognition.start()
        }
    }, [recognition, isListening, silenceTimer])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (silenceTimer) {
                clearTimeout(silenceTimer)
            }
            if (recognition && isListening) {
                recognition.stop()
            }
        }
    }, [])

    // Add global keyboard event listener
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === "Enter" &&
                !e.shiftKey &&
                chat.status !== 'streaming' &&
                !isListening &&
                chat.input.trim() &&
                !(e.target instanceof HTMLInputElement) &&
                !(e.target instanceof HTMLTextAreaElement)
            ) {
                e.preventDefault()
                onSubmit(new Event('submit') as any)
            }
        }

        window.addEventListener('keydown', handleGlobalKeyDown)
        return () => window.removeEventListener('keydown', handleGlobalKeyDown)
    }, [onSubmit, chat.status, isListening, chat.input])

    // Display transcript (interim or input)
    const displayTranscript = useMemo(() => {
        if (isListening && interimTranscript) {
            return chat.input + ' ' + interimTranscript
        }
        return chat.input
    }, [isListening, interimTranscript, chat.input])

    const handleFileSelect = useCallback((file: File) => {
        // Handle the selected file here
        console.log('Selected file:', file)
        setShowFileUpload(false)
    }, [])

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] text-foreground">
            <main className="flex-1 overflow-hidden flex flex-col">
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
                    {!hasMessages ? (
                        <div className="flex flex-col items-center justify-center w-full h-full px-4">
                            <div className="relative">
                                <div className="w-full flex flex-col items-center justify-center gap-1 mb-4">
                                    <h1 className="text-2xl font-bold">Ask AIM Assist</h1>
                                    <p className="text-sm text-neutral-600">Automate care, admin, and ops — instantly.
                                    </p>
                                </div>

                                <div className="w-full relative">
                                    <textarea
                                        placeholder="Ask Anything"
                                        className="p-4 pr-16 text-sm text-neutral-900 placeholder:text-neutral-500 w-full rounded-2xl focus:ring-0 resize-none lg:w-[900px] md:w-[500px] sm:w-[400px] xs:w-[300px] border border-neutral-200 shadow-sm "
                                        rows={4}
                                        value={displayTranscript}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => chat.handleInputChange(e)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => handleKeyDown(e)}
                                        disabled={chat.status === 'streaming'}
                                    />
                                    <div className="absolute bottom-5 left-4 flex items-center gap-2">
                                        <Button
                                            className="rounded-full"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setShowFileUpload(true)}
                                            disabled={chat.status === 'streaming'}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-5 right-4 flex items-center gap-2">
                                        <Button
                                            className="rounded-full"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setShowSuggestions(true)}
                                            disabled={chat.status === 'streaming'}
                                        >
                                            <Lightbulb className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            className="rounded-full bg-primary hover:bg-blue-600"
                                            size="icon"
                                            onClick={handleSendClick}
                                            disabled={!chat.input.trim() || chat.status === 'streaming'}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-5xl mx-auto py-6 px-4 space-y-6 w-full pb-32">
                            <AnimatePresence>
                                {memoizedMessages.map((message) => (
                                    <MessageComponent key={message.id} message={message} />
                                ))}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Fixed Textarea at the Bottom - Only shown when messages exist */}
                {hasMessages && (
                    <div className="sticky bottom-0 pt-4 pb-6 px-4">
                        <div className="max-w-5xl mx-auto w-full flex justify-center relative">
                            <div className="w-full flex flex-col gap-2">
                                <div className="relative">
                                    <textarea
                                        placeholder="Ask Anything"
                                        className="p-4 pr-16 text-sm text-neutral-900 placeholder:text-neutral-500 w-full rounded-2xl focus:ring-0 border-neutral-200 border"
                                        rows={4}
                                        value={displayTranscript}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => chat.handleInputChange(e)}
                                        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => handleKeyDown(e)}
                                        disabled={chat.status === 'streaming' || isListening}
                                    />
                                    <div className="absolute bottom-5 left-4 flex items-center gap-2">
                                        <Button
                                            className="rounded-full"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setShowFileUpload(true)}
                                            disabled={chat.status === 'streaming'}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-5 right-4 flex items-center gap-2">
                                        <Button
                                            className="rounded-full"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setShowSuggestions(true)}
                                            disabled={chat.status === 'streaming'}
                                        >
                                            <Lightbulb className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            className="rounded-full bg-primary hover:bg-blue-600"
                                            size="icon"
                                            onClick={handleSendClick}
                                            disabled={!chat.input.trim() || chat.status === 'streaming'}
                                        >
                                            <ArrowUp className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-[10px] text-center mt-2 flex items-center justify-center gap-1 text-neutral-500">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/50"></span>
                            AI Care Assistant may make mistakes. Please verify important information.
                        </div>
                    </div>
                )}
            </main>
            <SuggestionDialog open={showSuggestions} onOpenChange={setShowSuggestions} onSelect={handleSuggestionSelect} />

            {/* File Upload Dialog */}
            <Dialog open={showFileUpload} onOpenChange={setShowFileUpload}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload File</DialogTitle>
                    </DialogHeader>
                    <FileUpload
                        onFileSelect={handleFileSelect}
                        onCancel={() => setShowFileUpload(false)}
                        accept="*/*"
                        maxSize={10}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}