import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, type, ...otherDetails } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Supabase credentials missing, skipping user store.");
      return NextResponse.json({ success: false, error: 'Configs missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Make an effort to insert without authentication
    const { data, error } = await supabase
      .from('users')
      .insert({ 
        email, 
        last_login: new Date().toISOString(),
        login_type: type, // 'login' or 'signup'
        ...otherDetails
      });

    if (error) {
      console.error('Supabase users insert error:', error.message);
      // Suppress error responses to avoid breaking client login loop
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error in /api/users:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' });
  }
}
