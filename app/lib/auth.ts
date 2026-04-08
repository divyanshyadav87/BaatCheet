// app/lib/auth.ts
import { supabase } from './supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

/** Get the current user from Supabase auth */
export const getUser = async (req: Request): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user ?? null;
};

/** Sign‑up with email & password */
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

/** Sign‑in with email & password */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

/** Sign‑out */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/** Helper for protected route handlers – throws if no user */
export const requireAuth = async (req: Request) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const err = new Error('Unauthenticated');
    // @ts-ignore – Next.js expects a Response
    (err as any).status = 401;
    throw err;
  }
  return user;
};
