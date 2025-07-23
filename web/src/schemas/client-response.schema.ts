import z from 'zod'

const clientResponseSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  refund: z.boolean(),
})

export type ClientResponseSchema = z.infer<typeof clientResponseSchema>

export default clientResponseSchema
