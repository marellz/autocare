import z from 'zod'

const newRequestFormSchema = z.object({
  name: z.string().min(2, { message: 'We need your name' }),
  phone: z
    .string()
    .length(12, { message: 'Not a valid phone number' })
    .startsWith('254', { message: "Phone number must start with '254'" })
    .regex(/^[0-9]+$/, { message: 'Phone number must only contain digits' }),
  item: z.string().min(2, { message: 'Your need to describe the part you want' }),
  token: z.string({ required_error: "You need to verify that your're human" }),
})

export type NewRequestFormSchema = z.infer<typeof newRequestFormSchema>

export const myRequestFormSchema = z.object({
  phone: z
    .string()
    .length(12, { message: 'Not a valid phone number' })
    .startsWith('254', { message: "Phone number must start with '254'" })
    .regex(/^[0-9]+$/, { message: 'Phone number must only contain digits' }),
})

export type MyRequestFormSchema = z.infer<typeof myRequestFormSchema>

export default newRequestFormSchema
