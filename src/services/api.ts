import axios from 'axios';
import type { Content, Template, Assessment } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const contentService = {
  // Content Management
  async getContents(): Promise<Content[]> {
    const response = await api.get('/contents');
    return response.data;
  },

  async getContent(id: string): Promise<Content> {
    const response = await api.get(`/contents/${id}`);
    return response.data;
  },

  async createContent(content: Omit<Content, 'id'>): Promise<Content> {
    const response = await api.post('/contents', content);
    return response.data;
  },

  async updateContent(id: string, content: Partial<Content>): Promise<Content> {
    const response = await api.put(`/contents/${id}`, content);
    return response.data;
  },

  async deleteContent(id: string): Promise<void> {
    await api.delete(`/contents/${id}`);
  },

  // Template Management
  async getTemplates(): Promise<Template[]> {
    const response = await api.get('/templates');
    return response.data;
  },

  async getTemplate(id: string): Promise<Template> {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  async createTemplate(template: Omit<Template, 'id'>): Promise<Template> {
    const response = await api.post('/templates', template);
    return response.data;
  },

  async updateTemplate(id: string, template: Partial<Template>): Promise<Template> {
    const response = await api.put(`/templates/${id}`, template);
    return response.data;
  },

  async deleteTemplate(id: string): Promise<void> {
    await api.delete(`/templates/${id}`);
  },

  // Assessment Management
  async getAssessments(): Promise<Assessment[]> {
    const response = await api.get('/assessments');
    return response.data;
  },

  async getAssessment(id: string): Promise<Assessment> {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  },

  async createAssessment(assessment: Omit<Assessment, 'id'>): Promise<Assessment> {
    const response = await api.post('/assessments', assessment);
    return response.data;
  },

  async updateAssessment(id: string, assessment: Partial<Assessment>): Promise<Assessment> {
    const response = await api.put(`/assessments/${id}`, assessment);
    return response.data;
  },

  async deleteAssessment(id: string): Promise<void> {
    await api.delete(`/assessments/${id}`);
  },
};
