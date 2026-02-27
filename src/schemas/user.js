import { z } from 'zod';

export const createUserSchema = z.object({
  first_name: z
    .string({
      error: 'First name is required.',
    })
    .trim()
    .min(1, {
      error: 'First name is required.',
    }),
  last_name: z
    .string({
      error: 'Last name is required.',
    })
    .trim()
    .min(1, {
      error: 'Last name is required.',
    }),
  email: z
    .email({
      error: 'Plase provide a valid e-mail.',
    })
    .trim()
    .min(1, {
      error: 'E-mail is required.',
    }),
  password: z
    .string({
      error: 'Password is required.',
    })
    .trim()
    .min(6, {
      error: 'Password must be at least 6 characters.',
    }),
});

export const updateUserSchema = createUserSchema.partial().strict();

export const loginUserSchema = z.object({
  email: z
    .email({
      error: 'Please provide a valid e-mail',
    })
    .trim()
    .min(1, {
      error: 'E-mail is required',
    }),
  password: z
    .string({
      error: 'Password is required',
    })
    .trim()
    .min(6, {
      error: 'Password must be at least 6 characters.',
    }),
});

export const refreshTokenSchema = z.object({
  refresh_token: z
    .string({
      error: 'Refresh token is required',
    })
    .trim()
    .min(1, {
      error: 'Refresh token is required',
    }),
});
