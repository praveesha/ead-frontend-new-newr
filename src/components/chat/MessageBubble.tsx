import React, { useState } from 'react';
import type { Message } from '../../types/chat';
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  TextField,
  Tooltip,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onEdit?: (messageId: number, newContent: string) => Promise<void>;
  onDelete?: (messageId: number) => Promise<void>;
  isEditing?: boolean;
  isDeleting?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  onEdit,
  onDelete,
  isEditing = false,
  isDeleting = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showActions, setShowActions] = useState(false);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleEdit = async () => {
    const trimmed = editContent.trim();
    if (!onEdit || trimmed === message.content) {
      setIsEditMode(false);
      setEditContent(message.content);
      return;
    }

    try {
      await onEdit(message.id, trimmed);
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to edit message:', error);
      setEditContent(message.content);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    try {
      await onDelete(message.id);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  if (message.isDeleted) {
    return (
      <Box display="flex" justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'} mb={1.5}>
        <Box
          sx={{
            maxWidth: { xs: 320, lg: 560 },
            px: 1.5,
            py: 1,
            borderRadius: 1.5,
            opacity: 0.6,
            bgcolor: 'var(--color-bg-tertiary)',
            color: 'var(--color-text-tertiary)',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
              Message deleted
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block' }}>
            {formatTime(message.createdAt)}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'}
      mb={1.5}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Box sx={{ maxWidth: { xs: 320, lg: 560 }, order: isOwnMessage ? 2 : 1 }}>
        {/* Bubble */}
        <Box
          sx={{
            px: 2,
            py: 1.25,
            borderRadius: 2,
            borderTopRightRadius: isOwnMessage ? 4 : 16,
            borderTopLeftRadius: isOwnMessage ? 16 : 4,
            border: "1px solid var(--color-border-primary)",
            opacity: isDeleting ? 0.5 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {/* Type indicator */}
          {message.type === 'CUSTOM_QUESTION' && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1, opacity: 0.8 }}>
              <HelpOutlineIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">Quick Response</Typography>
            </Stack>
          )}

          {/* Edit mode */}
          {isEditMode ? (
            <Box>
              <TextField
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                multiline
                rows={3}
                fullWidth
                size="small"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isOwnMessage ? 'rgba(255,255,255,0.12)' : 'var(--color-bg-tertiary)',
                    color: isOwnMessage ? '#fff' : 'var(--color-text-primary)',
                    '& fieldset': { borderColor: 'var(--color-border-primary)' },
                    '&:hover fieldset': { borderColor: 'var(--color-border-primary)' },
                    '&.Mui-focused fieldset': { borderColor: 'var(--color-border-primary)' },
                  },
                  mb: 1,
                }}
                autoFocus
              />
              <Stack direction="row" spacing={1}>
                <Button
                  onClick={handleEdit}
                  disabled={isEditing}
                  size="small"
                  variant="contained"
                  sx={{
                    bgcolor: 'var(--color-primary)',
                    '&:hover': { bgcolor: 'var(--color-primary-dark)' },
                  }}
                >
                  {isEditing ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditMode(false);
                    setEditContent(message.content);
                  }}
                  size="small"
                  variant="outlined"
                  color="inherit"
                >
                  Cancel
                </Button>
              </Stack>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {message.content}
            </Typography>
          )}
        </Box>

        {/* Meta */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={isOwnMessage ? 'flex-end' : 'flex-start'}
          sx={{ mt: 0.5, px: 0.5 }}
        >
          <Typography variant="caption" sx={{ color: 'var(--color-text-tertiary)' }}>
            {formatTime(message.createdAt)}
          </Typography>
          {message.isEdited && (
            <Typography variant="caption" sx={{ color: 'var(--color-text-tertiary)' }}>
              (edited)
            </Typography>
          )}
          {!isOwnMessage && (
            <Typography variant="caption" sx={{ color: 'var(--color-text-tertiary)' }}>
              {message.sender?.fullName}
            </Typography>
          )}
        </Stack>

        {/* Actions */}
        {isOwnMessage && showActions && !isEditMode && (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end" sx={{ mt: 0.5 }}>
            {onEdit && (
              <Tooltip title="Edit message">
                <IconButton
                  size="small"
                  onClick={() => setIsEditMode(true)}
                  sx={{
                    bgcolor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-text-secondary)',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  <EditOutlinedIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
            {onDelete && (
              <Tooltip title="Delete message">
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  sx={{
                    bgcolor: 'var(--color-bg-tertiary)',
                    color: 'var(--color-primary)',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  <DeleteOutlineIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default MessageBubble;