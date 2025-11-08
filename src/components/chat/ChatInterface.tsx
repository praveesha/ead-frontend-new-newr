import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const chatContext = useChat();

  useEffect(() => {
    if (user) {
      try {
        chatContext.loadConversations();
        chatContext.loadCustomQuestions();
      } catch (error) {
        console.error('Error loading chat data:', error);
      }
    }
  }, [user, chatContext.loadConversations, chatContext.loadCustomQuestions]);

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Authentication Required
          </Typography>
          <Typography variant="body2">
            Please log in to access the chat system.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 320,
          minWidth: 280,
          maxWidth: 360,
          borderRight: '1px solid var(--color-border-primary)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2.5, borderBottom: '1px solid var(--color-border-primary)' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Messages
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {user.fullName}
          </Typography>
        </Box>

        {/* Chat List */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5 }}>
          <ChatList
            chats={chatContext.chats}
            selectedChatId={chatContext.selectedChat?.id || null}
            onSelectChat={chatContext.selectChat}
            isLoading={chatContext.isLoading}
            error={chatContext.error}
            onRetry={chatContext.retry}
          />
        </Box>

      </Box>

      {/* Chat Window */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <ChatWindow
          selectedChat={chatContext.selectedChat}
          messages={chatContext.messages}
          customQuestions={chatContext.customQuestions}
          isLoadingMessages={chatContext.isLoading}
          isLoadingQuestions={chatContext.isLoading}
          error={chatContext.error}
          onSendMessage={chatContext.sendMessage}
          onEditMessage={chatContext.editMessage}
          onDeleteMessage={chatContext.deleteMessage}
          onRetry={chatContext.retry}
        />
      </Box>
    </Box>
  );
};

export default ChatInterface;