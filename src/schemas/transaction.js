import z from 'zod';
import validator from 'validator';

export const createTransactionSchema = z.object({
  user_id: z.uuid({
    error: (value) =>
      !value.input ? 'User ID is required' : 'User ID must be a valid UUID',
  }),
  name: z
    .string({
      error: 'Name is required',
    })
    .trim()
    .min(1, {
      error: 'Name is required',
    }),
  date: z.iso.datetime({
    error: (value) =>
      !value.input ? 'Date is required' : 'Date must be a valid date',
  }),
  amount: z
    .number({
      error: (value) =>
        !value.input ? 'Amount is required' : 'Amount must be a valid number',
    })
    .min(1, {
      error: 'Amount must be greater than 0',
    })
    .refine((value) => {
      return validator.isCurrency(value.toFixed(2), {
        allow_negatives: false,
        digits_after_decimal: [2],
        decimal_separator: '.',
      });
    }),
  type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
    error: 'Type must be EARNING, EXPENSE or INVESTMENT',
  }),
});

export const updateTransactionSchema = createTransactionSchema
  .omit({ user_id: true })
  .partial()
  .strict();
