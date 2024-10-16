import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  display_name: z.string().min(5),
  username: z.string().min(5),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});