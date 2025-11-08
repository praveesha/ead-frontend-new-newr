import React, { useState, useRef } from 'react';
import { Box, Stack, IconButton, Button, Popover, Typography, Divider, TextField } from '@mui/material';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type { CustomQuestion } from '../../types/chat';

interface MessageInputProps {
  onSendMessage: (content: string, type?: 'TEXT' | 'CUSTOM_QUESTION', customQuestionId?: number) => Promise<void>;
  customQuestions: CustomQuestion[];
  disabled?: boolean;
  placeholder?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  customQuestions,
  disabled = false,
  placeholder = 'Type your message...',
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const openQuick = Boolean(anchorEl);

  const handleOpenQuick = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget as HTMLElement);
  const handleCloseQuick = () => setAnchorEl(null);

  const handleSend = async (
    content: string,
    type: 'TEXT' | 'CUSTOM_QUESTION' = 'TEXT',
    customQuestionId?: number
  ) => {
    if (isSending || disabled) return;
    const trimmed = content.trim();
    if (!trimmed) return;

    setIsSending(true);
    try {
      await onSendMessage(trimmed, type, customQuestionId);
      setMessage('');
      // reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      handleCloseQuick();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(message);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }
  };

  const groupedQuestions = customQuestions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, CustomQuestion[]>);

  const categoryLabels: Record<string, string> = {
    SERVICE_STATUS: 'Service Status',
    PICKUP_READY: 'Pickup Ready',
    FEEDBACK: 'Feedback',
    GENERAL: 'General',
  };

  return (
    <Box sx={{ position: 'relative'}}>
      <Stack direction="row" spacing={1.5} alignItems="flex-end" sx={{ p: 1.5 }}>
        {customQuestions.length > 0 && (
          <IconButton
            onClick={openQuick ? handleCloseQuick : handleOpenQuick}
            disabled={disabled || isSending}
            sx={{
              bgcolor: openQuick ? 'var(--color-primary)' : 'var(--color-bg-tertiary)',
              color: openQuick ? '#fff' : 'var(--color-text-secondary)',
              '&:hover': { opacity: 0.9 },
              flexShrink: 0,
            }}
            title="Quick responses"
          >
            <QuizOutlinedIcon fontSize="small" />
          </IconButton>
        )}

        <TextField
          multiline
          minRows={1}
          maxRows={6}
          placeholder={placeholder}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSending}
          fullWidth
          inputRef={textareaRef}
          
        />

        <Button
          onClick={() => handleSend(message)}
          disabled={disabled || isSending || !message.trim()}
          variant="contained"
          endIcon={<SendRoundedIcon />}
          sx={{
            bgcolor: 'var(--color-primary)',
            '&:hover': { bgcolor: 'var(--color-primary-dark)' },
            boxShadow: 'none',
            flexShrink: 0,
          }}
        >
          Send
        </Button>
      </Stack>

      {/* Char count */}
      {message.length > 200 && (
        <Box sx={{ position: 'absolute', right: 16, bottom: 56 }}>
          <Typography variant="caption">
            {message.length}/1000
          </Typography>
        </Box>
      )}

      {/* Quick Responses Popover */}
      <Popover
        open={openQuick}
        anchorEl={anchorEl}
        onClose={handleCloseQuick}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{
          sx: {
            width: 420,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 320,
            overflowY: 'auto',
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              Quick Responses
            </Typography>
            <IconButton size="small" onClick={handleCloseQuick} sx={{ color: 'var(--color-text-tertiary)' }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>
          <Divider sx={{ mb: 1 }} />

          {Object.keys(groupedQuestions).length === 0 ? (
            <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
              No quick responses available
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2 }}>
              {Object.entries(groupedQuestions).map(([category, qs]) => (
                <Box key={category}>
                  <Typography
                    variant="overline"
                    sx={{ color: 'var(--color-text-secondary)', display: 'block', mb: 1, letterSpacing: 0.6 }}
                  >
                    {categoryLabels[category] || category}
                  </Typography>
                  <Stack spacing={1}>
                    {qs.map((q) => (
                      <Button
                        key={q.id}
                        onClick={() => handleSend(q.question, 'CUSTOM_QUESTION', q.id)}
                        disabled={isSending}
                        variant="outlined"
                        color="inherit"
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          borderColor: 'var(--color-border-primary)',
                          color: 'var(--color-text-primary)',
                          bgcolor: 'var(--color-bg-tertiary)',
                          '&:hover': { borderColor: 'var(--color-primary)' },
                        }}
                      >
                        {q.question}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default MessageInput;