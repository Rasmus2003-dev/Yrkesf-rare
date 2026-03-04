export type QuizCategory = 'YKB' | 'C' | 'CE' | 'D' | 'Gemensam' | 'ALL';

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type?: 'multiple-choice' | 'true-false' | 'fill-blank';
  text: string;
  image: string | null;
  options?: Option[];
  correctAnswer?: string;
  explanation?: string;
  category?: QuizCategory; // Added for Supabase integration
  difficulty?: number; // Added for Supabase integration
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  category: QuizCategory;
  questions: Question[];
}

// Supabase Types
export interface DatabaseQuestion {
  id: string;
  source_key: string;
  category: string;
  topic: string;
  difficulty: number;
  question_text: string;
  explanation: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseChoice {
  id: string;
  question_id: string;
  choice_text: string;
  is_correct: boolean;
  sort_order: number;
}

export interface Exam {
  id: string;
  user_id: string;
  category: string;
  status: 'started' | 'completed';
  score: number;
  total_questions: number;
  started_at: string;
  completed_at: string | null;
}
