import z from 'zod'

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email(),
  phone: z
    .string()
    .length(12, { message: 'Not a valid phone number' })
    .startsWith('254', { message: "Phone number must start with '254'" })
    .regex(/^[0-9]+$/, { message: 'Phone number must only contain digits' })
    .optional(),
  message: z.string().min(5, 'Message is required'),
  token: z.string({ required_error: "You need to verify that your're human" }),
})

export default contactFormSchema

export type ContactFormSchema = z.infer<typeof contactFormSchema>
