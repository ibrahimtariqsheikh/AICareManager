"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AutoResizeTextarea } from "@/components/ui/autoresize-textarea"
import { cn } from "@/lib/utils"
import {
    Plus,
    Lightbulb,
    ImageIcon,
    Send,
    Sparkles,
    Database,
    Brain,
    FileText,
    Clipboard,
    Calendar,
    Syringe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { FileUpload } from "@/app/dashboard/chatbot/components/file-upload"
import { SearchDialog } from "@/app/dashboard/chatbot/components/search-dialog"
import { SuggestionDialog } from "@/app/dashboard/chatbot/components/suggestion-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { type Message, useChat } from "@/app/dashboard/chatbot/chatbot-client"

// Define the thinking stages for the AI response
type ThinkingStage = {
    id: string
    text: string
    icon: React.ReactNode
    duration: number
}

export default function ChatbotPage() {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [hasMessages, setHasMessages] = useState(false)


    const [thinkingStage, setThinkingStage] = useState<number>(-1)

    // Dialog states
    const [imageUploadOpen, setImageUploadOpen] = useState(false)
    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const [suggestionDialogOpen, setSuggestionDialogOpen] = useState(false)

    // Define the thinking stages with useMemo to avoid recreation on every render
    const thinkingStages = useMemo<ThinkingStage[]>(() => [
        {
            id: "thinking",
            text: "Thinking...",
            icon: <Brain className="h-4 w-4" />,
            duration: 1500,
        },
        {
            id: "analyzing",
            text: "Analyzing data...",
            icon: <Database className="h-4 w-4" />,
            duration: 2000,
        },
        {
            id: "creating",
            text: "Creating response...",
            icon: <Sparkles className="h-4 w-4" />,
            duration: 1500,
        },
    ], [])

    // Use our custom hook with error handling
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        onError: (error) => {
            toast.error(error)
        },
    })

    // Mock the thinking stages when loading
    useEffect(() => {
        if (isLoading) {
            setThinkingStage(0)

            // Progress through thinking stages
            const timers: NodeJS.Timeout[] = []

            let cumulativeTime = 0
            thinkingStages.forEach((stage, index) => {
                if (index > 0) {
                    const timer = setTimeout(() => {
                        setThinkingStage(index)
                    }, cumulativeTime)
                    timers.push(timer)
                }
                cumulativeTime += stage.duration
            })

            return () => {
                timers.forEach((timer) => clearTimeout(timer))
            }
        } else {
            setThinkingStage(-1)
            return undefined
        }
    }, [isLoading, thinkingStages])

    useEffect(() => {
        setHasMessages(messages.length > 0)
    }, [messages])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (input.trim()) {
            handleSubmit(e)
        }
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isLoading, thinkingStage])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
        }
    }

    const handleLightbulbClick = () => {
        setSuggestionDialogOpen(true)
    }

    const handleImageClick = () => {
        setImageUploadOpen(true)
    }

    const handleQuickAction = (action: string) => {
        handleInputChange({ target: { value: action } } as React.ChangeEvent<HTMLTextAreaElement>)
    }

    const handleFileSelect = (file: File) => {
        const fileType = file.type.startsWith("image/") ? "image" : "file"
        const message = `[Uploaded ${fileType}: ${file.name}]`

        // Add the file reference to the input
        handleQuickAction(`${input.trim() ? input + "\n" : ""}${message}`)

        // Close the dialog
        setImageUploadOpen(false)

        toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded successfully`)
    }

    return (
        <div className={cn("flex flex-col h-[calc(100vh-4rem)] text-foreground")}>
            {/* Main content area */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {/* Messages area */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
                    {!hasMessages ? (
                        <div className="flex flex-col items-center justify-center w-full h-full px-4">
                            <div
                                className={cn(
                                    "flex flex-col items-center justify-center w-full max-w-md p-12 rounded-2xl text-center bg-neutral-100 border shadow-none",
                                )}
                            >
                                <h2 className="text-3xl font-bold mb-4">Care.ai</h2>
                                <p className="mb-6 text-sm text-center text-muted-foreground">
                                    Schedule, medication, and manage your client&apos;s care in one place
                                </p>
                                <div className="grid grid-cols-4 gap-3 w-full">
                                    {[
                                        { text: "Summarize Notes", icon: <FileText className="h-4 w-4" /> },
                                        { text: "Create Care Plan", icon: <Clipboard className="h-4 w-4" /> },
                                        { text: "Schedule Appointment", icon: <Calendar className="h-4 w-4" /> },
                                        { text: "Log Medication", icon: <Syringe className="h-4 w-4" /> },
                                    ].map((action) => (
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                duration: 0.1,
                                                ease: "easeInOut",
                                            }}
                                            key={action.text}
                                        >
                                            <TooltipProvider>
                                                <Tooltip delayDuration={100}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-full h-12 rounded-lg flex items-center justify-center border shadow-none bg-neutral-200/50 hover:bg-neutral-200/70 transition-all"
                                                            onClick={() => handleQuickAction(action.text)}
                                                        >
                                                            {action.icon}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-black text-white">
                                                        <p>{action.text}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6 w-full">
                            <AnimatePresence>
                                {messages.map((msg: Message, index: number) => (
                                    <motion.div
                                        key={msg.id || index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="message"
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <div
                                                className={cn(
                                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                                    msg.role === "user" ? "bg-background" : "bg-background",
                                                )}
                                            >
                                                {msg.role === "user" ? "U" : "A"}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="font-medium mb-1 flex items-center gap-2">
                                                    {msg.role === "user" ? "You" : "Assistant"}
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </span>
                                                </div>
                                                <div
                                                    className={cn(
                                                        "whitespace-pre-wrap break-words p-4 rounded-lg border",
                                                        msg.role === "user" ? "bg-background" : "bg-background",
                                                    )}
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Thinking stages */}
                                {isLoading && thinkingStage >= 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="message"
                                    >
                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-background text-foreground flex items-center justify-center shrink-0 border">
                                                A
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="font-medium mb-1 flex items-center gap-2">
                                                    Assistant
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                </div>
                                                <div className={cn("p-4 rounded-lg border bg-background")}>
                                                    <AnimatePresence mode="wait">
                                                        <motion.div
                                                            key={thinkingStage}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="flex flex-col gap-3"
                                                        >
                                                            {/* Current thinking stage */}
                                                            <div className="flex items-center gap-2 p-2 rounded-md border">
                                                                {thinkingStages[thinkingStage]?.icon}
                                                                <span className="text-sm font-medium">{thinkingStages[thinkingStage]?.text}</span>
                                                                <div className="ml-auto flex gap-1">
                                                                    <div className="h-2 w-2 rounded-full bg-current animate-pulse"></div>
                                                                    <div
                                                                        className="h-2 w-2 rounded-full bg-current animate-pulse"
                                                                        style={{ animationDelay: "300ms" }}
                                                                    ></div>
                                                                    <div
                                                                        className="h-2 w-2 rounded-full bg-current animate-pulse"
                                                                        style={{ animationDelay: "600ms" }}
                                                                    ></div>
                                                                </div>
                                                            </div>

                                                            {/* Previous thinking stages (completed) */}
                                                            {Array.from({ length: thinkingStage }).map((_, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center gap-2 p-2 rounded-md border text-muted-foreground"
                                                                >
                                                                    {thinkingStages[idx]?.icon}
                                                                    <span className="text-sm">{thinkingStages[idx]?.text}</span>
                                                                    <div className="ml-auto">
                                                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M5 13l4 4L19 7"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input area */}
                <div className="px-4 pb-4 pt-2 w-full">
                    <div className="max-w-3xl mx-auto w-full">
                        <form onSubmit={onSubmit} className="relative">
                            <div className="relative rounded-xl border shadow-sm bg-background">
                                <div className="absolute left-3 top-3.5 flex space-x-1">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 rounded-full text-muted-foreground"
                                        disabled={isLoading}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <AutoResizeTextarea
                                    placeholder="Ask anything"
                                    value={input}
                                    onChange={(value: string) => {
                                        handleInputChange({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>)
                                    }}
                                    onKeyDown={handleKeyDown}
                                    className="w-full py-2 pl-12 pr-12 bg-transparent focus:outline-none resize-none max-h-[200px] min-h-[40px] flex items-center"
                                    disabled={isLoading}
                                />
                                <div className="absolute right-3 top-3 flex items-center space-x-1">
                                    {!input.trim() ? (
                                        <>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={handleLightbulbClick}
                                                className="h-7 w-7 rounded-full text-muted-foreground"
                                                disabled={isLoading}
                                            >
                                                <Lightbulb className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                onClick={handleImageClick}
                                                className="h-7 w-7 rounded-full text-muted-foreground"
                                                disabled={isLoading}
                                            >
                                                <ImageIcon className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={isLoading}
                                            className="h-7 w-7 transition-all duration-200 bg-foreground text-background hover:bg-foreground/90"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                        <div className="text-xs text-center mt-2 flex items-center justify-center gap-1 text-muted-foreground">
                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground/30 animate-pulse"></span>
                            AI Care Assistant may make mistakes. Please verify important information.
                        </div>
                    </div>
                </div>
            </main>

            {/* Image Upload Dialog */}
            <Dialog open={imageUploadOpen} onOpenChange={setImageUploadOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <FileUpload
                        onFileSelect={handleFileSelect}
                        onCancel={() => setImageUploadOpen(false)}
                        accept="image/*,application/pdf"
                    />
                </DialogContent>
            </Dialog>

            {/* Search Dialog */}
            <SearchDialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen} onSelect={handleQuickAction} />

            {/* Suggestion Dialog */}
            <SuggestionDialog
                open={suggestionDialogOpen}
                onOpenChange={setSuggestionDialogOpen}
                onSelect={handleQuickAction}
            />
        </div>
    )
}
