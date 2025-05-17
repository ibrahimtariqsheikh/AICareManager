export interface Message {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    senderId: string;
    conversationId: string;
    isRead: boolean;
    sender?: {
        id: string;
        fullName: string;
        email: string;
        profile?: {
            avatarUrl: string | null;
        };
    };
}

export interface Conversation {
    id: string;
    participants: {
        id: string;
        fullName: string;
        email: string;
        profile?: {
            avatarUrl: string | null;
        };
    }[];
    lastMessage?: Message;
    updatedAt: string;
} 