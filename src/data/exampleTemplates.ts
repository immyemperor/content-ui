import { QuestionTemplate } from '../types/questionTemplate';

export const exampleTemplates: QuestionTemplate[] = [
  {
    id: 'example-1',
    name: 'Basic Concept MCQ',
    type: 'mcq',
    template: 'What is [TOPIC] in the context of [FIELD]?\n[OPTIONS]\nCorrect: [ANSWER]',
    subject: 'General',
    difficulty: 'easy',
    category: 'Concepts',
    description: 'Basic multiple choice question about a concept',
    variables: ['TOPIC', 'FIELD', 'OPTIONS', 'ANSWER'],
    examples: [
      'What is Machine Learning in the context of Artificial Intelligence?',
      'What is Photosynthesis in the context of Biology?'
    ],
    isPublic: true,
    formatInstructions: 'Replace [TOPIC] with the main concept, [FIELD] with the subject area, and [OPTIONS] with 4 options A) to D)',
    language: 'en'
  },
  {
    id: 'example-2',
    name: 'Compare and Contrast',
    type: 'open_ended',
    template: 'Compare and contrast [TOPIC1] and [TOPIC2] in terms of their [ASPECT]. Discuss at least three key differences and similarities.',
    subject: 'Analysis',
    difficulty: 'medium',
    category: 'Critical Thinking',
    description: 'Question that requires comparing two related concepts',
    variables: ['TOPIC1', 'TOPIC2', 'ASPECT'],
    examples: [
      'Compare and contrast RAM and ROM in terms of their storage characteristics.',
      'Compare and contrast mitosis and meiosis in terms of their cellular processes.'
    ],
    isPublic: true,
    formatInstructions: 'Replace [TOPIC1] and [TOPIC2] with related concepts, and [ASPECT] with the comparison criteria',
    language: 'en'
  },
  {
    id: 'example-3',
    name: 'Problem-Solving MCQ',
    type: 'mcq',
    template: 'Given [SCENARIO], what would be the most appropriate [ACTION] to [GOAL]?\n[OPTIONS]\nCorrect: [ANSWER]',
    subject: 'Problem Solving',
    difficulty: 'hard',
    category: 'Application',
    description: 'Scenario-based multiple choice question',
    variables: ['SCENARIO', 'ACTION', 'GOAL', 'OPTIONS', 'ANSWER'],
    examples: [
      'Given a database with increasing response times, what would be the most appropriate optimization technique to improve performance?',
      'Given a patient with high blood pressure, what would be the most appropriate lifestyle change to reduce cardiovascular risk?'
    ],
    isPublic: true,
    formatInstructions: 'Replace [SCENARIO] with a practical situation, [ACTION] with a type of solution, and [GOAL] with the desired outcome',
    language: 'en'
  },
  {
    id: 'example-4',
    name: 'Implementation Steps',
    type: 'open_ended',
    template: 'Explain the step-by-step process to implement [TOPIC] in [CONTEXT]. Include any necessary [REQUIREMENTS] and potential challenges.',
    subject: 'Implementation',
    difficulty: 'medium',
    category: 'Practical Application',
    description: 'Question about implementation steps',
    variables: ['TOPIC', 'CONTEXT', 'REQUIREMENTS'],
    examples: [
      'Explain the step-by-step process to implement authentication in a web application. Include any necessary security measures and potential challenges.',
      'Explain the step-by-step process to implement a binary search tree. Include any necessary data structures and potential challenges.'
    ],
    isPublic: true,
    formatInstructions: 'Replace [TOPIC] with the implementation subject, [CONTEXT] with the environment or situation, and [REQUIREMENTS] with specific needs',
    language: 'en'
  },
  {
    id: 'example-5',
    name: 'Best Practice MCQ',
    type: 'mcq',
    template: 'Which of the following is the best practice for [TOPIC] when dealing with [SITUATION]?\n[OPTIONS]\nCorrect: [ANSWER]',
    subject: 'Best Practices',
    difficulty: 'medium',
    category: 'Professional Knowledge',
    description: 'Question about industry best practices',
    variables: ['TOPIC', 'SITUATION', 'OPTIONS', 'ANSWER'],
    examples: [
      'Which of the following is the best practice for error handling when dealing with API responses?',
      'Which of the following is the best practice for data backup when dealing with critical business information?'
    ],
    isPublic: true,
    formatInstructions: 'Replace [TOPIC] with the subject of best practice, and [SITUATION] with the specific scenario',
    language: 'en'
  }
];
