import { Request, Response } from 'express';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { v4 as uuidv4 } from 'uuid';


const chatSessions = new Map();

export const healthCheck = (req: Request, res: Response) => {
    console.log("health check");
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
};

export const handleChat = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("here");
    const { messages, sessionId = uuidv4() } = req.body;
    console.log(messages);
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Invalid request. Messages array is required.' });
      return;
    }
    
    // Get or create chat history
    let chatHistory = chatSessions.get(sessionId) || [];
    
    // Add new message to history
    const lastMessage = messages[messages.length - 1];
    chatHistory.push(lastMessage);
    
    // Format the conversation for Anthropic
    const prompt = lastMessage.content;
    
    // System prompt (optional)
    const systemPrompt = "You are an AI Care Assistant helping with healthcare management. Provide clear, accurate, and helpful responses.";
    
    console.log(`Processing chat request for session ${sessionId}`);
    console.log(prompt);
    const response = await generateText({
      model: anthropic('claude-3-opus-20240229'),
      prompt: prompt,
      system: systemPrompt,
      // Optional parameters
      temperature: 0.7,
      maxTokens: 1000,
    });
    console.log(response);
    // Create assistant message
    const assistantMessage = {
      id: uuidv4(),
      role: 'assistant',
      content: response.text,
      createdAt: new Date().toISOString()
    };
    
    // Add assistant response to history
    chatHistory.push(assistantMessage);
    
    // Update session
    chatSessions.set(sessionId, chatHistory);
    
    // Clean up old sessions (simple cleanup mechanism)
    if (chatSessions.size > 1000) {
      const oldestKey = chatSessions.keys().next().value;
      chatSessions.delete(oldestKey);
    }
    
    res.json({
      sessionId,
      message: assistantMessage
    });
    
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    
    // Determine appropriate error response
    if (error.name === 'AbortError') {
      res.status(408).json({ error: 'Request timed out' });
    } else if (error.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.status) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(500).json({ 
        error: 'An error occurred while processing your request.',
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
      });
    }
  }
};

export const getChatHistory = (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const chatHistory = chatSessions.get(sessionId) || [];
  
  res.json({
    sessionId,
    messages: chatHistory
  });
};

export const clearChatHistory = (req: Request, res: Response) => {
  const { sessionId } = req.params;
  chatSessions.delete(sessionId);
  
  res.json({
    sessionId,
    status: 'cleared'
  });
}; 