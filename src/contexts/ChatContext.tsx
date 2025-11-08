import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,        // ✅ Add this
  useRef,
  useState,
} from "react";
import { useAuth } from "../contexts/AuthContext";
import chatAPI from "../services/chatAPI";
import webSocketService from "../services/webSocketService";
import type { Chat, ChatState, CustomQuestion, Message } from "../types/chat";

interface ChatContextType extends ChatState {
  selectedChat: Chat | null;
  selectChat: (chat: Chat) => void;
  loadConversations: () => Promise<void>;
  loadCustomQuestions: () => Promise<void>;
  sendMessage: (
    content: string,
    type?: "TEXT" | "CUSTOM_QUESTION",
    customQuestionId?: number
  ) => Promise<void>;
  editMessage: (messageId: number, newContent: string) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  retry: () => Promise<void>;
  clearError: () => void;
  isSendingMessage: boolean;
  isLoadingMoreMessages: boolean;
}

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined
);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, token } = useAuth();

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMoreMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  const unsubscribeRef = useRef<(() => void) | null>(null);

 const loadConversations = useCallback(async () => {
  if (!user) return;
  
  try {
    setIsLoading(true);
    setError(null);
    
    const chatList = await chatAPI.getConversations(user.id);
    
    // ✅ Transform chats to show the OTHER person's info
    const transformedChats = chatList.map((chat: Chat) => {
      const isCustomer = user.id === chat.customerId;
      
      return {
        ...chat,
        otherPersonId: isCustomer ? chat.employeeId : chat.customerId,
        otherPersonName: isCustomer ? chat.employeeName : chat.customerName,
        otherPersonEmail: isCustomer ? chat.employeeEmail : chat.customerEmail,
      };
    });
    
    setChats(transformedChats);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load conversations';
    console.error('❌ Load conversations error:', err);
    setError(errorMessage);
    setChats([]);
  } finally {
    setIsLoading(false);
  }
}, [user]);

  // ✅ Make sure this function exists
  const loadCustomQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const questions = await chatAPI.getCustomQuestions();
      setCustomQuestions(questions);
    } catch (err) {
      console.error('Failed to load custom questions:', err);
      setError('Failed to load quick responses');
    } finally {
      setIsLoading(false);
    }
  }, []);

   const handleRealTimeMessage = useCallback((payload: any) => {
  const isDev = import.meta.env.DEV; // ✅ Use Vite's environment variable instead of process.env
  
  if (isDev) console.log('🔔 Real-time message received:', payload);
  
  if (payload.action === 'NEW_MESSAGE') {
    const message = payload.message;
    if (!message || !message.id) {
      console.error('Invalid message format:', message);
      return;
    }
    
    setMessages(prevMessages => {
      const exists = prevMessages.some(msg => msg.id === message.id);
      if (exists) {
        if (isDev) console.log('⚠️ Message already exists, skipping');
        return prevMessages;
      }
      if (isDev) console.log('📝 Adding new message:', message.id);
      return [message, ...prevMessages];
    });
  } 
  else if (payload.action === 'EDIT_MESSAGE') {
    const message = payload.message;
    if (isDev) console.log('✏️ Updating edited message:', message.id);
    setMessages(prevMessages =>
      prevMessages.map(msg =>
        msg.id === message.id ? message : msg
      )
    );
  }
  else if (payload.action === 'DELETE_MESSAGE') {
    const { messageId } = payload;
    if (isDev) console.log('🗑️ Removing deleted message:', messageId);
    setMessages(prevMessages =>
      prevMessages.filter(msg => msg.id !== messageId)
    );
  }
  else {
    // Backward compatibility
    if (payload.id) {
      setMessages(prevMessages => {
        const exists = prevMessages.some(msg => msg.id === payload.id);
        if (exists) return prevMessages;
        return [payload, ...prevMessages];
      });
    }
  }
}, []);
  const initializeWebSocket = useCallback(async () => {
    try {
      await webSocketService.connect(token || undefined);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error("WebSocket connection failed:", err);
      setIsConnected(false);
    }
  }, [token]);

  const loadInitialData = useCallback(async () => {
    await Promise.all([loadConversations(), loadCustomQuestions()]);
  }, [loadConversations, loadCustomQuestions]);

  useEffect(() => {
    if (token && user) {
      initializeWebSocket();
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      webSocketService.disconnect();
    };
  }, [token, user, initializeWebSocket]);

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user, loadInitialData]);

  const loadMessages = useCallback(async (chatId: number, page = 0) => {
  console.log(`📞 Loading messages for chat ${chatId}, page ${page}`);
  setIsLoading(true);
  setError(null);
  
  try {
    const response = await chatAPI.getMessages(chatId, page, 50);
    console.log('✅ Messages loaded:', response);
    
    // ✅ Make sure response is an array
    const messageList = Array.isArray(response) ? response : [];
    
    if (page === 0) {
      // First page - replace all messages
      setMessages(messageList);
      console.log(`📝 Set ${messageList.length} messages for chat ${chatId}`);
    } else {
      // Additional pages - append to existing messages
      setMessages(prev => [...prev, ...messageList]);
      console.log(`📝 Added ${messageList.length} more messages`);
    }
    
    setCurrentPage(page);
    setHasMoreMessages(messageList.length === 50); // If we got 50, there might be more
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load messages';
    console.error('❌ Load messages error:', err);
    setError(errorMessage);
    setMessages([]); // Clear messages on error
  } finally {
    setIsLoading(false);
  }
}, []);
  const selectChat = useCallback(
  async (chat: Chat) => {
    // ✅ Prevent selecting the same chat twice
    if (selectedChat?.id === chat.id) {
      console.log('⚠️ Chat already selected:', chat.id);
      return;
    }

    console.log('🎯 Selecting chat:', chat.id);

    // ✅ Unsubscribe from previous chat's WebSocket
    if (unsubscribeRef.current) {
      console.log('📡 Unsubscribing from previous chat');
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // ✅ Reset state
    setSelectedChat(chat);
    setMessages([]);
    setCurrentPage(0);
    setHasMoreMessages(true);
    setError(null);

    // ✅ Load messages with error handling
    try {
      console.log(`📞 Loading messages for chat ${chat.id}`);
      await loadMessages(chat.id, 0);
      console.log(`✅ Messages loaded for chat ${chat.id}`);

      // ✅ Subscribe to WebSocket for this chat
      if (isConnected) {
        console.log(`📡 Subscribing to WebSocket for chat ${chat.id}`);
        unsubscribeRef.current = webSocketService.subscribeToChat(
          chat.id,
          handleRealTimeMessage
        );
      }
    } catch (error) {
      console.error('❌ Error selecting chat:', error);
      setError('Failed to load messages');
    }
  },
  [selectedChat, isConnected, handleRealTimeMessage, loadMessages] // 🛠️ Added loadMessages to dependencies
);

  const loadMoreMessages = useCallback(async () => {
    if (!selectedChat || !hasMoreMessages || isLoadingMoreMessages) return;
    await loadMessages(selectedChat.id, currentPage + 1);
  }, [selectedChat, hasMoreMessages, isLoadingMoreMessages, currentPage, loadMessages]);

  const sendMessage = useCallback(async (
  content: string, 
  type: 'TEXT' | 'CUSTOM_QUESTION' = 'TEXT', 
  customQuestionId?: number
) => {
  if (!selectedChat || !user) {
    throw new Error('No chat selected or user not authenticated');
  }
  
  setIsSendingMessage(true);
  setError(null);
  
  try {
    console.log('📤 Sending message:', { chatId: selectedChat.id, senderId: user.id, content, type });
    
    const response = await chatAPI.sendMessage({
      chatId: selectedChat.id,
      senderId: user.id,
      content,
      type,
      customQuestionId
    });
    
    console.log('✅ Message sent, response:', response);
    
    // ✅ IMPORTANT: Validate response structure before using it
    if (!response || typeof response !== 'object') {
      console.error('Invalid response structure:', response);
      throw new Error('Invalid message response from server');
    }
    
    // Create a properly structured message object
    const newMessage: Message = {
      id: response.id || Date.now(), // Fallback to timestamp if no ID
      chatId: response.chatId || selectedChat.id,
      senderId: response.senderId || user.id,
      sender: response.sender || {
        id: user.id,
        fullName: user.fullName || '',
        email: user.email || '',
        role: user.role || 'CUSTOMER'
      },
      content: response.content || content,
      type: response.type || type,
      createdAt: response.createdAt || new Date().toISOString(),
      updatedAt: response.updatedAt,
      isEdited: response.isEdited || response.edited || false,
      customQuestionId: response.customQuestionId
    };
    
    console.log('📝 Adding message to state:', newMessage);
    
    // ✅ Add message safely - DON'T add if WebSocket already added it
    setMessages(prevMessages => {
      // Check if message already exists (via WebSocket)
      const exists = prevMessages.some(msg => msg.id === newMessage.id);
      if (exists) {
        console.log('⚠️ Message already exists (from WebSocket), not adding again');
        return prevMessages;
      }
      // Add to beginning (newest first)
      return [newMessage, ...prevMessages];
    });
    
    console.log('✅ Message added to state successfully');
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
    console.error('❌ Send message error:', err);
    setError(errorMessage);
    throw err;
  } finally {
    setIsSendingMessage(false);
  }
}, [selectedChat, user]);

  const editMessage = useCallback(async (messageId: number, newContent: string) => {
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  setError(null);
  
  try {
    console.log(`✏️ Editing message ${messageId}`);
    
    const response = await chatAPI.editMessage(messageId, user.id, newContent);
    
    console.log('✅ Message edited successfully:', response);
    
    // Update the message in the state
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              content: response.content || newContent,
              isEdited: true,
              updatedAt: response.updatedAt || new Date().toISOString()
            }
          : msg
      )
    );
    
    return response;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to edit message';
    console.error('❌ Edit message error:', err);
    setError(errorMessage);
    throw err;
  }
}, [user]);

  const deleteMessage = useCallback(async (messageId: number) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    setError(null);
    
    try {
      console.log(`🗑️ Deleting message ${messageId}`);
      
      await chatAPI.deleteMessage(messageId, user.id);
      
      console.log('✅ Message deleted successfully');
      
      // Remove the message from the state
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete message';
      console.error('❌ Delete message error:', err);
      setError(errorMessage);
      throw err;
    }
  }, [user]);

  const retry = useCallback(async () => {
    setError(null);

    if (!isConnected && token) {
      await initializeWebSocket();
    }

    await loadInitialData();

    if (selectedChat) {
      await loadMessages(selectedChat.id, 0);
    }
  }, [isConnected, token, selectedChat, initializeWebSocket, loadInitialData, loadMessages]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

 

  // ✅ Memoize the context value to prevent unnecessary re-renders
const value: ChatContextType = useMemo(() => ({
  chats,
  selectedChat,
  messages,
  customQuestions,
  isLoading,
  isLoadingMoreMessages,
  isSendingMessage,
  isConnected,
  error,
  selectChat,
  loadConversations,
  loadCustomQuestions, // ✅ Add this line
  sendMessage,
  editMessage,
  deleteMessage,
  loadMoreMessages,
  retry,
  clearError,
}), [
  chats,
  selectedChat,
  messages,
  customQuestions,
  isLoading,
  isLoadingMoreMessages,
  isSendingMessage,
  isConnected,
  error,
  selectChat,
  loadConversations,
  loadCustomQuestions, // ✅ Add this line
  sendMessage,
  editMessage,
  deleteMessage,
  loadMoreMessages,
  retry,
  clearError,
]);

return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

