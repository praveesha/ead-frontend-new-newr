import React, { useState, useEffect, useRef } from 'react';
import type { Chat, Message, CustomQuestion } from '../../types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface ChatWindowProps {
  selectedChat: Chat | null;
  messages: Message[];
  customQuestions: CustomQuestion[];
  isLoadingMessages: boolean;
  isLoadingQuestions: boolean;
  error: string | null;
  onSendMessage: (content: string, type?: 'TEXT' | 'CUSTOM_QUESTION', customQuestionId?: number) => Promise<void>;
  onEditMessage: (messageId: number, newContent: string) => Promise<void>;
  onDeleteMessage: (messageId: number) => Promise<void>;
  onRetry?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedChat,
  messages,
  customQuestions,
  isLoadingMessages,
  isLoadingQuestions,
  error,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onRetry,
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);

  const getOtherPerson = (chat: Chat) => {
    const isCustomer = user?.id === chat.customerId;
    return {
      name: (isCustomer ? chat.employeeName : chat.customerName) || 'User',
      email: (isCustomer ? chat.employeeEmail : chat.customerEmail) || '',
      id: isCustomer ? chat.employeeId : chat.customerId,
    };
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0]?.toUpperCase() || '?';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEditMessage = async (messageId: number, newContent: string) => {
    setEditingMessageId(messageId);
    try {
      await onEditMessage(messageId, newContent);
    } finally {
      setEditingMessageId(null);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    setDeletingMessageId(messageId);
    try {
      await onDeleteMessage(messageId);
    } finally {
      setDeletingMessageId(null);
    }
  };

  // No chat selected
  if (!selectedChat) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box textAlign="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              mx: 'auto',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            Select a conversation
          </Typography>
          <Typography variant="body2">
            Choose a chat from the list to start messaging
          </Typography>
        </Box>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >
        <Box textAlign="center" sx={{ maxWidth: 420 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              mx: 'auto',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: 'var(--color-text-primary)' }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="contained"
            >
              Try Again
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  const otherPerson = getOtherPerson(selectedChat);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column'}}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid var(--color-border-primary)',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              sx={{
                color: '#fff',
                width: 40,
                height: 40,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {getInitials(otherPerson.name)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700}}>
                {otherPerson.name}
              </Typography>
              <Typography variant="body2">
                {otherPerson.email}
              </Typography>
            </Box>
          </Stack>

          <IconButton
            size="small"
            aria-label="Chat options"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {isLoadingMessages ? (
          <Box>
            {/* Keep your existing skeleton if you prefer, or replace with MUI Skeletons */}
            {/* <MessageSkeleton /> */}
            <Typography variant="body2">
              Loading messages...
            </Typography>
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                mx: 'auto',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Box>
            <Typography variant="body2">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === user?.id}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                isEditing={editingMessageId === message.id}
                isDeleting={deletingMessageId === message.id}
              />
            ))}
          </Stack>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 1.5 }}>
        <MessageInput
          onSendMessage={onSendMessage}
          customQuestions={customQuestions}
          disabled={isLoadingMessages || isLoadingQuestions}
          placeholder={
            isLoadingQuestions
              ? 'Loading quick responses...'
              : `Message ${otherPerson.name}...`
          }
        />
      </Box>
    </Box>
  );
};

export default ChatWindow;