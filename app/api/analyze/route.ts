// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { generateAIResponse } from '@/app/lib/ai';
import { logger } from '@/app/lib/logger';
import { z } from 'zod';

// Request schema
const analyzeSchema = z.object({
  chat_id: z.string(),
});

export async function POST(req: Request) {
  // Extract user ID from middleware header
  const userId = req.headers.get('x-user-id');
  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = analyzeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
  const { chat_id } = parsed.data;

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

  // Prepare prompt for AI – concatenate messages
  const prompt = chat.messages
    .map((msg: any) => `${msg.role}: ${msg.content}`)
    .join('\n');

  try {
    const aiResult = await generateAIResponse(prompt);

    // Store analysis result (simple example – insert into analyses table)
    const { error: insertErr } = await supabase.from('analyses').insert({
      user_id: userId,
      chat_id,
      result: aiResult,
    });
    if (insertErr) {
      logger.error('Analysis insert error', insertErr);
    }

    // Optionally increment usage count
    // Increment usage count safely
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


    return NextResponse.json({ analysis: aiResult }, { status: 200 });
  } catch (e: any) {
    logger.error('AI generation error', e);
    return NextResponse.json({ error: e.message ?? 'AI error' }, { status: 500 });
  }
}
