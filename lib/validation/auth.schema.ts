import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type AuthSchemaType = z.infer<typeof AuthSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type ForgotPasswordSchemaType = z.infer<typeof ForgotPasswordSchema>;