"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { socketService } from "../services/socketService"
import { v4 as uuidv4 } from "uuid"

export interface Message {
    id: string
    content: string
    senderId: string
    conversationId: string
    createdAt: string
    isRead: boolean
    sender?: {
        id: string
        fullName: string
        email: string
    }
}

interface MessageContextType {
    messages: Message[]
    currentConversationId: string | null
    setCurrentConversationId: (id: string | null) => void
    sendMessage: (content: string) => void
    deleteMessage: (id: string) => void
    updateMessage: (id: string, content: string) => void
    markMessagesAsRead: () => void
    setTypingStatus: (isTyping: boolean) => void
    typingUsers: Set<string>
    loadMessages: (conversationId: string) => Promise<void>
    isLoading: boolean
    error: string | null
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}

interface MessageProviderProps {
    children: ReactNode
    user?: {
        id: string
        fullName: string
        email: string
    } | null
}

const MessageContext = createContext<MessageContextType | undefined>(undefined)

export const MessageProvider: React.FC<MessageProviderProps> = ({ children, user }) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const currentUserId = user?.id || ""

    // Initialize socket connection when user is available
    useEffect(() => {
        if (currentUserId) {
            console.log("Initializing socket connection for user:", currentUserId);
            let isMounted = true;

            const initializeSocket = async () => {
                try {
                    const socket = await socketService.connect(currentUserId);
                    if (socket && isMounted) {
                        console.log("Socket connection established successfully");
                    } else if (isMounted) {
                        console.error("Failed to establish socket connection");
                    }
                } catch (error) {
                    if (isMounted) {
                        console.error("Error initializing socket:", error);
                    }
                }
            };

            initializeSocket();

            return () => {
                isMounted = false;
                console.log("Cleaning up socket connection");
                socketService.disconnect();
            }
        }
    }, [currentUserId])

    // Set up socket event listeners
    useEffect(() => {
        if (!currentUserId) {
            console.log("No user ID available, skipping socket event setup");
            return;
        }

        console.log("Setting up socket event listeners for user:", currentUserId);

        const removeMessageListener = socketService.onMessageReceived((message) => {
            console.log("Received new message:", message);
            if (message.conversationId === currentConversationId) {
                console.log("Adding message to current conversation");
                setMessages((prev) => [...prev, message]);
                // Mark as read if we're in the conversation
                markMessagesAsRead();
            }
        });

        const removeTypingListener = socketService.onTyping(({ userId, isTyping }) => {
            console.log("Received typing status:", { userId, isTyping });
            if (userId !== currentUserId) {
                console.log("Updating typing users set");
                setTypingUsers((prev) => {
                    const newSet = new Set(prev);
                    if (isTyping) {
                        newSet.add(userId);
                    } else {
                        newSet.delete(userId);
                    }
                    return newSet;
                });
            }
        });

        const removeDeleteListener = socketService.onMessageDeleted(({ id }) => {
            console.log("Message deleted:", id);
            setMessages((prev) => prev.filter((m) => m.id !== id));
        });

        const removeUpdateListener = socketService.onMessageUpdated((updatedMessage) => {
            console.log("Message updated:", updatedMessage);
            setMessages((prev) => prev.map((m) => (m.id === updatedMessage.id ? updatedMessage : m)));
        });

        return () => {
            console.log("Cleaning up socket event listeners");
            removeMessageListener();
            removeTypingListener();
            removeDeleteListener();
            removeUpdateListener();
        }
    }, [currentUserId, currentConversationId])

    // Load messages for a conversation
    const loadMessages = async (conversationId: string) => {
        if (!conversationId) {
            console.log("No conversation ID provided");
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Ensure proper URL construction by removing any double slashes
            const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001').replace(/\/+$/, '');
            const apiUrl = `${baseUrl}/messages/conversation/${conversationId}`;
            console.log("Fetching messages from:", apiUrl);

            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("Error response:", errorData);
                throw new Error(errorData?.error || `Failed to fetch messages: ${response.status}`);
            }

            const data = await response.json();
            console.log("Received messages:", data);
            setMessages(data);

            // Mark messages as read
            markMessagesAsRead();
        } catch (err) {
            console.error("Error loading messages:", err);
            setError(err instanceof Error ? err.message : "Failed to load messages");
        } finally {
            setIsLoading(false);
        }
    }

    // Send a new message
    const sendMessage = async (content: string) => {
        if (!content.trim() || !currentConversationId || !currentUserId) {
            console.log("Cannot send message:", { content, currentConversationId, currentUserId })
            return
        }

        // Generate tempId outside try block so it's accessible in catch
        const tempId = uuidv4()
        console.log("Sending message with tempId:", tempId)

        try {
            // Optimistic update with temporary ID
            const tempMessage: Message = {
                id: tempId,
                content,
                senderId: currentUserId,
                conversationId: currentConversationId,
                createdAt: new Date().toISOString(),
                isRead: false,
                sender: {
                    id: currentUserId,
                    fullName: user?.fullName || "You",
                    email: user?.email || "",
                },
            }

            console.log("Adding optimistic message:", tempMessage)
            setMessages((prev) => [...prev, tempMessage])

            // Send to server
            const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/messages`
            console.log("Sending message to server:", apiUrl)

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    content,
                    conversationId: currentConversationId,
                    senderId: currentUserId,
                }),
            })

            console.log("Server response status:", response.status)

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                console.error("Server error response:", errorData)
                throw new Error(errorData?.error || `Failed to send message: ${response.status}`)
            }

            const savedMessage = await response.json()
            console.log("Message saved successfully:", savedMessage)

            // Replace temp message with saved one
            setMessages((prev) => prev.map((m) => (m.id === tempId ? savedMessage : m)))

            // Emit socket event for real-time updates
            socketService.sendMessage({
                conversationId: currentConversationId,
                content,
                senderId: currentUserId
            })
        } catch (err) {
            console.error("Error sending message:", err)
            setError(err instanceof Error ? err.message : "Failed to send message")

            // Remove the optimistic message on error
            setMessages((prev) => prev.filter((m) => m.id !== tempId))
        }
    }

    // Delete a message
    const deleteMessage = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/messages/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.error || `Failed to delete message: ${response.status}`)
            }

            setMessages((prev) => prev.filter((m) => m.id !== id))
        } catch (err) {
            console.error("Error deleting message:", err)
            setError(err instanceof Error ? err.message : "Failed to delete message")
        }
    }

    // Update a message
    const updateMessage = async (id: string, content: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/messages/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ content }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.error || `Failed to update message: ${response.status}`)
            }

            const updatedMessage = await response.json()
            setMessages((prev) => prev.map((m) => (m.id === id ? updatedMessage : m)))
        } catch (err) {
            console.error("Error updating message:", err)
            setError(err instanceof Error ? err.message : "Failed to update message")
        }
    }

    // Mark messages as read
    const markMessagesAsRead = async () => {
        if (!currentConversationId || !currentUserId) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}/messages/read`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({
                    conversationId: currentConversationId,
                    userId: currentUserId,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.error || `Failed to mark messages as read: ${response.status}`)
            }

            // Update local messages to show as read
            setMessages((prev) => prev.map((m) => (m.senderId !== currentUserId ? { ...m, isRead: true } : m)))
        } catch (err) {
            console.error("Error marking messages as read:", err)
        }
    }

    // Set typing status
    const setTypingStatus = (isTyping: boolean) => {
        if (!currentConversationId || !currentUserId) {
            console.log("Cannot set typing status - missing conversationId or userId");
            return;
        }

        console.log("Setting typing status:", { isTyping, currentConversationId, currentUserId });
        socketService.setTypingStatus({
            conversationId: currentConversationId,
            userId: currentUserId,
            isTyping,
        });
    }

    const value = {
        messages,
        currentConversationId,
        setCurrentConversationId,
        sendMessage,
        deleteMessage,
        updateMessage,
        markMessagesAsRead,
        setTypingStatus,
        typingUsers,
        loadMessages,
        isLoading,
        error,
        setMessages,
    }

    return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
}

export const useMessages = () => {
    const context = useContext(MessageContext)
    if (context === undefined) {
        throw new Error("useMessages must be used within a MessageProvider")
    }
    return context
}
