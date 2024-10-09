import { z } from 'zod';

// Signup validation schema
export const signupSchema = z.object({
  email: z.string().email(),
  display_name: z.string().min(5),
  username: z.string().min(5),
  password: z.string().min(6),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Message validation schema
export const messageSchema = z.object({
  content: z.string().min(1),
  chatId: z.string().min(1),
});

// Zod schema for validating direct messages
export const directMessageSchema = z.object({
  content: z.string().min(1, { message: "Message content is required" }),
  senderId: z.string().length(26, { message: "Sender ID must be a valid ULID" }), // ULID is 26 characters long
  recipientId: z.string().length(26, { message: "Recipient ID must be a valid ULID" }),
  displayName: z.string().min(1, { message: "Display name is required" }),
  chatId: z.string().min(1, { message: "Chat ID is required" }),
});

// Zod schema for validating group messages
export const groupMessageSchema = z.object({
  content: z.string().min(1, { message: "Message content is required" }),
  senderId: z.string().length(26, { message: "Sender ID must be a valid ULID" }), // ULID is 26 characters long
  displayName: z.string().min(1, { message: "Display name is required" }),
  chatId: z.string().min(1, { message: "Chat ID is required" }),
});
