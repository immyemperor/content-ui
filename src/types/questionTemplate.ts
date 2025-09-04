export interface QuestionTemplate {
  id: string;
  name: string;
  type: 'mcq' | 'open_ended';
  template: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  variables?: string[];
  examples?: string[];
  description?: string;
  isPublic?: boolean;
  language?: string;
  formatInstructions?: string;
  validationRules?: {
    minLength?: number;
    maxLength?: number;
    requiredFields?: string[];
    requiredVariables?: string[];
    pattern?: string;
  };
}
