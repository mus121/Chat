import {z} from 'zod';

export const updatedProfileSchema = z.object({
    display_name: z.string().optional(),
    email: z.string().email().optional(),
    username: z.string().optional()
  });
  