"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

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
        isLoading: messagesLoading,
        error,
        typingUsers,
        setTypingStatus,
        setMessages,
    } = useMessages()

    const [createConversation] = useCreateConversationMutation<Conversation>()
    const [sendMessageInConversation] = useSendMessageInConversationMutation<Message>()
    const userFromRedux = useAppSelector((state) => state.user)
    const user = userFromRedux.user.userInfo
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
    const [isInitialLoading, setIsInitialLoading] = useState(true)

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
            console.log("Setting up conversation with:", { contactId, userId: user?.id });

            if (!contactId || !user?.id) {
                console.log("Missing required data:", { contactId, userId: user?.id });
                setIsInitialLoading(false);
                return;
            }

            // If we already have a conversation ID and messages are loaded, we don't need to create a new conversation
            if (currentConversationId && messages.length > 0) {
                console.log("Conversation and messages already exist, skipping creation:", {
                    currentConversationId,
                    messageCount: messages.length
                });
                setIsInitialLoading(false);
                return;
            }

            // If we have a conversation ID but no messages, try to load them first
            if (currentConversationId && messages.length === 0) {
                console.log("Loading existing messages for conversation:", currentConversationId);
                await loadMessages(currentConversationId);
                setIsInitialLoading(false);
                return;
            }

            // Check if there's an existing conversation between these users
            try {
                const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001').replace(/\/+$/, '');
                const response = await fetch(`${baseUrl}/messages/conversation/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        senderId: user?.id,
                        receiverId: contactId,
                    }),
                });

                if (response.ok) {
                    const existingConversation = await response.json();
                    if (existingConversation?.id) {
                        console.log("Found existing conversation:", existingConversation);
                        setCurrentConversationId(existingConversation.id);
                        await loadMessages(existingConversation.id);
                        setIsInitialLoading(false);
                        return;
                    }
                }
            } catch (error) {
                console.error("Error checking for existing conversation:", error);
            }

            console.log("No existing conversation found, creating new one...");

            // Add a flag to prevent multiple calls
            let isMounted = true;

            try {
                console.log("Creating conversation with data:", {
                    senderId: user?.id,
                    receiverId: contactId
                });

                const result = await createConversation({
                    senderId: user?.id,
                    receiverId: contactId,
                }).unwrap();

                console.log("Conversation creation result:", result);

                // Only update state if component is still mounted
                if (isMounted && result.id) {
                    console.log("Setting current conversation ID:", result.id);
                    setCurrentConversationId(result.id);

                    // Find the contact from the allContacts array
                    const otherParticipant = allContacts.find(contact => contact.id === contactId);
                    console.log("Found other participant:", otherParticipant);

                    if (otherParticipant) {
                        setContact(otherParticipant);
                    }

                    toast.success("Messages Loaded Successfully");

                    // Load messages for this conversation
                    if (result.id) {
                        console.log("Loading messages for conversation:", result.id);
                        await loadMessages(result.id);
                    }
                }
            } catch (error: any) {
                console.error("Error creating conversation:", error);
                console.error("Full error details:", {
                    message: error?.message,
                    data: error?.data,
                    status: error?.status
                });
            } finally {
                if (isMounted) {
                    setIsInitialLoading(false);
                }
            }

            // Cleanup function to prevent state updates if component unmounts
            return () => {
                console.log("Cleaning up conversation setup");
                isMounted = false;
            };
        };

        setupConversation();
    }, [contactId, user?.id, currentConversationId, messages.length]);

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

    // Handle key down
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (newMessage.trim() && !messagesLoading) {
                handleSendMessage(e as any)
            }
        }
    }

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value)
        handleTyping()
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        })
    }

    // Handle send message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Attempting to send message:", {
            message: newMessage,
            conversationId: currentConversationId,
            senderId: user?.id
        });

        if (!newMessage.trim() || !currentConversationId) {
            console.log("Cannot send message - missing data:", {
                hasMessage: !!newMessage.trim(),
                hasConversationId: !!currentConversationId
            });
            return;
        }

        // Clear typing status immediately
        setTypingStatus(false);
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            setTypingTimeout(null);
        }

        // Get agencyId with fallback
        const agencyId = user?.agenciesOwned?.[0]?.id || user?.agency?.id;
        console.log("Using agency ID:", agencyId);

        if (!agencyId) {
            console.error("No agency ID found for user:", user);
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
        };

        console.log("Created temporary message:", tempMessage);

        try {
            console.log("Starting to send message...");
            console.log("Message data:", {
                content: newMessage,
                conversationId: currentConversationId,
                senderId: user?.id,
                agencyId
            });

            // Update local state
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage("");

            // Emit message through socket
            console.log("Emitting socket message...");
            console.log("Socket connection status:", socketService.isConnected());
            console.log("Socket message data:", {
                conversationId: currentConversationId,
                content: newMessage,
                senderId: user?.id || '',
            });

            socketService.sendMessage({
                conversationId: currentConversationId,
                content: newMessage,
                senderId: user?.id || '',
            });

            console.log("Making API call to save message...");
            const result = await sendMessageInConversation({
                content: newMessage,
                conversationId: currentConversationId,
                senderId: user?.id || '',
                agencyId: user?.agency?.id || ""
            }).unwrap();

            console.log("Message sent successfully:", result);
        } catch (error: any) {
            console.error("Error sending message:", error);
            console.error("Full error details:", {
                message: error?.message,
                data: error?.data,
                status: error?.status,
                stack: error?.stack
            });

            // Remove the temporary message from the UI
            setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));

            // Show error toast with more details
            const errorMessage = error?.data?.message || error?.message || "Failed to send message";
            toast.error(errorMessage);
        }
    };

    // Format timestamp
    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Check if messages are close in time (within 5 minutes)
    const areMessagesCloseInTime = (msg1: MessageType, msg2: MessageType) => {
        const time1 = new Date(msg1.createdAt).getTime()
        const time2 = new Date(msg2.createdAt).getTime()
        const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds
        return Math.abs(time1 - time2) <= fiveMinutes
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

    // Handle message click
    const handleMessageClick = (messageId: string) => {
        setSelectedMessageId(selectedMessageId === messageId ? null : messageId)
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] ">
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
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                )}

                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isInitialLoading || messagesLoading ? (
                    <div className="space-y-2">
                        {/* Date group skeleton */}
                        <div className="flex justify-center mb-2">
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>

                        {/* Message skeletons */}
                        <div className="space-y-1.5">
                            {/* Left side message */}
                            <div className="flex items-end gap-1.5">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <div className="flex flex-col items-start">
                                    <Skeleton className="h-10 w-48 rounded-full rounded-tl-none" />
                                </div>
                            </div>

                            {/* Right side message */}
                            <div className="flex items-end gap-1.5 justify-end">
                                <div className="flex flex-col items-end">
                                    <Skeleton className="h-10 w-48 rounded-full rounded-tr-none" />
                                </div>
                            </div>

                            {/* Left side message */}
                            <div className="flex items-end gap-1.5">
                                <div className="w-8" />
                                <div className="flex flex-col items-start">
                                    <Skeleton className="h-10 w-64 rounded-full rounded-tl-none" />
                                </div>
                            </div>

                            {/* Right side message */}
                            <div className="flex items-end gap-1.5 justify-end">
                                <div className="flex flex-col items-end">
                                    <Skeleton className="h-10 w-56 rounded-full rounded-tr-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-destructive text-lg font-medium">
                            Error loading messages
                        </div>
                        <p className="text-muted-foreground text-sm">
                            {error}
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => currentConversationId && loadMessages(currentConversationId)}
                        >
                            Try Again
                        </Button>
                    </div>
                ) : !messagesLoading && messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="text-muted-foreground text-lg">
                            No messages yet
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Start the conversation by sending a message!
                        </p>
                    </div>
                ) : (
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date} className="space-y-2">
                            <div className="flex justify-center">
                                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{date}</span>
                            </div>
                            {(msgs as MessageType[]).map((message, index) => {
                                const isCurrentUser = message.senderId === user?.id
                                const showAvatar =
                                    !isCurrentUser && (index === 0 || (msgs as MessageType[])[index - 1]?.senderId !== message.senderId)

                                const nextMessage = (msgs as MessageType[])[index + 1]
                                const showTime = !nextMessage ||
                                    !areMessagesCloseInTime(message, nextMessage) ||
                                    nextMessage.senderId !== message.senderId

                                return (
                                    <div
                                        key={message.id}
                                        className={`flex items-end gap-1.5 ${isCurrentUser ? "justify-end" : "justify-start"}`}
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

                                        <div
                                            className={`flex flex-col ${isCurrentUser ? "order-1 items-end" : "order-2 items-start"}`}
                                            onClick={() => handleMessageClick(message.id)}
                                        >
                                            <div
                                                className={`px-4 py-2 ${message.content.length < 30
                                                    ? "rounded-full"
                                                    : "rounded-xl"
                                                    } ${isCurrentUser
                                                        ? "bg-blue-500 text-white"
                                                        : "bg-muted"
                                                    } cursor-pointer`}
                                            >
                                                <p>{message.content}</p>
                                            </div>
                                            {showTime && (
                                                <AnimatePresence>
                                                    {selectedMessageId === message.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="text-[10px] text-muted-foreground mt-0.5"
                                                        >
                                                            <span>{formatTime(message.createdAt)}</span>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            )}
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
                        <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-none">
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
            <form onSubmit={handleSendMessage} className="p-4 ">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <textarea
                            value={newMessage}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="p-4 pr-16 text-sm text-neutral-900 placeholder:text-neutral-500 w-full rounded-2xl focus:ring-0 resize-none border border-neutral-200 shadow-sm"
                            rows={4}
                            disabled={messagesLoading}
                        />
                        <div className="absolute bottom-5 right-4">
                            <Button
                                type="submit"
                                size="icon"
                                className="rounded-full bg-primary hover:bg-blue-600"
                                disabled={!newMessage.trim() || messagesLoading}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
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

