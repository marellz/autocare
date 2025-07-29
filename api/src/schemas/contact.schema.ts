import z from "zod";

export const contactMessageSchema = z.object({
    name: z.string(),
    phone: z.string(),
    message: z.string()
})