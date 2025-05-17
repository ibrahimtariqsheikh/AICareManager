import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();
let io: Server;

export const setSocketIO = (socketIO: Server) => {
    io = socketIO;
};

// Get all messages for a conversation
export const getMessages = async (req: Request, res: Response) => {
    try {
        const { conversationId } = req.params;
        console.log('Fetching messages for conversation:', conversationId);
        
        // First check if conversation exists
        console.log('Checking if conversation exists...');
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: true
            }
        });

        if (!conversation) {
            console.log('Conversation not found:', conversationId);
            return res.status(404).json({ error: 'Conversation not found' });
        }

        console.log('Found conversation:', {
            id: conversation.id,
            participantCount: conversation.participants.length,
            participants: conversation.participants.map(p => p.userId)
        });
        
        const messages = await prisma.message.findMany({
            where: {
                conversationId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        role: true,
                        profile: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    },
                },
            },
            orderBy: {
                sentAt: 'asc',
            },
        });
        
        console.log(`Found ${messages.length} messages for conversation ${conversationId}`);
        res.status(200).json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// Get all conversations for a user
export const getUserConversations = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log('Fetching conversations for user:', userId);

        // First get all conversations where the user is a participant
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                email: true,
                                profile: {
                                    select: {
                                        avatarUrl: true
                                    }
                                }
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {
                        sentAt: 'desc'
                    },
                    take: 1,
                    include: {
                        sender: {
                            select: {
                                id: true,
                                fullName: true
                            }
                        }
                    }
                }
            }
        });

        // Process conversations to ensure uniqueness and proper participant filtering
        const uniqueConversations = conversations.map(conversation => {
            // Filter out the current user from participants
            const otherParticipants = conversation.participants
                .filter(p => p.userId !== userId)
                .map(p => p.user);

            return {
                id: conversation.id,
                participants: otherParticipants,
                lastMessage: conversation.messages[0] || null,
                updatedAt: conversation.updatedAt
            };
        });

        // Sort by most recent message
        uniqueConversations.sort((a, b) => {
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime();
        });

        console.log(`Found ${uniqueConversations.length} conversations for user ${userId}`);
        res.status(200).json(uniqueConversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
};

// Create a new message
export const createMessage = async (req: Request, res: Response) => {
    try {
        const { content, conversationId, senderId } = req.body;
        console.log('Creating message in database...');

        const message = await prisma.message.create({
            data: {
                content,
                conversationId,
                senderId,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    }
                }
            }
        });

        console.log('Message created successfully:', message.id);
        console.log('Message:', message);

        // Emit the message through Socket.IO
        try {
            if (!io) {
                throw new Error('Socket.IO instance not initialized');
            }
            io.to(message.conversationId).emit('receive_message', {
                conversationId: message.conversationId,
                content: message.content,
                senderId: message.senderId,
                    createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                isRead: message.isRead,
                sender: message.sender

            });
            console.log('Message emitted through Socket.IO');
        } catch (error) {
            console.error('Error emitting message through Socket.IO:', error);
        }

        res.status(201).json({
            success: true,
            message: message,
            info: "Message sent successfully"
        });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Update a message
export const updateMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        // Validate content
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        // Find the message to get the conversation ID
        const existingMessage = await prisma.message.findUnique({
            where: { id }
        });

        if (!existingMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Update the message
        const message = await prisma.message.update({
            where: { id },
            data: { 
                content,
                updatedAt: new Date()
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        profile: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    }
                }
            }
        });

        // Emit the updated message to all users in the conversation
        if (!io) {
            throw new Error('Socket.IO instance not initialized');
        }
        io.to(existingMessage.conversationId).emit('message_updated', message);

        res.status(200).json(message);
    } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Failed to update message' });
    }
};

// Delete a message
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Find the message to get the conversation ID
        const message = await prisma.message.findUnique({
            where: { id }
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Delete the message
        await prisma.message.delete({
            where: { id }
        });

        // Emit the deleted message event to all users in the conversation
        if (!io) {
            throw new Error('Socket.IO instance not initialized');
        }
        io.to(message.conversationId).emit('message_deleted', { id });

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

// Create a new conversation
export const createConversation = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('conversation...');
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            res.status(400).json({ error: 'Both senderId and receiverId are required' });
            return;
        }

        if (senderId === receiverId) {
            res.status(400).json({ error: 'Cannot create a conversation with the same user' });
            return;
        }

        

        // Check if conversation already exists between these two users
        const existingConversation = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            },
            include: {
                messages: true,
                participants: true
            }
        });

        console.log('Existing conversation:', existingConversation);

        if (existingConversation) {
            console.log('Conversation already exists:', existingConversation);
            res.status(200).json(existingConversation);
            console.log('Conversation already exists:', existingConversation);
            return;
        }

      
        const conversation = await prisma.conversation.create({
            data: {
                senderId,
                receiverId,
                participants: {
                    create: [
                        { userId: senderId },
                        { userId: receiverId }
                    ]
                }
            },
            include: {
                messages: true,
                sender: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        profile: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        profile: {
                            select: {
                                avatarUrl: true
                            }
                        }
                    }
                }
            }
        });

        res.status(201).json(conversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
};

// Mark messages as read
export const markMessagesAsRead = async (req: Request, res: Response) => {
    try {
        const { conversationId, userId } = req.body;

        if (!conversationId || !userId) {
            return res.status(400).json({ error: 'Conversation ID and user ID are required' });
        }

        // Update all unread messages in the conversation that were not sent by the current user
        const result = await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                isRead: false
            },
            data: {
                isRead: true
            }
        });

        // Emit an event to notify that messages have been read
        if (!io) {
            throw new Error('Socket.IO instance not initialized');
        }
        io.to(conversationId).emit('messages_read', { conversationId, userId, count: result.count });

        res.status(200).json({ 
            success: true, 
            messagesRead: result.count 
        });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Failed to mark messages as read' });
    }
};

// Set typing status
export const setTypingStatus = async (req: Request, res: Response) => {
    try {
        const { conversationId, userId, isTyping } = req.body;

        if (!conversationId || !userId) {
            return res.status(400).json({ error: 'Conversation ID and user ID are required' });
        }

        // Emit typing status to all users in the conversation
        if (!io) {
            throw new Error('Socket.IO instance not initialized');
        }
        io.to(conversationId).emit('user_typing', { 
            conversationId, 
            userId, 
            isTyping 
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error setting typing status:', error);
        res.status(500).json({ error: 'Failed to set typing status' });
    }
};
