"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

import { useAppSelector } from "@/state/redux"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Send, MoreVertical } from "lucide-react"
import { getRandomPlaceholderImage } from "@/lib/utils"
import { useMessages, type Message, MessageProvider } from "@/app/context/MessageContext"
import { useCreateConversationMutation, useSendMessageInConversationMutation } from "@/state/api"
import { toast } from "sonner"
import { socketService } from "@/app/services/socketService"

// Import Message type from messageTypes
import { Message as MessageType } from "@/types/messageTypes"


type User = {
    id: string;
    cognitoId: string;
    email: string;
    fullName: string;
    role: string;
    agencyId?: string;
    agenciesOwned: Array<{
        id: string;
        name: string;
        isActive: boolean;
        isSuspended: boolean;
        hasScheduleV2: boolean;
        hasEMAR: boolean;
        hasFinance: boolean;
        isWeek1And2ScheduleEnabled: boolean;
        hasPoliciesAndProcedures: boolean;
        isTestAccount: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    agency?: {
        id: string;
        name: string;
        isActive: boolean;
        isSuspended: boolean;
        hasScheduleV2: boolean;
        hasEMAR: boolean;
        hasFinance: boolean;
        isWeek1And2ScheduleEnabled: boolean;
        hasPoliciesAndProcedures: boolean;
        isTestAccount: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
    profile?: {
        avatarUrl?: string;
        phone?: string;
    };
}

type Conversation = {
    id: string;
    senderId: string;
    receiverId: string;
    sender: User;
    receiver: User;
    message?: string;
}

function MessagesContent() {
    const {
        messages,
        currentConversationId,
        setCurrentConversationId,
        loadMessages,
        isLoading,
        error,
        typingUsers,
        setTypingStatus,
        setMessages,
    } = useMessages()

    const [createConversation] = useCreateConversationMutation<Conversation>()
    const [sendMessageInConversation] = useSendMessageInConversationMutation<Message>()
    const userFromRedux = useAppSelector((state) => state.user)
    const user = userFromRedux.user.userInfo



    const searchParams = useSearchParams()
    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [newMessage, setNewMessage] = useState("")
    const [contact, setContact] = useState<User | null>(null)
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

    // Get contact ID from URL
    const contactId = searchParams.get("contactId")

    // Get contacts from Redux store
    const { clients, officeStaff, careWorkers } = useAppSelector((state) => state.user)
    const allContacts = [...clients, ...officeStaff, ...careWorkers]

    // Find or create conversation when contact changes
    useEffect(() => {
        const setupConversation = async () => {
            if (!contactId || !user?.id) {
                ("Missing contactId or user.id:", { contactId, userId: user?.id })
                return
            }

            ("Will message with contactId:", contactId)
                ("Logged in user ID:", user?.id)

            // Add a flag to prevent multiple calls
            let isMounted = true

            try {
                const result = await createConversation({
                    senderId: user?.id,
                    receiverId: contactId,
                }).unwrap()

                    ("Conversation result:", result)

                // Only update state if component is still mounted
                if (isMounted && result.id) {
                    setCurrentConversationId(result.id)

                    // Find the contact from the allContacts array
                    const otherParticipant = allContacts.find(contact => contact.id === contactId)
                    if (otherParticipant) {
                        setContact(otherParticipant)
                    }

                    toast.success(result.message)

                    // Load messages for this conversation
                    if (result.id) {
                        loadMessages(result.id)
                    }
                }
            } catch (error: any) {
                console.error("Error creating conversation:", error)
                if (isMounted) {
                    toast.error(error?.data?.message || "Failed to create conversation")
                }
            }

            // Cleanup function to prevent state updates if component unmounts
            return () => {
                isMounted = false
            }
        }

        setupConversation()
    }, [contactId, user?.id])

    // Scroll to bottom when messages change or typing status changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

        // Clear typing status when new messages arrive
        if (messages.length > 0) {
            setTypingStatus(false)
            if (typingTimeout) {
                clearTimeout(typingTimeout)
                setTypingTimeout(null)
            }
        }
    }, [messages, typingUsers])

    // Handle typing status
    const handleTyping = () => {
        setTypingStatus(true)

        if (typingTimeout) {
            clearTimeout(typingTimeout)
        }

        const timeout = setTimeout(() => {
            setTypingStatus(false)
        }, 3000)

        setTypingTimeout(timeout)
    }

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)
        handleTyping()
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        })
    }

    // Handle send message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newMessage.trim() || !currentConversationId) {
            return
        }

        // Clear typing status immediately
        setTypingStatus(false)
        if (typingTimeout) {
            clearTimeout(typingTimeout)
            setTypingTimeout(null)
        }

        // Get agencyId with fallback
        const agencyId = user?.agenciesOwned?.[0]?.id || user?.agency?.id;

        if (!agencyId) {
            console.error("No agency ID found for user");
            toast.error("Unable to send message: No agency associated with your account");
            return;
        }

        // Create a temporary message object
        const tempMessage: MessageType = {
            id: Date.now().toString(), // Temporary ID
            content: newMessage,
            senderId: user?.id || '',
            conversationId: currentConversationId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isRead: false,
            sender: {
                id: user?.id || '',
                fullName: user?.fullName || '',
                email: user?.email || '',
            }
        }

        try {
            ("Starting to send message...");
            ("Message data:", {
                content: newMessage,
                conversationId: currentConversationId,
                senderId: user?.id,
                agencyId
            });

            // Update local state
            setMessages(prev => [...prev, tempMessage])
            setNewMessage("")

                // Emit message through socket
                ("Emitting socket message...");
            ("Socket connection status:", socketService.isConnected());
            ("Socket message data:", {
                conversationId: currentConversationId,
                content: newMessage,
                senderId: user?.id || '',
            });
            socketService.sendMessage({
                conversationId: currentConversationId,
                content: newMessage,
                senderId: user?.id || '',
            })

                ("Making API call to save message...");
            const result = await sendMessageInConversation({
                content: newMessage,
                conversationId: currentConversationId,
                senderId: user?.id || '',
                agencyId: user?.agency?.id || ""
            }).unwrap()

                ("Message sent successfully:", result)
        } catch (error: any) {
            console.error("Error sending message:", error)
            // Log the full error object
            console.error("Full error object:", {
                error,
                status: error?.status,
                data: error?.data,
                message: error?.message
            })

            // Remove the temporary message from the UI
            setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))

            // Show error toast with more details
            const errorMessage = error?.data?.message || error?.message || "Failed to send message"
            toast.error(errorMessage)
        }
    }

    // Format timestamp
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Format date for message groups
    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return "Today"
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Yesterday"
        } else {
            return date.toLocaleDateString(undefined, {
                weekday: "long",
                month: "short",
                day: "numeric",
            })
        }
    }

    // Group messages by date
    const groupedMessages = messages.reduce((groups: any, message) => {
        const date = formatDate(message.createdAt)
        if (!groups[date]) {
            groups[date] = []
        }
        groups[date].push(message)
        return groups
    }, {})

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
            {/* Header */}
            <div className="flex items-center p-4 border-b">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/contacts")} className="mr-2">
                    <ArrowLeft className="h-5 w-5" />
                </Button>

                {contact ? (
                    <div className="flex items-center flex-1">
                        <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={contact.profile?.avatarUrl || getRandomPlaceholderImage()} alt={contact.fullName} />
                            <AvatarFallback>
                                {(contact.fullName || "")
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-medium text-base">{contact.fullName}</h2>
                            <p className="text-xs text-muted-foreground">
                                {contact.role ? formatRole(contact.role) : ''}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center flex-1">
                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                        <div>
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                )}

                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {isLoading ? (
                    // Loading skeletons
                    Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                                <div className="flex items-end gap-2">
                                    {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full" />}
                                    <div>
                                        <Skeleton
                                            className={`h-12 w-48 rounded-lg ${i % 2 === 0 ? "rounded-tl-none" : "rounded-tr-none"}`}
                                        />
                                        <Skeleton className="h-3 w-16 mt-1" />
                                    </div>
                                </div>
                            </div>
                        ))
                ) : error ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-destructive">Error loading messages: {error}</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date} className="space-y-4">
                            <div className="flex justify-center">
                                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{date}</span>
                            </div>
                            {(msgs as MessageType[]).map((message, index) => {
                                const isCurrentUser = message.senderId === user?.id
                                const showAvatar =
                                    !isCurrentUser && (index === 0 || (msgs as MessageType[])[index - 1]?.senderId !== message.senderId)

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex items-end gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}
                                    >
                                        {showAvatar ? (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={getRandomPlaceholderImage() || "/placeholder.svg"}
                                                    alt={message.sender?.fullName || ""}
                                                />
                                                <AvatarFallback>
                                                    {(message.sender?.fullName || "")
                                                        .split(" ")
                                                        .map((n: string) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            !isCurrentUser && <div className="w-8" />
                                        )}

                                        <div className={`max-w-[75%] ${isCurrentUser ? "order-1" : "order-2"}`}>
                                            <div
                                                className={`px-4 py-2 rounded-full ${isCurrentUser
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-muted"
                                                    }`}
                                            >
                                                <p>{message.content}</p>
                                            </div>
                                            <div
                                                className={`flex text-xs mt-1 text-muted-foreground ${isCurrentUser ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                <span>{formatTime(message.createdAt)}</span>
                                                {isCurrentUser && <span className="ml-2">{message.isRead ? "Read" : "Sent"}</span>}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))
                )}

                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                    <div className="flex items-end gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={contact?.profile?.avatarUrl || getRandomPlaceholderImage()}
                                alt={contact?.fullName || ""}
                            />
                            <AvatarFallback>
                                {(contact?.fullName || "")
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted px-4 py-2 rounded-lg rounded-bl-none">
                            <div className="flex space-x-1">
                                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={handleInputChange}
                        placeholder="Type a message..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                        <Send className="h-5 w-5" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
export default function MessagesPage() {
    const userFromRedux = useAppSelector((state) => state.user)
    const user = userFromRedux.user.userInfo

    return (
        <MessageProvider user={user}>
            <MessagesContent />
        </MessageProvider>
    )
}

// Helper function to format role
function formatRole(role?: string) {

    if (!role) return '';
    return role
        .split("_")
        .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
        .join(" ")
}

