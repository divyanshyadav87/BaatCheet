import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/app/lib/ai';

export async function POST(req) {
  try {
    const { type, context } = await req.json();
    
    if (!context) {
      return NextResponse.json({ error: 'Context text is missing. Please type some context or upload an image.' }, { status: 400 });
    }

    let prompt = '';
    
    if (type === 'reply') {
      prompt = `You are a charismatic, socially intelligent assistant. The user needs a reply for the following chat context:\n\n"${context}"\n\nProvide exactly 3 different, clever, and natural reply options in JSON format. The JSON should have a top-level key "suggestions" containing an array of strings. Output raw JSON only without markdown formatting.`;
    } else if (type === 'starter') {
      prompt = `You are a communication and networking expert. Based on the following bio or context about a person:\n\n"${context}"\n\nProvide exactly 3 creative, engaging, and non-creepy conversation starters in JSON format. The JSON should have a top-level key "suggestions" containing an array of strings. Output raw JSON only without markdown formatting.`;
    } else if (type === 'awkward') {
      prompt = `You are an emotionally intelligent conflict resolution expert. The user is in this awkward situation:\n\n"${context}"\n\nProvide exactly 3 different ways to respond or handle this via text to de-escalate and save face gracefully. Output in JSON format. The JSON should have a top-level key "suggestions" containing an array of strings. Output raw JSON only without markdown formatting.`;
    } else {
      return NextResponse.json({ error: 'Invalid analysis type' }, { status: 400 });
    }

    const aiResultString = await generateAIResponse(prompt);
    
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
