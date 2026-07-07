import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ayah } from '../models/types';

const API_KEY_SECURE_KEY = 'secure_dhikr_groq_api_key';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizData {
  questions: QuizQuestion[];
}

class GroqService {
  private apiKey: string | null = null;
  private loaded = false;

  async getApiKey(): Promise<string | null> {
    if (this.apiKey) return this.apiKey;

    // 1. Try reading from device-level hardware keychain
    try {
      const securedKey = await SecureStore.getItemAsync(API_KEY_SECURE_KEY);
      if (securedKey && securedKey.trim()) {
        this.apiKey = securedKey.trim();
        return this.apiKey;
      }
    } catch (e) {
      console.warn('Error reading from SecureStore:', e);
    }

    // 2. Fallback to bundled environment variable, write to secure store if found
    const envKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
    if (envKey && envKey.trim()) {
      const trimmed = envKey.trim();
      this.apiKey = trimmed;
      try {
        await SecureStore.setItemAsync(API_KEY_SECURE_KEY, trimmed);
      } catch (e) {
        console.warn('Error writing to SecureStore:', e);
      }
      return this.apiKey;
    }

    return null;
  }


  async canGenerateQuiz(): Promise<boolean> {
    // Enable unlimited generation during development/testing
    if (__DEV__) {
      return true;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = await AsyncStorage.getItem('@dhikr_last_quiz_date');
      return lastDate !== today;
    } catch {
      return true;
    }
  }

  async recordQuizGeneration(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem('@dhikr_last_quiz_date', today);
    } catch (e) {
      console.warn('Error saving quiz generation date:', e);
    }
  }

  async generateQuiz(ayahs: Ayah[]): Promise<QuizQuestion[]> {
    const key = await this.getApiKey();
    if (!key) {
      throw new Error('API_KEY_MISSING');
    }

    // Check rate limit (1 time per day)
    const canGen = await this.canGenerateQuiz();
    if (!canGen) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }

    // Prepare verses summary for the prompt
    const versesContent = ayahs
      .map(
        (a) =>
          `Surah ${a.surah}, Ayah ${a.ayah}:
Arabic: ${a.arabic}
Translation: ${a.english}`
      )
      .join('\n\n');

    const systemPrompt = `You are an expert Islamic studies tutor aligned with the creed and teachings of the Ahl-e-Sunnat wal Jama'at.
You will generate highly detailed, educational multiple-choice questions in English that go beyond simple translation matching. Do NOT ask basic questions like "What does this Arabic word translate to?" or "What is the translation of Ayah X?". Instead, focus on:
- Historical contexts and circumstances of revelation (Asbab al-Nuzul) of these verses.
- Deeper theological lessons and creed (Aqeedah of Ahl-e-Sunnat wal Jama'at) derived from the verses.
- Character-building, spiritual wisdom, and moral guidelines (Akhlaq and Tasawwuf) taught by these verses.
- Nuances in classical Hanafi jurisprudence or Sunni interpretations.
- Explanations must be incredibly detailed, acting as a mini-lesson teaching the historical and theological background of the answer so that the user learns a great deal by reading it.

Ensure that all questions, options, and explanations reflect supreme respect for Allah, the Holy Prophet Muhammad ﷺ (using appropriate honorifics like ﷺ), his noble Sahaba (Companions), and his Ahl al-Bayt (Family). Ensure references use respected Sunni sources (like Kanzul Iman by Ala Hazrat Imam Ahmad Raza Khan).
Avoid any sectarian debates, and keep the output in English only.

JSON Format:
{
  "questions": [
    {
      "question": "Thought-provoking question text?",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswerIndex": 0, // 0-based index of correct option
      "explanation": "Detailed explanation that serves as a mini-lesson, explaining the context, historical events, or theological basis for the correct answer."
    }
  ]
}`;

    const userPrompt = `Here are the verses to base the quiz on. Generate exactly 10 high-quality, educational multiple-choice questions about these verses.
Do NOT generate simple vocabulary translation questions. Make them detailed and educational so the user can learn.

The 10 questions must be distributed as follows:
- 3 Simple/Easy questions (testing high-level moral guidelines, clear commands, or general summaries of the verses).
- 3 Medium questions (testing theological lessons, spiritual wisdom, or general connections to Islamic history).
- 4 Hard/Difficult questions (testing circumstances of revelation/Asbab al-Nuzul, specific events during the Prophet's ﷺ life related to the verses, or nuanced theological concepts).

Verses:
${versesContent}`;

    const FALLBACK_MODELS = [
      'meta-llama/llama-4-scout-17b-16e-instruct',
      'allam-2-7b',
      'llama-3.3-70b-versatile',
      'openai/gpt-oss-120b',
      'llama-3.1-8b-instant'
    ];

    let lastError: any = null;

    for (let i = 0; i < FALLBACK_MODELS.length; i++) {
      const model = FALLBACK_MODELS[i];
      console.log(`[GroqService] Attempting to generate quiz with model: ${model} (Attempt ${i + 1}/${FALLBACK_MODELS.length})`);
      
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.5,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[GroqService] Model ${model} failed with status ${response.status}:`, errText);
          lastError = new Error(`GROQ_API_ERROR: ${response.status} (${errText})`);
          continue; // Try next model
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (!content) {
          console.warn(`[GroqService] Model ${model} returned empty content.`);
          lastError = new Error('GROQ_EMPTY_RESPONSE');
          continue; // Try next model
        }

        const parsed: QuizData = JSON.parse(content);
        if (!parsed.questions || !Array.isArray(parsed.questions)) {
          console.warn(`[GroqService] Model ${model} returned invalid JSON format.`);
          lastError = new Error('GROQ_INVALID_JSON');
          continue; // Try next model
        }

        // Successfully generated! Record usage and return.
        await this.recordQuizGeneration();
        return parsed.questions;

      } catch (e: any) {
        console.warn(`[GroqService] Exception occurred using model ${model}:`, e);
        lastError = e;
        // Continue to fallback
      }
    }

    console.error('[GroqService] All fallback models failed to generate the quiz.');
    throw lastError || new Error('GROQ_ALL_MODELS_FAILED');
  }
}

export const groqService = new GroqService();
