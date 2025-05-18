import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import { useSendMessageMutation, useGetChatHistoryQuery, useClearChatHistoryMutation } from '@/state/api';
import { RootState } from '@/state/redux';
import { setMessages, addMessage, setLoading, setError, setSessionId, clearChat } from '@/state/slices/chatSlice';
import { getRandomPlaceholderImage } from "@/lib/utils"


export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
  avatar?: string | undefined;
};

export type UseChatOptions = {
  api?: string;
  initialMessages?: Message[];
  onError?: (error: string) => void;
  loadHistory?: boolean;
};

type ChatResponse = {
  message: Message;
  sessionId: string;
  error?: string;
};

export function useChat({

  onError,
  loadHistory = true,
}: UseChatOptions = {}) {
  const dispatch = useDispatch();
  const { messages, isLoading, error, sessionId } = useSelector((state: RootState) => state.chat);
  const [sendMessage] = useSendMessageMutation();
  const { data: chatHistory, error: historyError } = useGetChatHistoryQuery(sessionId || '', { 
    skip: !sessionId || !loadHistory,
    refetchOnMountOrArgChange: true 
  });
  const [clearChatHistory] = useClearChatHistoryMutation();
  const [input, setInput] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      const newSessionId = uuidv4();
      dispatch(setSessionId(newSessionId));
    }
  }, [sessionId, dispatch]);

  useEffect(() => {
    if (loadHistory && chatHistory?.messages && !isInitialized) {

      dispatch(setMessages(chatHistory.messages));
      setIsInitialized(true);
    }
  }, [chatHistory, dispatch, loadHistory, isInitialized]);

  useEffect(() => {
    if (historyError) {
      console.error('Error loading chat history:', historyError);
      dispatch(setError('Failed to load chat history'));
      if (onError) {
        onError('Failed to load chat history');
      }
    }
  }, [historyError, dispatch, onError]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, []);

  const clearChatState = useCallback(async () => {
    if (sessionId) {
      try {
        await clearChatHistory(sessionId).unwrap();
      } catch (err) {
        console.error('Error clearing chat history:', err);
      }
    }
    dispatch(clearChat());
    setInput('');
    setIsInitialized(false);
  }, [sessionId, clearChatHistory, dispatch]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !sessionId) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
      avatar: getRandomPlaceholderImage()
    };

    dispatch(addMessage(userMessage));
    setInput('');
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await sendMessage({
        messages: [...messages, userMessage],
        sessionId,
      }).unwrap() as ChatResponse;



      if (response.error) {
        throw new Error(response.error);
      }

      dispatch(addMessage(response.message));
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while sending the message';
      dispatch(setError(errorMessage));
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      dispatch(setLoading(false));
    }
  }, [input, isLoading, messages, onError, sendMessage, sessionId, dispatch]);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    clearChat: clearChatState,
  };
} 