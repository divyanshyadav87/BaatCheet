// app/lib/ai.ts
import OpenAI from 'openai';

const openaiKey = process.env.OPENAI_API_KEY;
const geminiKey = process.env.GEMINI_API_KEY;


export interface ImageContext {
  base64: string;
  mimeType: string;
}

/** Simple wrapper to call OpenAI or Gemini based on env */
export const generateAIResponse = async (prompt: string, imageContext?: ImageContext): Promise<string> => {
  if (geminiKey) {
    // Using @google/generative-ai library (already in deps)
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(geminiKey);
    
    // Updated to current stable multimodal models
    const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-flash-latest'];
    
    let lastError: any = null;
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });

        // Multimodal support: text + image
        const content: any[] = [{ text: prompt }];
        if (imageContext) {
          content.push({
            inlineData: {
              data: imageContext.base64,
              mimeType: imageContext.mimeType
            }
          });
        }

        const result = await model.generateContent(content);
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
    
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [{
      role: 'user',
      content: imageContext ? [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: `data:${imageContext.mimeType};base64,${imageContext.base64}` } }
      ] : prompt
    }];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      response_format: { type: 'json_object' }
    });
    return response.choices[0].message?.content ?? '';
  }
  throw new Error('No AI provider configured. Set OPENAI_API_KEY or GEMINI_API_KEY.');
};
