import { io, type Socket } from "socket.io-client"
import { fetchAuthSession } from "aws-amplify/auth"

interface MessageData {
  conversationId: string
  content: string
  senderId: string
  isTyping?: boolean
}

class SocketService {
  private socket: Socket | null = null
  private static instance: SocketService

  // Singleton pattern to ensure only one socket connection
  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  async connect(_userId: string) {
    if (!this.socket) {
      const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
      console.log("Connecting to socket server:", serverUrl);
      
      try {
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};
        
        if (!idToken) {
          console.error("No auth token available");
          return null;
        }

        return new Promise((resolve, reject) => {
          this.socket = io(serverUrl, {
            withCredentials: true,
            auth: { token: idToken.toString() },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          });

          this.socket.on("connect", () => {
            console.log("Connected to WebSocket server with ID:", this.socket?.id);
            resolve(this.socket);
          });

          this.socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            reject(error);
          });

          this.socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server");
          });
        });
      } catch (error) {
        console.error("Error connecting to socket:", error);
        return null;
      }
    }
    return this.socket;
  }

  isConnected(): boolean {
    return !!this.socket?.connected
  }

  sendMessage(data: MessageData) {
    if (this.socket) {
      const { conversationId, content, senderId } = data;
      console.log('Socket service - Sending message:', {
        conversationId,
        content,
        senderId
      });
      this.socket.emit("send_message", {
        conversationId,
        content,
        senderId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRead: false,
      })
      console.log('Socket service - Message emitted');
    } else {
      console.error("Socket not connected. Cannot send message.")
    }
  }

  setTypingStatus(data: { conversationId: string; userId: string; isTyping: boolean }) {
    if (this.socket) {
      this.socket.emit("typing", {
        conversationId: data.conversationId,
        userId: data.userId,
        isTyping: data.isTyping
      })
    }
  }

  onMessageReceived(callback: (message: any) => void) {
    if (this.socket) {
      console.log('Setting up message listener...');
      this.socket.on("receive_message", (message) => {
        console.log('Socket event received:', 'receive_message');
        console.log('Raw message data:', message);
        
        // Map the server's message format to our expected structure
        const formattedMessage = {
          id: message.id || Date.now().toString(),
          content: message.content,
          senderId: message.senderId,
          conversationId: message.roomId || message.conversationId,
          createdAt: message.timestamp || message.createdAt || new Date().toISOString(),
          updatedAt: message.timestamp || message.updatedAt || new Date().toISOString(),
          isRead: message.isRead || false,
          sender: message.sender || {
            id: message.senderId,
            fullName: message.sender?.fullName || 'Unknown User',
            email: message.sender?.email || '',
          }
        };
        
        console.log('Formatted message:', formattedMessage);
        callback(formattedMessage);
      });
      return () => {
        console.log('Cleaning up message listener...');
        this.socket?.off("receive_message", callback);
      };
    }
    console.log('Socket not connected, cannot set up message listener');
    return () => {};
  }

  onTyping(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("user_typing", callback)
      return () => this.socket?.off("user_typing", callback)
    }
    return () => {}
  }

  onMessageDeleted(callback: (data: { id: string }) => void) {
    if (this.socket) {
      this.socket.on("message_deleted", callback)
      return () => this.socket?.off("message_deleted", callback)
    }
    return () => {}
  }

  onMessageUpdated(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on("message_updated", callback)
      return () => this.socket?.off("message_updated", callback)
    }
    return () => {}
  }

  onMessagesRead(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on("messages_read", callback)
      return () => this.socket?.off("messages_read", callback)
    }
    return () => {}
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export const socketService = SocketService.getInstance()
