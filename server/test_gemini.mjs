// Quick test: verify Gemini API connectivity with new model
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    console.log('Testing Gemini API with gemini-3.8-flash...');
    const response = await genai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: 'Reply with exactly: GEMINI_OK' }] }],
      config: { temperature: 0 }
    });
    console.log('Gemini Response:', response.text);
    console.log('✅ Gemini API connection WORKS');
  } catch (err) {
    console.error('❌ Gemini API FAILED:', err.message);
  }
}

test();
