import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface LocalQuestion {
  id: string;
  type: string;
  text: string;
  image: string | null;
  options?: { id: string; text: string; isCorrect: boolean }[];
  explanation?: string;
  correctAnswer?: string; // For fill-in-the-blank
}

interface LocalQuiz {
  id: string;
  title: string;
  category: string;
  questions: LocalQuestion[];
}

async function seedQuestions() {
  console.log('Starting seed process...');

  const dataPath = path.join(__dirname, '../src/data/ykb_quizzes.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const quizzes: LocalQuiz[] = JSON.parse(rawData);

  for (const quiz of quizzes) {
    console.log(`Processing quiz: ${quiz.title} (${quiz.category})`);

    for (const q of quiz.questions) {
      const sourceKey = `local:${quiz.id}:${q.id}`;
      
      // Upsert Question
      const { data: questionData, error: questionError } = await supabase
        .from('questions')
        .upsert({
          source_key: sourceKey,
          category: quiz.category,
          topic: quiz.title, // Using quiz title as topic for now
          question_text: q.text,
          explanation: q.explanation,
          image_url: q.image,
          is_active: true,
          difficulty: 1 // Default difficulty
        }, { onConflict: 'source_key' })
        .select()
        .single();

      if (questionError) {
        console.error(`Error inserting question ${q.id}:`, questionError);
        continue;
      }

      const questionId = questionData.id;

      // Upsert Choices
      if (q.options) {
        // First, delete existing choices for this question to handle updates cleanly (simple approach)
        // Or better, upsert based on choice text + question_id if we had a unique constraint there.
        // For simplicity in this seed script, we'll delete and re-insert choices to ensure sync.
        await supabase.from('choices').delete().eq('question_id', questionId);

        const choicesToInsert = q.options.map((opt, index) => ({
          question_id: questionId,
          choice_text: opt.text,
          is_correct: opt.isCorrect,
          sort_order: index
        }));

        const { error: choicesError } = await supabase
          .from('choices')
          .insert(choicesToInsert);

        if (choicesError) {
          console.error(`Error inserting choices for question ${q.id}:`, choicesError);
        }
      } else if (q.type === 'fill-blank' && q.correctAnswer) {
         // Handle fill-in-the-blank as a choice? Or just store it?
         // Our schema expects choices for multiple choice. 
         // For fill-in-the-blank, we might need a different structure or just store the correct answer as a "choice"
         // Let's store it as a single correct choice for now to fit the schema
         await supabase.from('choices').delete().eq('question_id', questionId);
         
         const { error: choiceError } = await supabase.from('choices').insert({
            question_id: questionId,
            choice_text: q.correctAnswer,
            is_correct: true,
            sort_order: 0
         });
         
         if (choiceError) {
            console.error(`Error inserting fill-blank answer for question ${q.id}:`, choiceError);
         }
      }
    }
  }

  console.log('Seed process completed!');
}

seedQuestions().catch(console.error);
