import axios from 'axios';
import { Topic } from '@/types/topic';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const topicService = {
  async searchTopic(topic: string): Promise<Topic> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/topics/search`, { topic });
      return response.data;
    } catch (error) {
      console.error('Error searching topic:', error);
      throw error;
    }
  },

  async saveTopic(topic: Topic): Promise<Topic> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/topics`, topic);
      return response.data;
    } catch (error) {
      console.error('Error saving topic:', error);
      throw error;
    }
  }
};
