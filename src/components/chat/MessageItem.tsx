import React, { useState } from 'react';
import type { Message } from '../../types/chat';

interface MessageItemProps {
  message: Message;
  currentUserId: number;
  onEdit: (messageId: number, newContent: string) => Promise<void>;
  onDelete: (messageId: number) => Promise<void>;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  currentUserId, 
  onEdit, 
  onDelete 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [isDeleting, setIsDeleting] = useState(false);
  


  const isOwnMessage = message.senderId === currentUserId;


  // ✅ If message is deleted, show placeholder
    if (message.isDeleted) {
      return (
        <div
          style={{
            padding: '12px',
            margin: '8px 0',
            backgroundColor: '#1A1A1A',
            borderRadius: '8px',
            opacity: 0.5,
            fontStyle: 'italic',
            color: '#666'
          }}
        >
          <p style={{ margin: 0 }}>🗑️ [Message deleted]</p>
          <small style={{ fontSize: '11px' }}>
            {new Date(message.createdAt).toLocaleTimeString()}
          </small>
        </div>
      );
    }
  
  const handleEdit = async () => {
    if (editContent.trim() === message.content || !editContent.trim()) {
      setIsEditing(false);
      return;
    }
    
    try {
      await onEdit(message.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to edit message:', error);
      alert('Failed to edit message');
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await onDelete(message.id);
    } catch (error) {
      console.error('Failed to delete message:', error);
      alert('Failed to delete message');
      setIsDeleting(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditContent(message.content);
      setIsEditing(false);
    }
  };
  
  if (isDeleting) {
    return null; // Hide while deleting
  }
  
  return (
    <div
      style={{
        padding: '12px',
        margin: '8px 0',
        backgroundColor: isOwnMessage ? '#0D47A1' : '#2A2A2A',
        borderRadius: '8px',
        textAlign: isOwnMessage ? 'right' : 'left',
        maxWidth: '80%',
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
        position: 'relative',
        opacity: isDeleting ? 0.5 : 1
      }}
    >
      {/* Message Header */}
      <div style={{ 
        marginBottom: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <strong style={{ fontSize: '14px', color: '#B3B3B3' }}>
          {message.sender?.fullName || `User ${message.senderId}`}
        </strong>
        
        {/* Edit/Delete Buttons for Own Messages */}
        {isOwnMessage && !isEditing && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFF',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '2px 6px'
              }}
              title="Edit message"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FFF',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '2px 6px'
              }}
              title="Delete message"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
      
      {/* Message Content */}
      {isEditing ? (
        <div style={{ marginTop: '8px' }}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '8px',
              backgroundColor: '#1A1A1A',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '4px',
              resize: 'vertical',
              fontSize: '14px'
            }}
          />
          <div style={{ 
            marginTop: '8px', 
            display: 'flex', 
            gap: '8px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => {
                setEditContent(message.content);
                setIsEditing(false);
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={!editContent.trim() || editContent.trim() === message.content}
              style={{
                padding: '6px 12px',
                backgroundColor: editContent.trim() && editContent.trim() !== message.content ? '#4CAF50' : '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: editContent.trim() && editContent.trim() !== message.content ? 'pointer' : 'not-allowed',
                fontSize: '12px'
              }}
            >
              Save
            </button>
          </div>
          <small style={{ color: '#999', fontSize: '11px', marginTop: '4px', display: 'block' }}>
            Press Enter to save, Esc to cancel
          </small>
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: '15px', wordBreak: 'break-word' }}>
          {message.content}
        </p>
      )}
      
      {/* Message Footer */}
      <div style={{ 
        marginTop: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        opacity: 0.7
      }}>
        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
        {message.isEdited && (
          <span style={{ fontStyle: 'italic' }}>(edited)</span>
        )}
      </div>
    </div>
  );
};

export default MessageItem;