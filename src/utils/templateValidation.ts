import { QuestionTemplate } from '../types/questionTemplate';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface TemplateValidationRules {
  minLength?: number;
  maxLength?: number;
  requiredVariables?: string[];
  requiredFields?: string[];
  pattern?: string;
}

export const validateTemplate = (template: QuestionTemplate): ValidationResult => {
  const errors: string[] = [];
  const validationRules = template.validationRules || {
    minLength: 10,
    maxLength: 1000,
    requiredFields: ['name', 'template', 'type'],
    requiredVariables: ['TOPIC']
  };

  // Check required fields
  if (validationRules.requiredFields) {
    for (const field of validationRules.requiredFields) {
      if (!template[field as keyof QuestionTemplate]) {
        errors.push(`${field} is required`);
      }
    }
  }

  // Check template length
  if (validationRules.minLength && template.template.length < validationRules.minLength) {
    errors.push(`Template must be at least ${validationRules.minLength} characters long`);
  }
  if (validationRules.maxLength && template.template.length > validationRules.maxLength) {
    errors.push(`Template must not exceed ${validationRules.maxLength} characters`);
  }

  // Check required variables
  if (validationRules.requiredVariables) {
    for (const variable of validationRules.requiredVariables) {
      if (!template.template.includes(`[${variable}]`)) {
        errors.push(`Template must include [${variable}] variable`);
      }
    }
  }

  // Check pattern if specified
  if (validationRules.pattern && template.template) {
    const regex = new RegExp(validationRules.pattern);
    if (!regex.test(template.template)) {
      errors.push('Template format is invalid');
    }
  }

  // Type-specific validation
  if (template.type === 'mcq' && !template.template.includes('[OPTIONS]')) {
    errors.push('Multiple choice templates must include [OPTIONS] placeholder');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
