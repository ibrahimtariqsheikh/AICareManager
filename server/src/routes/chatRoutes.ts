import express from 'express';
import { healthCheck, handleChat, getChatHistory, clearChatHistory } from '../controllers/chatController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all chat routes
router.use(apiLimiter);

// Health check endpoint
router.get('/health', healthCheck);

// Chat endpoints
router.post('/chat', handleChat);
router.get('/chat/:sessionId', getChatHistory);
router.delete('/chat/:sessionId', clearChatHistory);

export default router; 