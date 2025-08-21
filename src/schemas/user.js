import { z } from 'zod'

export const createUserSchema = z.object({
    first_name: z.string().trim().min(1, { message: 'First name is Required' }),
    last_name: z.string().trim().min(1, { message: 'Last name is Required' }),
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email format' })
        .trim()
        .min(1, { message: 'Email is Required' }),
    password: z
        .string({ required_error: 'Password is required' })
        .trim()
        .min(6, {
            message: 'Password must be at least 6 characters',
        }),
})

export const updateUserSchema = createUserSchema.partial().strict({
    message: 'Some provided fields is not allowed.',
})

export const loginUserSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Invalid email format' })
        .trim()
        .min(1, { message: 'Email is Required' }),
    password: z
        .string({ required_error: 'Password is required' })
        .trim()
        .min(6, {
            message: 'Password must be at least 6 characters',
        }),
})
