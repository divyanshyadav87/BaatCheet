// app/lib/ai.ts
import OpenAI from 'openai';

const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

/** Simple wrapper to call OpenAI or Gemini based on env */
export const generateAIResponse = async (prompt: string): Promise<string> => {
  if (geminiKey) {
    // Using @google/generative-ai library (already in deps)
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(geminiKey);
    
    const modelsToTry = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-pro'];
    
    let lastError: any = null;
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });
        const result = await model.generateContent(prompt);
        return result.response?.text() ?? '';
      } catch (err: any) {
        lastError = err;
        console.warn(`[API] Model ${modelName} failed (${err.status || err.message}), trying fallback...`);
        continue;
      }
    }
    throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
  }
  if (openaiKey) {
    const openai = new OpenAI({ apiKey: openaiKey });
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    return response.choices[0].message?.content ?? '';
  }
  throw new Error('No AI provider configured. Set OPENAI_API_KEY or GEMINI_API_KEY.');
};
