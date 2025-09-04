import axios from 'axios';
import { QuestionTemplate } from '@/types/questionTemplate';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const templateService = {
  async getTemplates(): Promise<QuestionTemplate[]> {
    const response = await axios.get(`${API_BASE_URL}/templates`);
    return response.data;
  },

  async createTemplate(template: Omit<QuestionTemplate, 'id'>): Promise<QuestionTemplate> {
    const response = await axios.post(`${API_BASE_URL}/templates`, template);
    return response.data;
  },

  async updateTemplate(id: string, template: Partial<QuestionTemplate>): Promise<QuestionTemplate> {
    const response = await axios.put(`${API_BASE_URL}/templates/${id}`, template);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/templates/${id}`);
  },

  async getExampleTemplates(): Promise<QuestionTemplate[]> {
    const response = await axios.get(`${API_BASE_URL}/templates/examples`);
    return response.data;
  }
};
