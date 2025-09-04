export interface User {
  id: string;
  username: string;
  email?: string;
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

export interface Assessment {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export type QuestionType = 'multiple_choice' | 'short_answer' | 'coding';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  assessmentId?: string;
  createdAt: string;
  updatedAt: string;
}
