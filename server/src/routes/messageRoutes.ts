import express, { Request, Response, RequestHandler } from "express";
import {
  getMessages,
  getUserConversations,
  createMessage,
  updateMessage,
  deleteMessage,
  createConversation,
  markMessagesAsRead,
  setTypingStatus,
} from "../controllers/messageController";

const router = express.Router();


// Get all messages for a conversation
router.get("/conversation/:conversationId", getMessages as RequestHandler);

// Get all conversations for a user
router.get("/user/:userId", getUserConversations as RequestHandler);

// Create a new message
router.post("/", createMessage as RequestHandler);

// Update a message
router.put("/:id", updateMessage as RequestHandler);

// Delete a message
router.delete("/:id", deleteMessage as RequestHandler);

// Create a new conversation
router.post("/conversation", createConversation as RequestHandler);

// Mark messages as read
router.post("/read", markMessagesAsRead as RequestHandler);

// Set typing status
router.post("/typing", setTypingStatus as RequestHandler);

export default router;
