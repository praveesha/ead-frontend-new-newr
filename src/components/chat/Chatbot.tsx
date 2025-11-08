import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Fade,
  CircularProgress,
  Tooltip,
  Divider,
  Chip,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  DeleteOutline as ClearIcon,
} from '@mui/icons-material';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

interface Message {
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      text: 'Hello! I\'m your AI assistant. I can help you with appointment bookings, service information, and answer questions about our automobile service management system. How can I assist you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearConversation = () => {
    setMessages([
      {
        type: 'bot',
        text: 'Conversation cleared. How can I help you?',
        timestamp: new Date(),
      },
    ]);
    setShowQuickActions(true);
  };

  const handleQuickAction = (question: string) => {
    setInput(question);
    setShowQuickActions(false);
    // Auto-send after a brief moment
    setTimeout(() => {
      setInput(question);
      sendMessageWithText(question);
    }, 100);
  };

  const sendMessageWithText = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: Message = {
      type: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setShowQuickActions(false);

    try {
      const previousQuestions = messages
        .filter((m) => m.type === 'user')
        .map((m) => m.text)
        .slice(-5);

      const response = await axiosInstance.post(API_PATHS.CHATBOT.ASK, {
        question: userMessage.text,
        previousQuestions: previousQuestions,
      });

      const botMessage: Message = {
        type: 'bot',
        text: response.data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        type: 'bot',
        text: 'I\'m sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    await sendMessageWithText(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const quickActions = [
    'How do I book an appointment?',
    'What services do you offer?',
    'Can I reschedule my appointment?',
    'What does PENDING status mean?',
  ];

  return (
    <>
      {/* Floating Chat Icon */}
      <Tooltip title="Chat with AI Assistant" placement="left">
        <IconButton
          onClick={toggleChat}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 60,
            height: 60,
            backgroundColor: '#D60507',
            color: '#FFFFFF',
            boxShadow: '0 4px 20px rgba(214, 5, 7, 0.4)',
            zIndex: 1300,
            '&:hover': {
              backgroundColor: '#B91C1C',
              transform: 'scale(1.05)',
              boxShadow: '0 6px 24px rgba(214, 5, 7, 0.5)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isOpen ? <CloseIcon fontSize="large" /> : <ChatIcon fontSize="large" />}
        </IconButton>
      </Tooltip>

      {/* Chat Window */}
      <Fade in={isOpen}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: { xs: 'calc(100vw - 48px)', sm: 400 },
            height: { xs: 'calc(100vh - 140px)', sm: 600 },
            maxHeight: 'calc(100vh - 140px)',
            display: isOpen ? 'flex' : 'none',
            flexDirection: 'column',
            border: '1px solid rgba(212, 212, 216, 0.2)',
            borderRadius: 2,
            overflow: 'hidden',
            zIndex: 1299,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BotIcon />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  AI Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Online - Always here to help
                </Typography>
              </Box>
            </Box>
            <Tooltip title="Clear conversation">
              <IconButton
                onClick={clearConversation}
                size="small"
                sx={{
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                {message.type === 'bot' && (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <BotIcon sx={{ fontSize: 18 }} />
                  </Box>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      borderTopRightRadius: message.type === 'user' ? 0 : 2,
                      borderTopLeftRadius: message.type === 'bot' ? 0 : 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.6,
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      alignSelf: message.type === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {formatTime(message.timestamp)}
                  </Typography>
                </Box>

                {message.type === 'user' && (
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 18 }} />
                  </Box>
                )}
              </Box>
            ))}

            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignSelf: 'flex-start',
                  maxWidth: '85%',
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BotIcon sx={{ fontSize: 18}} />
                </Box>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    borderTopLeftRadius: 0,
                  }}
                >
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}

            {/* Quick Action Buttons */}
            {showQuickActions && messages.length === 1 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                <Typography variant="caption" sx={{ color: '#A1A1AA', px: 1 }}>
                  Quick questions:
                </Typography>
                {quickActions.map((question, index) => (
                  <Chip
                    key={index}
                    label={question}
                    onClick={() => handleQuickAction(question)}
                    sx={{
                      border: '1px solid rgba(212, 212, 216, 0.2)',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#4E4E4F',
                        borderColor: '#D60507',
                      },
                      justifyContent: 'flex-start',
                      height: 'auto',
                      py: 1,
                      px: 2,
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        textAlign: 'left',
                      },
                    }}
                  />
                ))}
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          <Divider sx={{ borderColor: 'rgba(212, 212, 216, 0.2)' }} />

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={3}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              inputRef={inputRef}
              
            />
            <IconButton
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
};
