import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai';

export async function POST(req) {
  try {
    const { type, context, image, tone } = await req.json();
    
    if (!context && !image) {
      return NextResponse.json({ error: 'Please provide either text context or an image to analyze.' }, { status: 400 });
    }

    let prompt = '';
    const imageHint = image ? " (Refer to the provided image for context)" : "";
    const styleHint = tone ? ` specifically in a ${tone} tone` : "";
    
    if (type === 'reply') {
      prompt = `You are a charismatic, socially intelligent person. The user needs a human-like, natural reply${styleHint} for the following chat context${imageHint}:\n\n"${context || 'See image for chat history'}"\n\nProvide exactly 4 different options: the first 2 must be in pure English, and the last 2 must be in Hinglish (a casual mix of Hindi and English, written in Roman script). Rules:\n1. Use casual language, lowercase (if it feels natural), and common abbreviations.\n2. Avoid sounding like an AI assistant or being overly formal.\n3. Make them sound like something a cool friend would actually text.\n4. The Hinglish replies should feel natural and use common Hindi phrases mixed with English (e.g., "yaar", "kya scene hai", "chal na").\n5. Output exactly in JSON format with a top-level key "suggestions" containing an array of 4 strings. Output raw JSON only.`;
    } else if (type === 'starter') {
      prompt = `You are a smooth, creative individual. Based on the bio/context${imageHint}, provide a ${tone || 'creative'} starter:\n\n"${context || 'See image for person details'}"\n\nProvide exactly 4 options: the first 2 must be in pure English, and the last 2 must be in Hinglish (a casual mix of Hindi and English, written in Roman script). Rules:\n1. Must be high-energy, engaging, and personal.\n2. No generic "Hey how are you" starters.\n3. Use a casual, human tone without being creepy.\n4. The Hinglish starters should feel natural with common Hindi-English mixing.\n5. Output exactly in JSON format with a top-level key "suggestions" containing an array of 4 strings. Output raw JSON only.`;
    } else if (type === 'awkward') {
      prompt = `You are an emotionally intelligent friend. Help with this awkward situation${imageHint} using a ${tone || 'diplomatic'} approach:\n\n"${context || 'See image for situation context'}"\n\nProvide exactly 4 options: the first 2 must be in pure English, and the last 2 must be in Hinglish (a casual mix of Hindi and English, written in Roman script). Rules:\n1. Make the responses sound genuine and human, not like a customer service bot.\n2. Use empathy and clever phrasing to save face.\n3. Keep it conversational and natural.\n4. The Hinglish options should feel natural with common Hindi-English mixing.\n5. Output exactly in JSON format with a top-level key "suggestions" containing an array of 4 strings. Output raw JSON only.`;
    } else {
      return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    const aiResultString = await generateAIResponse(prompt, image);
    
    // We expect the AI to return a JSON string based on the prompt.
    const cleanJson = aiResultString.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    let aiResponse;
    try {
      aiResponse = JSON.parse(cleanJson);
      // Ensure the format matches what the frontend expects
      if (!aiResponse.suggestions || !Array.isArray(aiResponse.suggestions)) {
          // If the AI gives weird JSON keys, just shove values inside suggestions
          aiResponse = { suggestions: Object.values(aiResponse) };
      }
    } catch (parseError) {
      // Fallback if AI fails to return proper JSON at all
      console.warn("Could not parse AI JSON, returning string literal");
      aiResponse = { suggestions: [cleanJson] };
    }

    return NextResponse.json(aiResponse, { status: 200 });
    
  } catch (error) {
    console.error("API Analyze Error:", error);
    return NextResponse.json({ error: error.message || 'Internal AI Error. Please check your API keys.' }, { status: 500 });
  }
}
