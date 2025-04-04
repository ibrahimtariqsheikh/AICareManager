"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { motion, AnimatePresence } from "framer-motion"
import { AutoResizeTextarea } from "../../../components/ui/autoresize-textarea"
import { cn } from "../../../lib/utils"
import { Plus, Search, Lightbulb, Image, Send } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { useTheme } from "next-themes"

export default function ChatbotPage() {
    const [inputValue, setInputValue] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const [hasMessages, setHasMessages] = useState(false)
    const { theme } = useTheme()
    const isDarkMode = theme === "dark"

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        initialMessages: [],
    })

    useEffect(() => {
        setHasMessages(messages.length > 0)
    }, [messages])

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (input.trim()) {
            handleSubmit(e)
            setInputValue("")
        }
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, isLoading])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
        }
    }

    return (
        <div className={cn(
            "flex flex-col h-[calc(100vh-4rem)] text-foreground",
            isDarkMode ? "bg-[#1E1E1E]" : "bg-white"
        )}>


            {/* Main content area */}
            <main className="flex-1 overflow-hidden flex flex-col">
                {/* Messages area */}
                <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
                    {!hasMessages ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <h2 className="text-3xl font-semibold mb-4">How can I assist with</h2>
                            <h2 className="text-3xl font-semibold mb-16">your care management needs?</h2>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto py-6 px-4 space-y-6 w-full">
                            <AnimatePresence>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg.id || index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="message"
                                    >
                                        <div className="flex items-start gap-4 mb-1">
                                            <div
                                                className={cn(
                                                    "w-7 h-7 rounded-full flex items-center justify-center",
                                                    msg.role === "user" ? "bg-gray-600 text-white" : "bg-green-600 text-white",
                                                )}
                                            >
                                                {msg.role === "user" ? "U" : "A"}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="font-medium mb-1">{msg.role === "user" ? "You" : "Assistant"}</div>
                                                <div className={cn(
                                                    "whitespace-pre-wrap break-words",
                                                    isDarkMode ? "text-gray-200" : "text-gray-700"
                                                )}>{msg.content}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="message">
                                        <div className="flex items-start gap-4 mb-1">
                                            <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center">A</div>
                                            <div className="flex-1">
                                                <div className="font-medium mb-1">Assistant</div>
                                                <div className="flex space-x-1">
                                                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                                                    <div
                                                        className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"
                                                        style={{ animationDelay: "300ms" }}
                                                    ></div>
                                                    <div
                                                        className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"
                                                        style={{ animationDelay: "600ms" }}
                                                    ></div>
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
                            <div className={cn(
                                "relative rounded-xl border shadow-lg",
                                isDarkMode
                                    ? "bg-[#2A2A2A] border-gray-700"
                                    : "bg-gray-100 border-gray-300"
                            )}>
                                <AutoResizeTextarea
                                    placeholder="Ask anything"
                                    value={input}
                                    onChange={(value) => {
                                        handleInputChange({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>)
                                        setInputValue(value)
                                    }}
                                    onKeyDown={handleKeyDown}
                                    className={cn(
                                        "w-full py-3 pl-12 pr-12 bg-transparent focus:outline-none resize-none max-h-[200px] min-h-[56px]",
                                        isDarkMode ? "text-white" : "text-gray-900"
                                    )}
                                />
                                <div className="absolute left-3 top-3.5 flex space-x-1">
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                        className={cn(
                                            "h-6 w-6 rounded-full hover:text-foreground",
                                            isDarkMode ? "text-gray-400" : "text-gray-500"
                                        )}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="absolute right-3 top-3 flex items-center space-x-1">
                                    {!input.trim() ? (
                                        <>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className={cn(
                                                    "h-7 w-7 rounded-full hover:text-foreground",
                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                )}
                                            >
                                                <Search className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className={cn(
                                                    "h-7 w-7 rounded-full hover:text-foreground",
                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                )}
                                            >
                                                <Lightbulb className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="ghost"
                                                className={cn(
                                                    "h-7 w-7 rounded-full hover:text-foreground",
                                                    isDarkMode ? "text-gray-400" : "text-gray-500"
                                                )}
                                            >
                                                <Image className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            type="submit"
                                            size="icon"
                                            disabled={isLoading}
                                            className={cn(
                                                "h-7 w-7 rounded-full bg-transparent text-foreground",
                                                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                                            )}
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </form>
                        <div className={cn(
                            "text-xs text-center mt-2",
                            isDarkMode ? "text-gray-500" : "text-gray-600"
                        )}>
                            AI Care Assistant can make mistakes. Check important info.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
