import { NextResponse } from 'next/server';

// Mock storage for saved questions
let savedQuestions: any[] = [];

export async function POST(request: Request) {
  try {
    const questions = await request.json();

    if (!Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Invalid input: expected an array of questions' },
        { status: 400 }
      );
    }

    // Store the questions (in a real app, this would be a database call)
    savedQuestions = [...savedQuestions, ...questions];

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ 
      message: 'Questions saved successfully',
      count: questions.length 
    });
  } catch (error) {
    console.error('Error saving questions:', error);
    return NextResponse.json(
      { error: 'Failed to save questions' },
      { status: 500 }
    );
  }
}
