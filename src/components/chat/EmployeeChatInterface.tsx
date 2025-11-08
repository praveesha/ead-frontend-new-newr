import React from 'react';
import { Box, Typography } from '@mui/material';
import { useChat } from '../../contexts/ChatContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const EmployeeChatInterface: React.FC = () => {
  const chatContext = useChat();

  return (
    <Box sx={{ height: '100%', display: 'flex' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 320,
          minWidth: 280,
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2.5}}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontWeight: 600}}>
              Customer Chats
            </Typography>
            {chatContext.chats.length > 0 && (
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 600,
                  bgcolor: 'var(--color-primary)',
                  color: '#fff',
                }}
              >
                {chatContext.chats.length}
              </Box>
            )}
          </Box>
        </Box>

        {/* Chat list */}
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

      {/* Chat window */}
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

      {/* Customer info panel */}
      {chatContext.selectedChat && (
        <Box
          sx={{
            width: 256,
            minWidth: 240,
            borderLeft: '1px solid var(--color-border-primary)',
            p: 2.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2}}>
            Customer Details
          </Typography>
          <Box sx={{ display: 'grid', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" >
                Name
              </Typography>
              <Typography variant="body2">
                {chatContext.selectedChat.customerName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption">
                Email
              </Typography>
              <Typography variant="body2">
                {chatContext.selectedChat.customerEmail}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EmployeeChatInterface;