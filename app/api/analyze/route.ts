// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { generateAIResponse } from '@/app/lib/ai';
import { logger } from '@/app/lib/logger';
import { z } from 'zod';

// Request schema
const analyzeSchema = z.object({
  chat_id: z.string(),
  mockText: z.string().optional(),
  tone: z.string().optional(),
});

const MOCK_RESPONSE = {
  contextAnalysis: "User is testing compatibility through shared space. The mention of 'too quiet' is a playful challenge to your social energy.",
  options: [
    {
      icon: "sparkles",
      name: "The Spark Essence",
      quote: "Too quiet? I think we bring enough chaotic energy to make even a library feel like a festival. Are you worried you'll have to actually listen to my secrets?",
      logic: "Uses Reframing Alchemy. Turns the 'quiet' negative into a challenge about intimacy and shared 'chaos'."
    },
    {
      icon: "heart",
      name: "The Heart Elixir",
      quote: "Maybe you're right. We might need a bit more background noise to distract everyone from how much we're staring at each other.",
      logic: "Applies Projection Charms. Escalates the tension by assuming a high level of mutual attraction."
    },
    {
      icon: "moon",
      name: "The Moon Mystery",
      quote: "Quiet just means there's less space between us and more room for trouble. Do you always look for reasons to be louder, or just around me?",
      logic: "Utilizes Shadow Insinuation. Suggests that physical proximity is the inevitable outcome of a quiet setting."
    }
  ]
};

export async function POST(req: Request) {
  // Extract user ID from middleware header
  let userId = req.headers.get('x-user-id');
  const isMockMode = !userId || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-project');

  if (!userId && !isMockMode) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = analyzeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
  const { chat_id, mockText, tone = 'Flirty' } = parsed.data;

  let messagesContent = '';

  if (isMockMode) {
    messagesContent = mockText || 'No text provided in mock mode.';
  } else {
    // Verify chat belongs to user and fetch messages
    const { data: chat, error: chatErr } = await supabase
      .from('chats')
      .select('messages')
      .eq('id', chat_id)
      .eq('user_id', userId)
      .single();

    if (chatErr) {
      logger.error('Chat fetch error in /api/analyze', chatErr);
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    messagesContent = chat.messages
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');
  }

  const prompt = `You are an expert conversation alchemist and a highly charismatic social coach for Gen-Z and Millennials in India. 
The user has provided a chat history snippet and needs to reply to the other person.
Read the chat context and pay special attention to the FINAL message.

CRITICAL RULES FOR REPLIES:
1. MUST sound 100% human and casual. Absolutely NO "AI-speak" (never use words like "Ah," "Indeed," "Well," "Moreover").
2. Type like a real person texting: use lowercase letters, conversational slang (tbh, rn, ya, haha, lol), and skip formal punctuation.
3. Use extremely natural Hinglish (Hindi + English blending) if the context implies an Indian context, otherwise keep it universally casual.
4. Keep it punchy! 1-2 short lines max. Never write rigid, perfect sentences.
5. Embody the exactly requested tone: "${tone}".

Generate 3 realistic, highly tailored text messages that the user can immediately copy and send.

The response must be strictly valid JSON matching this schema exactly:
{
  "contextAnalysis": "A casual 1-2 sentence analysis of the chat dynamic and what the other person is actually implying.",
  "options": [
    {
      "icon": "choose exactly one: sparkles, heart, or moon",
      "name": "Spell name (a catchy 2-3 word title)",
      "quote": "The exact suggested text message reply to send back (STRICTLY HUMAN, CASUAL, TEXTING STYLE)",
      "logic": "The psychological logic behind why this reply works perfectly"
    }
  ]
}

Only return JSON. No other formatting.
Messages:
${messagesContent}`;

  try {
    let aiResultJson;
    
    // Check if we have an AI key
    if (!process.env.OPENAI_API_KEY && !process.env.GEMINI_API_KEY) {
      if (isMockMode) {
        const snippet = (mockText ? mockText.slice(0, 40) : "No text").replace(/\n/g, ' ');
        aiResultJson = {
          contextAnalysis: `[MOCK MODE ACTIVE] You are seeing this because there is no OPENAI_API_KEY or GEMINI_API_KEY in your .env file! We successfully received your text starting with: "${snippet}...". Note: Add an API key for actual AI generations!`,
          options: [
            {
              icon: "sparkles",
              name: "The Mock Magic",
              quote: `(Mock Mode) If I had an API key, I would generate a ${tone} reply to your text about: "${snippet}..."`,
              logic: "This is a placeholder since the backend is running in Mock Mode."
            },
            {
              icon: "heart",
              name: "Fallback Elixir",
              quote: `Please add your GEMINI_API_KEY to the .env file!`,
              logic: "Without the API key, the alchemist has no magic."
            },
            {
              icon: "moon",
              name: "Offline Mystery",
              quote: `Just telling them: 'I'll reply once my API keys are configured.'`,
              logic: "Honesty is the best policy."
            }
          ]
        };
      } else {
        throw new Error('No AI provider configured. Set OPENAI_API_KEY or GEMINI_API_KEY.');
      }
    } else {
      let rawResult = await generateAIResponse(prompt);
      // Strip markdown JSON block if present
      const jsonStr = rawResult.replace(/^```json\n/, '').replace(/\n```$/, '').trim();
      try {
        aiResultJson = JSON.parse(jsonStr);
      } catch (parseErr) {
        logger.error('Failed to parse AI JSON output', { rawResult });
        aiResultJson = { error: "Failed to parse structured format. Fallback to raw text", rawOutput: rawResult };
      }
    }

    if (!isMockMode && userId) {
      // Store analysis result
      const { error: insertErr } = await supabase.from('analyses').insert({
        user_id: userId,
        chat_id,
        result: JSON.stringify(aiResultJson),
      });
      if (insertErr) {
        logger.error('Analysis insert error', insertErr);
      }

      // Increment usage count
      const { data: usage, error: usageErr } = await supabase
        .from('usage_limits')
        .select('used_today')
        .eq('user_id', userId)
        .single();
      if (!usageErr && usage) {
        await supabase
          .from('usage_limits')
          .update({ used_today: usage.used_today + 1 })
          .eq('user_id', userId);
      }
    }

    return NextResponse.json({ ...aiResultJson }, { status: 200 });
  } catch (e: any) {
    logger.error('AI generation error', e);
    return NextResponse.json({ error: e.message ?? 'AI error' }, { status: 500 });
  }
}
