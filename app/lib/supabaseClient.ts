// app/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for server‑side usage (SSR)
export const getServerSupabase = (req: Request) => {
  const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      // Pass the auth cookie from the request for SSR
      headers: { cookie: req.headers.get('cookie') ?? '' },
    },
  });
  return supabaseAuth;
};
