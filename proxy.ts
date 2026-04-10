import { NextResponse } from 'next/server';
import { logger } from '@/app/lib/logger';
import { getServerSupabase } from '@/app/lib/supabaseClient';

export const config = {
  matcher: ['/api/:path*'], // run only on API routes
};

export async function proxy(request: Request) {
  const response = NextResponse.next();

  // Use server‑side Supabase client with request cookies
  const supabaseServer = getServerSupabase(request);
  const { data: { user }, error } = await supabaseServer.auth.getUser();
  if (error) logger.warn('Supabase auth getUser error', error);

  if (user?.id) {
    response.headers.set('x-user-id', user.id);
    // usage limit logic unchanged
    const { data: limitData, error: limitErr } = await supabaseServer
      .from('usage_limits')
      .select('daily_limit, used_today, last_reset_date')
      .eq('user_id', user.id)
      .single();
    if (limitErr) {
      logger.error('Failed to fetch usage limits', limitErr);
    } else if (limitData) {
      const today = new Date().toISOString().split('T')[0];
      if (limitData.last_reset_date !== today) {
        await supabaseServer
          .from('usage_limits')
          .update({ used_today: 0, last_reset_date: today })
          .eq('user_id', user.id);
      }
    }
  }

  return response;
}
