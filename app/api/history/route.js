import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('History fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ history: data || [] }, { status: 200 });
  } catch (err) {
    console.error('History API error:', err);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
