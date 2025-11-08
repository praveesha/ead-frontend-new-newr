import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';

class ChatAPIService {
  async getConversations(userId: number) {
    try {
      console.log(`📞 Fetching conversations for user ${userId}`);
      const response = await axiosInstance.get(API_PATHS.CHAT.CONVERSATIONS(userId));
      console.log(`✅ Conversations response:`, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  async getMessages(chatId: number, page = 0, size = 50) {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.CHAT.MESSAGES(chatId)}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  async sendMessage(messageData: {
    chatId: number;
    senderId: number;
    content: string;
    type: 'TEXT' | 'CUSTOM_QUESTION';
    customQuestionId?: number;
  }) {
    try {
      console.log('📤 Sending message:', messageData);
      const response = await axiosInstance.post(API_PATHS.CHAT.SEND, messageData);
      console.log('✅ Message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async editMessage(messageId: number, userId: number, newContent: string) {
    try {
      console.log(`✏️ Editing message ${messageId}:`, newContent);
      const response = await axiosInstance.put(
        `${API_PATHS.CHAT.EDIT(messageId)}?userId=${userId}`,
        newContent,
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      );
      console.log('✅ Message edited:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: number, userId: number) {
    try {
      console.log(`🗑️ Deleting message ${messageId}`);
      await axiosInstance.delete(
        `${API_PATHS.CHAT.DELETE(messageId)}?userId=${userId}`
      );
      console.log('✅ Message deleted');
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  async createChat(customerId: number, employeeId: number) {
    try {
      console.log(`📞 Creating chat: Customer ${customerId}, Employee ${employeeId}`);
      const response = await axiosInstance.post(
        `${API_PATHS.CHAT.CREATE}?customerId=${customerId}&employeeId=${employeeId}`
      );
      console.log('✅ Chat created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  }

  async getCustomQuestions() {
    try {
      const response = await axiosInstance.get(API_PATHS.CHAT.CUSTOM_QUESTIONS);
      return response.data;
    } catch (error) {
      console.error('Error fetching custom questions:', error);
      throw error;
    }
  }
}

export default new ChatAPIService();