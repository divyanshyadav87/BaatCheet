// app/lib/zodSchemas.ts
import { z } from 'zod';

/** Auth */
export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/** Chat upload (text) */
export const chatTextSchema = z.object({
  platform: z.enum(['whatsapp', 'instagram', 'telegram']),
  contact_name: z.string().min(1),
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ),
});

/** Chat upload (image) */
export const chatImageSchema = z.object({
  platform: z.enum(['whatsapp', 'instagram', 'telegram']),
  contact_name: z.string().min(1),
  // The image will be sent as multipart/form-data; we only validate other fields here.
});

/** Analysis request */
export const analysisSchema = z.object({
  chat_id: z.string().uuid(),
  tone: z.enum(['flirty', 'smart', 'funny', 'mysterious', 'classy']).optional(),
});

/** User profile update */
export const profileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  plan: z.enum(['free', 'pro']).optional(),
});

/** Usage limit reset (cron) – no payload */
export const emptySchema = z.object({});
