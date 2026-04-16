import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  // Use the service role key which has admin privileges
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { db: { schema: 'public' } }
  );

  // Step 1: Check if table already exists by trying to query it
  const { error: analysesError } = await supabase.from('analyses').select('id').limit(1);
  const { error: usersError } = await supabase.from('users').select('id').limit(1);
  
  if (!analysesError && !usersError) {
    return NextResponse.json({ status: 'OK', message: 'Tables already exist and are accessible!' });
  }

  // Table doesn't exist — we can't create it via PostgREST.
  // But we CAN create an RPC function. Let's try using the SQL Editor endpoint.
  // Since that's not available, we'll need to guide the user.
  
  return NextResponse.json({ 
    status: 'TABLE_MISSING',
    message: 'Required tables are missing. Please go to your Supabase Dashboard > SQL Editor and run the SQL below.',
    dashboardUrl: `https://supabase.com/dashboard/project/meylxftuccaxoovqkyjz/sql/new`,
    sql: `CREATE TABLE IF NOT EXISTS public.analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  type text NOT NULL,
  context text,
  result text,
  tone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_all_analyses ON public.analyses 
  FOR ALL USING (true) WITH CHECK (true);
  
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  login_type text,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_all_users ON public.users 
  FOR ALL USING (true) WITH CHECK (true);`
  });
}
