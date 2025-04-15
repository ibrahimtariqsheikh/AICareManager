import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '@/app/dashboard/chatbot/chatbot-client';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessionId: string | null;
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  sessionId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSessionId: (state, action: PayloadAction<string>) => {
      state.sessionId = action.payload;
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
      state.sessionId = null;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setLoading,
  setError,
  setSessionId,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer; 