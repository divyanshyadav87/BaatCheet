import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Get today's start date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', today.toISOString());

    if (error) {
      console.error("Supabase count error:", error);
      throw error;
    }
    
    const limit = 7;
    const used = count || 0;
    const remaining = Math.max(0, limit - used);

    return NextResponse.json({ used, limit, remaining }, { status: 200 });
  } catch (error) {
    console.error("API Usage Error:", error);
    return NextResponse.json({ error: error.message || 'Error fetching usage' }, { status: 500 });
  }
}
