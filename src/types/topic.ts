export interface Topic {
  id: string;
  name: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  type: 'multiple_choice' | 'text';
  difficulty?: 'easy' | 'medium' | 'hard';
}
