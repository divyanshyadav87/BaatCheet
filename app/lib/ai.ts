// app/lib/ai.ts
import { Configuration, OpenAIApi } from 'openai';

const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

/** Simple wrapper to call OpenAI or Gemini based on env */
export const generateAIResponse = async (prompt: string): Promise<string> => {
  if (geminiKey) {
    // Using @google/generative-ai library (already in deps)
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response?.text();
    return text ?? '';
  }
  if (openaiKey) {
    const config = new Configuration({ apiKey: openaiKey });
    const openai = new OpenAIApi(config);
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    });
    return response.data.choices[0].message?.content ?? '';
  }
  throw new Error('No AI provider configured. Set OPENAI_API_KEY or GEMINI_API_KEY.');
};
