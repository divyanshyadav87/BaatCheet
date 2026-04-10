// app/api/chat/upload-text/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';
import { chatTextSchema } from '@/app/lib/zodSchemas';
import { logger } from '@/app/lib/logger';

export async function POST(req: Request) {
  let userId = req.headers.get('x-user-id');
  const isMockMode = !userId || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-supabase-project');

  if (!userId && !isMockMode) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = chatTextSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
  const { platform, contact_name, messages } = parsed.data;

  if (isMockMode) {
    return NextResponse.json({ 
      chatId: 'mock-chat-123', 
      mockText: messages.map((m: any) => m.content).join('\n') 
    }, { status: 201 });
  }

  const { data, error } = await supabase.from('chats').insert({
    user_id: userId,
    platform,
    contact_name,
    messages,
  }).select();

  if (error) {
    logger.error('Chat insert error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ chatId: data[0].id }, { status: 201 });
}
