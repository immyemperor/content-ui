import { NextResponse } from 'next/server';

// Mock data generation based on topic and difficulty
const generateQuestionText = (topic: string, subtopic: string, difficulty: string): string => {
  const difficultyPrefixes = {
    easy: ['Explain', 'Describe', 'List', 'Define', 'Identify'],
    medium: ['Compare', 'Analyze', 'Differentiate', 'Evaluate', 'Discuss'],
    hard: ['Critique', 'Synthesize', 'Assess', 'Propose', 'Design']
  };

  const prefixes = difficultyPrefixes[difficulty as keyof typeof difficultyPrefixes] || difficultyPrefixes.medium;
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  return `${prefix} the ${subtopic ? `${subtopic} in context of ${topic}` : topic}.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, subtopic, difficulty, numberOfQuestions, type = 'coding' } = body;

    // Validate input
    if (!topic || !numberOfQuestions || numberOfQuestions < 10 || numberOfQuestions > 30) {
      return NextResponse.json(
        { error: 'Invalid input parameters' },
        { status: 400 }
      );
    }

    // Generate mock questions based on type
    const questions = Array.from({ length: numberOfQuestions }, (_, index) => {
      const baseQuestion = {
        id: crypto.randomUUID(),
        type: type,
        difficulty_level: difficulty,
        question_text: {
          text: generateQuestionText(topic, subtopic, difficulty),
          starter_code: type === 'coding' ? `def solution():\n    # Your code here\n    pass` : undefined
        },
        correct_answer: type === 'coding' ? `def solution():\n    # Sample solution\n    return True` : '',
        topic,
        explanation: {
          text: `This question tests ${topic} implementation skills at ${difficulty} level.`
        },
        images: {
          explanation: [],
          question: []
        },
        test_cases: type === 'coding' ? [
          {
            input: "example_input",
            expected_output: "example_output",
            description: "Default example test case",
            is_default: true
          },
          {
            input: { data: [1, 2, 3], operation: "sum" },
            expected_output: 6,
            description: "Basic operation test",
            is_default: false
          }
        ] : []
      };

      // Add type-specific fields
      if (type === 'mcq') {
        return {
          ...baseQuestion,
          options: [
            { id: crypto.randomUUID(), text: 'Option A', is_correct: true },
            { id: crypto.randomUUID(), text: 'Option B', is_correct: false },
            { id: crypto.randomUUID(), text: 'Option C', is_correct: false },
            { id: crypto.randomUUID(), text: 'Option D', is_correct: false }
          ]
        };
      } else if (type === 'true-false') {
        return {
          ...baseQuestion,
          correct_option: Math.random() > 0.5
        };
      } else if (type === 'code-output-mcq') {
        return {
          ...baseQuestion,
          code_snippet: `print("Hello, World!")\nfor i in range(3):\n    print(i)`,
          output_options: [
            { id: crypto.randomUUID(), text: 'Hello, World!\n0\n1\n2', is_correct: true },
            { id: crypto.randomUUID(), text: 'Hello, World!\n1\n2\n3', is_correct: false },
            { id: crypto.randomUUID(), text: 'Hello\n0\n1\n2', is_correct: false },
            { id: crypto.randomUUID(), text: 'Error', is_correct: false }
          ]
        };
      }

      return baseQuestion;
    });

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
