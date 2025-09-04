export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'assessment' | 'question';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  authorId: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  type: 'assessment' | 'question';
  category: string;
  tags?: string[];
  variables: string[];
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  authorId: string;
  passingScore?: number;
}

export type QuestionType = 'multiple_choice' | 'short_answer' | 'coding' | 'true_false' | 'essay';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  assessmentId?: string;
  explanation?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
