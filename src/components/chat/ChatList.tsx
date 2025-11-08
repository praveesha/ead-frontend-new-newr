import React from 'react';
import { Box, Typography, Avatar, Stack, Button, Skeleton,Card } from '@mui/material';
import type { Chat } from '../../types/chat';
import { useAuth } from '../../contexts/AuthContext';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chat: Chat) => void;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  onSelectChat,
  isLoading,
  error,
  onRetry,
}) => {
  const { user } = useAuth();

  const getOtherPerson = (chat: Chat) => {
    const isCustomer = user?.id === chat.customerId;
    return {
      name: (isCustomer ? chat.employeeName : chat.customerName) || 'User',
      email: (isCustomer ? chat.employeeEmail : chat.customerEmail) || 'N/A',
      id: isCustomer ? chat.employeeId : chat.customerId,
    };
  };

  const getInitials = (name?: string | null): string => {
    if (!name || !name.trim()) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0]?.toUpperCase() || '?';
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m`;
      if (hours < 24) return `${hours}h`;
      if (days < 7) return `${days}d`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };

  const formatLastMessage = (content: string | null) => {
    if (!content) return 'No messages yet';
    return content.length > 40 ? `${content.substring(0, 40)}...` : content;
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              p: 1.5,
              borderRadius: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="80%" height={16} />
              </Box>
            </Stack>
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {error}
        </Typography>
        {onRetry && (
          <Button
            onClick={onRetry}
            size="small"
            variant="contained"
          >
            Retry
          </Button>
        )}
      </Box>
    );
  }

  if (chats.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <Typography variant="body2">
          No conversations yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gap: 1.5,border: '1px solid var(--color-border-primary)' }}>
      {chats.map((chat) => {
        const otherPerson = getOtherPerson(chat);

        return (
          <Card
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectChat(chat);
            }}
            sx={{
              p: 1.5,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': { opacity: 0.9 },
              border: '2px solid var(--color-border-primary)',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {getInitials(otherPerson.name)}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                  <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 600, }}
                  >
                    {otherPerson.name}
                  </Typography>
                  <Typography variant="caption" flexShrink={0}>
                    {formatTime(chat.lastMessageAt)}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{ color: 'var(--color-text-secondary)', pr: 1 }}
                  >
                    {formatLastMessage(chat.lastMessageContent)}
                  </Typography>

                  {chat.unreadCount > 0 && (
                    <Box
                      sx={{
                        px: 1,
                        minWidth: 20,
                        height: 20,
                        borderRadius: 10,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'var(--color-primary)',
                        color: '#fff',
                        fontSize: 11,
                        fontWeight: 700,
                        ml: 1,
                        flexShrink: 0,
                      }}
                    >
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </Box>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Card>
        );
      })}
    </Box>
  );
};

export default ChatList;