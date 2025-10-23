import z from 'zod'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>

export default loginFormSchema

export const requestPasswordResetSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email('Not a valid email'),
  token: z.string({ required_error: "You need to verify that your're human" }),
})
export type RequestPasswordResetSchema = z.infer<typeof requestPasswordResetSchema>

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string({ required_error: 'Password confirmation is required' })
      .min(8, 'Password confirmation must be at least 8 characters long'),
    token: z.string({ required_error: "You need to verify that your're human" }),
    secure_token: z.string({ required_error: 'Secure token is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
