import { z } from 'zod'
import validator from 'validator'

export const createTransactionSchema = z.object({
    user_id: z.string().uuid({ message: 'Invalid UUID format' }),
    name: z
        .string({ error: 'Name is required' })
        .trim()
        .min(1, { message: 'Name is required and cannot be empty' }),
    date: z
        .string({ error: 'Date is required' })
        .datetime({ message: 'Invalid date format' }),
    type: z.enum(['EARNING', 'EXPENSE', 'INVESTMENT'], {
        error: 'Invalid Enum Value: EARNING, EXPENSE, or INVESTMENT',
    }),
    amount: z
        .number({
            error: 'Amount must be a number',
        })
        .min(1, { message: 'Amount must be a positive number' })
        .refine((value) =>
            validator.isCurrency(value.toFixed(2), {
                digits_after_decimal: [2],
                allow_negatives: false,
                decimal_separator: '.',
            }),
        ),
})

export const updateTransactionSchema = createTransactionSchema
    .partial()
    .strict({
        message: 'Some provided fields is not allowed.',
    })
